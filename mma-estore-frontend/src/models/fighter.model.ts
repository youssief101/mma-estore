export interface Fighter {
  _id: string;

  firstName: string;

  lastName: string;

  nickname: string;

  gender: string;

  weightClass: string;

  ranking: number | null;

  country: string;

  image: string;

  champion: boolean;

  slug: string;

  isActive: boolean;

  createdAt: string;
  updatedAt: string;
}

export interface FighterResponse {
  success: boolean;
  fighter: Fighter;
}

export interface FighterListResponse {
  success: boolean;
  count: number;
  fighters: Fighter[];
}