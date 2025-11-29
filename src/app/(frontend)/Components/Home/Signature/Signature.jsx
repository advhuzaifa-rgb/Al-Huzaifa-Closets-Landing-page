import React from 'react'
import styles from './Signature.module.css'

const Signature = () => {
  return (
    <>
      <div className={styles.main}>
        <div className={styles.MainContainer}>
          <div className={styles.Top}>
            <h3>Craft Your Signature</h3>
          </div>
          <div className={styles.Middle}>
            <p>
              Visit us to explore Signature Closets in person — where luxury meets innovation, and
              every design tells your story.
            </p>
          </div>
          <button data-open-contact id="cta-hero-1" className={styles.Button}>Enquire Now</button>
        </div>
      </div>
    </>
  )
}

export default Signature
