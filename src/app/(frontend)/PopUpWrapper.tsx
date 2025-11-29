'use client'
import React from 'react'
import ContactModal from './Components/Common/ContactModal/ContactModal'

export default function PopUpWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ContactModal />
      {children}
    </>
  )
}
