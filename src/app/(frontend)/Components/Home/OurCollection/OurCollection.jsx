import React from 'react'
import styles from './OurCollection.module.css'
import Image from 'next/image'
import one from './1.png'
import two from './2.png'
import three from './3.png'
import four from './4.png'
import five from './5.png'
import six from './6.png'

const OurCollection = () => {
  return (
    <>
      <div className={styles.main}>
        <div className={styles.MainContainer}>
          <div className={styles.TopContainer}>
            <h3>Our Collection</h3>
            <p>
              Every Signature Closet tells a story, of meticulous detail, modern grace, and timeless
              craftsmanship.
            </p>
          </div>
          <div className={styles.MiddleContainer}>
            <div className={styles.MiddleTop}>
              <div className={styles.MiddleOne}>
                <Image src={one} alt="one" />
                <h3>Walk-In Closets</h3>
                <div className={styles.line}></div>
                <p>
                  Discover luxury and creativity in our walk-in closet, blending Open Cloak, Aqua,
                  and Pole System designs for perfect organization and contemporary style.
                </p>
              </div>
              <div className={styles.MiddleTwo}>
                <Image src={two} alt="two" />
                <h3>Pole System Designs</h3>
                <div className={styles.line}></div>
                <p>
                  With synchronized sliding doors, the innovative Pole System embodies modern
                  minimalism with clean lines, deep drawers, inventive trouser shelves, and luminous
                  light-inserted poles.{' '}
                </p>
              </div>
            </div>
            <div className={styles.MiddleCenter}>
              <div className={styles.MiddleOne}>
                <Image src={three} alt="one" />
                <h3>Leather Wardrobes</h3>
                <div className={styles.line}></div>
                <p>
                  Create your statement style with fully customizable leather closets featuring
                  genuine leather doors, coffee brown interiors, and revolving shoe shelves.
                </p>
              </div>
              <div className={styles.MiddleTwo}>
                <Image src={four} alt="two" />
                <h3>Open Cloak Systems</h3>
                <div className={styles.line}></div>
                <p>
                  The Open Cloak closet stands as a utility marvel with an open framework, modular
                  design, smart LED illumination, and generous 3-metre vertical storage with elegant
                  aluminum profiles.
                </p>
              </div>
            </div>
            <div className={styles.MiddleBottom}>
              <div className={styles.MiddleOne}>
                <Image src={five} alt="one" />
                <h3>Kids Room</h3>
                <div className={styles.line}></div>
                <p>
                  Next-generation, versatile systems with eclectic storage configurations, ribbed
                  veneers, wallpaper accents, geometric inserts, and color reveals, crafted for
                  evolving, expressive spaces.{' '}
                </p>
              </div>
              <div className={styles.MiddleTwo}>
                <Image src={six} alt="two" />
                <h3>Entertainment Area</h3>
                <div className={styles.line}></div>
                <p>
                  Experience ultimate sophistication with our modern cellar featuring pristine glass
                  panels, sleek racks, custom storage, and temperature-controlled chillers for
                  refined hosting.
                </p>
              </div>
            </div>
          </div>
          <div className={styles.BottomContainer}>
            <button data-open-contact id="cta-hero-1" className={styles.Button}>Enquire Now</button>
          </div>
        </div>
      </div>
    </>
  )
}

export default OurCollection
