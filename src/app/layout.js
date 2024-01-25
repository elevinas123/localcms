"use client"
import { Inter as FontSans } from "next/font/google"
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { cn } from "../lib/utils"
 
export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})


export default function RootLayout({ children, pageProps}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "min-h-screen  font-sans antialiased bg-zinc-800",
          fontSans.variable
        )}
      >
         <SessionProvider {...pageProps}>
        {children}
        </SessionProvider>
      </body>
    </html>
  )
}