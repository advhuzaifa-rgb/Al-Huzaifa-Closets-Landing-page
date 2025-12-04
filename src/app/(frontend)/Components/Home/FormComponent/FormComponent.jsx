'use client'
import React, { useState, useEffect, useMemo, useRef } from 'react'
import { useRouter } from 'next/navigation'
import styles from './Form.module.css'
import { COUNTRIES } from './flags'
import { CircleFlag } from 'react-circle-flags'

const AREA_OPTIONS = [
  { label: 'Bedroom', value: 'bedroom' },
  { label: 'Hallway', value: 'hallway' },
  { label: 'Majlis/Diwaniya', value: 'majlis_diwaniya' },
  { label: 'Dining room', value: 'dining_room' },
  { label: 'Living room', value: 'living_room' },
  { label: 'Cinema', value: 'cinema' },
  { label: 'Home office', value: 'home_office' },
  { label: 'Nursery', value: 'nursery' },
]

function useOutsideClick(ref, onClose) {
  useEffect(() => {
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) onClose()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [ref, onClose])
}

export default function FormComponent() {
  const router = useRouter()

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    country: 'AE',
    areaOfInterest: '',
    message: '',
    fileName: '',
  })
  const [fileObj, setFileObj] = useState(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)

  const [countryOpen, setCountryOpen] = useState(false)
  const flagMenuRef = useRef(null)
  useOutsideClick(flagMenuRef, () => setCountryOpen(false))

  const [searchTerm, setSearchTerm] = useState('')

  const selectedCountry = useMemo(
    () => COUNTRIES.find((c) => c.value === form.country) || COUNTRIES[0],
    [form.country],
  )

  useEffect(() => {
    if (!form.phone) {
      setForm((prev) => ({ ...prev, phone: `${selectedCountry.dialCode} ` }))
    }
  }, [])

  useEffect(() => {
    if (message && message.type === 'success') {
      const t = setTimeout(() => setMessage(null), 2000)
      return () => clearTimeout(t)
    }
    return undefined
  }, [message])

  const handleChange = (e) => {
    const { name, value } = e.target

    if (name === 'phone') {
      const raw = value.replace(/[^\d\s+]/g, '')
      const dc = selectedCountry.dialCode

      let next = raw
      if (!raw.startsWith(dc)) {
        const national = raw.replace(/^\+?\d+\s*/, '')
        next = `${dc} ${national}`
      }

      setForm((prev) => ({ ...prev, phone: next }))
      return
    }

    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleFile = (e) => {
    const f = e.target.files && e.target.files[0]
    setFileObj(f || null)
    setForm((prev) => ({ ...prev, fileName: f ? f.name : '' }))
  }

  // Instead of uploading directly to Payload from the browser (which requires auth),
  // POST the full multipart form (fields + file) to our server endpoint `/api/form`.
  // The server will forward the file to Payload using server-side credentials.

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    const fullPhone = form.phone.replace(/\s+/g, '')

    try {
      // Build a multipart FormData and POST it to our server route which handles
      // uploads and creates server-side (no API key required in the browser).
      const fd = new FormData()
      fd.append('name', form.name.trim())
      fd.append('email', form.email.trim())
      fd.append('phone', fullPhone)
      fd.append('country', form.country)
      fd.append('areaOfInterest', (form.areaOfInterest || '').trim())
      fd.append('message', (form.message || '').trim())
      if (fileObj) fd.append('file', fileObj, fileObj.name)

      const resp = await fetch('/api/form', {
        method: 'POST',
        body: fd,
      })

      let respJson = null
      try {
        respJson = await resp.json()
      } catch (e) {
        respJson = null
      }

      if (!resp.ok) {
        const errMsg = respJson?.error || `Submit failed (${resp.status})`
        throw new Error(errMsg)
      }

      setMessage({ type: 'success', text: 'Form submitted successfully!' })

      if (typeof window !== 'undefined' && typeof window.gtag_report_conversion === 'function') {
        try {
          window.gtag_report_conversion()
        } catch (err) {}
      }

      setForm({
        name: '',
        email: '',
        phone: '',
        country: 'AE',
        areaOfInterest: '',
        message: '',
        fileName: '',
      })
      setFileObj(null)

      setTimeout(() => {
        router.push('/thank-you')
      }, 800)
    } catch (err) {
      console.error('Submit error', err)
      setMessage({ type: 'error', text: err?.message || 'Network error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.heading}>Submit your enquiry</h2>

      <form className={styles.field} onSubmit={handleSubmit}>
        <div className={styles.inputWrap}>
          <input
            name="name"
            className={styles.inputLine}
            type="text"
            placeholder="Your name *"
            value={form.name}
            onChange={handleChange}
            aria-label="Your name"
            required
          />
        </div>

        <div className={styles.inputWrap}>
          <input
            name="email"
            className={styles.inputLine}
            type="email"
            placeholder="Your email *"
            value={form.email}
            onChange={handleChange}
            aria-label="Your email"
            required
          />
        </div>

        <div className={styles.inputWrap}>
          <div className={styles.phoneRow} ref={flagMenuRef}>
            <button
              type="button"
              className={styles.flagBtn}
              aria-label="Select country"
              onClick={() => setCountryOpen((o) => !o)}
            >
              <CircleFlag countryCode={selectedCountry.value.toLowerCase()} height="18" />
              <span className={styles.flagChevron} aria-hidden>
                ▾
              </span>
            </button>

            <input
              name="phone"
              className={styles.phoneInput}
              type="tel"
              placeholder="+971 54321543 "
              value={form.phone}
              onChange={handleChange}
              aria-label="Phone number"
              required
            />

            {countryOpen && (
              <div className={styles.flagMenu} role="listbox">
                <input
                  type="text"
                  className={styles.flagSearch}
                  placeholder="Search country..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  autoFocus
                />

                <ul className={styles.flagList}>
                  {COUNTRIES.filter((c) =>
                    c.label.toLowerCase().includes(searchTerm.toLowerCase()),
                  ).map((c) => {
                    const active = form.country === c.value
                    return (
                      <li
                        key={c.value}
                        role="option"
                        aria-selected={active}
                        className={`${styles.flagItem} ${active ? styles.flagItemActive : ''}`}
                        onClick={() => {
                          setForm((prev) => ({
                            ...prev,
                            country: c.value,
                            phone: `${c.dialCode} ${prev.phone.replace(/^\+?\d+\s*/, '')}`,
                          }))
                          setCountryOpen(false)
                          setSearchTerm('')
                        }}
                      >
                        <span className={styles.flagIcon}>
                          <CircleFlag countryCode={c.value.toLowerCase()} height="18" />
                        </span>
                        <span className={styles.flagLabel}>{c.label}</span>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className={styles.selectWrap}>
          <select
            name="areaOfInterest"
            className={styles.select}
            value={form.areaOfInterest}
            onChange={handleChange}
            aria-label="Area of interest (optional)"
          >
            <option value="" disabled className={styles.selectPlaceholder}>
              Area of interest (optional)
            </option>
            {AREA_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.inputWrap}>
          <textarea
            name="message"
            className={styles.textarea}
            placeholder="Type your message *"
            value={form.message}
            onChange={handleChange}
            aria-label="Your message"
            required
          />
        </div>

        <div className={styles.inputWrap}>
          <input
            id="fileInput"
            name="file"
            type="file"
            className={styles.fileInput}
            onChange={handleFile}
            aria-hidden="true"
          />

          <div className={styles.fileLine}>
            <label htmlFor="fileInput" className={styles.fileLinkInline}>
              {form.fileName || 'Attach floor plan (optional)'}
            </label>
          </div>
          <label className={styles.fileLabel}>Select your file</label>
        </div>

        <div className={styles.submitWrap}>
          <div>
            <button className={styles.submitBtn} type="submit" disabled={loading}>
              {loading ? 'Submitting…' : 'Submit'}
            </button>
          </div>
          <div className={styles.statusWrap} aria-live="polite">
            {message ? (
              <p
                className={`${styles.status} ${message.type === 'error' ? styles.error : styles.success}`}
              >
                {message.text}
              </p>
            ) : (
              <p className={styles.statusHidden} aria-hidden="true">
                &nbsp;
              </p>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}
