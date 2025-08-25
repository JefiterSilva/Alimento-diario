// Tipos baseados no Supabase
export interface User {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role: "USER" | "ADMIN";
  created_at: string;
  updated_at: string;
}

export interface UserWithoutPassword {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
  created_at: string;
  updated_at: string;
}

export interface Devotional {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  bible_verse: string;
  bible_reference: string;
  author: string;
  author_id?: string;
  date: string;
  featured: boolean;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Tag {
  id: string;
  name: string;
  color: string | null;
  created_at: string;
}

export interface DevotionalTag {
  devotional_id: string;
  tag_id: string;
}

export interface DevotionalWithTags extends Devotional {
  tags: Tag[];
}

export interface Database {
  public: {
    Tables: {
      users: {
        Row: User;
        Insert: Omit<User, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<User, "id" | "created_at" | "updated_at">>;
      };
      devotionals: {
        Row: Devotional;
        Insert: Omit<Devotional, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Devotional, "id" | "created_at" | "updated_at">>;
      };
      tags: {
        Row: Tag;
        Insert: Omit<Tag, "id" | "created_at">;
        Update: Partial<Omit<Tag, "id" | "created_at">>;
      };
      devotional_tags: {
        Row: DevotionalTag;
        Insert: DevotionalTag;
        Update: Partial<DevotionalTag>;
      };
    };
  };
}
