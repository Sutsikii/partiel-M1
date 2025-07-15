import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Début du seeding...')

  const admin = await prisma.user.upsert({
    where: { email: 'admin@demo.com' },
    update: {},
    create: {
      email: 'admin@demo.com',
      name: 'Administrateur',
      role: 'ADMIN',
    },
  })

  const visiteur = await prisma.user.upsert({
    where: { email: 'visiteur@demo.com' },
    update: {},
    create: {
      email: 'visiteur@demo.com',
      name: 'Visiteur Demo',
      role: 'VISITOR',
    },
  })

  const user2 = await prisma.user.upsert({
    where: { email: 'user2@example.com' },
    update: {},
    create: {
      email: 'user2@example.com',
      name: 'Marie Martin',
      role: 'VISITOR',
    },
  })

  const sponsorUser = await prisma.user.upsert({
    where: { email: 'sponsor@demo.com' },
    update: {},
    create: {
      email: 'sponsor@demo.com',
      name: 'Sponsor Demo',
      role: 'VISITOR',
    },
  })

  console.log('✅ Utilisateurs créés')

  const rooms = await Promise.all([
    prisma.room.upsert({
      where: { name: 'Salle A' },
      update: {},
      create: { name: 'Salle A', capacity: 100 },
    }),
    prisma.room.upsert({
      where: { name: 'Salle B' },
      update: {},
      create: { name: 'Salle B', capacity: 80 },
    }),
    prisma.room.upsert({
      where: { name: 'Salle C' },
      update: {},
      create: { name: 'Salle C', capacity: 60 },
    }),
    prisma.room.upsert({
      where: { name: 'Salle D' },
      update: {},
      create: { name: 'Salle D', capacity: 50 },
    }),
    prisma.room.upsert({
      where: { name: 'Salle E' },
      update: {},
      create: { name: 'Salle E', capacity: 40 },
    }),
  ])

  console.log('✅ Salles créées')

  const sponsors = await Promise.all([
    prisma.sponsor.create({
      data: {
        name: 'TechCorp',
        description: 'Leader dans le développement de solutions technologiques innovantes',
        logo: 'https://via.placeholder.com/150x150/3B82F6/FFFFFF?text=TechCorp',
        website: 'https://techcorp.com',
        email: 'contact@techcorp.com',
        phone: '+33 1 23 45 67 89',
        level: 'PLATINUM',
        userId: sponsorUser.id,
      },
    }),
    prisma.sponsor.create({
      data: {
        name: 'InnovSoft',
        description: 'Spécialiste en logiciels d\'entreprise et solutions cloud',
        logo: 'https://via.placeholder.com/150x150/10B981/FFFFFF?text=InnovSoft',
        website: 'https://innovsoft.com',
        email: 'info@innovsoft.com',
        phone: '+33 1 98 76 54 32',
        level: 'GOLD',
      },
    }),
    prisma.sponsor.create({
      data: {
        name: 'DataFlow',
        description: 'Expert en analyse de données et intelligence artificielle',
        logo: 'https://via.placeholder.com/150x150/F59E0B/FFFFFF?text=DataFlow',
        website: 'https://dataflow.com',
        email: 'hello@dataflow.com',
        phone: '+33 1 45 67 89 12',
        level: 'SILVER',
      },
    }),
    prisma.sponsor.create({
      data: {
        name: 'CloudNet',
        description: 'Services cloud et infrastructure IT',
        logo: 'https://via.placeholder.com/150x150/8B5CF6/FFFFFF?text=CloudNet',
        website: 'https://cloudnet.com',
        email: 'contact@cloudnet.com',
        phone: '+33 1 34 56 78 90',
        level: 'BRONZE',
      },
    }),
  ])

  console.log('✅ Sponsors créés')

  const conferences = await Promise.all([
    prisma.conference.create({
      data: {
        title: 'Introduction à Next.js 14',
        description: 'Découvrez les nouvelles fonctionnalités de Next.js 14 et comment les utiliser dans vos projets.',
        speaker: 'Sarah Johnson',
        date: new Date('2024-03-15T09:00:00Z'),
        duration: 90,
        roomId: rooms[0].id,
        maxCapacity: 80,
        sponsorId: sponsors[0].id,
      },
    }),
    prisma.conference.create({
      data: {
        title: 'Architecture Cloud Native',
        description: 'Les meilleures pratiques pour concevoir des applications cloud-native scalables.',
        speaker: 'Marc Dubois',
        date: new Date('2024-03-15T11:00:00Z'),
        duration: 120,
        roomId: rooms[1].id,
        maxCapacity: 60,
        sponsorId: sponsors[3].id,
      },
    }),
    prisma.conference.create({
      data: {
        title: 'Machine Learning en Production',
        description: 'Comment déployer et maintenir des modèles ML en production de manière fiable.',
        speaker: 'Dr. Elena Rodriguez',
        date: new Date('2024-03-15T14:00:00Z'),
        duration: 90,
        roomId: rooms[2].id,
        maxCapacity: 50,
        sponsorId: sponsors[2].id,
      },
    }),
    prisma.conference.create({
      data: {
        title: 'Sécurité des Applications Web',
        description: 'Les vulnérabilités courantes et comment les prévenir dans vos applications web.',
        speaker: 'Alex Chen',
        date: new Date('2024-03-16T09:00:00Z'),
        duration: 90,
        roomId: rooms[0].id,
        maxCapacity: 80,
        sponsorId: sponsors[1].id,
      },
    }),
    prisma.conference.create({
      data: {
        title: 'Microservices avec Docker',
        description: 'Conception et déploiement d\'architectures microservices avec Docker et Kubernetes.',
        speaker: 'Pierre Moreau',
        date: new Date('2024-03-16T11:00:00Z'),
        duration: 120,
        roomId: rooms[1].id,
        maxCapacity: 60,
      },
    }),
    prisma.conference.create({
      data: {
        title: 'React Performance Optimization',
        description: 'Techniques avancées pour optimiser les performances de vos applications React.',
        speaker: 'Emma Wilson',
        date: new Date('2024-03-16T14:00:00Z'),
        duration: 90,
        roomId: rooms[2].id,
        maxCapacity: 50,
        sponsorId: sponsors[0].id,
      },
    }),
    prisma.conference.create({
      data: {
        title: 'API Design Patterns',
        description: 'Les patterns de conception pour créer des APIs RESTful robustes et maintenables.',
        speaker: 'David Kim',
        date: new Date('2024-03-17T09:00:00Z'),
        duration: 90,
        roomId: rooms[0].id,
        maxCapacity: 80,
        sponsorId: sponsors[1].id,
      },
    }),
    prisma.conference.create({
      data: {
        title: 'Data Engineering avec Python',
        description: 'Construction de pipelines de données avec Python, Pandas et Apache Airflow.',
        speaker: 'Sophie Martin',
        date: new Date('2024-03-17T11:00:00Z'),
        duration: 120,
        roomId: rooms[1].id,
        maxCapacity: 60,
        sponsorId: sponsors[2].id,
      },
    }),
    prisma.conference.create({
      data: {
        title: 'DevOps Best Practices',
        description: 'Intégration continue, déploiement continu et automatisation des processus.',
        speaker: 'Thomas Anderson',
        date: new Date('2024-03-17T14:00:00Z'),
        duration: 90,
        roomId: rooms[2].id,
        maxCapacity: 50,
        sponsorId: sponsors[3].id,
      },
    }),
  ])

  console.log('✅ Conférences créées')

  await Promise.all([
    prisma.userConference.create({
      data: {
        userId: visiteur.id,
        conferenceId: conferences[0].id,
      },
    }),
    prisma.userConference.create({
      data: {
        userId: visiteur.id,
        conferenceId: conferences[2].id,
      },
    }),
    prisma.userConference.create({
      data: {
        userId: user2.id,
        conferenceId: conferences[1].id,
      },
    }),
    prisma.userConference.create({
      data: {
        userId: user2.id,
        conferenceId: conferences[3].id,
      },
    }),
  ])

  console.log('✅ Inscriptions utilisateur créées')

  console.log('🎉 Seeding terminé avec succès!')
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 