"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { getConference, getRooms, updateConference } from "@/lib/actions"
import { ArrowLeft, Save, Users, Calendar, Clock, MapPin, Building } from "lucide-react"

interface Conference {
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
}

interface Room {
  id: string
  name: string
  capacity: number
}

export default function EditSponsorConferencePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [conference, setConference] = useState<Conference | null>(null)
  const [rooms, setRooms] = useState<Room[]>([])
  const [conferenceId, setConferenceId] = useState<string>("")
  const router = useRouter()
  const params = useParams()

  useEffect(() => {
    const getConferenceId = async () => {
      if (params.id) {
        const id = Array.isArray(params.id) ? params.id[0] : params.id
        setConferenceId(id)
      }
    }
    getConferenceId()
  }, [params.id])

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    speaker: "",
    date: "",
    time: "",
    duration: "",
    roomId: "",
    maxCapacity: ""
  })

  useEffect(() => {
    if (!conferenceId) return

    const loadData = async () => {
      try {
        const [conferenceResult, roomsResult] = await Promise.all([
          getConference(conferenceId),
          getRooms()
        ])
        
        if (conferenceResult.success && roomsResult.success && conferenceResult.data) {
          const conf = conferenceResult.data
          setConference(conf)
          setRooms(roomsResult.data || [])
          
          const date = new Date(conf.date)
          setFormData({
            title: conf.title,
            description: conf.description,
            speaker: conf.speaker,
            date: date.toISOString().split('T')[0],
            time: date.toTimeString().slice(0, 5),
            duration: conf.duration.toString(),
            roomId: conf.roomId,
            maxCapacity: conf.maxCapacity.toString()
          })
        } else {
        }
      } catch (error) {
      }
    }

    loadData()
  }, [conferenceId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const dateTime = new Date(`${formData.date}T${formData.time}`)
      
      const result = await updateConference(conferenceId, {
        title: formData.title,
        description: formData.description,
        speaker: formData.speaker,
        date: dateTime.toISOString(),
        duration: parseInt(formData.duration),
        roomId: formData.roomId,
        maxCapacity: parseInt(formData.maxCapacity)
      })

      if (result.success) {
        router.push("/sponsor/mes-conferences")
      }
    } catch (err) {
      console.error("Erreur lors de la modification:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  if (!conference) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Chargement des données...</p>
        <Link href="/sponsor/mes-conferences">
          <Button className="mt-4">
            Retour aux conférences
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/sponsor/mes-conferences">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Modifier la Conférence</h1>
          <p className="text-muted-foreground">
            Modifier les informations de votre conférence sponsorisée
          </p>
        </div>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Informations de la conférence</CardTitle>
          <CardDescription>
            Modifiez les informations de votre conférence
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Titre *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Titre de la conférence"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Description détaillée de la conférence"
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="speaker">Intervenant *</Label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="speaker"
                    value={formData.speaker}
                    onChange={(e) => handleInputChange("speaker", e.target.value)}
                    placeholder="Nom de l'intervenant"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Durée (minutes) *</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="duration"
                    type="number"
                    value={formData.duration}
                    onChange={(e) => handleInputChange("duration", e.target.value)}
                    placeholder="90"
                    className="pl-10"
                    min="15"
                    max="300"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange("date", e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="time">Heure *</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => handleInputChange("time", e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="room">Salle *</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <select
                    id="room"
                    value={formData.roomId}
                    onChange={(e) => handleInputChange("roomId", e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 pl-10"
                    required
                  >
                    <option value="">Sélectionner une salle</option>
                    {rooms.map((room: Room) => (
                      <option key={room.id} value={room.id}>
                        {room.name} ({room.capacity} places)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxCapacity">Capacité maximale *</Label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="maxCapacity"
                    type="number"
                    value={formData.maxCapacity}
                    onChange={(e) => handleInputChange("maxCapacity", e.target.value)}
                    placeholder="50"
                    className="pl-10"
                    min="1"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Link href="/sponsor/mes-conferences">
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
                    <span>Mise à jour...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Save className="h-4 w-4" />
                    <span>Mettre à jour</span>
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