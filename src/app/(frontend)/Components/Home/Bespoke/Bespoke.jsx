import React from 'react'
import styles from './Bespoke.module.css'

const Bespoke = () => {
  return (
    <>
      <div className={styles.main}>
        <div className={styles.MainContainer}>
          <div className={styles.Top}>
            <h2>Your Bespoke Journey</h2>
            <p>
              Every Signature Closet begins with you. From the first conversation to final
              installation.
            </p>
          </div>
          <div className={styles.Bottom}>
            <div className={styles.One}>
              <div className={styles.OneTop}>
                <p>01</p>
                <div className={styles.line}></div>
                <h5>Consultation</h5>
              </div>
              <div className={styles.OneBottom}>
                <p>We discover your lifestyle, taste, and requirements.</p>
              </div>
            </div>
            <div className={styles.One}>
              <div className={styles.OneTop}>
                <p>02</p>
                <div className={styles.line}></div>
                <h5>Concept</h5>
              </div>
              <div className={styles.OneBottom}>
                <p>Materials, finishes, and layout visualizations are curated</p>
              </div>
            </div>
            <div className={styles.One}>
              <div className={styles.OneTop}>
                <p>03</p>
                <div className={styles.line}></div>
                <h5>Co-Creation</h5>
              </div>
              <div className={styles.OneBottom}>
                <p>Experience your design in 3D or Virtual Reality.</p>
              </div>
            </div>
            <div className={styles.One}>
              <div className={styles.OneTop}>
                <p>04</p>
                <div className={styles.line}></div>
                <h5>Completion</h5>
              </div>
              <div className={styles.OneBottom}>
                <p>Precision-built, effortlessly installed, and ready to admire.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Bespoke
