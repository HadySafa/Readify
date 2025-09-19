import { CheckCircle, XCircle, User, Tag, Edit, Trash2, Copy } from "lucide-react";
import type { Book } from "../../../Models/Book";

type Props = {
  book: Book;
  handleEdit: (book: Book) => void;
  handleDelete: (book: Book) => void;
};

export default function Book({ book, handleEdit, handleDelete }: Props) {

  return (

    <div className="flex flex-col justify-between h-full p-4 transition-shadow duration-200 bg-white border border-border rounded-2xl hover:shadow-lg">

      {/* Header */}
      <div className="flex items-start justify-between gap-2 pb-3">

        <h3 className="text-lg font-semibold leading-tight text-card-foreground text-balance">
          {book.title}
        </h3>

        <div className="flex-shrink-0">

          {book.available_copies > 0 ? (
            <div className="inline-flex items-center gap-1 px-2 py-1 text-xs text-white bg-green-700 rounded-full bg-primary text-primary-foreground">
              <CheckCircle className="w-3 h-3" />
              Available
            </div>
          ) : (
            <div className="inline-flex items-center gap-1 px-2 py-1 text-xs text-white bg-red-700 rounded-full bg-muted text-muted-foreground">
              <XCircle className="w-3 h-3" />
              Unavailable
            </div>
          )}
        </div>

      </div>

      {/* Copies Info */}
      <div className="flex items-center gap-2 text-sm">
        <Copy className="w-4 h-4 text-muted-foreground" />
        <span className="text-card-foreground">
          <span className="text-base font-bold text-green-700">{book.available_copies}</span>
          <span> of </span>
          <span className="text-base font-medium text-gray-700">{book.number_of_copies}</span>
          <span className="ml-1 text-muted-foreground">copies available</span>
        </span>
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

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <button
            onClick={() => handleEdit(book)}
            className="flex items-center gap-1 px-3 py-1 text-sm transition border rounded-md border-border hover:bg-gray-100"
          >
            <Edit className="w-3 h-3" />
            Edit
          </button>

          {/* Delete Button */}
          <div className="relative">
            <button
              className="flex items-center gap-1 px-3 py-1 text-sm text-red-700 transition border rounded-md border-border hover:text-red-700 hover:bg-red-50"
              onClick={() => handleDelete(book)}
            >
              <Trash2 className="w-3 h-3" />
              Delete
            </button>
          </div>

        </div>

      </div>

    </div>

  );
}
