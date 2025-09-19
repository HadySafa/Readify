"use client"

interface Borrowing {
  id: number
  bookName: string
  borrowedAt: string
  returnedAt: string | null
}

// Mock data
const mockBorrowings: Borrowing[] = [
  {
    id: 1,
    bookName: "The Great Gatsby",
    borrowedAt: "2024-01-15T10:30:00Z",
    returnedAt: "2024-02-01T14:20:00Z",
  },
  {
    id: 2,
    bookName: "To Kill a Mockingbird",
    borrowedAt: "2024-02-05T09:15:00Z",
    returnedAt: "2024-02-28T16:45:00Z",
  },
  {
    id: 3,
    bookName: "1984",
    borrowedAt: "2024-03-10T11:00:00Z",
    returnedAt: null,
  },
  {
    id: 4,
    bookName: "Pride and Prejudice",
    borrowedAt: "2024-03-20T13:30:00Z",
    returnedAt: "2024-04-15T10:15:00Z",
  },
  {
    id: 5,
    bookName: "The Catcher in the Rye",
    borrowedAt: "2024-04-01T08:45:00Z",
    returnedAt: null,
  },
]

function formatDate(dateString: string | null): string {
  if (!dateString) return ""
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export default function BorrowingHistory() {
  return (
    <div className="container max-w-6xl p-6 mx-auto">
      {/* Card replacement */}
      <div className="bg-white border border-gray-200 shadow-md rounded-2xl">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-center text-gray-800">Borrowing History</h2>
        </div>

        <div className="p-6">
          {mockBorrowings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <span className="mb-2 text-4xl">📚</span>
              <h3 className="mb-1 text-lg font-medium">No borrowing history found</h3>
              <p className="text-gray-500">You haven’t borrowed any books yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100 border-b border-gray-200">
                    <th className="px-4 py-3 font-semibold text-left text-gray-700">Book Name</th>
                    <th className="px-4 py-3 font-semibold text-left text-gray-700">Borrowed At</th>
                    <th className="px-4 py-3 font-semibold text-left text-gray-700">Returned At</th>
                  </tr>
                </thead>
                <tbody>
                  {mockBorrowings.map((borrowing, index) => (
                    <tr
                      key={borrowing.id}
                      className={`border-b border-gray-200 last:border-0 hover:bg-gray-50 transition-colors ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                      }`}
                    >
                      <td className="px-4 py-3 font-medium text-gray-900">{borrowing.bookName}</td>
                      <td className="px-4 py-3 text-gray-600">{formatDate(borrowing.borrowedAt)}</td>
                      <td className="px-4 py-3">
                        {borrowing.returnedAt ? (
                          <span className="text-gray-600">{formatDate(borrowing.returnedAt)}</span>
                        ) : (
                          <span className="font-medium text-red-600">Not Returned</span>
                        )}
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
