import { getSponsorConferences } from "@/lib/actions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Trophy, Calendar, MapPin, Clock, Users, Building, Edit } from "lucide-react"
import Image from "next/image"

export default async function SponsorConferencesPage() {
  const result = await getSponsorConferences()

  if (!result.success) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{result.error}</p>
        <Link href="/conferences">
          <Button className="mt-4">
            Voir toutes les conférences
          </Button>
        </Link>
      </div>
    )
  }

  const sponsor = result.data
  if (!sponsor) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Erreur: données du sponsor non disponibles</p>
        <Link href="/conferences">
          <Button className="mt-4">
            Voir toutes les conférences
          </Button>
        </Link>
      </div>
    )
  }
  
  const conferences = sponsor.conferences || []

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
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    })
  }

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Trophy className="h-8 w-8 text-yellow-600" />
        <div>
          <h1 className="text-3xl font-bold">Mes Conférences Sponsorisées</h1>
          <p className="text-muted-foreground">
            Gérez les conférences que vous sponsorisez
          </p>
        </div>
      </div>

      {/* Informations du sponsor */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            {sponsor.logo && (
              <div className="flex items-center space-x-3 mb-4">
                <Image
                  src={sponsor.logo}
                  alt={`Logo ${sponsor.name}`}
                  width={48}
                  height={48}
                  className="rounded-lg object-contain"
                />
                <div>
                  <h3 className="font-semibold">{sponsor.name}</h3>
                  <p className="text-sm text-muted-foreground">{sponsor.level}</p>
                </div>
              </div>
            )}
            <div>
              <CardTitle className="flex items-center gap-2">
                {sponsor.name}
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getLevelColor(sponsor.level)}`}>
                  {getLevelIcon(sponsor.level)} {sponsor.level}
                </span>
              </CardTitle>
              <CardDescription>
                {sponsor.description || "Aucune description"}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Conférences</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{conferences.length}</div>
            <p className="text-xs text-muted-foreground">
              Conférences sponsorisées
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Inscriptions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {conferences.reduce((total, conf) => total + (conf._count?.attendees || 0), 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Participants inscrits
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Moyenne par Conférence</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {conferences.length > 0 
                ? Math.round(conferences.reduce((total, conf) => total + (conf._count?.attendees || 0), 0) / conferences.length)
                : 0
              }
            </div>
            <p className="text-xs text-muted-foreground">
              Participants moyens
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Liste des conférences */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Conférences Sponsorisées</h2>
        
        {conferences.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-xl font-semibold mb-2">Aucune conférence sponsorisée</h3>
              <p className="text-muted-foreground mb-4">
                Vous n&apos;avez pas encore créé de conférences sponsorisées
              </p>
              <Link href="/conferences">
                <Button>
                  Voir toutes les conférences
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {conferences.map((conference) => (
              <Card key={conference.id} className="h-full hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-yellow-500">
                <CardHeader>
                  <CardTitle className="line-clamp-2 text-lg">{conference.title}</CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    Par {conference.speaker}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(conference.date)}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{formatTime(conference.date)} - {conference.duration} min</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{conference.room.name}</span>
                  </div>
                  
                                     <div className="flex items-center justify-between pt-2">
                     <div className="flex items-center gap-2 text-sm">
                       <Users className="h-4 w-4" />
                       <span>{conference._count?.attendees || 0} / {conference.maxCapacity} inscrits</span>
                     </div>
                     
                     <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                       <div 
                         className="h-full bg-yellow-500 transition-all duration-300"
                         style={{ 
                           width: `${Math.min(100, ((conference._count?.attendees || 0) / conference.maxCapacity) * 100)}%` 
                         }}
                       />
                     </div>
                   </div>
                   
                   <div className="flex justify-end pt-2">
                     <Link href={`/sponsor/conferences/${conference.id}/edit`}>
                       <Button variant="outline" size="sm">
                         <Edit className="h-4 w-4 mr-1" />
                         Modifier
                       </Button>
                     </Link>
                   </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 