import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Calendar, Users, MapPin, TrendingUp, Shield } from "lucide-react"

export default function HomePage() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-8">
        <div className="space-y-4">
          <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80">
            Salon Professionnel 2024
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Planifiez votre
            <span className="text-primary"> parcours</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Découvrez 300 conférences réparties sur 3 jours dans 10 salles. 
            Créez votre programme personnalisé et optimisez votre expérience.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/conferences">
            <Button size="lg" className="text-base px-8 py-3">
              Découvrir les conférences
            </Button>
          </Link>
          <Link href="/auth/signin">
            <Button variant="outline" size="lg" className="text-base px-8 py-3">
              Se connecter
            </Button>
          </Link>
        </div>
      </section>

      {/* Statistiques */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="border-0 shadow-sm bg-muted/50">
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">3 Jours</CardTitle>
            </div>
            <CardDescription>Du 15 au 17 décembre 2024</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">300+</p>
            <p className="text-sm text-muted-foreground">Conférences</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-muted/50">
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">10 Salles</CardTitle>
            </div>
            <CardDescription>Capacité de 50 à 200 personnes</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">10</p>
            <p className="text-sm text-muted-foreground">Salles équipées</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-muted/50">
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Programme Personnalisé</CardTitle>
            </div>
            <CardDescription>Créez votre planning sur mesure</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">∞</p>
            <p className="text-sm text-muted-foreground">Possibilités</p>
          </CardContent>
        </Card>
      </section>

      {/* Fonctionnalités */}
      <section className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold">Fonctionnalités</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Une plateforme complète pour gérer et optimiser votre expérience lors du salon
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-primary" />
                <CardTitle>Planification Intelligente</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Consultez toutes les conférences disponibles et ajoutez-les à votre programme personnalisé. 
                Filtrez par date, salle ou conférencier pour trouver facilement ce qui vous intéresse.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-primary" />
                <CardTitle>Gestion des Rôles</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Interface adaptée selon votre rôle : visiteur pour planifier votre parcours, 
                administrateur pour gérer les conférences et consulter les statistiques.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <CardTitle>Statistiques en Temps Réel</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Suivez le taux de remplissage des salles et les tendances d&apos;inscription 
                pour optimiser l&apos;organisation de l&apos;événement.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-primary" />
                <CardTitle>Sécurité et RGPD</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Authentification sécurisée, gestion des données personnelles conforme au RGPD, 
                et protection des informations sensibles.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
