import React from 'react'
import styles from './HomeButton.module.css'

const HomeButton = () => {
  return (
    <div>
      <button data-open-contact id="cta-hero-1" className={styles.btn}>Book a Free Consultation</button>
    </div>
  )
}

export default HomeButton
