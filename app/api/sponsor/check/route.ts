import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ isSponsor: false })
    }

    const sponsor = await prisma.sponsor.findFirst({
      where: { userId: session.user.id }
    })

    return NextResponse.json({ 
      isSponsor: !!sponsor,
      sponsorId: sponsor?.id || null
    })
  } catch (error) {
    console.error('Erreur lors de la vérification du statut sponsor:', error)
    return NextResponse.json({ isSponsor: false }, { status: 500 })
  }
} 