import { getAdminStats, getConferences, getRooms, getSponsors } from "@/lib/actions"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AdminStats } from "@/components/admin-stats"
import { AdminConferenceList } from "@/components/admin-conference-list"
import Link from "next/link"
import { Trophy, Users, Calendar, Settings, Plus } from "lucide-react"

interface Sponsor {
  id: string
  name: string
  email: string | null
  level: string
}

export default async function AdminPage() {
  const [statsResult, conferencesResult, roomsResult, sponsorsResult] = await Promise.all([
    getAdminStats(),
    getConferences(),
    getRooms(),
    getSponsors()
  ])

  if (!statsResult.success) {
    return (
      <div className="text-center py-12">
        <div className="space-y-4">
          <div className="w-12 h-12 bg-destructive/10 rounded-xl flex items-center justify-center mx-auto">
            <Settings className="h-6 w-6 text-destructive" />
          </div>
          <p className="text-destructive font-medium">Accès non autorisé ou erreur lors du chargement des statistiques</p>
        </div>
      </div>
    )
  }

  if (!conferencesResult.success) {
    return (
      <div className="text-center py-12">
        <div className="space-y-4">
          <div className="w-12 h-12 bg-destructive/10 rounded-xl flex items-center justify-center mx-auto">
            <Calendar className="h-6 w-6 text-destructive" />
          </div>
          <p className="text-destructive font-medium">Erreur lors du chargement des conférences</p>
        </div>
      </div>
    )
  }

  if (!roomsResult.success) {
    return (
      <div className="text-center py-12">
        <div className="space-y-4">
          <div className="w-12 h-12 bg-destructive/10 rounded-xl flex items-center justify-center mx-auto">
            <Users className="h-6 w-6 text-destructive" />
          </div>
          <p className="text-destructive font-medium">Erreur lors du chargement des salles</p>
        </div>
      </div>
    )
  }

  if (!sponsorsResult.success) {
    return (
      <div className="text-center py-12">
        <div className="space-y-4">
          <div className="w-12 h-12 bg-destructive/10 rounded-xl flex items-center justify-center mx-auto">
            <Trophy className="h-6 w-6 text-destructive" />
          </div>
          <p className="text-destructive font-medium">Erreur lors du chargement des sponsors</p>
        </div>
      </div>
    )
  }

  const transformedStats = {
    totalConferences: statsResult.data?.totalConferences || 0,
    totalUsers: statsResult.data?.totalUsers || 0,
    totalRegistrations: statsResult.data?.totalRegistrations || 0,
    conferencesWithStats: statsResult.data?.conferencesWithStats || [],
    roomStats: statsResult.data?.roomStats?.map((room: { 
      id: string; 
      name: string; 
      capacity: number; 
      conferences?: Array<{ 
        _count?: { attendees: number } 
      }> 
    }) => {
      const conferences = room.conferences || []
      const totalRegistrations = conferences.reduce((sum: number, conf: { _count?: { attendees: number } }) => sum + (conf._count?.attendees || 0), 0)
      const occupancyRate = conferences.length > 0 
        ? (totalRegistrations / conferences.length) / room.capacity * 100
        : 0
      
      return {
        roomId: room.id,
        roomName: room.name,
        totalRegistrations,
        occupancyRate
      }
    }) || []
  }

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Settings className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Administration</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Gérez les conférences, les sponsors et consultez les statistiques
        </p>
      </div>

      <AdminStats stats={transformedStats || {
        totalConferences: 0,
        totalUsers: 0,
        totalRegistrations: 0,
        conferencesWithStats: [],
        roomStats: []
      }} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Conférences</h2>
            <div className="flex items-center space-x-2">
              <Link href="/admin/conferences">
                <Button variant="outline" size="sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  Gérer les conférences
                </Button>
              </Link>
              <Link href="/admin/conferences/new">
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvelle conférence
                </Button>
              </Link>
            </div>
          </div>
          <AdminConferenceList 
            conferences={conferencesResult.data || []} 
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Sponsors</h2>
            <div className="flex items-center space-x-2">
              <Link href="/admin/sponsors">
                <Button variant="outline" size="sm">
                  <Trophy className="h-4 w-4 mr-2" />
                  Gérer les sponsors
                </Button>
              </Link>
              <Link href="/admin/sponsors/new">
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Nouveau sponsor
                </Button>
              </Link>
            </div>
          </div>
          <div className="space-y-4">
            {(sponsorsResult.data || []).slice(0, 3).map((sponsor: Sponsor) => (
              <Card key={sponsor.id} className="border-0 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{sponsor.name}</h3>
                      <p className="text-sm text-muted-foreground">{sponsor.email}</p>
                    </div>
                    <Link href={`/admin/sponsors/${sponsor.id}/edit`}>
                      <Button variant="outline" size="sm">
                        Modifier
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
            {(sponsorsResult.data || []).length > 3 && (
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground mb-2">
                  Et {(sponsorsResult.data || []).length - 3} autre(s) sponsor(s)
                </p>
                <Link href="/admin/sponsors">
                  <Button variant="outline" size="sm">
                    Voir tous les sponsors
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 