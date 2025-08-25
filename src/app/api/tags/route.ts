import { NextResponse } from "next/server";
import { getAllTags } from "@/lib/supabase-devotionals";

export async function GET() {
  try {
    const tags = await getAllTags();

    return NextResponse.json({
      success: true,
      data: tags,
    });
  } catch (error) {
    console.error("Erro ao buscar tags:", error);
    return NextResponse.json(
      { success: false, error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
