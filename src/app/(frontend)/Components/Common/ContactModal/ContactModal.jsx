'use client'
import React, { useEffect, useRef, useState } from 'react'
import styles from './ContactModal.module.css'
import FormComponent from '../../Home/FormComponent/FormComponent'

export default function ContactModal() {
  const [open, setOpen] = useState(false)
  const lastActiveEl = useRef(null)
  const backdropRef = useRef(null)
  const initialHrefRef = useRef(null)
  const pollRef = useRef(null)

  useEffect(() => {
    window.openContactForm = (detail = {}) => {
      window.dispatchEvent(new CustomEvent('open-contact-form', { detail }))
    }

    window.closeContactForm = () => setOpen(false)

    const onOpen = (ev) => {
      lastActiveEl.current = document.activeElement
      // store the href at the moment we open the modal so we can detect navigation after submit
      initialHrefRef.current = window.location.href
      setOpen(true)
    }
    const onClose = () => {
      setOpen(false)
      if (lastActiveEl.current && lastActiveEl.current.focus) {
        lastActiveEl.current.focus()
      }
    }

    window.addEventListener('open-contact-form', onOpen)
    window.addEventListener('close-contact-form', onClose)

    const clickHandler = (ev) => {
      const btn = ev.target.closest && ev.target.closest('[data-open-contact]')
      if (btn) {
        ev.preventDefault()
        const id = btn.getAttribute('id') || btn.dataset.contactId || null
        window.dispatchEvent(new CustomEvent('open-contact-form', { detail: { id } }))
      }
    }
    document.addEventListener('click', clickHandler)

    return () => {
      document.removeEventListener('click', clickHandler)
      window.removeEventListener('open-contact-form', onOpen)
      window.removeEventListener('close-contact-form', onClose)
      delete window.openContactForm
      delete window.closeContactForm
    }
  }, [])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    if (open) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  const handleBackdropMouseDown = (e) => {
    if (e.target === backdropRef.current) {
      setOpen(false)
    }
  }

  // WATCH FOR NAVIGATION TO A "SUCCESS" / THANK-YOU URL and close modal only then
  useEffect(() => {
    if (!open) {
      // clear any existing poll
      if (pollRef.current) {
        clearInterval(pollRef.current)
        pollRef.current = null
      }
      return
    }

    // list of substrings commonly present in thank-you / success pages
    const SUCCESS_KEYWORDS = ['thank', 'thank-you', 'thankyou', 'success', 'submitted', 'confirmation']

    const checkNav = () => {
      try {
        const prev = initialHrefRef.current || ''
        const now = window.location.href
        // If href changed and new href contains any success keyword -> close modal
        if (now !== prev) {
          const lower = now.toLowerCase()
          const matched = SUCCESS_KEYWORDS.some(k => lower.includes(k))
          if (matched) {
            setOpen(false)
            // once closed, stop polling
            if (pollRef.current) {
              clearInterval(pollRef.current)
              pollRef.current = null
            }
          } else {
            // if navigation occurred but not a success page, update stored href so we don't
            // repeatedly compare old values. This prevents false-positives on normal navigation.
            initialHrefRef.current = now
          }
        }
      } catch (err) {
        // ignore any read errors
      }
    }

    // start a short poll while modal is open; 200ms is responsive but lightweight
    pollRef.current = setInterval(checkNav, 200)

    // also listen to popstate in case single-page-app navigation occurs without href change pattern
    const onPop = () => checkNav()
    window.addEventListener('popstate', onPop)

    return () => {
      if (pollRef.current) {
        clearInterval(pollRef.current)
        pollRef.current = null
      }
      window.removeEventListener('popstate', onPop)
    }
  }, [open])

 
  if (!open) return null

  return (
    <div
      ref={backdropRef}
      className={styles.backdrop}
      role="dialog"
      aria-modal="true"
      onMouseDown={handleBackdropMouseDown}
    >
      <div
        className={styles.modal}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <button
          className={styles.closeBtn}
          aria-label="Close contact form"
          onClick={() => setOpen(false)}
        >
          ×
        </button>

        <div className={styles.content}>
          <FormComponent onSuccess={() => setOpen(false)} />
        </div>
      </div>
    </div>
  )
}
