// React
import { useState, useEffect } from "react";

// External libraries
import axios from "axios";
import { BookOpen, Plus, List } from "lucide-react";

// Redux (hooks + slice methods + types)
import { fetchBooks } from "../../../Store/Slices/BookSlice";
import type { RootState, AppDispatch } from "../../../Store";
import { useSelector, useDispatch } from "react-redux";

// Components
import BookComponent from "./Book";
import CreateBookModal from "./CreateBookModal";
import EditBookModal from "./EditBookModal";
import ManageGenresModal from "../Genres/ManageGenres";
import DeleteConfirmationModal from "../../DeleteConfirmationModal";
import NotificationToast from "../../NotificationToast";

// Types
import type { Book } from "../../../Models/Book";

// Router
import { useNavigate } from "react-router-dom";


interface propsType {
  searchTerm: string
}

export function BooksContainer({ searchTerm }: propsType) {

  // Get token
  const token = useSelector((state: RootState) => state.auth.token)

  // Get books + states
  const { books, loading, error } = useSelector((state: RootState) => state.book);

  const navigate = useNavigate()

  const dispatch = useDispatch<AppDispatch>();

  const [notification, setNotification] = useState<Notification | null>(null)

  const [loadingBooks, setLoadingBooks] = useState<boolean>(false)
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([])

  const [showAddBookForm, setShowAddBookForm] = useState(false);
  const [showManageGenres, setShowManageGenres] = useState(false);

  function addNotification(message: string, type: "success" | "error"): void {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification(null)
    }, 3000)
  }

  // Edit Book
  const [showEditBookForm, setShowEditBookForm] = useState<boolean>(false);
  const [bookToEdit, setBookToEdit] = useState<Book | null>(null);
  function handleEdit(book: Book) {
    setBookToEdit(book);
    setShowEditBookForm(true);
  }

  // Delete Book
  const [isDeleteConfirmationModalOpen, setIsDeleteConfirmationModalOpen] = useState<boolean>(false);
  const [bookToDelete, setBookToDelete] = useState<Book | null>(null);
  function handleDelete(book: Book) {
    setBookToDelete(book);
    setIsDeleteConfirmationModalOpen(true);
  }
  async function deleteBook() {

    const url = "http://localhost:5067/api/books/" + bookToDelete?.id;

    try {
      await axios.delete(
        url,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      addNotification("Book deleted successfully", "success")
      dispatch(fetchBooks());
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

  // Fetch users based on search parameter
  async function fetchBooksBySearch() {

    setLoadingBooks(true)

    const url = "http://localhost:5067/api/books/search?q=" + searchTerm;

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setLoadingBooks(false)
      setFilteredBooks(response.data.books)
    }
    catch (error: unknown) {
      setLoadingBooks(false)
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

  // debouncing: each time the search term changes, wait for 1s then fetch the results based on the search term 
  useEffect(() => {
    if (searchTerm) {
      const handler = setTimeout(() => {
        fetchBooksBySearch();
      }, 1000);
      return () => clearTimeout(handler);
    }
  }, [searchTerm]);

  // Fetch books when the component first mounts
  useEffect(() => {
    dispatch(fetchBooks());
  }, [])

  // Render content
  let content;
  if (loadingBooks) {
    content = (
      <div className="flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-t-4 border-t-[#15803D] border-gray-200 rounded-full animate-spin"></div>
      </div>
    );
  } else {
    if (searchTerm) {
      if (filteredBooks.length > 0) {
        content = (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredBooks.map((book, index) => (
              <BookComponent
                key={index}
                book={book}
                handleDelete={handleDelete}
                handleEdit={handleEdit}
              />
            ))}
          </div>
        );
      } else {
        content = (
          <div className="py-12 text-center">
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="mb-2 text-xl font-semibold text-gray-900">
              No books found
            </h3>
            <p className="text-gray-500">
              {"No results found for " + searchTerm}
            </p>
          </div>
        );
      }
    } else {
      if (books.length > 0) {
        content = (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {books.map((book, index) => (
              <BookComponent
                key={index}
                book={book}
                handleDelete={handleDelete}
                handleEdit={handleEdit}
              />
            ))}
          </div>
        );
      } else {
        content = (
          <div className="py-12 text-center">
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="mb-2 text-xl font-semibold text-gray-900">
              No books found
            </h3>
            <p className="text-gray-500">Add your first book to get started.</p>
          </div>
        );
      }
    }
  }

  return (
    <div>

      {/* Delete Confirmation Modal */}
      {isDeleteConfirmationModalOpen && (
        <DeleteConfirmationModal
          onClose={() => setIsDeleteConfirmationModalOpen(false)}
          message={`Are you sure you want to delete ${bookToDelete?.title}?`}
          onConfirm={deleteBook}
        />
      )}

      {notification && (
        <NotificationToast notification={notification} onClose={() => setNotification(null)} />
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteConfirmationModalOpen && (
        <DeleteConfirmationModal
          onClose={() => setIsDeleteConfirmationModalOpen(false)}
          message={`Are you sure you want to delete ${bookToDelete?.title}?`}
          onConfirm={deleteBook}
        />
      )}

      {/* Edit Book Modal */}
      {showEditBookForm && (
        <EditBookModal
          setShowEditBookForm={setShowEditBookForm}
          bookToEdit={bookToEdit}
        />
      )}


      {/* Header with buttons */}
      <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Books</h2>
        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            onClick={() => setShowManageGenres(true)}
            className="flex items-center justify-center px-4 py-2 text-green-900 transition-colors duration-200 bg-green-200 rounded-lg hover:bg-green-200"
          >
            <List className="w-5 h-5 mr-2 text-green-900" />
            Manage Genres
          </button>

          <button
            onClick={() => setShowAddBookForm(true)}
            className="flex items-center justify-center px-4 py-2 text-white transition-colors duration-200 bg-green-700 rounded-lg hover:bg-green-900"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Book
          </button>
        </div>
      </div>

      {/* Modals */}
      {showAddBookForm && (
        <CreateBookModal setShowCreateBookForm={setShowAddBookForm} />
      )}
      {showManageGenres && (
        <ManageGenresModal setIsGenresModalOpen={setShowManageGenres} />
      )}

      {/* Books Grid */}
      {
        content
      }

    </div>
  );
}
