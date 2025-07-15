"use client"

import { useState, useEffect, Suspense } from "react"
import { useSession, signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LogIn, Mail, Lock, Eye, EyeOff, Calendar } from "lucide-react"

function SignInContent() {
  const { data: session, status } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (status === "authenticated" && session) {
      const callbackUrl = searchParams.get('callbackUrl') || "/"
      router.push(callbackUrl)
    }
  }, [session, status, router, searchParams])

  if (status === "loading" || (status === "authenticated" && session)) {
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false
      })

      if (result?.ok) {
        router.push("/")
      }
    } catch (err) {
      console.error("Erreur de connexion:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoLogin = async (demoEmail: string) => {
    setIsLoading(true)
    setFormData(prev => ({ ...prev, email: demoEmail }))
    setFormData(prev => ({ ...prev, password: "password123" }))

    try {
      const callbackUrl = searchParams.get('callbackUrl') || "/"
      const result = await signIn("credentials", {
        email: demoEmail,
        password: "password123",
        redirect: false,
        callbackUrl: callbackUrl
      })

      if (result?.error) {
      } else {
        router.push(callbackUrl)
      }
    } catch (err) {
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-[70vh]">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <Calendar className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Connexion</h1>
            <p className="text-sm text-muted-foreground mt-2">
              Accédez à votre programme personnalisé
            </p>
          </div>
        </div>

        {/* Formulaire */}
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="votre@email.com"
                    className="pl-10 h-11"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">Mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Mot de passe"
                    className="pl-10 pr-10 h-11"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-11 text-sm font-medium" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    <span>Connexion en cours...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <LogIn className="h-4 w-4" />
                    <span>Se connecter</span>
                  </div>
                )}
              </Button>
            </form>

            {/* Séparateur */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground font-medium">
                  Ou connectez-vous rapidement
                </span>
              </div>
            </div>

            {/* Boutons de démonstration */}
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full h-11 text-sm"
                onClick={() => handleDemoLogin("visiteur@demo.com")}
                disabled={isLoading}
              >
                <Mail className="h-4 w-4 mr-2" />
                Visiteur Demo
              </Button>
              
              <Button
                variant="outline"
                className="w-full h-11 text-sm"
                onClick={() => handleDemoLogin("admin@demo.com")}
                disabled={isLoading}
              >
                <Mail className="h-4 w-4 mr-2" />
                Admin Demo
              </Button>

              <Button
                variant="outline"
                className="w-full h-11 text-sm"
                onClick={() => handleDemoLogin("sponsor@demo.com")}
                disabled={isLoading}
              >
                <Mail className="h-4 w-4 mr-2" />
                Sponsor Demo
              </Button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-xs text-muted-foreground">
                Mot de passe pour tous les comptes demo : 
                <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono ml-1">
                  password123
                </code>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    }>
      <SignInContent />
    </Suspense>
  )
} 