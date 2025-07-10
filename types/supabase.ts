export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export interface Database {
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
          original_url: string;
          blurred_url?: string | null;
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
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
}
