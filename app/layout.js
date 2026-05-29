import './globals.css'

export const metadata = {
  title: 'YoloFare — Fly for Less',
  description: 'Handpicked flight deals from India. 40% off minimum.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  )
}