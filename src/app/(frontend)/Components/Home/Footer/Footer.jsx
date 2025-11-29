import React from 'react'
import styles from './Footer.module.css'
import Link from 'next/link'
import Image from 'next/image'
import logo from './Design.svg'

const Footer = () => {
  return (
    <>
      <footer className={styles.footer}>
        <div className={styles.footerContainer}>
          <div className={styles.footerTop}>
            <div className={styles.TopSection}>
              <a
                href="https://www.facebook.com/p/Al-Huzaifa-Design-Studio-100076170074054/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <svg
                  width="30"
                  height="30"
                  viewBox="0 0 30 30"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M26.24 0H3.28C1.476 0 0 1.476 0 3.28V26.24C0 28.0456 1.476 29.52 3.28 29.52H14.76V18.04H11.48V13.981H14.76V10.619C14.76 7.07004 16.7477 4.57724 20.9362 4.57724L23.8932 4.58052V8.85272H21.9301C20.2999 8.85272 19.68 10.0762 19.68 11.211V13.9826H23.8915L22.96 18.04H19.68V29.52H26.24C28.044 29.52 29.52 28.0456 29.52 26.24V3.28C29.52 1.476 28.044 0 26.24 0Z"
                    fill="white"
                  />
                </svg>
              </a>

              <a
                href="https://www.instagram.com/alhuzaifadesignstudio/?hl=en"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <svg
                  width="30"
                  height="30"
                  viewBox="0 0 30 30"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M14.6274 0C1.06147 0 0 1.06221 0 14.6274V14.8926C0 28.4578 1.06148 29.52 14.6274 29.52H14.8926C28.4585 29.52 29.52 28.4578 29.52 14.8926V14.76C29.52 1.07158 28.4484 0 14.76 0H14.6274ZM23.6117 4.428C24.4272 4.42579 25.0898 5.08419 25.092 5.89968C25.0942 6.71517 24.4358 7.37779 23.6203 7.38C22.8048 7.38221 22.1422 6.72381 22.14 5.90832C22.1378 5.09283 22.7962 4.43021 23.6117 4.428ZM14.7427 7.38C18.8179 7.37041 22.1304 10.6675 22.14 14.7427C22.1496 18.8179 18.8525 22.1304 14.7773 22.14C10.7021 22.1496 7.38959 18.8525 7.38 14.7773C7.37041 10.7021 10.6675 7.38959 14.7427 7.38ZM14.7499 10.332C12.3042 10.3379 10.3261 12.3258 10.332 14.7715C10.3379 17.2165 12.3251 19.1939 14.7701 19.188C17.2158 19.1821 19.1939 17.1949 19.188 14.7499C19.1821 12.3042 17.1949 10.3261 14.7499 10.332Z"
                    fill="white"
                  />
                </svg>
              </a>

              <a
                href="https://www.linkedin.com/company/al-huzaifa-furniture/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <svg
                  width="30"
                  height="30"
                  viewBox="0 0 30 30"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M26.0057 0H3.51429C1.5744 0 0 1.5744 0 3.51429V26.0057C0 27.9456 1.5744 29.52 3.51429 29.52H26.0057C27.9456 29.52 29.52 27.9456 29.52 26.0057V3.51429C29.52 1.5744 27.9456 0 26.0057 0ZM9.13714 11.2457V24.6H4.92V11.2457H9.13714ZM4.92 7.35891C4.92 6.37491 5.76343 5.62286 7.02857 5.62286C8.29371 5.62286 9.08794 6.37491 9.13714 7.35891C9.13714 8.34291 8.34994 9.13714 7.02857 9.13714C5.76343 9.13714 4.92 8.34291 4.92 7.35891ZM24.6 24.6H20.3829C20.3829 24.6 20.3829 18.0915 20.3829 17.5714C20.3829 16.1657 19.68 14.76 17.9229 14.7319H17.8666C16.1657 14.7319 15.4629 16.1798 15.4629 17.5714C15.4629 18.211 15.4629 24.6 15.4629 24.6H11.2457V11.2457H15.4629V13.045C15.4629 13.045 16.8194 11.2457 19.5465 11.2457C22.3368 11.2457 24.6 13.1645 24.6 17.0513V24.6Z"
                    fill="white"
                  />
                </svg>
              </a>
            </div>

            <div className={styles.TopMiddleSection}>
              <Image src={logo} alt="logo" />
            </div>
            <div className={styles.TopBottomSection}>
              <div className={styles.TopSectionOne}>
                <p>Contact</p>
              </div>
              <div className={styles.TopBottomSectionTwo}>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 5.5C3 14.0604 9.93959 21 18.5 21C18.8862 21 19.2691 20.9859 19.6483 20.9581C20.0834 20.9262 20.3009 20.9103 20.499 20.7963C20.663 20.7019 20.8185 20.5345 20.9007 20.364C21 20.1582 21 19.9181 21 19.438V16.6207C21 16.2169 21 16.015 20.9335 15.842C20.8749 15.6891 20.7795 15.553 20.6559 15.4456C20.516 15.324 20.3262 15.255 19.9468 15.117L16.74 13.9509C16.2985 13.7904 16.0777 13.7101 15.8683 13.7237C15.6836 13.7357 15.5059 13.7988 15.3549 13.9058C15.1837 14.0271 15.0629 14.2285 14.8212 14.6314L14 16C11.3501 14.7999 9.2019 12.6489 8 10L9.36863 9.17882C9.77145 8.93713 9.97286 8.81628 10.0942 8.64506C10.2012 8.49408 10.2643 8.31637 10.2763 8.1317C10.2899 7.92227 10.2096 7.70153 10.0491 7.26005L8.88299 4.05321C8.745 3.67376 8.67601 3.48403 8.55442 3.3441C8.44701 3.22049 8.31089 3.12515 8.15802 3.06645C7.98496 3 7.78308 3 7.37932 3H4.56201C4.08188 3 3.84181 3 3.63598 3.09925C3.4655 3.18146 3.29814 3.33701 3.2037 3.50103C3.08968 3.69907 3.07375 3.91662 3.04189 4.35173C3.01413 4.73086 3 5.11378 3 5.5Z"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p>
                  <a href="tel:+97142245002" className={styles.phone}>
                    (04) 224 5002
                  </a>
                </p>
              </div>
              <div className={styles.TopBottomSectionThree}>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M17.4009 19.2C15.8965 20.3302 14.0265 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12V13.5C21 14.8807 19.8807 16 18.5 16C17.1193 16 16 14.8807 16 13.5V8M16 12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12Z"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p>
                  <a href="mailto:Enquiryds@huzaifa1.ae" className={styles.email}>
                    Enquiryds@huzaifa1.ae
                  </a>
                </p>
              </div>
            </div>
          </div>
          <div className={styles.footerMiddle}></div>
          <div className={styles.footerBottom}>
            <div className={styles.footerBottomone}>
              <p>Copyright © 2025 Al-Huzaifa</p>
            </div>
            <div className={styles.footerBottomtwo}>
              {' '}
              <p>
                Crafted by{' '}
                <Link
                  href="https://integramagna.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.im}
                >
                  Integra Magna
                </Link>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}

export default Footer
