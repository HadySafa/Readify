export interface BorrowedBook {
  borrowing_id: number;
  book_id: number;
  user_id: number;
  borrowed_at: string;   
  returned_at?: string | null;
  due_date: string;   
  title: string;
}
