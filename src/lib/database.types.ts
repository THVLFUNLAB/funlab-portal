export type Episode = {
  id: number;
  title: string;
  video_url: string;
  created_at: string;
};

export type LeaderboardEntry = {
  id: number;
  episode_id: number;
  student_name: string;
  score: number;
  created_at: string;
};

// Simplified Supabase Database type mapping
export type Database = {
  public: {
    Tables: {
      episodes: {
        Row: Episode;
        Insert: Omit<Episode, 'id' | 'created_at'>;
        Update: Partial<Omit<Episode, 'id' | 'created_at'>>;
      };
      leaderboard: {
        Row: LeaderboardEntry;
        Insert: Omit<LeaderboardEntry, 'id' | 'created_at'>;
        Update: Partial<Omit<LeaderboardEntry, 'id' | 'created_at'>>;
      };
    };
  };
};
