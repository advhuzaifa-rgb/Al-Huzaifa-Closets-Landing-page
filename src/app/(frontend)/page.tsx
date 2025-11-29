import { headers as getHeaders } from 'next/headers.js'
import Image from 'next/image'
import { getPayload } from 'payload'
import React from 'react'
import { fileURLToPath } from 'url'
import config from '@/payload.config'
import './styles.css'

import Footer from './Components/Home/Footer/Footer'
import Experience from './Components/Home/Experience/Experience'
import Bespoke from './Components/Home/Bespoke/Bespoke'
import Signature from './Components/Home/Signature/Signature'
import Symphony from './Components/Home/Symphony/Symphony'
import Innovation from './Components/Home/Innovation/Innovation'
import Landing from './Components/Home/Landing/Landing'
import OurCollection from './Components/Home/OurCollection/OurCollection'
import whatsappIcon from './wp.png'
import Script from 'next/script'

export default async function HomePage() {
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })

  const fileURL = `vscode://file/${fileURLToPath(import.meta.url)}`

  return (
    <div className="home">
      <Landing />
      <Symphony />
      <OurCollection />
      <Innovation />
      <Bespoke />
      <Experience />
      <Signature />
      <Footer />

      <div className="whatsapp">
        <a
          href="https://wa.me/971501993091?text=Hi%20I%20want%20enquiry%20regarding%20Signature%Closets%20and%20services."
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image src={whatsappIcon} alt="whatsapp" />
        </a>
      </div>
    </div>
  )
}
