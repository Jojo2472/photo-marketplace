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
          created_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          description?: string | null;
          created_at?: string | null;
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
          original_url: string;   // Updated here
          created_at: string | null;
        };
        Insert: {
          id?: string;
          album_id: string;
          user_id: string;
          original_url: string;   // Updated here
          created_at?: string | null;
        };
        Update: {
          album_id?: string;
          user_id?: string;
          original_url?: string;   // Updated here
          created_at?: string | null;
        };
      };
      // Add other tables as needed
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
}
