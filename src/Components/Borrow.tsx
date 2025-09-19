"use client";

import { useState } from "react";
import { CheckCircle, XCircle, User, Tag } from "lucide-react";
import type { BookResponse } from "../../../Models/BookResponse";

type Props = {
  book: BookResponse;
  handleBorrow: (book: BookResponse, days: number) => void;
};

export default function Borrow({ book, handleBorrow }: Props) {

  const [showDaysInput, setShowDaysInput] = useState(false);
  const [days, setDays] = useState<number>(7);

  const handleBorrowClick = () => {
    if (!showDaysInput) {
      setShowDaysInput(true);
    } else {
      handleBorrow(book, days);
      setShowDaysInput(false);
      setDays(7);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-50">
      <div className="flex flex-col justify-between w-full h-full max-w-md p-4 transition-shadow duration-200 bg-white border border-border rounded-2xl hover:shadow-lg">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 pb-3">
          <h3 className="text-lg font-semibold leading-tight text-card-foreground text-balance">
            {book.title}
          </h3>
          <div className="flex-shrink-0">
            {book.available ? (
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

          {/* Borrow Section */}
          <div className="pt-2 space-y-3">
            {showDaysInput && book.available && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Borrow book for</span>
                <input
                  type="number"
                  autoFocus={true}
                  min={1}
                  value={days}
                  onChange={(e) => setDays(Number(e.target.value))}
                  className="w-24 px-2 py-1 text-sm border rounded-md focus:ring-2 focus:ring-green-700 focus:outline-none"
                />
                <span className="text-sm text-muted-foreground">days.</span>
              </div>
            )}

            <button
              onClick={handleBorrowClick}
              disabled={!book.available}
              className={`w-full px-3 py-2 text-sm font-bold rounded-md border transition-colors
                ${
                  book.available
                    ? "border-green-900 text-white bg-green-900 hover:bg-green-700"
                    : "border-green-900 text-white bg-green-900 hover:bg-green-900 cursor-not-allowed"
                }`}
            >
              {showDaysInput ? "Confirm Borrow" : "Borrow"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
