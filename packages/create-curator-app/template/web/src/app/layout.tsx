import './globals.css'
import { Inter } from 'next/font/google'
import {Bridge} from "@curatorjs/bridge";

import "@curatorjs/bridge/styles.min.css"

const inter = Inter({ subsets: ['latin'] })



export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <Bridge strapiUrl="http://localhost:1337" studioUrl="http://localhost:1338" refreshAfterChanges />
      {children}
      </body>
    </html>
  )
}
