// React
import { useState, useEffect } from "react";

// Router
import { useNavigate } from "react-router-dom";

// Icons
import { BookOpen } from "lucide-react";

// Types
import type { Author } from "../../../Models/Author";
import type { Genre } from "../../../Models/Genre";

// Components
import NotificationToast from "../../NotificationToast";

// Libraries
import axios from "axios";

// Redux (slices + types)
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../../Store";
import { fetchGenres } from "../../../Store/Slices/GenreSlice";
import { fetchAuthors } from "../../../Store/Slices/AuthorSlice";
import { fetchBooks } from "../../../Store/Slices/BookSlice";

type CreateBookModalProps = {
  setShowCreateBookForm: React.Dispatch<React.SetStateAction<boolean>>;
};

interface BookFormData {
  title: string,
  author_id: number,
  number_of_copies: number,
  genre_id: number,
  description: string
}

export default function CreateBookModal({ setShowCreateBookForm }: CreateBookModalProps) {

  // Get token
  const token = useSelector((state: RootState) => state.auth.token)

  const navigate = useNavigate();

  const dispatch = useDispatch<AppDispatch>();

  // Get authors and genres
  const { authors } = useSelector((state: RootState) => state.author);
  const { genres } = useSelector((state: RootState) => state.genre);


  function addNotification(message: string, type: "success" | "error"): void {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification(null)
    }, 3000)
  }

  const [notification, setNotification] = useState<Notification | null>(null)
  const [formData, setFormData] = useState<BookFormData>({ title: "", author_id: 0, number_of_copies: 0, genre_id: 0, description: "" });

  // Actions handlers
  async function handleConfirm() {

    if (!formData.title.trim() || !formData.description.trim() || formData.genre_id == 0 || formData.author_id == 0 || formData.number_of_copies == 0) return

    const url = "http://localhost:5067/api/books";

    try {
      await axios.post(
        url,
        {
          title: formData.title,
          author_id: formData.author_id,
          number_of_copies: formData.number_of_copies,
          genre_id: formData.genre_id,
          description: formData.description
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      addNotification("Book added successfully.", "success")
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
    setTimeout(() => { setShowCreateBookForm(false) }, 3000)
    dispatch(fetchBooks());
  };
  function handleCancel() {
    setShowCreateBookForm(false);
  };

  // Fetch authors and genres when the component mounts
  useEffect(() => {
    dispatch(fetchGenres());
    dispatch(fetchAuthors())
  }, [])

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
            <h1 className="text-xl font-bold text-green-900 sm:text-2xl">
              Create Book
            </h1>
          </div>
        </div>

        {/* Form */}
        <form className="mt-4 space-y-4">

          {/* Title */}
          <div>
            <label
              htmlFor="book-title"
              className="block text-sm font-medium text-gray-700"
            >
              Title
            </label>
            <input
              id="book-title"
              autoFocus
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Enter book title"
              className="w-full p-2 mt-1 border border-gray-300 rounded-lg"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="book-description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="book-description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Enter book description"
              rows={4}
              className="w-full p-2 mt-1 border border-gray-300 rounded-lg"
            />
          </div>

          {/* Number of Copies */}
          <div>
            <label
              htmlFor="book-available-copies"
              className="block text-sm font-medium text-gray-700"
            >
              Number of Copies
            </label>
            <input
              id="book-available-copies"
              type="number"
              min={0}
              value={formData.number_of_copies ?? 0}
              onChange={(e) =>
                setFormData({ ...formData, number_of_copies: Number(e.target.value) })
              }
              placeholder="Enter number of available copies"
              className="w-full p-2 mt-1 border border-gray-300 rounded-lg"
              required
            />
          </div>

          {/* Author */}
          <div>
            <label
              htmlFor="book-author"
              className="block text-sm font-medium text-gray-700"
            >
              Author
            </label>
            <select
              id="book-author"
              value={formData.author_id}
              onChange={(e) =>
                setFormData({ ...formData, author_id: parseInt(e.target.value) })
              }
              className="w-full p-2 mt-1 border border-gray-300 rounded-lg"
              required
            >
              <option value={0}>Select an author</option>
              {
                authors.map((obj: Author, index: number) => {
                  return (<option key={index} value={obj.id}>{obj.name}</option>)
                })
              }
            </select>
          </div>

          {/* Genre */}
          <div>
            <label
              htmlFor="book-genre"
              className="block text-sm font-medium text-gray-700"
            >
              Genre
            </label>
            <select
              id="book-genre"
              value={formData.genre_id}
              onChange={(e) =>
                setFormData({ ...formData, genre_id: parseFloat(e.target.value) })
              }
              className="w-full p-2 mt-1 border border-gray-300 rounded-lg"
              required
            >
              <option value={0}>Select a genre</option>
              {
                genres.map((obj: Genre, index: number) => {
                  return (<option key={index} value={obj.id}>{obj.name}</option>)
                })
              }
            </select>
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
              Create Book
            </button>
          </div>

        </form>

      </div>

    </div>
  );
}
