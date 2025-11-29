import React from 'react'
import styles from './Landing.module.css'
import Image from 'next/image'
import Logo from './logo.svg'
import FormComponent from '../FormComponent/FormComponent'

const Landing = () => {
  return (
    <>
      <div className={styles.main}>
        <div className={styles.MainContainer}>
          <div className={styles.Left}>
            <div className={styles.LeftTop}>
              <Image src={Logo} alt="logo" className={styles.Logo} />
            </div>
            <div className={styles.LeftBottom}>
              <h1>Signature Closets</h1>
              <p>
                Crafting your signature style where artistry, precision, and innovation redefine the
                modern wardrobe.
              </p>
            </div>
          </div>
          <div className={styles.RightDesk}>
            <FormComponent />
          </div>
          <div className={styles.RightMobile}>
            <button data-open-contact id="cta-hero-1" className={styles.button}>Enquire Now</button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Landing
