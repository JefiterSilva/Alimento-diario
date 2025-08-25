import { supabase } from "./supabase";
import bcrypt from "bcryptjs";
import type { UserWithoutPassword } from "./types";

// Verificar credenciais de login
export async function verifyCredentials(data: {
  email: string;
  password: string;
}): Promise<UserWithoutPassword | null> {
  const { email, password } = data;

  // Buscar usuário por email
  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (error || !user) {
    return null;
  }

  // Verificar senha
  const isValidPassword = await bcrypt.compare(password, user.password_hash);

  if (!isValidPassword) {
    return null;
  }

  // Retornar usuário sem senha
  const { password_hash, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

// Buscar usuário por ID
export async function getUserById(
  id: string
): Promise<UserWithoutPassword | null> {
  const { data: user, error } = await supabase
    .from("users")
    .select("id, name, email, role, created_at, updated_at")
    .eq("id", id)
    .single();

  if (error || !user) {
    return null;
  }

  return user;
}

// Buscar usuário por email
export async function getUserByEmail(
  email: string
): Promise<UserWithoutPassword | null> {
  const { data: user, error } = await supabase
    .from("users")
    .select("id, name, email, role, created_at, updated_at")
    .eq("email", email)
    .single();

  if (error || !user) {
    return null;
  }

  return user;
}

// Criar novo usuário
export async function createUser(data: {
  name: string;
  email: string;
  password: string;
  role?: "USER" | "ADMIN";
}): Promise<UserWithoutPassword> {
  const { password, ...userData } = data;

  // Hash da senha
  const passwordHash = await bcrypt.hash(password, 12);

  const { data: user, error } = await supabase
    .from("users")
    .insert({
      ...userData,
      password_hash: passwordHash,
      role: userData.role || "USER",
    })
    .select("id, name, email, role, created_at, updated_at")
    .single();

  if (error) {
    console.error("Erro ao criar usuário:", error);
    throw error;
  }

  return user;
}

// Atualizar usuário
export async function updateUser(
  id: string,
  data: {
    name?: string;
    email?: string;
    password?: string;
    role?: "USER" | "ADMIN";
  }
): Promise<UserWithoutPassword> {
  const updateData: any = { ...data };

  // Se há senha para atualizar, fazer hash
  if (data.password) {
    updateData.password_hash = await bcrypt.hash(data.password, 12);
    delete updateData.password;
  }

  const { data: user, error } = await supabase
    .from("users")
    .update(updateData)
    .eq("id", id)
    .select("id, name, email, role, created_at, updated_at")
    .single();

  if (error) {
    console.error("Erro ao atualizar usuário:", error);
    throw error;
  }

  return user;
}

// Deletar usuário
export async function deleteUser(
  id: string
): Promise<{ success: boolean; error?: string; devotionalsCount?: number }> {
  console.log("🗑️ Tentando deletar usuário com ID:", id);

  try {
    // Verificar se o usuário tem devocionais (apenas para informação)
    const { data: devotionals, error: devotionalsError } = await supabase
      .from("devotionals")
      .select("id, title")
      .eq("author_id", id);

    if (devotionalsError) {
      console.error("❌ Erro ao verificar devocionais:", devotionalsError);
      throw new Error(
        `Erro ao verificar devocionais: ${devotionalsError.message}`
      );
    }

    const devotionalsCount = devotionals?.length || 0;

    if (devotionalsCount > 0) {
      console.log(
        `⚠️ Usuário tem ${devotionalsCount} devocionais que serão deletados automaticamente`
      );
    }

    // Deletar o usuário (os devocionais serão deletados automaticamente pelo CASCADE)
    const { error: deleteError } = await supabase
      .from("users")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("❌ Erro ao deletar usuário:", deleteError);
      throw new Error(`Erro ao deletar usuário: ${deleteError.message}`);
    }

    console.log(
      `✅ Usuário deletado com sucesso. ${devotionalsCount} devocionais também foram deletados.`
    );
    return { success: true, devotionalsCount };
  } catch (error) {
    console.error("❌ Erro geral na função deleteUser:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }
}

// Buscar todos os usuários (apenas para admin)
export async function getAllUsers(): Promise<UserWithoutPassword[]> {
  const { data: users, error } = await supabase
    .from("users")
    .select("id, name, email, role, created_at, updated_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erro ao buscar usuários:", error);
    throw error;
  }

  return users || [];
}

// Função para verificar e criar usuário OAuth
export async function checkAndCreateOAuthUser(
  userId: string,
  userMetadata: any
) {
  try {
    // Verificar se o usuário já existe na tabela users
    const { data: existingUser, error: fetchError } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      console.error("Erro ao verificar usuário:", fetchError);
      return { success: false, error: fetchError.message };
    }

    // Se o usuário não existe, criar um novo
    if (!existingUser) {
      const { error: insertError } = await supabase.from("users").insert({
        id: userId,
        name:
          userMetadata?.full_name ||
          userMetadata?.email?.split("@")[0] ||
          "Usuário",
        email: userMetadata?.email || "",
        password_hash: null, // Usuários OAuth não têm senha
        role: "USER", // Por padrão, usuários OAuth são USER
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      if (insertError) {
        console.error("Erro ao criar usuário OAuth:", insertError);
        return { success: false, error: insertError.message };
      }

      console.log("Usuário OAuth criado com sucesso:", userId);
      return { success: true, user: { id: userId, ...userMetadata } };
    }

    return { success: true, user: existingUser };
  } catch (error) {
    console.error("Erro ao verificar/criar usuário OAuth:", error);
    return { success: false, error: "Erro interno" };
  }
}
