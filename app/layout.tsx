import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/components/auth-provider"
import { Navigation } from "@/components/navigation"

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "Salon Conférences - Planifiez votre parcours",
  description: "Découvrez et planifiez votre parcours de conférences pour le salon professionnel 2024",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className={inter.variable}>
      <body className="antialiased">
        <AuthProvider>
          <div className="min-h-screen bg-background">
            <Navigation />
            <main className="container mx-auto px-6 py-12 max-w-7xl">
              {children}
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}
