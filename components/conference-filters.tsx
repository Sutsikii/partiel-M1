"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Room {
  id: string
  name: string
  capacity: number
}

interface ConferenceFiltersProps {
  rooms: Room[]
}

export function ConferenceFilters({ rooms }: ConferenceFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const updateFilters = (updates: Record<string, string | undefined>) => {
    const params = new URLSearchParams(searchParams)
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
    })

    router.push(`/conferences?${params.toString()}`)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filtres</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={searchParams.get("date") || ""}
              onChange={(e) => updateFilters({ date: e.target.value || undefined })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="room">Salle</Label>
            <select
              id="room"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              value={searchParams.get("roomId") || ""}
              onChange={(e) => updateFilters({ roomId: e.target.value || undefined })}
            >
              <option value="">Toutes les salles</option>
              {rooms.map((room: Room) => (
                <option key={room.id} value={room.id}>
                  {room.name} ({room.capacity} places)
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="speaker">Conférencier</Label>
            <Input
              id="speaker"
              type="text"
              placeholder="Nom du conférencier"
              value={searchParams.get("speaker") || ""}
              onChange={(e) => updateFilters({ speaker: e.target.value || undefined })}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            variant="outline"
            onClick={() => {
              router.push("/conferences")
            }}
          >
            Réinitialiser les filtres
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 