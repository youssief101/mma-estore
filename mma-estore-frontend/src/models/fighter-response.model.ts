import { Fighter } from "./fighter.model";

export interface FightersResponse {
  success: boolean;
  count: number;
  fighters: Fighter[];
}

export interface FighterResponse {
  success: boolean;
  fighter: Fighter;
}