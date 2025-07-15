"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Conference, deleteConference } from "@/lib/actions"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface AdminConferenceListProps {
  conferences: Conference[]
}

export function AdminConferenceList({ conferences }: AdminConferenceListProps) {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({})
  const router = useRouter()

  const handleDeleteConference = async (conferenceId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette conférence ?")) {
      return
    }

    setLoadingStates(prev => ({ ...prev, [conferenceId]: true }))

    try {
      const result = await deleteConference(conferenceId)
      
      if (result.success) {
        alert("Conférence supprimée avec succès")
        router.refresh()
      } else {
        alert(result.error || "Erreur lors de la suppression de la conférence")
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de la conférence:", error)
      alert("Erreur lors de la suppression de la conférence")
    } finally {
      setLoadingStates(prev => ({ ...prev, [conferenceId]: false }))
    }
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  const getOccupancyColor = (attendees: number, maxCapacity: number) => {
    const percentage = (attendees / maxCapacity) * 100
    if (percentage >= 80) return "text-red-600"
    if (percentage >= 60) return "text-orange-600"
    return "text-green-600"
  }

  return (
    <div className="space-y-4">
      {conferences.map((conference) => (
        <Card key={conference.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{conference.title}</CardTitle>
                <CardDescription>
                  Par {conference.speaker} • {conference.room.name}
                </CardDescription>
              </div>
              <div className="flex space-x-2">
                <Link href={`/admin/conferences/${conference.id}/edit`}>
                  <Button variant="outline" size="sm">
                    Modifier
                  </Button>
                </Link>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteConference(conference.id)}
                  disabled={loadingStates[conference.id]}
                >
                  {loadingStates[conference.id] ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      <span>Suppression...</span>
                    </div>
                  ) : (
                    "Supprimer"
                  )}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-medium">Date et Heure</p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(conference.date)}
                </p>
              </div>
              
              <div>
                <p className="text-sm font-medium">Durée</p>
                <p className="text-sm text-muted-foreground">
                  {conference.duration} minutes
                </p>
              </div>
              
              <div>
                <p className="text-sm font-medium">Inscriptions</p>
                <p className={`text-sm font-medium ${getOccupancyColor(
                  conference._count?.attendees || 0, 
                  conference.maxCapacity
                )}`}>
                  {conference._count?.attendees || 0} / {conference.maxCapacity} 
                  ({Math.round(((conference._count?.attendees || 0) / conference.maxCapacity) * 100)}%)
                </p>
              </div>
            </div>
            
            <div className="mt-4">
              <p className="text-sm font-medium">Description</p>
              <p className="text-sm text-muted-foreground mt-1">
                {conference.description}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 