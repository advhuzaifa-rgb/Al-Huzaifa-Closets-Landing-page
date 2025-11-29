import Link from 'next/link'
import styles from './TopSection.module.css'

export default function TopSection() {
  return (
    <main className={styles.wrapper}>
      <div className={styles.cardview}>
        <h1 className={styles.titlemain}>Thank you!</h1>
        <p className={styles.subtitlemain}>
          We received your message. We'll get back to you shortly.
        </p>
        <div className={styles.actions}>
          <Link href="/" className={styles.button}>Back to Home</Link>
        </div> 
      </div>
    </main>
  )
}
