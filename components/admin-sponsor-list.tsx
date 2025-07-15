"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { deleteSponsor } from "@/lib/actions"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Edit, Trash2, Globe, Mail, Phone, Building } from "lucide-react"
import Image from 'next/image'

interface Sponsor {
  id: string
  name: string
  description: string | null
  logo?: string | null
  website: string | null
  email: string | null
  phone: string | null
  level: 'PLATINUM' | 'GOLD' | 'SILVER' | 'BRONZE'
  createdAt: Date
  updatedAt: Date
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

export function AdminSponsorList({ sponsors }: { sponsors: Sponsor[] }) {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({})
  const router = useRouter()

  const handleDeleteSponsor = async (sponsorId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce sponsor ?")) {
      return
    }

    setLoadingStates(prev => ({ ...prev, [sponsorId]: true }))

    try {
      const result = await deleteSponsor(sponsorId)
      
      if (result.success) {
        alert("Sponsor supprimé avec succès")
        router.refresh()
      } else {
        alert(result.error || "Erreur lors de la suppression du sponsor")
      }
    } catch (err) {
      alert("Erreur lors de la suppression du sponsor")
    } finally {
      setLoadingStates(prev => ({ ...prev, [sponsorId]: false }))
    }
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'PLATINUM':
        return 'bg-gray-100 text-gray-800 border-gray-300'
      case 'GOLD':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'SILVER':
        return 'bg-gray-100 text-gray-700 border-gray-400'
      case 'BRONZE':
        return 'bg-amber-100 text-amber-800 border-amber-300'
      default:
        return 'bg-gray-100 text-gray-600 border-gray-300'
    }
  }

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'PLATINUM':
        return '🥇'
      case 'GOLD':
        return '🥇'
      case 'SILVER':
        return '🥈'
      case 'BRONZE':
        return '🥉'
      default:
        return '🏆'
    }
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric"
    })
  }

  return (
    <div className="space-y-4">
      {sponsors.map((sponsor) => (
        <Card key={sponsor.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                {sponsor.logo && (
                  <Image
                    src={sponsor.logo}
                    alt={`Logo du sponsor ${sponsor.name}`}
                    width={48}
                    height={48}
                    className="w-12 h-12 object-contain rounded"
                  />
                )}
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {sponsor.name}
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getLevelColor(sponsor.level)}`}>
                      {getLevelIcon(sponsor.level)} {sponsor.level}
                    </span>
                  </CardTitle>
                  <CardDescription>
                    Ajouté le {formatDate(sponsor.createdAt)}
                  </CardDescription>
                </div>
              </div>
              <div className="flex space-x-2">
                <Link href={`/admin/sponsors/${sponsor.id}/edit`}>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-1" />
                    Modifier
                  </Button>
                </Link>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteSponsor(sponsor.id)}
                  disabled={loadingStates[sponsor.id]}
                >
                  {loadingStates[sponsor.id] ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      <span>Suppression...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Trash2 className="h-4 w-4" />
                      <span>Supprimer</span>
                    </div>
                  )}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium mb-2">Description</p>
                <p className="text-sm text-muted-foreground">
                  {sponsor.description || "Aucune description"}
                </p>
              </div>
              
              <div>
                <p className="text-sm font-medium mb-2">Contact</p>
                <div className="space-y-1">
                  {sponsor.email && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-3 w-3" />
                      <a href={`mailto:${sponsor.email}`} className="hover:text-primary">
                        {sponsor.email}
                      </a>
                    </div>
                  )}
                  {sponsor.phone && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-3 w-3" />
                      <a href={`tel:${sponsor.phone}`} className="hover:text-primary">
                        {sponsor.phone}
                      </a>
                    </div>
                  )}
                  {sponsor.website && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Globe className="h-3 w-3" />
                      <a 
                        href={sponsor.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:text-primary"
                      >
                        {sponsor.website}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {sponsor.conferences && sponsor.conferences.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium mb-2">Conférences sponsorisées</p>
                <div className="flex flex-wrap gap-2">
                  {(sponsor.conferences || []).map((conference) => (
                    <span 
                      key={conference.id}
                      className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-blue-100 text-blue-800"
                    >
                      <Building className="h-3 w-3 mr-1" />
                      {conference.title}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
      
      {sponsors.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">Aucun sponsor pour le moment</p>
            <Link href="/admin/sponsors/new">
              <Button className="mt-4">
                Ajouter le premier sponsor
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 