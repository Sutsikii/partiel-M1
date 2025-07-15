import { getConferences, getRooms, addToProgram } from "@/lib/actions"
import { ConferenceFilters } from "@/components/conference-filters"
import { ConferenceList } from "@/components/conference-list"
import { Calendar, Search } from "lucide-react"

export default async function ConferencesPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string; roomId?: string; speaker?: string }>
}) {
  const params = await searchParams
  
  const [conferencesResult, roomsResult] = await Promise.all([
    getConferences(params),
    getRooms()
  ])

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
            <Search className="h-6 w-6 text-destructive" />
          </div>
          <p className="text-destructive font-medium">Erreur lors du chargement des salles</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Calendar className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Conférences</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Découvrez toutes les conférences disponibles et ajoutez-les à votre programme personnalisé
        </p>
      </div>

      <ConferenceFilters rooms={roomsResult.data || []} />

      <ConferenceList 
        conferences={conferencesResult.data || []} 
        addToProgram={addToProgram}
      />
    </div>
  )
} 