"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { getSponsor, updateSponsor } from "@/lib/actions"
import { ArrowLeft, Save, Building, Mail, Phone, Globe, Trophy } from "lucide-react"

interface Sponsor {
  id: string
  name: string
  description: string | null
  website: string | null
  email: string | null
  phone: string | null
  level: 'PLATINUM' | 'GOLD' | 'SILVER' | 'BRONZE'
  conferences?: Array<{
    id: string
    title: string
    description: string
    speaker: string
    date: Date
    duration: number
    roomId: string
    maxCapacity: number
    sponsorId: string | null
    room: {
      id: string
      name: string
      capacity: number
    }
  }>
}

export default function EditSponsorPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [sponsor, setSponsor] = useState<Sponsor | null>(null)
  const [sponsorId, setSponsorId] = useState<string>("")
  const router = useRouter()
  const params = useParams()

  useEffect(() => {
    const getSponsorId = async () => {
      if (params.id) {
        const id = Array.isArray(params.id) ? params.id[0] : params.id
        setSponsorId(id)
      }
    }
    getSponsorId()
  }, [params.id])

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    website: "",
    email: "",
    phone: "",
    level: "BRONZE" as 'PLATINUM' | 'GOLD' | 'SILVER' | 'BRONZE'
  })

  useEffect(() => {
    const loadSponsor = async () => {
      const result = await getSponsor(sponsorId)
      
      if (result.success && result.data) {
        const sponsorData = result.data
        setSponsor(sponsorData)
        
        setFormData({
          name: sponsorData.name,
          description: sponsorData.description || "",
          website: sponsorData.website || "",
          email: sponsorData.email || "",
          phone: sponsorData.phone || "",
          level: sponsorData.level
        })
      }
    }

    loadSponsor()
  }, [sponsorId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await updateSponsor(sponsorId, formData)
      
      if (result.success) {
        router.push("/admin/sponsors")
      }
    } catch (error) {
      console.error("Erreur lors de la modification:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  if (!sponsor) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/sponsors">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Modifier le Sponsor</h1>
          <p className="text-muted-foreground">
            Modifier les informations du sponsor
          </p>
        </div>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Informations du sponsor</CardTitle>
          <CardDescription>
            Modifiez les informations du sponsor
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nom du sponsor *</Label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Nom de l'entreprise"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Description du sponsor et de ses activités"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="website">Site web</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="website"
                    type="url"
                    value={formData.website}
                    onChange={(e) => handleInputChange("website", e.target.value)}
                    placeholder="https://example.com"
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email de contact</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="contact@example.com"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="+33 1 23 45 67 89"
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="level">Niveau de sponsorisation *</Label>
              <div className="relative">
                <Trophy className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <select
                  id="level"
                  value={formData.level}
                  onChange={(e) => handleInputChange("level", e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-10"
                  required
                >
                  <option value="BRONZE">🥉 Bronze</option>
                  <option value="SILVER">🥈 Silver</option>
                  <option value="GOLD">🥇 Gold</option>
                  <option value="PLATINUM">🥇 Platinum</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Link href="/admin/sponsors">
                <Button variant="outline">
                  Annuler
                </Button>
              </Link>
              <Button 
                type="submit" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    <span>Modification...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Save className="h-4 w-4" />
                    <span>Modifier</span>
                  </div>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 