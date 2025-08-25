import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tipos para as tabelas do Supabase
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          name: string;
          email: string;
          password_hash: string;
          role: "USER" | "ADMIN";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          password_hash: string;
          role?: "USER" | "ADMIN";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          password_hash?: string;
          role?: "USER" | "ADMIN";
          created_at?: string;
          updated_at?: string;
        };
      };
      devotionals: {
        Row: {
          id: string;
          slug: string;
          title: string;
          excerpt: string;
          content: string;
          bible_verse: string;
          bible_reference: string;
          author: string;
          date: string;
          featured: boolean;
          published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          excerpt: string;
          content: string;
          bible_verse: string;
          bible_reference: string;
          author: string;
          date: string;
          featured?: boolean;
          published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          excerpt?: string;
          content?: string;
          bible_verse?: string;
          bible_reference?: string;
          author?: string;
          date?: string;
          featured?: boolean;
          published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      tags: {
        Row: {
          id: string;
          name: string;
          color: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          color?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          color?: string | null;
          created_at?: string;
        };
      };
      devotional_tags: {
        Row: {
          devotional_id: string;
          tag_id: string;
        };
        Insert: {
          devotional_id: string;
          tag_id: string;
        };
        Update: {
          devotional_id?: string;
          tag_id?: string;
        };
      };
    };
  };
}
