import { PostgrestVersion } from '@supabase/postgrest-js'

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export interface Database extends PostgrestVersion {
  public: {
    Tables: {
      albums: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          name?: string;
          description?: string | null;
        };
      };
      photos: {
        Row: {
          id: string;
          album_id: string;
          user_id: string;
          original_url: string;  // updated from file_path
          blurred_url?: string | null; // if you use this field
          created_at: string;
        };
        Insert: {
          id?: string;
          album_id: string;
          user_id: string;
          original_url: string;
          blurred_url?: string | null;
          created_at?: string;
        };
        Update: {
          original_url?: string;
          blurred_url?: string | null;
        };
      };
      // Add other tables as needed
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
}
