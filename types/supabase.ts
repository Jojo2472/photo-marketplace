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
          file_path: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          album_id: string;
          user_id: string;
          file_path: string;
          created_at?: string;
        };
        Update: {
          file_path?: string;
        };
      };
      // Add other tables as needed
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
}
