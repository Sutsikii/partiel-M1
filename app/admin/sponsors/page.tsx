import { getSponsors } from "@/lib/actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AdminSponsorList } from "@/components/admin-sponsor-list"
import Link from "next/link"
import { Trophy, Plus } from "lucide-react"

interface Sponsor {
  id: string
  name: string
  description: string | null
  logo: string | null
  website: string | null
  email: string | null
  phone: string | null
  level: 'PLATINUM' | 'GOLD' | 'SILVER' | 'BRONZE'
  createdAt: Date
  updatedAt: Date
  userId: string | null
}

export default async function SponsorsPage() {
  const sponsorsResult = await getSponsors()

  if (!sponsorsResult.success) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Erreur lors du chargement des sponsors</p>
      </div>
    )
  }

  const sponsors = sponsorsResult.data || []

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Trophy className="h-8 w-8 text-yellow-600" />
        <div>
          <h1 className="text-3xl font-bold">Gestion des Sponsors</h1>
          <p className="text-muted-foreground">
            Gérez les sponsors du salon professionnel
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sponsors</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sponsors.length}</div>
            <p className="text-xs text-muted-foreground">
              Sponsors actifs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Platinum</CardTitle>
            <span className="text-2xl">🥇</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {sponsors.filter((s: Sponsor) => s.level === 'PLATINUM').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Sponsors premium
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gold</CardTitle>
            <span className="text-2xl">🥇</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {sponsors.filter((s: Sponsor) => s.level === 'GOLD').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Sponsors or
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Silver & Bronze</CardTitle>
            <span className="text-2xl">🥈🥉</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {sponsors.filter((s: Sponsor) => s.level === 'SILVER' || s.level === 'BRONZE').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Sponsors standard
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Liste des Sponsors</h2>
          <Link href="/admin/sponsors/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nouveau Sponsor
            </Button>
          </Link>
        </div>

        <AdminSponsorList sponsors={sponsors} />
      </div>
    </div>
  )
} 