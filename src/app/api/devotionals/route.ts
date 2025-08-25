import { NextRequest, NextResponse } from "next/server";
import { getAllDevotionals, searchDevotionals, createDevotional } from "@/lib/supabase-devotionals";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const searchTerm = searchParams.get("searchTerm");
    const tagNames = searchParams.get("tagNames")?.split(",") || [];
    const author = searchParams.get("author");
    const featured = searchParams.get("featured");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");



    let result;

    if (searchTerm || tagNames.length > 0 || author || featured) {
      // Busca com filtros
      result = await searchDevotionals({
        searchTerm: searchTerm || undefined,
        tagNames: tagNames.length > 0 ? tagNames : undefined,
        author: author || undefined,
        featured: featured ? featured === "true" : undefined,
        limit,
        offset,
      });
    } else {
      // Busca todos os devocionais
      const devotionals = await getAllDevotionals();
      result = {
        devotionals,
        total: devotionals.length,
      };
    }

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Erro ao buscar devocionais:", error);
    return NextResponse.json(
      { success: false, error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      title,
      excerpt,
      content,
      bibleVerse,
      bibleReference,
      author,
      authorId,
      tagNames = [],
      featured = false,
      published = true,
    } = body;

    // Validação dos campos obrigatórios
    if (
      !title ||
      !excerpt ||
      !content ||
      !bibleVerse ||
      !bibleReference ||
      !author
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Todos os campos obrigatórios devem ser preenchidos",
        },
        { status: 400 }
      );
    }



    // Gerar slug baseado no título
    const slug = title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();

    const devotional = await createDevotional({
      slug,
      title,
      excerpt,
      content,
      bibleVerse,
      bibleReference,
      author,
      authorId,
      date: new Date(),
      tagNames,
      featured,
      published,
    });

    return NextResponse.json({
      success: true,
      data: devotional,
    });
  } catch (error) {
    console.error("Erro ao criar devocional:", error);
    return NextResponse.json(
      { success: false, error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
