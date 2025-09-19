"use client"

import { useState } from "react"

interface BorrowedBook {
  id: string
  title: string
  author: string
  borrowDate: string
}

interface UserInfo {
  phone: string
  username: string
  fullName: string
  id: string
}

export default function ProfilePage() {
  const [userInfo, setUserInfo] = useState<UserInfo>({
    phone: "+1 (555) 123-4567",
    username: "john_reader",
    fullName: "John Smith",
    id: "USR-2024-001",
  })

  const [borrowedBooks, setBorrowedBooks] = useState<BorrowedBook[]>([
    { id: "1", title: "The Great Gatsby", author: "F. Scott Fitzgerald", borrowDate: "2024-01-15" },
    { id: "2", title: "To Kill a Mockingbird", author: "Harper Lee", borrowDate: "2024-01-20" },
    { id: "3", title: "1984", author: "George Orwell", borrowDate: "2024-02-01" },
    { id: "4", title: "Pride and Prejudice", author: "Jane Austen", borrowDate: "2024-02-10" },
  ])

  const [editingName, setEditingName] = useState(false)
  const [tempName, setTempName] = useState(userInfo.fullName)

  const handleSaveName = () => {
    setUserInfo((prev) => ({ ...prev, fullName: tempName }))
    setEditingName(false)
  }

  const handleCancelEdit = () => {
    setTempName(userInfo.fullName)
    setEditingName(false)
  }

  const handleReturnBook = (bookId: string) => {
    setBorrowedBooks((prev) => prev.filter((book) => book.id !== bookId))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Personal Info Section */}
        <div className="p-6 space-y-4 bg-white rounded-lg shadow">
          <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-500">Phone</label>
              <div className="p-3 bg-gray-100 border rounded">{userInfo.phone}</div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-500">Username</label>
              <div className="p-3 bg-gray-100 border rounded">{userInfo.username}</div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-500">Full Name</label>
              {editingName ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    placeholder="Enter full name"
                    className="flex-1 p-2 border rounded"
                  />
                  <button
                    onClick={handleSaveName}
                    className="px-3 py-1 text-white transition bg-blue-600 rounded hover:bg-blue-700"
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
              ) : (
                <div className="flex items-center gap-2">
                  <div className="flex-1 p-3 bg-gray-100 border rounded">{userInfo.fullName}</div>
                  <button
                    onClick={() => setEditingName(true)}
                    className="px-3 py-1 transition border rounded hover:bg-gray-200"
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-500">User ID</label>
              <div className="p-3 bg-gray-100 border rounded">{userInfo.id}</div>
            </div>
          </div>
        </div>

        {/* Borrowed Books Section */}
        <div className="p-6 space-y-4 bg-white rounded-lg shadow">
          <div className="flex flex-col gap-2 md:flex-row md:justify-between md:items-center">
            <h2 className="text-2xl font-bold text-gray-900">Borrowed Books</h2>
            <p className="text-gray-500">
              You currently have {borrowedBooks.length} book{borrowedBooks.length !== 1 ? "s" : ""} borrowed
            </p>
          </div>

          {borrowedBooks.length === 0 ? (
            <div className="py-8 space-y-1 text-center text-gray-500">
              <p className="text-lg">No books currently borrowed</p>
              <p className="text-sm">Visit the library to borrow some books!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-300">
                    <th className="p-3 font-semibold text-left text-gray-900">Book Title</th>
                    <th className="p-3 font-semibold text-left text-gray-900">Author</th>
                    <th className="p-3 font-semibold text-left text-gray-900">Borrow Date</th>
                    <th className="p-3 font-semibold text-left text-gray-900">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {borrowedBooks.map((book) => (
                    <tr key={book.id} className="transition border-b border-gray-200 hover:bg-gray-100">
                      <td className="p-3 font-medium text-gray-900">{book.title}</td>
                      <td className="p-3 text-gray-500">{book.author}</td>
                      <td className="p-3 text-gray-500">{formatDate(book.borrowDate)}</td>
                      <td className="p-3">
                        <button
                          onClick={() => handleReturnBook(book.id)}
                          className="px-3 py-1 text-red-600 transition border rounded hover:bg-red-50"
                        >
                          Return Book
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
