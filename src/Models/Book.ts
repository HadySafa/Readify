export interface Book {
  id: number;          
  title: string;
  description: string;
  author_id: number;
  author: string,
  genre_id: number;
  genre: string,
  number_of_copies: number;
  available_copies: number;
}
