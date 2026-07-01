import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'The Hook | Angler Log',
  description: 'Log your catches and track your fishing adventures.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body 
        className={inter.className} 
        style={{ 
          margin: 0, 
          padding: 0, 
          backgroundColor: '#021526', 
          color: '#f8fafc',
          minHeight: '100vh',
          position: 'relative',
          overflowX: 'hidden'
        }}
      >
        {/* Background Video Layer */}
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: -1
          }}
        >
          {/* Ensure your video file is in the public folder */}
          <source src="/background-video.mp4" type="video/mp4" />
        </video>

        {/* Content Layer */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          {children}
        </div>
      </body>
    </html>
  )
}