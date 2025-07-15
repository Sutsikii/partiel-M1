import { NextRequest, NextResponse } from "next/server"
import { deleteConference } from "@/lib/actions"

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const result = await deleteConference(id)
    
    if (result.success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error("Erreur lors de la suppression de la conférence:", error)
    return NextResponse.json(
      { success: false, error: "Erreur interne du serveur" },
      { status: 500 }
    )
  }
} 