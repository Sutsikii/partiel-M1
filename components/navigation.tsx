"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { Calendar, User, Settings, LogOut, Menu } from "lucide-react"

export function Navigation() {
  const { data: session } = useSession()
  const [isSponsor, setIsSponsor] = useState(false)

  useEffect(() => {
    const checkSponsorStatus = async () => {
      if (session?.user) {
        try {
          const response = await fetch('/api/sponsor/check')
          if (response.ok) {
            const data = await response.json()
            setIsSponsor(data.isSponsor)
          }
        } catch (error) {
          console.error('Erreur lors de la vérification du statut sponsor:', error)
        }
      } else {
        setIsSponsor(false)
      }
    }

    checkSponsorStatus()
  }, [session])

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Calendar className="h-6 w-6" />
            <span className="text-xl font-semibold tracking-tight">
              Salon Conférences
            </span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/conferences">
              <Button variant="ghost" className="text-sm font-medium">
                Conférences
              </Button>
            </Link>
            
            {session ? (
              <>
                <Link href="/programme">
                  <Button variant="ghost" className="text-sm font-medium">
                    Mon Programme
                  </Button>
                </Link>
                {isSponsor && (
                  <Link href="/sponsor/mes-conferences">
                    <Button variant="ghost" className="text-sm font-medium">
                      Mes Conférences
                    </Button>
                  </Link>
                )}
                {session.user.role === "ADMIN" && (
                  <Link href="/admin">
                    <Button variant="ghost" className="text-sm font-medium">
                      <Settings className="h-4 w-4 mr-2" />
                      Administration
                    </Button>
                  </Link>
                )}
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span>{session.user.name}</span>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => signOut()}
                    className="text-xs"
                  >
                    <LogOut className="h-3 w-3 mr-1" />
                    Déconnexion
                  </Button>
                </div>
              </>
            ) : (
              <Link href="/auth/signin">
                <Button size="sm" className="text-sm font-medium">
                  Connexion
                </Button>
              </Link>
            )}
          </div>

          {/* Menu mobile */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
} 