// React
import { useState, useEffect } from "react";

// External libraries
import axios from "axios";
import { Users, Plus } from "lucide-react";

// Redux (hooks + slice methods + types)
import { useSelector, useDispatch } from "react-redux";
import { fetchAuthors, clearAuthorState } from "../../../Store/Slices/AuthorSlice";
import type { RootState, AppDispatch } from "../../../Store";

// Components
import AuthorComponent from "./Author";
import EditAuthorModal from "./EditAuthorModal";
import CreateAuthorModal from "./CreateAuthorModal";
import DeleteConfirmationModal from "../../DeleteConfirmationModal";
import NotificationToast from "../../NotificationToast";

// Types
import type { Author } from "../../../Models/Author";

// Router
import { useNavigate } from "react-router-dom";


interface PropsType {
  searchTerm: string;
}


export default function AuthorsContainer({ searchTerm }: PropsType) {

  // Get the token
  const token = useSelector((state: RootState) => state.auth.token)

  // Get authors + states
  const dispatch = useDispatch<AppDispatch>();
  const { authors, loading, error } = useSelector((state: RootState) => state.author);

  const [notification, setNotification] = useState<Notification | null>(null)
  const [filteredAuthors, setFilteredAuthors] = useState<Author[]>(authors)

  const navigate = useNavigate()

  function addNotification(message: string, type: "success" | "error"): void {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification(null)
    }, 3000)
  }

  // Add Author
  const [showAddAuthorForm, setShowAddAuthorForm] = useState<boolean>(false);
  function handleAddAuthor() {
    setShowAddAuthorForm(true);
  }

  // Edit Author
  const [showEditAuthorForm, setShowEditAuthorForm] = useState<boolean>(false);
  const [authorToEdit, setAuthorToEdit] = useState<Author | null>(null);
  function handleEdit(author: Author) {
    setAuthorToEdit(author);
    setShowEditAuthorForm(true);
  }

  // Delete Author
  const [isDeleteConfirmationModalOpen, setIsDeleteConfirmationModalOpen] = useState<boolean>(false);
  const [authorToDelete, setAuthorToDelete] = useState<Author | null>(null);
  function handleDelete(author: Author) {
    setAuthorToDelete(author);
    setIsDeleteConfirmationModalOpen(true);
  }
  async function deleteAuthor() {

    const url = "http://localhost:5067/api/authors/" + authorToDelete?.id;

    try {
      await axios.delete(
        url,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      addNotification("Author deleted successfully", "success")
      dispatch(fetchAuthors());
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

  // Filter authors based on the search term
  useEffect(() => {
    if (searchTerm) {
      setFilteredAuthors(
        authors.filter((author: Author) =>
          author.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredAuthors([]);
    }
  }, [searchTerm, authors]);

  // Fetch authors when the component first mounts
  useEffect(() => {
    dispatch(fetchAuthors());
  }, []);

  // Show error notifications when fetching authors fails
  useEffect(() => {
    if (!loading && error) {
      addNotification(error, "error");
      dispatch(clearAuthorState());
    }
  }, [error, loading]);


  // Determine the content to render based on search term and available authors
  let content;
  if (loading) {
    content = (<div className="flex items-center justify-center"><div className="w-10 h-10 border-4 border-t-4 border-t-[#15803D] border-gray-200 rounded-full animate-spin" ></div></div>)
  }
  else {
    if (searchTerm) {
      if (filteredAuthors.length > 0) {
        content = (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredAuthors.map((author) => (
              <AuthorComponent
                key={author.id}
                author={author}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
              />
            ))}
          </div>
        );
      } else {
        content = (
          <div className="py-12 text-center">
            <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="mb-2 text-xl font-semibold text-gray-900">
              No authors found
            </h3>
            <p className="text-gray-500">
              {"No users found for " + searchTerm}
            </p>
          </div>
        );
      }
    } else {
      if (authors.length > 0) {
        content = (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {authors.map((author) => (
              <AuthorComponent
                key={author.id}
                author={author}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
              />
            ))}
          </div>
        );
      } else {
        content = (
          <div className="py-12 text-center">
            <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="mb-2 text-xl font-semibold text-gray-900">
              No authors found
            </h3>
            <p className="text-gray-500">
              Add your first author to get started with author management.
            </p>
          </div>
        );
      }
    }
  }

  return (
    <div className="mt-0">

      {/* Notification Toast */}
      {notification && (
        <NotificationToast notification={notification} onClose={() => setNotification(null)} />
      )}

      {/* Edit Author Modal */}
      {showEditAuthorForm && (
        <EditAuthorModal
          setShowEditAuthorForm={setShowEditAuthorForm}
          authorToEdit={authorToEdit}
        />
      )}

      {/* Create Author Modal */}
      {showAddAuthorForm && (
        <CreateAuthorModal
          setShowCreateAuthorForm={setShowAddAuthorForm}
        />
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteConfirmationModalOpen && (
        <DeleteConfirmationModal
          onClose={() => setIsDeleteConfirmationModalOpen(false)}
          message={`Are you sure you want to delete ${authorToDelete?.name}`}
          onConfirm={deleteAuthor}
        />
      )}

      {/* Header with Add Author Button */}
      <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Authors</h2>
        <button
          onClick={handleAddAuthor}
          className="flex items-center justify-center px-4 py-2 text-white transition-colors duration-200 bg-green-700 rounded-lg hover:bg-green-900"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Author
        </button>
      </div>

      {/* Authors List */}
      {
        <div>
          {content}
        </div>
      }

    </div>
  );
}
