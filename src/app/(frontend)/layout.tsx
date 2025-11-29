import React from 'react'
import './globals.css'
import PopUpWrapper from './PopUpWrapper'



export const metadata = {
  description: 'Al Huzaifa Furniture - Crafting Bespoke Furniture with Excellence and Precision',
  keywords: [
    'Furniture',
    'Bespoke Furniture',
    'Custom Furniture',
    'Interior Design',
    'Home Decor',
    'Office Furniture',
    'Luxury Furniture',
    'Handcrafted Furniture',
  ],
  title: 'Al Huzaifa Closets',
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon-32x32.png',
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
       
      </head>
      <body>
        <PopUpWrapper>
          <main>{children}</main>
        </PopUpWrapper>
 
      </body>
    </html>
  )
}
