import React from 'react'
import styles from './Experience.module.css'
import Image from 'next/image'
import leftimg from './1.avif'

const Experience = () => {
  return (
    <>
      <div className={styles.Main}>
        <div className={styles.MainConatiner}>
          <div className={styles.LeftContainer}>
            <Image src={leftimg} alt="leftimg" className={styles.LeftImage} />
          </div>
          <div className={styles.RightContainer}>
            <h2>The Al Huzaifa Design Studio Experience</h2>
            <p>
              Step inside our Design Studio on Al Wasl Road - a space where imagination takes form.
              Discover conceptual walkthroughs, curated materials, and a team dedicated to
              transforming your vision into reality. From inspiration to installation, every detail
              is orchestrated with artistry and precision.
            </p>
            <button data-open-contact id="cta-hero-1" className={styles.Button}>
               Enquire Now
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Experience
