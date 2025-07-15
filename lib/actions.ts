"use server"

import { prisma } from "./prisma"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export interface Conference {
  id: string
  title: string
  description: string
  speaker: string
  date: Date
  duration: number
  roomId: string
  maxCapacity: number
  room: {
    name: string
    capacity: number
  }
  _count?: {
    attendees: number
  }
}

interface ConferenceFilters {
  date?: string
  roomId?: string
  speaker?: string
}

interface PrismaWhereClause {
  date?: {
    gte: Date
    lt: Date
  }
  roomId?: string
  speaker?: {
    contains: string
    mode: 'insensitive'
  }
}

export async function getConferences(filters?: ConferenceFilters) {
  try {
    const where: PrismaWhereClause = {}
    
    if (filters?.date) {
      const startDate = new Date(filters.date)
      const endDate = new Date(startDate)
      endDate.setDate(endDate.getDate() + 1)
      where.date = {
        gte: startDate,
        lt: endDate
      }
    }
    
    if (filters?.roomId) {
      where.roomId = filters.roomId
    }
    
    if (filters?.speaker) {
      where.speaker = {
        contains: filters.speaker,
        mode: 'insensitive'
      }
    }

    const conferences = await prisma.conference.findMany({
      where,
      include: {
        room: true,
        _count: {
          select: {
            attendees: true
          }
        }
      },
      orderBy: {
        date: 'asc'
      }
    })

    return { success: true, data: conferences }
  } catch (error) {
    console.error("Erreur lors de la récupération des conférences:", error)
    return { success: false, error: "Erreur lors de la récupération des conférences" }
  }
}

export async function getConference(id: string) {
  try {
    const conference = await prisma.conference.findUnique({
      where: { id },
      include: {
        room: true,
        _count: {
          select: {
            attendees: true
          }
        }
      }
    })

    if (!conference) {
      return { success: false, error: "Conférence non trouvée" }
    }

    return { success: true, data: conference }
  } catch (error) {
    console.error("Erreur lors de la récupération de la conférence:", error)
    return { success: false, error: "Erreur lors de la récupération de la conférence" }
  }
}

export async function createConference(data: {
  title: string
  description: string
  speaker: string
  date: string
  duration: number
  roomId: string
  maxCapacity: number
}) {
  try {
    const session = await auth()
    
    if (!session?.user || session.user.role !== "ADMIN") {
      return { success: false, error: "Accès non autorisé" }
    }

    const conference = await prisma.conference.create({
      data: {
        ...data,
        date: new Date(data.date)
      },
      include: {
        room: true
      }
    })

    revalidatePath("/admin")
    revalidatePath("/conferences")
    
    return { success: true, data: conference }
  } catch (error) {
    console.error("Erreur lors de la création de la conférence:", error)
    return { success: false, error: "Erreur lors de la création de la conférence" }
  }
}

export async function updateConference(id: string, data: {
  title?: string
  description?: string
  speaker?: string
  date?: string
  duration?: number
  roomId?: string
  maxCapacity?: number
}) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return { success: false, error: "Non connecté" }
    }

    if (session.user.role !== "ADMIN") {
      const sponsor = await prisma.sponsor.findFirst({
        where: { 
          userId: session.user.id,
          conferences: {
            some: { id }
          }
        }
      })
      
      if (!sponsor) {
        return { success: false, error: "Accès non autorisé" }
      }
    }

    const updateData: Record<string, unknown> = { ...data }
    if (data.date) {
      updateData.date = new Date(data.date)
    }

    const conference = await prisma.conference.update({
      where: { id },
      data: updateData,
      include: {
        room: true
      }
    })

    revalidatePath("/admin")
    revalidatePath("/conferences")
    
    return { success: true, data: conference }
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la conférence:", error)
    return { success: false, error: "Erreur lors de la mise à jour de la conférence" }
  }
}


export async function deleteConference(id: string) {
  try {
    const session = await auth()
    
    if (!session?.user || session.user.role !== "ADMIN") {
      return { success: false, error: "Accès non autorisé" }
    }

    await prisma.conference.delete({
      where: { id }
    })

    revalidatePath("/admin")
    revalidatePath("/conferences")
    
    return { success: true }
  } catch (error) {
    console.error("Erreur lors de la suppression de la conférence:", error)
    return { success: false, error: "Erreur lors de la suppression de la conférence" }
  }
}

export async function getRooms() {
  try {
    const rooms = await prisma.room.findMany({
      orderBy: {
        name: 'asc'
      }
    })

    return { success: true, data: rooms }
  } catch (error) {
    console.error("Erreur lors de la récupération des salles:", error)
    return { success: false, error: "Erreur lors de la récupération des salles" }
  }
}

export async function getUserProgram() {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return { success: false, error: "Non connecté" }
    }

    const userConferences = await prisma.userConference.findMany({
      where: {
        userId: session.user.id
      },
      include: {
        conference: {
          include: {
            room: true
          }
        }
      },
      orderBy: {
        conference: {
          date: 'asc'
        }
      }
    })

    return { success: true, data: userConferences }
  } catch (error) {
    console.error("Erreur lors de la récupération du programme:", error)
    return { success: false, error: "Erreur lors de la récupération du programme" }
  }
}

export async function addToProgram(conferenceId: string) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return { success: false, error: "Non connecté" }
    }

    const existing = await prisma.userConference.findUnique({
      where: {
        userId_conferenceId: {
          userId: session.user.id,
          conferenceId
        }
      }
    })

    if (existing) {
      return { success: false, error: "Conférence déjà dans votre programme" }
    }

    await prisma.userConference.create({
      data: {
        userId: session.user.id,
        conferenceId
      }
    })

    revalidatePath("/programme")
    revalidatePath("/conferences")
    
    return { success: true }
  } catch (error) {
    console.error("Erreur lors de l'ajout au programme:", error)
    return { success: false, error: "Erreur lors de l'ajout au programme" }
  }
}

export async function removeFromProgram(conferenceId: string) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return { success: false, error: "Non connecté" }
    }

    await prisma.userConference.delete({
      where: {
        userId_conferenceId: {
          userId: session.user.id,
          conferenceId
        }
      }
    })

    revalidatePath("/programme")
    revalidatePath("/conferences")
    
    return { success: true }
  } catch (error) {
    console.error("Erreur lors de la suppression du programme:", error)
    return { success: false, error: "Erreur lors de la suppression du programme" }
  }
}

export async function getAdminStats() {
  try {
    const session = await auth()
    
    if (!session || session.user.role !== "ADMIN") {
      return { success: false, error: "Accès non autorisé" }
    }

    const [totalConferences, totalUsers, totalRegistrations] = await Promise.all([
      prisma.conference.count(),
      prisma.user.count(),
      prisma.userConference.count()
    ])

    const conferencesWithStats = await prisma.conference.findMany({
      include: {
        room: true,
        _count: {
          select: {
            attendees: true
          }
        }
      }
    })

    const roomStats = await prisma.room.findMany({
      include: {
        conferences: {
          include: {
            _count: {
              select: {
                attendees: true
              }
            }
          }
        }
      }
    })

    return {
      success: true,
      data: {
        totalConferences,
        totalUsers,
        totalRegistrations,
        conferencesWithStats,
        roomStats
      }
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques:", error)
    return { success: false, error: "Erreur lors de la récupération des statistiques" }
  }
} 

export async function getSponsors() {
  try {
    const sponsors = await prisma.sponsor.findMany({
      orderBy: {
        level: 'asc'
      }
    })

    return { success: true, data: sponsors }
  } catch (error) {
    console.error("Erreur lors de la récupération des sponsors:", error)
    return { success: false, error: "Erreur lors de la récupération des sponsors" }
  }
}

export async function getSponsor(id: string) {
  try {
    const sponsor = await prisma.sponsor.findUnique({
      where: { id },
      include: {
        conferences: {
          include: {
            room: true
          }
        }
      }
    })

    if (!sponsor) {
      return { success: false, error: "Sponsor non trouvé" }
    }

    return { success: true, data: sponsor }
  } catch (error) {
    console.error("Erreur lors de la récupération du sponsor:", error)
    return { success: false, error: "Erreur lors de la récupération du sponsor" }
  }
}

export async function createSponsor(data: {
  name: string
  description?: string
  logo?: string
  website?: string
  email?: string
  phone?: string
  level: 'PLATINUM' | 'GOLD' | 'SILVER' | 'BRONZE'
}) {
  try {
    const session = await auth()
    
    if (!session || session.user.role !== "ADMIN") {
      return { success: false, error: "Accès non autorisé" }
    }

    const sponsor = await prisma.sponsor.create({
      data
    })

    revalidatePath("/admin/sponsors")
    
    return { success: true, data: sponsor }
  } catch (error) {
    console.error("Erreur lors de la création du sponsor:", error)
    return { success: false, error: "Erreur lors de la création du sponsor" }
  }
}

export async function updateSponsor(id: string, data: {
  name?: string
  description?: string
  logo?: string
  website?: string
  email?: string
  phone?: string
  level?: 'PLATINUM' | 'GOLD' | 'SILVER' | 'BRONZE'
}) {
  try {
    const session = await auth()
    
    if (!session || session.user.role !== "ADMIN") {
      return { success: false, error: "Accès non autorisé" }
    }

    const sponsor = await prisma.sponsor.update({
      where: { id },
      data
    })

    revalidatePath("/admin/sponsors")
    
    return { success: true, data: sponsor }
  } catch (error) {
    console.error("Erreur lors de la mise à jour du sponsor:", error)
    return { success: false, error: "Erreur lors de la mise à jour du sponsor" }
  }
}

export async function deleteSponsor(id: string) {
  try {
    const session = await auth()
    
    if (!session || session.user.role !== "ADMIN") {
      return { success: false, error: "Accès non autorisé" }
    }

    await prisma.sponsor.delete({
      where: { id }
    })

    revalidatePath("/admin/sponsors")
    
    return { success: true }
  } catch (error) {
    console.error("Erreur lors de la suppression du sponsor:", error)
    return { success: false, error: "Erreur lors de la suppression du sponsor" }
  }
}

export async function getSponsorConferences() {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return { success: false, error: "Non connecté" }
    }

    const sponsor = await prisma.sponsor.findFirst({
      where: { userId: session.user.id },
      include: {
        conferences: {
          include: {
            room: true,
            _count: {
              select: {
                attendees: true
              }
            }
          },
          orderBy: {
            date: 'asc'
          }
        }
      }
    })

    if (!sponsor) {
      return { success: false, error: "Aucun sponsor trouvé pour cet utilisateur" }
    }

    return { success: true, data: sponsor }
  } catch (error) {
    console.error("Erreur lors de la récupération des conférences du sponsor:", error)
    return { success: false, error: "Erreur lors de la récupération des conférences" }
  }
} 