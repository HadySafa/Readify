import { useState, useEffect } from "react"
import axios from "axios";

// Components
import { HeaderNavigation } from "./Header"
import NotificationToast from "./NotificationToast";

// Redux
import { useSelector } from "react-redux";
import type { RootState } from "../Store";

// Types
import type { User } from "../Models/User";
import type { Notification } from "../Models/Notification";
import type { BorrowedBook } from "../Models/BorrowedBook";

// Router
import { useNavigate } from "react-router-dom";



export default function ProfilePage() {

  // Get token
  const token = useSelector((state: RootState) => state.auth.token)

  // Get user role + protect the page
  const role = useSelector((state: RootState) => state.auth.role)
  useEffect(() => {
    if (!role) { navigate("/") }
  }, [])

  const navigate = useNavigate()

  const [userInfo, setUserInfo] = useState<User>({
    phone_number: 0,
    username: " ",
    full_name: " ",
    id: -1,
    role: "User"
  })
  const [borrowedBooks, setBorrowedBooks] = useState<BorrowedBook[]>([
  ])
  const [editingName, setEditingName] = useState(false)
  const [notification, setNotification] = useState<Notification | null>(null)
  const [tempName, setTempName] = useState(userInfo.full_name)

  // Get currently borrowed books
  async function getBorrowedBooks() {

    const url = "http://localhost:5067/api/books/borrowings/current"

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log(response.data.books)
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

  // Get User Info
  async function getUserInfo() {

    const url = "http://localhost:5067/api/user"

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUserInfo(response.data.user)
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

  // Return Book
  async function handleReturnBook(borrowingId: number) {

    if (borrowingId <= 0) { return }

    const url = "http://localhost:5067/api/books/return/" + borrowingId;

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
      addNotification("Book returned successfully", "success")
      getBorrowedBooks()
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

  // Update Name
  async function handleSaveName() {

    if (!tempName.trim() || tempName.trim() === userInfo.full_name.trim()) {
      setEditingName(false)
      return
    }

    const url = "http://localhost:5067/api/user";

    try {
      await axios.put(
        url,
        { full_name: tempName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      addNotification("Name updated successfully", "success")
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
    setTempName("")
    getUserInfo()
    setEditingName(false)
  }
  function handleCancelEdit() {
    setTempName(userInfo.full_name)
    setEditingName(false)
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

  // when the component mounts, get borrowed books & user info
  useEffect(() => {
    getBorrowedBooks()
    getUserInfo()
  }, [])
  useEffect(() => {
    setTempName(userInfo.full_name)
  }, [userInfo])
  

  return (

    <>

      <HeaderNavigation role={role} active="Profile" />

      {notification && (
        <NotificationToast notification={notification} onClose={() => setNotification(null)} />
      )}

      <div className="min-h-screen p-4 bg-gray-50">

        <div className="max-w-6xl mx-auto space-y-6">

          {/* Personal Info Section */}
          <div className="p-6 space-y-4 bg-white rounded-lg shadow">

            <h2 className="text-2xl font-bold text-green-700">Personal Information</h2>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

              {/* Full Name Field */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500">Full Name</label>
                {
                  editingName
                    ?
                    (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={tempName}
                          autoFocus={true}
                          onChange={(e) => setTempName(e.target.value)}
                          placeholder="Enter full name"
                          className="flex-1 p-2 border rounded"
                        />
                        <button
                          onClick={handleSaveName}
                          className="px-3 py-1 text-white transition bg-green-700 rounded hover:bg-green-900"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="px-3 py-1 transition border rounded hover:bg-gray-200"
                        >
                          Cancel
                        </button>
                      </div>
                    )
                    :
                    (
                      <div className="flex items-center gap-2">
                        <div className="flex-1 p-3 border rounded bg-green-50">{userInfo.full_name}</div>
                        <button
                          onClick={() => setEditingName(true)}
                          className="px-3 py-3 transition border rounded hover:bg-gray-200"
                        >
                          Edit
                        </button>
                      </div>
                    )}
              </div>

              {/* Username Field */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500">Username</label>
                <div className="p-3 border rounded bg-green-50">{userInfo.username}</div>
              </div>

              {/* Phone Field */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500">Phone</label>
                <div className="p-3 border rounded bg-green-50">{userInfo.phone_number}</div>
              </div>

            </div>

          </div>

          {/* Borrowed Books Section */}
          <div className="p-6 space-y-4 bg-white rounded-lg shadow">

            {/* Section Header */}
            <div className="flex flex-col gap-2 md:flex-row md:justify-between md:items-center">
              <div>
                <h2 className="text-2xl font-bold text-green-700">Borrowed Books</h2>
                <p className="text-gray-500">
                  You currently have {borrowedBooks?.length} book{borrowedBooks?.length !== 1 ? "s" : ""} borrowed
                </p>
              </div>
              <button onClick={() => { navigate("/history") }} className="px-5 py-2.5 bg-green-700 text-white font-semibold rounded-lg shadow-md hover:bg-green-900 hover:shadow-lg transition-all duration-300 ease-in-out active:scale-95">
                View History
              </button>

            </div>

            {
              borrowedBooks?.length === 0
                ?
                ( // Display message if no books borrowed
                  <div className="py-8 space-y-1 text-center text-gray-500">
                    <p className="text-lg">No books currently borrowed</p>
                    <p className="text-sm">Visit the library to borrow some books!</p>
                  </div>
                )
                :
                ( // Render borrowed books
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-gray-300">
                          <th className="p-3 font-semibold text-left text-gray-900">Book Title</th>
                          <th className="p-3 font-semibold text-left text-gray-900">Due Date</th>
                          <th className="p-3 font-semibold text-left text-gray-900">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {borrowedBooks.map((book) => (
                          <tr key={book.id} className="transition border-b border-gray-200 hover:bg-green-50">
                            <td className="p-3 font-medium text-gray-900">{book.title}</td>
                            <td className="p-3 text-gray-500">{formatDate(book.due_date)}</td>
                            <td className="p-3">
                              <button
                                onClick={() => handleReturnBook(book.borrowing_id)}
                                className="px-3 py-1 text-white transition bg-red-600 border rounded hover:bg-red-900"
                              >
                                Return Book
                              </button>
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
