"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Conference } from "@/lib/actions"
import { Plus, Calendar, MapPin, Clock, Users, CheckCircle } from "lucide-react"

interface ConferenceListProps {
  conferences: Conference[]
  addToProgram: (conferenceId: string) => Promise<{ success: boolean; error?: string }>
}

export function ConferenceList({ conferences, addToProgram }: ConferenceListProps) {
  const { data: session } = useSession()
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({})
  const [successStates, setSuccessStates] = useState<Record<string, boolean>>({})

  const handleAddToProgram = async (conferenceId: string) => {
    if (!session) {
      alert("Vous devez être connecté pour ajouter une conférence à votre programme")
      return
    }

    setLoadingStates(prev => ({ ...prev, [conferenceId]: true }))
    setSuccessStates(prev => ({ ...prev, [conferenceId]: false }))

    try {
      const result = await addToProgram(conferenceId)
      if (result.success) {
        setSuccessStates(prev => ({ ...prev, [conferenceId]: true }))
        setTimeout(() => {
          setSuccessStates(prev => ({ ...prev, [conferenceId]: false }))
        }, 2000)
      } else {
        alert(result.error || "Erreur lors de l'ajout au programme")
      }
    } catch (err) {
      alert("Erreur lors de l'ajout au programme")
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

  const getOccupancyIcon = (attendees: number, maxCapacity: number) => {
    const percentage = (attendees / maxCapacity) * 100
    if (percentage >= 80) return "🔴"
    if (percentage >= 60) return "🟡"
    return "🟢"
  }

  if (conferences.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-xl font-semibold mb-2">Aucune conférence trouvée</h3>
          <p className="text-muted-foreground">
            Essayez de modifier vos filtres pour voir plus de résultats
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {conferences.map((conference) => (
        <Card key={conference.id} className="h-full hover:shadow-lg transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="line-clamp-2 text-lg">{conference.title}</CardTitle>
            <CardDescription className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              Par {conference.speaker}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(conference.date)}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{conference.room.name}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{conference.duration} minutes</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4" />
                  <span className={getOccupancyColor(
                    conference._count?.attendees || 0, 
                    conference.maxCapacity
                  )}>
                    {conference._count?.attendees || 0} / {conference.maxCapacity}
                  </span>
                </div>
                <span className="text-lg">
                  {getOccupancyIcon(conference._count?.attendees || 0, conference.maxCapacity)}
                </span>
              </div>
            </div>

            <p className="text-sm line-clamp-3 text-muted-foreground">
              {conference.description}
            </p>

            <div className="flex justify-between items-center pt-2">
              <span className={`text-sm font-medium ${getOccupancyColor(
                conference._count?.attendees || 0, 
                conference.maxCapacity
              )}`}>
                {Math.round(((conference._count?.attendees || 0) / conference.maxCapacity) * 100)}% rempli
              </span>

              {session && (
                <Button
                  size="sm"
                  variant={successStates[conference.id] ? "outline" : "default"}
                  onClick={() => handleAddToProgram(conference.id)}
                  disabled={loadingStates[conference.id]}
                >
                  {loadingStates[conference.id] ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      <span>Ajout...</span>
                    </div>
                  ) : successStates[conference.id] ? (
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4" />
                      <span>Ajouté !</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Plus className="h-4 w-4" />
                      <span>Ajouter au programme</span>
                    </div>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 