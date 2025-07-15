import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface AdminStats {
  totalConferences: number
  totalUsers: number
  totalRegistrations: number
  conferencesWithStats: Array<{
    id: string
    title: string
    speaker: string
    room: { name: string }
    _count: { attendees: number }
  }>
  roomStats: Array<{
    roomId: string
    roomName: string
    totalRegistrations: number
    occupancyRate: number
  }>
}

interface AdminStatsProps {
  stats: AdminStats
}

export function AdminStats({ stats }: AdminStatsProps) {
  const averageRegistrations = stats.totalConferences > 0 
    ? Math.round(stats.totalRegistrations / stats.totalConferences) 
    : 0

  return (
    <div className="space-y-8">
      {/* Statistiques générales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Conférences</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.totalConferences}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Utilisateurs Inscrits</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.totalUsers}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Inscriptions Total</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.totalRegistrations}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Moyenne par Conférence</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{averageRegistrations}</p>
          </CardContent>
        </Card>
      </div>

      {/* Top 5 des conférences les plus populaires */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Top des conférences</h3>
        <div className="space-y-2">
          {stats.conferencesWithStats.slice(0, 5).map((conference) => (
            <Card key={conference.id} className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium line-clamp-1">{conference.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {conference.speaker} • {conference.room.name}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary">
                      {conference._count.attendees}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Inscriptions
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Statistiques par salle */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Détails par salle</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stats.roomStats.map((room) => (
            <Card key={room.roomId} className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{room.roomName}</h4>
                    <p className="text-sm text-muted-foreground">
                      {room.totalRegistrations} inscriptions
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">
                      {Math.round(room.occupancyRate)}%
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Taux de remplissage
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      {/* Correction de l'apostrophe */}
      <div className="text-sm text-muted-foreground mt-4">
        Statistiques sur l&apos;ensemble des conférences
      </div>
    </div>
  )
} 