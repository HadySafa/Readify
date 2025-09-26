import { useEffect, useState } from "react";
import axios from "axios";

// Components
import { HeaderNavigation } from "./Header"
import NotificationToast from "./NotificationToast";

// Redux
import { useSelector } from "react-redux";
import type { RootState } from "../Store";

// Types
import type { BorrowedBook } from "../Models/BorrowedBook";

// Router
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

export default function BorrowingHistory() {

  const token = useSelector((state: RootState) => state.auth.token)

  // Get user role + protect the page
  const role = useSelector((state: RootState) => state.auth.role)
  useEffect(() => {
    if (!role) { navigate("/") }
  }, [])

  const navigate = useNavigate()
  const { id } = useParams<{ id?: string }>();

  const [notification, setNotification] = useState<Notification | null>(null)
  const [borrowedBooks, setBorrowedBooks] = useState<BorrowedBook[]>([])

  // Get borrowed books history of the authenticated user
  async function getBorrowedBooks() {

    const url = "http://localhost:5067/api/books/borrowings/all"

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setBorrowedBooks(response.data.books)
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

  // Get borrowed books history of a user (by the admin)
  async function getUserBorrowedBooks() {

    const url = "http://localhost:5067/api/books/borrowings/all/users/" + id

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setBorrowedBooks(response.data.books)
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

  // format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  function addNotification(message: string, type: "success" | "error"): void {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification(null)
    }, 3000)
  }

  // when the component mounts, get borrowed books history
  useEffect(() => {
    if (role === 'admin' && id && parseInt(id) > 0) {
      getUserBorrowedBooks()
    }
    else {
      getBorrowedBooks()
    }
  }, [])

  return (
    <>
      <HeaderNavigation role={role} showBack={true} backLink={role === "admin" ? "/dashboard" : "/profile"} />

      {notification && (
        <NotificationToast notification={notification} onClose={() => setNotification(null)} />
      )}

      <div className="container max-w-6xl p-6 mx-auto">

        {/* Container */}
        <div className="bg-white border border-gray-200 shadow-md rounded-2xl">

          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-center text-green-700">Borrowing History</h2>
            {
              borrowedBooks.length > 0
                ? <p className="text-right text-gray-500">
                  {borrowedBooks?.length} borrowed book{borrowedBooks?.length !== 1 ? "s" : ""}
                </p>
                : null
            }
          </div>

          {/* Content */}
          <div className="p-6">

            {
              borrowedBooks.length === 0
                ?
                ( // if no borrowed books, show a message
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <span className="mb-2 text-4xl">📚</span>
                    <h3 className="mb-1 text-lg font-medium">No borrowing history found</h3>
                    <p className="text-gray-500">You haven’t borrowed any books yet.</p>
                  </div>
                )
                :
                ( // render borrowed books
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-green-100 border-b border-gray-200">
                          <th className="px-4 py-3 font-semibold text-left text-gray-700">Book Name</th>
                          <th className="px-4 py-3 font-semibold text-left text-gray-700">Borrowed At</th>
                          <th className="px-4 py-3 font-semibold text-left text-gray-700">Returned At</th>
                        </tr>
                      </thead>
                      <tbody>
                        {borrowedBooks.map((borrowing) => (
                          <tr
                            key={borrowing.book_id}
                            className={`border-b border-gray-200 last:border-0 hover:bg-green-50 transition-colors bg-white"
                              }`}
                          >
                            <td className="px-4 py-3 font-medium text-gray-900">{borrowing.title}</td>
                            <td className="px-4 py-3 text-gray-600">{formatDate(borrowing.borrowed_at)}</td>
                            <td className="px-4 py-3">
                              {borrowing.returned_at ? (
                                <span className="text-gray-600">{formatDate(borrowing.returned_at)}</span>
                              ) : (
                                <span className="font-medium text-red-600">Not Returned</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )
            }

          </div>

        </div>

      </div>

    </>
  )

}
