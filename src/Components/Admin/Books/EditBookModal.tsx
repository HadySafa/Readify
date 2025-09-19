// React
import { useState } from "react";

// Router
import { useNavigate } from "react-router-dom";

// Icons
import { BookOpen } from "lucide-react";

// Types
import type { Book } from "../../../Models/Book";

// Components
import NotificationToast from "../../NotificationToast";

// Libraries
import axios from "axios";

// Redux
import { useSelector, useDispatch } from "react-redux";
import { fetchBooks } from "../../../Store/Slices/BookSlice";
import type { RootState, AppDispatch } from "../../../Store";


type EditBookModalProps = {
  setShowEditBookForm: React.Dispatch<React.SetStateAction<boolean>>;
  bookToEdit: Book;
};

interface EditBookFormData {
  number_of_copies: number;
  description: string;
}

export default function EditBookModal({ setShowEditBookForm, bookToEdit }: EditBookModalProps) {

  // Get token
  const token = useSelector((state: RootState) => state.auth.token);


  const dispatch = useDispatch<AppDispatch>();

  const navigate = useNavigate();

  const [notification, setNotification] = useState<Notification | null>(null);
  const [formData, setFormData] = useState<EditBookFormData>({ number_of_copies: bookToEdit.number_of_copies, description: bookToEdit.description || "", });

  function addNotification(message: string, type: "success" | "error") {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  }

  // Actions handlers
  async function handleConfirm() {

    if (formData.number_of_copies <= 0) return;

    const { author, genre, ...rest } = bookToEdit;

    try {
      await axios.put(
        `http://localhost:5067/api/books`,
        {
          ...rest,
          description: formData.description,
          number_of_copies: formData.number_of_copies,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      addNotification("Book updated successfully.", "success");
      setTimeout(() => setShowEditBookForm(false), 1500);
    } catch (error: unknown) {
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
    dispatch(fetchBooks())
    setTimeout(() => { setShowEditBookForm(false) }, 3000)
  };
  function handleCancel() { setShowEditBookForm(false); }

  return (

    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 bg-black bg-opacity-50">

      {notification && (
        <NotificationToast notification={notification} onClose={() => setNotification(null)} />
      )}

      <div className="w-[90%] sm:w-full max-w-md sm:max-w-2xl p-4 sm:p-6 bg-white shadow-md rounded-2xl overflow-y-auto max-h-[90vh]">

        {/* Modal Header */}
        <div className="pb-2 text-center border-b border-gray-200">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen className="w-6 h-6 text-green-900 sm:w-8 sm:h-8" />
            <h1 className="text-xl font-bold text-green-900 sm:text-2xl">Edit Book</h1>
          </div>
        </div>

        {/* Description */}
        <form className="mt-4 space-y-4">
          <div>
            <label htmlFor="book-description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="book-description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter book description"
              rows={4}
              className="w-full p-2 mt-1 border border-gray-300 rounded-lg"
            />
          </div>

          {/* Number of Copies  */}
          <div>
            <label htmlFor="book-copies" className="block text-sm font-medium text-gray-700">
              Number of Copies
            </label>
            <input
              id="book-copies"
              type="number"
              min={0}
              value={formData.number_of_copies}
              onChange={(e) =>
                setFormData({ ...formData, number_of_copies: Number(e.target.value) })
              }
              placeholder="Enter total number of copies"
              className="w-full p-2 mt-1 border border-gray-300 rounded-lg"
              required
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col justify-end gap-2 mt-6 sm:flex-row">
            <button
              type="button"
              onClick={handleCancel}
              className="w-full px-4 py-2 bg-gray-200 border rounded-lg sm:w-auto hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="w-full px-4 py-2 text-white bg-green-900 rounded-lg sm:w-auto hover:bg-green-700"
            >
              Save Changes
            </button>
          </div>

        </form>

      </div>

    </div>
  );
}
