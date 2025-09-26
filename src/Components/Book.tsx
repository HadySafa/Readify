import { CheckCircle, XCircle, User, Tag } from "lucide-react";
import type { BookResponse } from "../Models/BookResponse";
import { useNavigate } from "react-router-dom";

type Props = {
  book: BookResponse;
};

export default function Book({ book }: Props) {

  const navigate = useNavigate()

  function handleBorrow(book: BookResponse){
    navigate("/book/" + book.id)
  }
  
  return (
    
    <div className="flex flex-col justify-between h-full p-4 transition duration-200 bg-white border shadow-xl border-border rounded-2xl">

      {/* Header */}
      <div className="flex items-start justify-between gap-2 pb-3">
        
        <h3 className="text-lg font-semibold leading-tight text-card-foreground text-balance">
          {book.title}
        </h3>
        
        <div className="flex-shrink-0">
          {book.isAvailable ? (
            <div className="inline-flex items-center gap-1 px-2 py-1 text-xs text-white bg-green-700 rounded-full">
              <CheckCircle className="w-3 h-3" />
              Available
            </div>
          ) : (
            <div className="inline-flex items-center gap-1 px-2 py-1 text-xs text-white bg-red-700 rounded-full">
              <XCircle className="w-3 h-3" />
              Borrowed
            </div>
          )}
        </div>
        
      </div>

      {/* Content */}
      <div className="flex-1 pt-2 space-y-3">
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <User className="w-4 h-4" />
          <span>{book.author}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Tag className="w-4 h-4" />
          <span>{book.genre}</span>
        </div>

        <p className="text-sm leading-relaxed text-card-foreground text-pretty">
          {book.description}
        </p>

        {/* Borrow Button */}
        <div className="pt-2">
          <button
            onClick={() => handleBorrow(book)}
            disabled={!book.isAvailable}
            className={`w-full px-3 py-2 text-sm font-bold rounded-md border transition-colors
              ${ book.isAvailable
                ? "border-green-900 text-white bg-green-700 hover:bg-green-900"
                : "border-green-900 text-white bg-green-700 hover:bg-green-700 cursor-not-allowed"
              }`}
          >
            Borrow
          </button>
          
        </div>

      </div>

    </div>

  );
  
}
