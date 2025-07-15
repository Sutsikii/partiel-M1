"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2, Calendar, MapPin, Clock, Users } from "lucide-react"

interface UserConference {
  id: string
  conference: {
    id: string
    title: string
    description: string
    speaker: string
    date: Date
    duration: number
    maxCapacity: number
    room: {
      name: string
      capacity: number
    }
    _count?: {
      attendees: number
    }
  }
}

interface ProgramListProps {
  userConferences: UserConference[]
  removeFromProgram: (conferenceId: string) => Promise<{ success: boolean; error?: string }>
}

export function ProgramList({ userConferences, removeFromProgram }: ProgramListProps) {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({})

  const handleRemoveFromProgram = async (conferenceId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir retirer cette conférence de votre programme ?")) {
      return
    }

    setLoadingStates(prev => ({ ...prev, [conferenceId]: true }))

    try {
      const result = await removeFromProgram(conferenceId)
      if (result.success) {
        console.log("Conférence retirée avec succès")
      } else {
        alert(result.error || "Erreur lors de la suppression du programme")
      }
    } catch (err) {
      alert("Erreur lors de la suppression du programme")
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

  const getTimeUntilConference = (date: Date) => {
    const now = new Date()
    const conferenceDate = new Date(date)
    const diffTime = conferenceDate.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays < 0) return "Passée"
    if (diffDays === 0) return "Aujourd'hui"
    if (diffDays === 1) return "Demain"
    return `Dans ${diffDays} jours`
  }

  const groupedConferences = userConferences.reduce((acc: Record<string, UserConference[]>, userConference: UserConference) => {
    const date = new Date(userConference.conference.date).toDateString()
    if (!acc[date]) {
      acc[date] = []
    }
    acc[date].push(userConference)
    return acc
  }, {} as Record<string, UserConference[]>)

  return (
    <div className="space-y-8">
      {Object.entries(groupedConferences).map(([date, conferences]: [string, UserConference[]]) => (
        <div key={date} className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">
              {new Date(date).toLocaleDateString("fr-FR", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric"
              })}
            </h2>
            <span className="text-sm text-muted-foreground">
              {conferences.length} conférence{conferences.length > 1 ? 's' : ''}
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {conferences.map((userConference: UserConference) => (
              <Card key={userConference.id} className="h-full hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-primary">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="line-clamp-2 text-lg">
                        {userConference.conference.title}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-1 mt-1">
                        <Users className="h-4 w-4" />
                        Par {userConference.conference.speaker}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        getTimeUntilConference(userConference.conference.date) === "Passée" 
                          ? "bg-gray-100 text-gray-600" 
                          : "bg-green-100 text-green-600"
                      }`}>
                        {getTimeUntilConference(userConference.conference.date)}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(userConference.conference.date)}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{userConference.conference.room.name}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{userConference.conference.duration} minutes</span>
                    </div>
                  </div>

                  <p className="text-sm line-clamp-3 text-muted-foreground">
                    {userConference.conference.description}
                  </p>

                  <div className="flex justify-between items-center pt-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>
                        {userConference.conference._count?.attendees || 0} / {userConference.conference.maxCapacity} participants
                      </span>
                    </div>

                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRemoveFromProgram(userConference.conference.id)}
                      disabled={loadingStates[userConference.conference.id]}
                    >
                      {loadingStates[userConference.conference.id] ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          <span>Suppression...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Trash2 className="h-4 w-4" />
                          <span>Retirer</span>
                        </div>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
} 