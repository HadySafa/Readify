// React
import { useEffect, useState } from "react";

// Router
import { useNavigate } from "react-router-dom";

// Icons
import { BookOpen, Eye, EyeOff } from "lucide-react";

// Types
import type { Notification } from "../Models/Notification";

// Components
import NotificationToast from "./NotificationToast";

// Libraries
import axios from "axios";

// Redux
import { useDispatch } from "react-redux";
import { setToken } from "../Store/Slices/AuthenticationSlice";
import { useSelector } from "react-redux";
import type { RootState } from "../Store";


export default function Login() {

  const role = useSelector((state: RootState) => state.auth.role)

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false)
  const [notification, setNotification] = useState<Notification | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })

  function addNotification(message: string, type: "success" | "error"): void {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification(null)
    }, 3000)
  }

  async function handleLogin(e: React.FormEvent) {

    e.preventDefault()

    if (!formData.username || !formData.password) {
      addNotification("Please fill in all required fields", "error")
      return
    }

    setIsLoading(true)

    const url = "http://localhost:5067/api/login";

    try {
      const response = await axios.post(url, formData);
      addNotification("Logged in successfully.", "success");
      setIsLoading(false);
      dispatch(setToken(response.data.token))
    } catch (error: unknown) {
      setIsLoading(false);
      if (axios.isAxiosError(error)) {
        if (error.response) {
          addNotification(error.response.data?.message, "error")
        } else if (error.request) {
          addNotification("Unable to reach the server. Please try again.", "error")
        }
      }
      else { addNotification("Unexpected error occurred.", "error"); }
    }

  }

  // Redirect based on the role
  useEffect(() => {
    setTimeout(() => {
      if (role) {
        if (role === 'user') {
          navigate('/homepage')
        }
        else {
          navigate('/dashboard')
        }
      }
    }, 1500);
  }, [role])

  return (

    /* Parent Container */
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-100">

      {notification && (
        <NotificationToast notification={notification} onClose={() => setNotification(null)} />
      )}

      {/* Main ontainer */}
      <div className="w-full max-w-md p-6 bg-white shadow-md rounded-2xl">

        {/* Main container header*/}
        <div className="pb-6 text-center">

          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen className="w-10 h-10 text-green-900" />
            <h1 className="text-2xl font-bold text-green-900">eLibrary</h1>
          </div>

          <h2 className="text-xl font-semibold">Welcome Back</h2>

          <p className="text-sm text-gray-500">Sign in to your account to continue</p>

        </div>

        <form onSubmit={handleLogin} className="space-y-4">

          {/* Username field */}
          <div>

            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>

            <input
              id="username"
              type="text"
              value={formData.username}
              onChange={(e) => setFormData((prev) => ({ ...prev, username: e.target.value }))}
              placeholder="Enter your username"
              className="w-full p-2 mt-1 border border-gray-300 rounded-lg "
              required
              autoFocus={true}
            />

          </div>

          {/* Password field */}
          <div>

            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>

            <div className="relative mt-1">

              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                placeholder="Enter your password"
                className="w-full p-2 pr-10 border border-gray-300 rounded-lg "
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute text-gray-500 transform -translate-y-1/2 right-3 top-1/2 hover:text-gray-700"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>

            </div>

          </div>

          {/* Submission button */}
          <button
            type="submit"
            className="w-full px-4 py-2 font-semibold text-white bg-green-900 rounded-lg hover:bg-green-700 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>

        </form>

        {/* Link to registeration page */}
        <div className="pt-4 mt-6 text-center border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Don't have an account?
            <a
              href="/register"
              className="ml-1 text-green-900 hover:underline"
            >
              Register here
            </a>
          </p>
        </div>

      </div>

    </div>

  )
}
