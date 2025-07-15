import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { getRooms, getSponsors } from '@/lib/actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface Room {
  id: string
  name: string
  capacity: number
}

interface Sponsor {
  id: string
  name: string
  level: string
}

export default async function NewConferencePage() {
  const session = await auth()
  
  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/auth/signin')
  }

  const [roomsResult, sponsorsResult] = await Promise.all([
    getRooms(),
    getSponsors()
  ])

  const rooms: Room[] = roomsResult.success && roomsResult.data ? roomsResult.data : []
  const sponsors: Sponsor[] = sponsorsResult.success && sponsorsResult.data ? sponsorsResult.data : []

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Nouvelle Conférence</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Créer une nouvelle conférence</CardTitle>
          </CardHeader>
          <CardContent>
            <form action="/api/conferences" method="POST" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="title">Titre</Label>
                  <Input
                    id="title"
                    name="title"
                    required
                    placeholder="Titre de la conférence"
                  />
                </div>
                
                <div>
                  <Label htmlFor="speaker">Conférencier</Label>
                  <Input
                    id="speaker"
                    name="speaker"
                    required
                    placeholder="Nom du conférencier"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  required
                  placeholder="Description de la conférence"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="time">Heure</Label>
                  <Input
                    id="time"
                    name="time"
                    type="time"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="duration">Durée (minutes)</Label>
                  <Input
                    id="duration"
                    name="duration"
                    type="number"
                    min="15"
                    max="180"
                    defaultValue="60"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="roomId">Salle</Label>
                  <select
                    id="roomId"
                    name="roomId"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Sélectionner une salle</option>
                    {rooms.map((room: Room) => (
                      <option key={room.id} value={room.id}>
                        {room.name} (Capacité: {room.capacity})
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <Label htmlFor="maxCapacity">Capacité maximale</Label>
                  <Input
                    id="maxCapacity"
                    name="maxCapacity"
                    type="number"
                    min="1"
                    required
                    placeholder="Nombre de places"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="sponsorId">Sponsor (optionnel)</Label>
                <select
                  id="sponsorId"
                  name="sponsorId"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Aucun sponsor</option>
                  {sponsors.map((sponsor: Sponsor) => (
                    <option key={sponsor.id} value={sponsor.id}>
                      {sponsor.name} ({sponsor.level})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-4">
                <Button type="submit" className="flex-1">
                  Créer la conférence
                </Button>
                <Button type="button" variant="outline" onClick={() => window.history.back()}>
                  Annuler
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 