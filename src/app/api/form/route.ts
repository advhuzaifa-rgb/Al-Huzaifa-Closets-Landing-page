import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Always use the explicit Payload host set in env
function getPayloadBaseUrl() {
  const url = process.env.PAYLOAD_API_URL || process.env.NEXT_PUBLIC_PAYLOAD_URL
  if (!url) throw new Error('PAYLOAD_API_URL not set')
  return url.replace(/\/$/, '')
}


export async function POST(req: Request) {
  // Debug: print whether PAYLOAD_API_KEY or admin creds are present (do not log the key itself)
  try {
    const hasKey = !!process.env.PAYLOAD_API_KEY;
    const keyLen = hasKey ? String(process.env.PAYLOAD_API_KEY).length : 0;
    console.log('[form] PAYLOAD_API_KEY present?', hasKey, hasKey ? `(length ${keyLen})` : '');
  } catch (e) {
    // ignore
  }

  try {
    const base = getPayloadBaseUrl()

    const contentType = (req.headers.get('content-type') || '').toLowerCase()
    let bodyObj: any = null

    // If multipart/form-data, parse formData, upload file to Payload media and build JSON body
    if (contentType.includes('multipart/form-data')) {
      const fd = await req.formData()
      const name = fd.get('name')?.toString() || ''
      const email = fd.get('email')?.toString() || ''
      const phone = fd.get('phone')?.toString() || ''
      const country = fd.get('country')?.toString() || ''
      const areaOfInterest = fd.get('areaOfInterest')?.toString() || ''
      const message = fd.get('message')?.toString() || ''

      // Try to get file (input name 'file')
      const file = fd.get('file') as any
      let attachmentId: any = undefined

      if (file && typeof file === 'object' && file.size) {
        // Forward the file to Payload media endpoint
        const mediaForm = new FormData()
        // 'file' should be a File from formData; append with name
        mediaForm.append('file', file, file.name || 'attachment')
        // provide an alt text
        mediaForm.append('alt', name || 'attachment')

        // include API key header if provided in env (some Payload setups require this)
        const mediaHeaders: Record<string, string> = {}
        if (process.env.PAYLOAD_API_KEY) {
          // Send API key in multiple common header shapes to support different Payload setups
          mediaHeaders['api-key'] = process.env.PAYLOAD_API_KEY
          mediaHeaders['payload-api-key'] = process.env.PAYLOAD_API_KEY
          mediaHeaders['Authorization'] = `Bearer ${process.env.PAYLOAD_API_KEY}`
        } else {
          // No API key: attempt admin login fallback if creds provided
          const adminEmail = process.env.PAYLOAD_ADMIN_EMAIL
          const adminPass = process.env.PAYLOAD_ADMIN_PASSWORD
          if (adminEmail && adminPass) {
            try {
              const loginRes = await fetch(`${base}/api/users/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: adminEmail, password: adminPass }),
              })

              // capture cookie header and any token from response
              const setCookie = loginRes.headers.get('set-cookie')
              if (setCookie) {
                mediaHeaders['cookie'] = setCookie
              }

              let loginJson: any = null
              try { loginJson = await loginRes.json() } catch (e) { loginJson = null }
              // try common token shapes
              const token = loginJson?.token || loginJson?.token?.token || loginJson?.data?.token
              if (token) mediaHeaders['Authorization'] = `Bearer ${token}`
            } catch (err) {
              console.error('[form] admin login fallback failed', err)
            }
          }
        }

        const mediaRes = await fetch(`${base}/api/media`, {
          method: 'POST',
          body: mediaForm,
          headers: mediaHeaders,
        })

        let mediaJson: any = null
        try {
          mediaJson = await mediaRes.json()
        } catch (e) {
          mediaJson = null
        }

        if (!mediaRes.ok) {
          console.error('[form] media upload failed', mediaRes.status, mediaJson)
          // continue without attachment
        } else {
          // payload typically returns { doc: { id: '...' } } or { id: '...' }
          attachmentId = mediaJson?.doc?.id || mediaJson?.id || mediaJson?._id || (mediaJson?.doc && mediaJson.doc.id)
        }
      }

      bodyObj = {
        name,
        email,
        phone,
        country,
        areaOfInterest,
        message,
      }
      if (attachmentId) bodyObj.attachment = attachmentId
    } else {
      bodyObj = await req.json()
    }

    const target = `${base}/api/form-responses`

    const payloadHeaders: Record<string, string> = { 'Content-Type': 'application/json' }
    if (process.env.PAYLOAD_API_KEY) {
      // Send API key using several header names (some deployments expect Authorization: Bearer)
      payloadHeaders['api-key'] = process.env.PAYLOAD_API_KEY
      payloadHeaders['payload-api-key'] = process.env.PAYLOAD_API_KEY
      payloadHeaders['Authorization'] = `Bearer ${process.env.PAYLOAD_API_KEY}`
    } else {
      // If we don't have an API key but admin creds exist, include cookie/token for create/update
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
          if (setCookie) payloadHeaders['cookie'] = setCookie
          let loginJson: any = null
          try { loginJson = await loginRes.json() } catch (e) { loginJson = null }
          const token = loginJson?.token || loginJson?.token?.token || loginJson?.data?.token
          if (token) payloadHeaders['Authorization'] = `Bearer ${token}`
        } catch (err) {
          console.error('[form] admin login fallback for payload create failed', err)
        }
      }
    }

    const payloadRes = await fetch(target, {
      method: 'POST',
      headers: payloadHeaders,
      body: JSON.stringify(bodyObj),
    })

    let data: any = null
    let raw = ''
    try {
      data = await payloadRes.clone().json()
    } catch {
      raw = await payloadRes.text()
    }

    if (!payloadRes.ok) {
      console.error('[form] POST to Payload failed:', {
        status: payloadRes.status,
        target,
        json: data,
        text: raw?.slice(0, 500),
      })
      return NextResponse.json(
        { error: data?.message || raw || 'Failed to save form' },
        { status: payloadRes.status || 500 },
      )
    }

    // If we uploaded a file but the created doc doesn't include the attachment,
    // try to PATCH the document to set the attachment explicitly.
    try {
      const created = data ?? null
      const createdId = created?.doc?.id || created?.id || created?._id || created?.doc?._id
      const hasAttachmentInResponse = !!(created && (created.doc?.attachment || created.attachment))

      if (bodyObj && bodyObj.attachment && createdId && !hasAttachmentInResponse) {
        console.log('[form] attachment missing on create, attempting PATCH to attach media', {
          createdId,
          attachment: bodyObj.attachment,
        })

        const updateRes = await fetch(`${target}/${createdId}`, {
          method: 'PATCH',
          headers: payloadHeaders,
          body: JSON.stringify({ attachment: bodyObj.attachment }),
        })

        let updateJson: any = null
        try {
          updateJson = await updateRes.json()
        } catch (e) {
          updateJson = null
        }

        if (!updateRes.ok) {
          console.error('[form] PATCH to attach media failed', updateRes.status, updateJson)
        } else {
          console.log('[form] Successfully attached media via PATCH', updateJson)
          // replace data with updated doc for the response
          data = updateJson
        }
      }
    } catch (e) {
      console.error('[form] attach-after-create error', e)
    }

    return NextResponse.json({ success: true, data: data ?? null })
  } catch (err: any) {
    console.error('[form] Handler crashed:', err)
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 })
  }
}
