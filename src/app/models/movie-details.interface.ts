import { Movie } from './movie.interface';

export interface MovieDetails extends Movie {
  genres: { id: number; name: string }[];
  runtime: number;
  revenue: number;
  budget: number;
}
