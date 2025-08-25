import { NextRequest, NextResponse } from "next/server";
import { getDevotionalBySlug } from "@/lib/supabase-devotionals";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const resolvedParams = await params;
    const devotional = await getDevotionalBySlug(resolvedParams.slug);

    if (!devotional) {
      return NextResponse.json(
        { success: false, error: "Devocional não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: devotional,
    });
  } catch (error) {
    console.error("Erro ao buscar devocional:", error);
    return NextResponse.json(
      { success: false, error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
