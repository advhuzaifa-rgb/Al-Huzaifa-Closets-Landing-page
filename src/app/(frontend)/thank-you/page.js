import Footer from '../Components/Home/Footer/Footer'
import TopSection from '../Components/ThankYou/TopSection/TopSection'
import Script from 'next/script'

export default function ThankYouPage() {
  return (
    <>
      {/* ✅ Pinterest Base Tag */}
      <Script id="pinterest-base-thankyou" strategy="afterInteractive">
        {`!function(e){if(!window.pintrk){window.pintrk = function () {
window.pintrk.queue.push(Array.prototype.slice.call(arguments))};var
n=window.pintrk;n.queue=[],n.version="3.0";var
t=document.createElement("script");t.async=!0;t.src=e;var
r=document.getElementsByTagName("script")[0];
r.parentNode.insertBefore(t,r)}}("https://s.pinimg.com/ct/core.js");
pintrk('load', '2612831868623', {em: '<user_email_address>'});
pintrk('page');`}
      </Script>

      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          alt=""
          src="https://ct.pinterest.com/v3/?event=init&tid=2612831868623&pd[em]=<hashed_email_address>&noscript=1"
        />
      </noscript>

      {/* ✅ Pinterest Signup Conversion Event (ONLY here) */}
      <Script id="pinterest-signup-event" strategy="afterInteractive">
        {`pintrk('track', 'signup', { event_id: 'eventId0001' });`}
      </Script>
      <TopSection />
      <Footer />
    </>
  )
}
