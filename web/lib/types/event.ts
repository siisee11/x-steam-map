import { Tweet } from "./xapi";

export interface MyEvent {
  title: string;
  latitude: number;
  longitude: number;
  tweets: Tweet[];
  emergency_level: number;
  created_at: string; //  "Wed Jan 06 18:40:40 +0000 2021"
}
