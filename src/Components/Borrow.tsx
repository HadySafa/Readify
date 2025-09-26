import { useEffect, useState } from "react";
import axios from "axios";

// Icons
import { CheckCircle, XCircle, User, Tag } from "lucide-react";

// Router
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

// Types
import type { BookResponse } from "../Models/BookResponse";
import type { Notification } from "../Models/Notification";

// Components
import { HeaderNavigation } from "./Header";
import NotificationToast from "./NotificationToast";

// Redux
import { useSelector } from "react-redux";
import type { RootState } from "../Store";


export default function Borrow() {

  // Get user role + protect the page
  const role = useSelector((state: RootState) => state.auth.role)
  useEffect(() => {
    if (!role) { navigate("/") }
  }, [])

  const token = useSelector((state: RootState) => state.auth.token)

  const navigate = useNavigate()

  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<BookResponse>(
    {
      id: 1,
      title: "Title",
      author: "Author",
      genre: "Genre",
      isAvailable: false,
      description: ""
    }
  )
  const [showDaysInput, setShowDaysInput] = useState(false);
  const [days, setDays] = useState<number>(7);
  const [notification, setNotification] = useState<Notification | null>(null)

  function addNotification(message: string, type: "success" | "error"): void {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification(null)
    }, 3000)
  }

  // Borrow book
  function handleBorrowClick() {
    if (!showDaysInput) {
      setShowDaysInput(true);
    } else {
      handleBorrow(days);
      setShowDaysInput(false);
      setDays(7);
    }
  };
  async function handleBorrow() {

    if (!days || !id) { return }

    const url = "http://localhost:5067/api/books/borrow/" + id + "?days=" + days;

    try {
      await axios.post(
        url,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      addNotification("Book Borrowed.", "success")
      setTimeout(() => { navigate("/profile") }, 2000)
    }
    catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          if (error.response.data?.message) addNotification(error.response.data?.message, "error")
          else {
            const status = error.response.status;
            if (status === 401) {
              addNotification('Not authenticated', 'error');
              setTimeout(() => navigate('/'), 2000);
            } else if (status === 403) {
              addNotification('Not allowed to perform this action', 'error');
              setTimeout(() => navigate('/'), 2000);
            }
          }
        } else if (error.request) {
          addNotification("Unable to reach the server. Please try again.", "error")
        }
      }
      else { addNotification("Unexpected error occurred.", "error"); }
    }
    setShowDaysInput(false)
    setDays(7)
  }

  // Get book
  async function getBook() {

    const url = "http://localhost:5067/api/books/" + id

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.data.book) { setBook(response.data.book) }
      else {
        addNotification('Not a valid Id.', 'error');
        setTimeout(() => { navigate("/homepage") }, 2000)
      }
    }
    catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          if (error.response.data?.message) addNotification(error.response.data?.message, "error")
          else {
            const status = error.response.status;
            if (status === 401) {
              addNotification('Not authenticated', 'error');
              setTimeout(() => navigate('/'), 2000);
            } else if (status === 403) {
              addNotification('Not allowed to perform this action', 'error');
              setTimeout(() => navigate('/'), 2000);
            }
          }
        } else if (error.request) {
          addNotification("Unable to reach the server. Please try again.", "error")
        }
      }
      else { addNotification("Unexpected error occurred.", "error"); }
    }
  }
  useEffect(() => { getBook() }, [])

  return (
    <>
      <HeaderNavigation role={role} backLink="/homepage" showBack={true} />

      {notification && (
        <NotificationToast notification={notification} onClose={() => setNotification(null)} />
      )}

      <div className="flex items-center justify-center min-h-screen p-4 bg-gray-50">

        <div className="flex flex-col justify-between w-full h-full max-w-xl p-5 transition-shadow duration-200 bg-white border border-border rounded-2xl hover:shadow-lg">

          {/* Header: title + availability status */}
          <div className="flex items-start justify-between gap-2 pb-3">
            <h3 className="text-xl font-semibold leading-tight text-card-foreground text-balance">
              {book.title}
            </h3>
            <div className="flex-shrink-0">
              {book.isAvailable ? (
                <div className="inline-flex items-center gap-1 px-2.5 py-1 text-sm text-white bg-green-700 rounded-full">
                  <CheckCircle className="w-3.5 h-3.5" />
                  Available
                </div>
              ) : (
                <div className="inline-flex items-center gap-1 px-2.5 py-1 text-sm text-white bg-red-700 rounded-full">
                  <XCircle className="w-3.5 h-3.5" />
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

              {showDaysInput && book.isAvailable && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Borrow book for</span>
                  <input
                    type="number"
                    autoFocus
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
                disabled={!book.isAvailable}
                className={`w-full px-3 py-2 text-sm font-bold rounded-md border transition-colors
          ${book.isAvailable
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

    </>
  );
  
}
