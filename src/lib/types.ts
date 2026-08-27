export type Game = {
  id: string;
  name: string;
  slug: string;
  icon_url: string | null;
  created_at: string;
};

export type Character = {
  id: string;
  game_id: string;
  name: string;
  slug: string;
  cover_image_url: string | null;
  description: string | null;
  chest_top: string | null;
  chest_underbust: string | null;
  chest_cup: string | null;
  waist: string | null;
  hip: string | null;
  source_note: string | null;
  created_at: string;
  updated_at: string;
};

export type GalleryImage = {
  id: string;
  character_id: string;
  image_url: string;
  caption: string | null;
  sort_order: number;
  created_at: string;
};

export type CharacterWithGame = Character & { games: Pick<Game, "name" | "slug"> };
