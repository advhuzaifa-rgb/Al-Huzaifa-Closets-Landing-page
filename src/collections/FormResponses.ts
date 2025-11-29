import { CollectionConfig } from 'payload'
import payload from 'payload'

const getPayloadBaseUrl = (): string | null => {
  const url = process.env.PAYLOAD_API_URL || process.env.NEXT_PUBLIC_PAYLOAD_URL
  if (!url) return null
  return String(url).replace(/\/$/, '')
}

const FormResponses: CollectionConfig = {
  slug: 'form-responses',
  labels: {
    singular: 'Form Response',
    plural: 'Form Responses',
  },
  admin: {
    useAsTitle: 'name',
  },
  access: {
    create: () => true,
    read: () => true,
    update: () => false,
    delete: ({ req }) => Boolean(req?.user && (req.user as any).role === 'admin'),
  },
  fields: [
    { name: 'name', label: 'Full Name', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'phone', label: 'Phone Number', type: 'text', required: true },
    {
      name: 'areaOfInterest',
      label: 'Area of Interest',
      type: 'select',
      required: false,
      options: [
        { label: '-- Please Select --', value: '' },
        { label: 'Bedroom', value: 'bedroom' },
        { label: 'Hallway', value: 'hallway' },
        { label: 'Majlis/Diwaniya', value: 'majlis_diwaniya' },
        { label: 'Dining room', value: 'dining_room' },
        { label: 'Living room', value: 'living_room' },
        { label: 'Cinema', value: 'cinema' },
        { label: 'Home office', value: 'home_office' },
        { label: 'Nursery', value: 'nursery' },
      ],
    },
    { name: 'message', label: 'Message', type: 'textarea', required: true },

    {
      name: 'attachment',
      label: 'Attachment',
      type: 'upload',
      relationTo: 'media',
      required: false,
      admin: {
        readOnly: true,
      },
    },

    {
      name: 'attachmentUrl',
      label: 'Attachment URL',
      type: 'text',
      required: false,
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },

    {
      name: 'fileName',
      label: 'Attached file name',
      type: 'text',
      required: false,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'submittedAt',
      label: 'Submitted At',
      type: 'date',
      admin: { position: 'sidebar', readOnly: true },
      defaultValue: () => new Date().toISOString(),
    },
  ],

  hooks: {
    afterChange: [
      async ({ req, doc, operation }) => {
        if (operation !== 'create') return

        console.log('🔔 FormResponses.afterChange fired. operation=', operation)
        console.log('🔍 raw doc:', doc)

        if (!process.env.BREVO_API_KEY) {
          console.error('❌ BREVO_API_KEY not set in env. Hook will not send email.')
          return
        }

        const verifiedSender = process.env.VERIFIED_SENDER || process.env.ADMIN_EMAIL
        if (!verifiedSender) {
          console.error(
            '❌ VERIFIED_SENDER or ADMIN_EMAIL not set. Set VERIFIED_SENDER to a verified sender in Brevo.',
          )
          return
        }

        const submittedAt =
          (doc as any).submittedAt || (doc as any).createdAt || new Date().toISOString()

        const payloadInstance: any = req?.payload ?? payload

        if (!payloadInstance || typeof payloadInstance !== 'object') {
          console.error(
            '❌ payload instance not available in afterChange hook; skipping media resolution.',
          )
        }

        let attachmentMeta: { url?: string; filename?: string } | null = null

        try {
          const att = (doc as any).attachment

          if (att) {
            if (typeof att === 'object' && (att.url || att.src || att.filename || att.name)) {
              attachmentMeta = {
                url: att.url || att.src || att?.file?.url || undefined,
                filename: att.filename || att.name || att?.file?.filename || undefined,
              }
            } else if (typeof att === 'object' && (att.id || att._id || att.value)) {
              const id = att.id || att._id || att.value
              try {
                if (payloadInstance && typeof payloadInstance.findByID === 'function') {
                  const media = await payloadInstance.findByID({ collection: 'media', id })
                  attachmentMeta = {
                    url: (media as any).url || (media as any).src || (media as any).file?.url,
                    filename:
                      (media as any).filename ||
                      (media as any).originalname ||
                      (media as any).file?.filename,
                  }
                } else {
                  console.warn(
                    '⚠️ payloadInstance.findByID not available; cannot fetch media by id.',
                  )
                }
              } catch (err) {
                console.warn('⚠️ Could not fetch media by id (from object):', id, err)
              }
            } else if (typeof att === 'string') {
              try {
                if (payloadInstance && typeof payloadInstance.findByID === 'function') {
                  const media = await payloadInstance.findByID({
                    collection: 'media',
                    id: att,
                  })

                  attachmentMeta = {
                    url: (media as any).url || (media as any).src || (media as any).file?.url,
                    filename:
                      (media as any).filename ||
                      (media as any).originalname ||
                      (media as any).file?.filename,
                  }
                } else {
                  console.warn(
                    '⚠️ payloadInstance.findByID not available; cannot fetch media by id string.',
                  )
                }
              } catch (err) {
                console.warn('⚠️ Could not fetch media by id:', att, err)
              }
            }
          }
        } catch (err) {
          console.warn('⚠️ error while resolving attachment metadata', err)
        }

        const effectiveFileName = (doc as any).fileName || attachmentMeta?.filename || ''

        try {
          const base = getPayloadBaseUrl()
          if (attachmentMeta?.url && base && !/^https?:\/\//i.test(attachmentMeta.url)) {
            attachmentMeta.url = attachmentMeta.url.startsWith('/')
              ? `${base}${attachmentMeta.url}`
              : `${base}/${attachmentMeta.url}`
          }
        } catch (e) {}

        try {
          const updateData: any = {}
          if (attachmentMeta?.url) updateData.attachmentUrl = attachmentMeta.url
          if (effectiveFileName) updateData.fileName = effectiveFileName

          if (Object.keys(updateData).length) {
            try {
              if (payloadInstance && typeof payloadInstance.update === 'function') {
                await payloadInstance.update({
                  collection: 'form-responses',
                  id: (doc as any).id,
                  data: updateData,

                  overrideAccess: true,
                })
                console.log('ℹ️ Updated form-responses with derived attachment info.', updateData)
              } else {
                throw new Error('payloadInstance.update is not available')
              }
            } catch (err) {
              console.warn('⚠️ payload.update failed, attempting REST PATCH fallback:', err)
              try {
                const base = getPayloadBaseUrl()
                if (!base) throw err

                const target = `${base}/api/form-responses/${(doc as any).id}`
                const headers: Record<string, string> = { 'Content-Type': 'application/json' }

                if (process.env.PAYLOAD_API_KEY) {
                  headers['api-key'] = process.env.PAYLOAD_API_KEY
                  headers['payload-api-key'] = process.env.PAYLOAD_API_KEY
                  headers['Authorization'] = `Bearer ${process.env.PAYLOAD_API_KEY}`
                } else {
                  const adminEmail = process.env.PAYLOAD_ADMIN_EMAIL
                  const adminPass = process.env.PAYLOAD_ADMIN_PASSWORD
                  if (adminEmail && adminPass) {
                    try {
                      const loginRes = await fetch(`${base}/api/users/login`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email: adminEmail, password: adminPass }),
                      })
                      const setCookie = loginRes.headers.get('set-cookie')
                      if (setCookie) headers['cookie'] = setCookie
                      let loginJson: any = null
                      try {
                        loginJson = await loginRes.json()
                      } catch (e) {
                        loginJson = null
                      }
                      const token =
                        loginJson?.token || loginJson?.token?.token || loginJson?.data?.token
                      if (token) headers['Authorization'] = `Bearer ${token}`
                    } catch (e) {
                      // continue and attempt unauthenticated PATCH (may fail)
                      console.warn('⚠️ admin login fallback failed for REST PATCH', e)
                    }
                  }
                }

                const patchRes = await fetch(target, {
                  method: 'PATCH',
                  headers,
                  body: JSON.stringify(updateData),
                })

                if (!patchRes.ok) {
                  const text = await patchRes.text().catch(() => '<no-body>')
                  throw new Error(`Fallback PATCH failed: ${patchRes.status} ${text}`)
                }

                console.log('ℹ️ Updated form-responses via REST fallback.', updateData)
              } catch (err2) {
                console.warn('⚠️ REST PATCH fallback failed:', err2)
              }
            }
          }
        } catch (err) {
          console.warn('⚠️ failed to update form-responses with attachmentUrl/fileName', err)
        }

        const attachmentLinkAdmin = attachmentMeta?.url
          ? `<a href="${attachmentMeta.url}" target="_blank" rel="noopener noreferrer">${
              attachmentMeta.filename || effectiveFileName || 'Attachment'
            }</a>`
          : effectiveFileName || 'None'

        const adminHtml = `
          <h2>New Form Submission</h2>
          <p><strong>Name:</strong> ${(doc as any).name || '—'}</p>
          <p><strong>Email:</strong> ${(doc as any).email || '—'}</p>
          <p><strong>Phone:</strong> ${(doc as any).phone || '—'}</p>
          <p><strong>Area of interest:</strong> ${(doc as any).areaOfInterest || 'Not provided'}</p>
          <p><strong>Message:</strong> ${(doc as any).message || '—'}</p>
          <p><strong>Attached file:</strong> ${attachmentLinkAdmin}</p>
          <p><small>Submitted on ${submittedAt}</small></p>
        `

        const payloadForAdmin = {
          sender: { email: verifiedSender, name: 'Website' },
          to: [{ email: process.env.ADMIN_EMAIL, name: 'Admin' }],
          subject: '📩 New Form Response',
          htmlContent: adminHtml,
        }

        const sendBrevo = async (payloadBody: any) => {
          const apiKey = (process.env.BREVO_API_KEY || '').trim()
          if (!apiKey) {
            console.error('❌ BREVO_API_KEY missing at send time.')
            return
          }

          const nameFromEmail = (email: string) => {
            const local = (email || '').split('@')[0] || 'Recipient'
            return local.charAt(0).toUpperCase() + local.slice(1)
          }

          const fromEmail = payloadBody?.sender?.email || verifiedSender
          const fromName = payloadBody?.sender?.name || 'Website'
          const toList = (payloadBody?.to || [])
            .filter((t: any) => t && t.email)
            .map((t: any) => ({
              email: t.email,
              name: (t.name && String(t.name).trim()) || nameFromEmail(t.email),
            }))

          if (!toList.length && process.env.ADMIN_EMAIL) {
            toList.push({ email: process.env.ADMIN_EMAIL, name: 'Admin' })
          }

          const brevoBody: any = {
            sender: { email: fromEmail, name: fromName },
            to: toList,
            subject: payloadBody?.subject || '',
            htmlContent: payloadBody?.htmlContent || payloadBody?.html || '',
            textContent: typeof payloadBody?.text === 'string' ? payloadBody.text : undefined,
          }

          if (brevoBody && typeof brevoBody === 'object' && 'attachment' in brevoBody) {
            try {
              delete brevoBody.attachment
            } catch (e) {}
          }

          const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            'api-key': apiKey,
          }

          const url = 'https://api.brevo.com/v3/smtp/email'
          for (let attempt = 1; attempt <= 2; attempt++) {
            const ctrl = new AbortController()
            const timer = setTimeout(() => ctrl.abort(), 10000)
            try {
              const res = await fetch(url, {
                method: 'POST',
                headers,
                body: JSON.stringify(brevoBody),
                signal: ctrl.signal,
              })
              clearTimeout(timer)
              const text = await res.text().catch(() => '<no-body>')
              console.log(`Brevo: attempt=${attempt} status=${res.status} body=${text}`)
              if (!res.ok) throw new Error(`Brevo ${res.status}: ${text}`)
              return
            } catch (err: any) {
              clearTimeout(timer)
              const c = err?.cause || {}
              console.error(`❌ Brevo fetch failed (attempt ${attempt}):`, {
                name: err?.name,
                message: err?.message,
                code: c?.code,
                errno: c?.errno,
                syscall: c?.syscall,
                address: c?.address,
                port: c?.port,
              })
              if (attempt === 2) throw err
              await new Promise((r) => setTimeout(r, 400))
            }
          }
        }

        try {
          if (process.env.ADMIN_EMAIL) {
            console.log('⏳ Sending admin email to', process.env.ADMIN_EMAIL)
            await sendBrevo(payloadForAdmin)
          } else {
            console.warn('ADMIN_EMAIL not set — skipping admin notification.')
          }

          if ((doc as any).email) {
            const attachmentLinkUser = attachmentMeta?.url
              ? `<a href="${attachmentMeta.url}" target="_blank" rel="noopener noreferrer">${
                  attachmentMeta.filename || effectiveFileName || 'Attachment'
                }</a>`
              : effectiveFileName || 'None'

            const userHtml = `
              <h3>Thanks for contacting us, ${(doc as any).name || ''}!</h3>
              <p>We received your submission. A copy of what you sent:</p>
              <ul>
                <li><strong>Name:</strong> ${(doc as any).name || '—'}</li>
                <li><strong>Email:</strong> ${(doc as any).email || '—'}</li>
                <li><strong>Phone:</strong> ${(doc as any).phone || '—'}</li>
                <li><strong>Area of interest:</strong> ${(doc as any).areaOfInterest || 'Not provided'}</li>
                <li><strong>Message:</strong> ${(doc as any).message || '—'}</li>
                <li><strong>Attached file:</strong> ${attachmentLinkUser}</li>
              </ul>
              <p>We will contact you shortly.</p>
              <p><small>Submitted on ${submittedAt}</small></p>
            `

            await sendBrevo({
              sender: { email: verifiedSender, name: 'Website' },
              to: [{ email: (doc as any).email, name: (doc as any).name || 'Recipient' }],
              subject: 'We received your submission',
              htmlContent: userHtml,
            })
            console.log('✅ Confirmation email sent to user:', (doc as any).email)
          } else {
            console.log('ℹ️ No user email present on doc; skipping user notification.')
          }
        } catch (err) {
          console.error('❌ Failed to send one or more emails (hook continues):', err)
        }
      },
    ],
  },
}

export default FormResponses
