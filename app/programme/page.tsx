import { getUserProgram, removeFromProgram } from "@/lib/actions"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ProgramList } from "@/components/program-list"
import Link from "next/link"
import { Calendar, Plus } from "lucide-react"

export default async function ProgramPage() {
  const result = await getUserProgram()

  if (!result.success) {
    return (
      <div className="text-center py-12">
        <div className="space-y-4">
          <div className="w-12 h-12 bg-destructive/10 rounded-xl flex items-center justify-center mx-auto">
            <Calendar className="h-6 w-6 text-destructive" />
          </div>
          <p className="text-destructive font-medium">{result.error}</p>
        </div>
      </div>
    )
  }

  const userConferences = result.data || []

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Calendar className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Mon Programme</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Vos conférences sélectionnées pour le salon
        </p>
      </div>

      {userConferences.length === 0 ? (
        <Card className="border-0 shadow-sm bg-muted/50">
          <CardContent className="text-center py-12">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center mx-auto">
                <Plus className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <p className="text-muted-foreground font-medium">
                  Vous n&apos;avez pas encore ajouté de conférences à votre programme
                </p>
                <p className="text-sm text-muted-foreground">
                  Commencez par explorer les conférences disponibles
                </p>
              </div>
              <Link href="/conferences">
                <Button className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Découvrir les conférences
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <ProgramList 
          userConferences={userConferences} 
          removeFromProgram={removeFromProgram}
        />
      )}
    </div>
  )
} 