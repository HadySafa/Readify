// React
import { useState, useEffect } from "react";

// Router
import { useNavigate } from "react-router-dom";

// Icons
import { UserCheck, User as UserIcon, Eye } from "lucide-react";

// Types
import type { User } from "../../../Models/User";

// Components
import NotificationToast from "../../NotificationToast";

// Libraries
import axios from "axios";

// Redux
import { useSelector } from "react-redux";
import type { RootState } from "../../../Store";

interface UsersTableProps {
  searchTerm: string;
}

export default function UsersTable({ searchTerm }: UsersTableProps) {

  // Get token
  const token = useSelector((state: RootState) => state.auth.token)

  const navigate = useNavigate();

  // Get users + states
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  const [notification, setNotification] = useState<Notification | null>(null)

  function addNotification(message: string, type: "success" | "error"): void {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification(null)
    }, 3000)
  }

  // Fetch users 
  async function fetchUsers() {

    setLoading(true)

    const url = "http://localhost:5067/api/users";

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setLoading(false)
      setUsers(response.data.users)
    }
    catch (error: unknown) {
      setLoading(false)
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
  async function fetchUsersBySearch() {

    setLoading(true)

    const url = "http://localhost:5067/api/users/search?q=" + searchTerm;

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setLoading(false)
      setUsers(response.data.users)
    }
    catch (error: unknown) {
      setLoading(false)
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
        fetchUsersBySearch();
      }, 1000);
      return () => clearTimeout(handler);
    }
  }, [searchTerm]);
  // Fetch users when component mounts
  useEffect(() => { if (!searchTerm) fetchUsers() }, [searchTerm])

  // Handle loading state
  if (loading) return (<div className="flex items-center justify-center"><div className="w-10 h-10 border-4 border-t-4 border-t-[#15803D] border-gray-200 rounded-full animate-spin" ></div></div>)

  return (

    <div>

      {notification && (
        <NotificationToast notification={notification} onClose={() => setNotification(null)} />
      )}

      {users.length > 0 ? (

        <div className="overflow-hidden bg-white rounded-md shadow">

          <div className="overflow-x-auto">

            <div className="min-w-full border-b border-gray-200">

              {/* Table Header */}
              <div className="hidden md:grid grid-cols-[64px_1fr_200px] bg-gray-50 text-gray-500 text-xs uppercase font-medium tracking-wider px-6 py-3">
                <div>ID</div>
                <div>Name</div>
                <div>Actions</div>
              </div>

              {/* Table Body */}
              {users.map((user) => (

                <div
                  key={user.id}
                  className="flex flex-col md:grid md:grid-cols-[64px_1fr_200px] px-6 py-4 md:items-center border-b border-gray-200 text-gray-900"
                >

                  {/* ID */}
                  <div className="font-medium">{user.id}</div>

                  {/* Name */}
                  <div className="flex items-center gap-2 mt-2 md:mt-0">
                    <UserIcon className="w-4 h-4 text-gray-400" />
                    {user.full_name}
                  </div>

                  {/* Actions */}
                  <div className="mt-2 md:mt-0 md:text-right">
                      <button  onClick={ () => { navigate("/history/" + user.id) } }
                      className="flex items-center gap-1 px-3 py-1 text-white bg-green-700 border border-gray-300 rounded bgtext-sm hover:bg-green-900">
                        <Eye className="w-3 h-3" />
                        View History
                      </button>
                  </div>

                </div>

              ))}

            </div>

          </div>

        </div>

      )
        // If no users found, show a message 
        : (
          <div className="py-12 text-center">

            <UserCheck className="w-16 h-16 mx-auto mb-4 text-gray-400" />

            <h3 className="mb-2 text-xl font-semibold text-gray-900">No users found</h3>

            <p className="text-gray-500">
              {searchTerm ? "No results found for " + searchTerm : "No users are currently registered in the system."}
            </p>

          </div>

        )}

    </div>

  );

}
