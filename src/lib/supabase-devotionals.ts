import { supabase } from "./supabase";
import type { DevotionalWithTags } from "./types";

// Buscar todos os devocionais publicados
export async function getAllDevotionals(): Promise<DevotionalWithTags[]> {
  const { data, error } = await supabase
    .from("devotionals")
    .select(
      `
      *,
      devotional_tags (
        tags (
          id,
          name,
          color
        )
      )
    `
    )
    .eq("published", true)
    .order("date", { ascending: false });

  if (error) {
    console.error("Erro ao buscar devocionais:", error);
    throw error;
  }

  // Transformar dados para o formato esperado
  return (
    data?.map((devotional) => ({
      id: devotional.id,
      slug: devotional.slug,
      title: devotional.title,
      excerpt: devotional.excerpt,
      content: devotional.content,
      bible_verse: devotional.bible_verse,
      bible_reference: devotional.bible_reference,
      author: devotional.author,
      author_id: devotional.author_id,
      date: devotional.date,
      featured: devotional.featured,
      published: devotional.published,
      created_at: devotional.created_at,
      updated_at: devotional.updated_at,
      tags:
        devotional.devotional_tags?.map((dt: any) => ({
          id: dt.tags.id,
          name: dt.tags.name,
          color: dt.tags.color,
          created_at: dt.tags.created_at,
        })) || [],
    })) || []
  );
}

// Buscar devocionais do usuário atual (para admins verem apenas seus próprios)
export async function getDevotionalsByAuthor(
  authorId: string
): Promise<DevotionalWithTags[]> {
  try {
    // Primeiro, tentar buscar com author_id (se a coluna existir)
    const { data, error } = await supabase
      .from("devotionals")
      .select(
        `
        *,
        devotional_tags (
          tags (
            id,
            name,
            color
          )
        )
      `
      )
      .eq("author_id", authorId)
      .order("date", { ascending: false });

    if (error) {
      // Se houver erro (provavelmente coluna não existe), buscar todos por enquanto
      console.warn(
        "Coluna author_id não encontrada, buscando todos os devocionais"
      );
      return await getAllDevotionals();
    }

    // Transformar dados para o formato esperado
    return (
      data?.map((devotional) => ({
        id: devotional.id,
        slug: devotional.slug,
        title: devotional.title,
        excerpt: devotional.excerpt,
        content: devotional.content,
        bible_verse: devotional.bible_verse,
        bible_reference: devotional.bible_reference,
        author: devotional.author,
        author_id: devotional.author_id,
        date: devotional.date,
        featured: devotional.featured,
        published: devotional.published,
        created_at: devotional.created_at,
        updated_at: devotional.updated_at,
        tags:
          devotional.devotional_tags?.map((dt: any) => ({
            id: dt.tags.id,
            name: dt.tags.name,
            color: dt.tags.color,
            created_at: dt.tags.created_at,
          })) || [],
      })) || []
    );
  } catch (error) {
    console.warn("Erro ao buscar por author_id, usando fallback:", error);
    // Fallback: buscar todos os devocionais se houver erro
    return await getAllDevotionals();
  }
}

// Buscar devocional por slug
export async function getDevotionalBySlug(
  slug: string
): Promise<DevotionalWithTags | null> {
  const { data, error } = await supabase
    .from("devotionals")
    .select(
      `
      *,
      devotional_tags (
        tags (
          id,
          name,
          color
        )
      )
    `
    )
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (error) {
    console.error("Erro ao buscar devocional:", error);
    return null;
  }

  if (!data) return null;

  // Transformar dados para o formato esperado
  return {
    id: data.id,
    slug: data.slug,
    title: data.title,
    excerpt: data.excerpt,
    content: data.content,
    bible_verse: data.bible_verse,
    bible_reference: data.bible_reference,
    author: data.author,
    date: data.date,
    featured: data.featured,
    published: data.published,
    created_at: data.created_at,
    updated_at: data.updated_at,
    tags:
      data.devotional_tags?.map((dt: any) => ({
        id: dt.tags.id,
        name: dt.tags.name,
        color: dt.tags.color,
        created_at: dt.tags.created_at,
      })) || [],
  };
}

// Buscar devocionais com filtros
export async function searchDevotionals(params: {
  searchTerm?: string;
  tagNames?: string[];
  author?: string;
  featured?: boolean;
  limit?: number;
  offset?: number;
}): Promise<{ devotionals: DevotionalWithTags[]; total: number }> {
  const {
    searchTerm,
    tagNames,
    author,
    featured,
    limit = 20,
    offset = 0,
  } = params;

  let query = supabase
    .from("devotionals")
    .select(
      `
      *,
      devotional_tags (
        tags (
          id,
          name,
          color
        )
      )
    `,
      { count: "exact" }
    )
    .eq("published", true);

  // Aplicar filtros
  if (searchTerm) {
    query = query.or(
      `title.ilike.%${searchTerm}%,excerpt.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%,author.ilike.%${searchTerm}%`
    );
  }

  if (author) {
    query = query.ilike("author", `%${author}%`);
  }

  if (featured !== undefined) {
    query = query.eq("featured", featured);
  }

  // Ordenar
  query = query
    .order("featured", { ascending: false })
    .order("date", { ascending: false });

  // Paginação
  query = query.range(offset, offset + limit - 1);

  const { data, error, count } = await query;

  if (error) {
    console.error("Erro ao buscar devocionais:", error);
    throw error;
  }

  // Filtrar por tags se especificado
  let filteredData = data || [];
  if (tagNames && tagNames.length > 0) {
    filteredData = filteredData.filter((devotional) =>
      devotional.devotional_tags?.some((dt: any) =>
        tagNames.includes(dt.tags.name)
      )
    );
  }

  // Transformar dados para o formato esperado
  const devotionals: DevotionalWithTags[] = filteredData.map((devotional) => ({
    id: devotional.id,
    slug: devotional.slug,
    title: devotional.title,
    excerpt: devotional.excerpt,
    content: devotional.content,
    bible_verse: devotional.bible_verse,
    bible_reference: devotional.bible_reference,
    author: devotional.author,
    date: devotional.date,
    featured: devotional.featured,
    published: devotional.published,
    created_at: devotional.created_at,
    updated_at: devotional.updated_at,
    tags:
      devotional.devotional_tags?.map((dt: any) => ({
        id: dt.tags.id,
        name: dt.tags.name,
        color: dt.tags.color,
        created_at: dt.tags.created_at,
      })) || [],
  }));

  return {
    devotionals,
    total: count || 0,
  };
}

// Buscar todas as tags
export async function getAllTags() {
  const { data, error } = await supabase
    .from("tags")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    console.error("Erro ao buscar tags:", error);
    throw error;
  }

  return data || [];
}

// Criar novo devocional
export async function createDevotional(data: {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  bibleVerse: string;
  bibleReference: string;
  author: string;
  authorId?: string;
  date: Date;
  featured?: boolean;
  published?: boolean;
  tagNames: string[];
}): Promise<DevotionalWithTags> {
  const { tagNames, ...devotionalData } = data;

  // Preparar dados do devocional
  const devotionalInsert: any = {
    slug: devotionalData.slug,
    title: devotionalData.title,
    excerpt: devotionalData.excerpt,
    content: devotionalData.content,
    bible_verse: devotionalData.bibleVerse,
    bible_reference: devotionalData.bibleReference,
    author: devotionalData.author,
    date: devotionalData.date.toISOString(),
    featured: devotionalData.featured || false,
    published: devotionalData.published !== false,
  };

  // Adicionar author_id apenas se fornecido (para compatibilidade com tabelas sem essa coluna)
  if (devotionalData.authorId) {
    devotionalInsert.author_id = devotionalData.authorId;
  }

  // Inserir devocional
  const { data: devotional, error: devotionalError } = await supabase
    .from("devotionals")
    .insert(devotionalInsert)
    .select()
    .single();

  if (devotionalError) {
    console.error("Erro ao criar devocional:", devotionalError);
    throw devotionalError;
  }

  // Buscar ou criar tags
  const tagPromises = tagNames.map(async (tagName) => {
    // Verificar se a tag já existe
    let { data: existingTag } = await supabase
      .from("tags")
      .select("*")
      .eq("name", tagName)
      .single();

    if (!existingTag) {
      // Criar nova tag
      const { data: newTag, error: tagError } = await supabase
        .from("tags")
        .insert({ name: tagName })
        .select()
        .single();

      if (tagError) {
        console.error("Erro ao criar tag:", tagError);
        throw tagError;
      }

      existingTag = newTag;
    }

    return existingTag;
  });

  const tags = await Promise.all(tagPromises);

  // Criar relacionamentos devotional_tags
  const devotionalTagPromises = tags.map((tag) =>
    supabase.from("devotional_tags").insert({
      devotional_id: devotional.id,
      tag_id: tag.id,
    })
  );

  await Promise.all(devotionalTagPromises);

  // Retornar devocional com tags
  const result = (await getDevotionalBySlug(devotional.slug)) || {
    ...devotional,
    bibleVerse: devotional.bible_verse,
    bibleReference: devotional.bible_reference,
    date: new Date(devotional.date),
    createdAt: new Date(devotional.created_at),
    updatedAt: new Date(devotional.updated_at),
    tags: tags.map((tag) => ({
      tag: {
        id: tag.id,
        name: tag.name,
        color: tag.color,
      },
    })),
  };

  return result;
}

// Atualizar devocional existente
export async function updateDevotional(
  id: string,
  data: {
    title: string;
    excerpt: string;
    content: string;
    bibleVerse: string;
    bibleReference: string;
    author: string;
    authorId?: string;
    date: string;
    featured: boolean;
    published: boolean;
    tags: string[];
  }
): Promise<DevotionalWithTags> {
  const { tags: tagNames, ...devotionalData } = data;

  // Atualizar devocional
  const { data: devotional, error: devotionalError } = await supabase
    .from("devotionals")
    .update({
      title: devotionalData.title,
      excerpt: devotionalData.excerpt,
      content: devotionalData.content,
      bible_verse: devotionalData.bibleVerse,
      bible_reference: devotionalData.bibleReference,
      author: devotionalData.author,
      date: devotionalData.date,
      featured: devotionalData.featured,
      published: devotionalData.published,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (devotionalError) {
    console.error("Erro ao atualizar devocional:", devotionalError);
    throw devotionalError;
  }

  // Remover relacionamentos de tags existentes
  await supabase.from("devotional_tags").delete().eq("devotional_id", id);

  // Buscar ou criar tags
  const tagPromises = tagNames.map(async (tagName) => {
    // Verificar se a tag já existe
    let { data: existingTag } = await supabase
      .from("tags")
      .select("*")
      .eq("name", tagName)
      .single();

    if (!existingTag) {
      // Criar nova tag
      const { data: newTag, error: tagError } = await supabase
        .from("tags")
        .insert({ name: tagName })
        .select()
        .single();

      if (tagError) {
        console.error("Erro ao criar tag:", tagError);
        throw tagError;
      }

      existingTag = newTag;
    }

    return existingTag;
  });

  const tags = await Promise.all(tagPromises);

  // Criar novos relacionamentos devotional_tags
  const devotionalTagPromises = tags.map((tag) =>
    supabase.from("devotional_tags").insert({
      devotional_id: id,
      tag_id: tag.id,
    })
  );

  await Promise.all(devotionalTagPromises);

  // Retornar devocional atualizado com tags
  const result = (await getDevotionalBySlug(devotional.slug)) || {
    ...devotional,
    bibleVerse: devotional.bible_verse,
    bibleReference: devotional.bible_reference,
    date: new Date(devotional.date),
    createdAt: new Date(devotional.created_at),
    updatedAt: new Date(devotional.updated_at),
    tags: tags.map((tag) => ({
      tag: {
        id: tag.id,
        name: tag.name,
        color: tag.color,
      },
    })),
  };

  return result;
}

// Deletar devocional
export async function deleteDevotional(id: string): Promise<void> {
  // Deletar relacionamentos de tags primeiro
  await supabase.from("devotional_tags").delete().eq("devotional_id", id);

  // Deletar devocional
  const { error } = await supabase.from("devotionals").delete().eq("id", id);

  if (error) {
    console.error("Erro ao deletar devocional:", error);
    throw error;
  }
}
