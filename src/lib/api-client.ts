import type { DevotionalWithTags } from "./types";

// Tipos para as respostas da API
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

interface DevotionalsResponse {
  devotionals: DevotionalWithTags[];
  total: number;
}

// Função genérica para fazer requisições
async function apiRequest<T>(url: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
      ...options,
    });

    // Verificar se a resposta é JSON válido
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      console.error("Resposta não é JSON válido:", text.substring(0, 200));
      throw new Error(`Resposta inválida do servidor: ${response.status} ${response.statusText}`);
    }

    const data: ApiResponse<T> = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error || "Erro na requisição");
    }

    return data.data!;
  } catch (error) {
    console.error(`Erro na requisição para ${url}:`, error);
    throw error;
  }
}

// Funções para devocionais
export async function fetchDevotionals(params?: {
  searchTerm?: string;
  tagNames?: string[];
  author?: string;
  featured?: boolean;
  limit?: number;
  offset?: number;
}): Promise<DevotionalsResponse> {
  const searchParams = new URLSearchParams();

  if (params?.searchTerm) searchParams.set("searchTerm", params.searchTerm);
  if (params?.tagNames?.length)
    searchParams.set("tagNames", params.tagNames.join(","));
  if (params?.author) searchParams.set("author", params.author);
  if (params?.featured !== undefined)
    searchParams.set("featured", params.featured.toString());
  if (params?.limit) searchParams.set("limit", params.limit.toString());
  if (params?.offset) searchParams.set("offset", params.offset.toString());

  const url = `/api/devotionals${
    searchParams.toString() ? `?${searchParams.toString()}` : ""
  }`;

  return apiRequest<DevotionalsResponse>(url);
}

export async function fetchDevotionalBySlug(
  slug: string
): Promise<DevotionalWithTags> {
  return apiRequest<DevotionalWithTags>(`/api/devotionals/${slug}`);
}

// Funções para tags
export async function fetchTags(): Promise<
  { id: string; name: string; color: string | null }[]
> {
  return apiRequest<{ id: string; name: string; color: string | null }[]>(
    "/api/tags"
  );
}

// Funções para autenticação
export async function loginUser(
  email: string,
  password: string
// eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> {
  return apiRequest<unknown>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export interface UserWithoutPassword {
  id: string;
  email: string;
  name?: string;
  // add other user fields as needed, excluding password
}

export async function fetchUserById(
  userId: string
): Promise<UserWithoutPassword> {
  return apiRequest<UserWithoutPassword>(`/api/users/${userId}`);
}
