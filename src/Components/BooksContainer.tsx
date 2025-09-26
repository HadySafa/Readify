import { useEffect, useState } from "react"
import axios from "axios"

// Icons
import { BookOpen } from "lucide-react"

// Components
import Book from "./Book"
import NotificationToast from "./NotificationToast"
import { HeaderNavigation } from "./Header"

// Types
import type { BookResponse } from "../Models/BookResponse"
import type { Notification } from "../Models/Notification"
import type { Author } from "../Models/Author"
import type { Genre } from "../Models/Genre"

// Redux
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../Store"
import { fetchGenres } from "../Store/Slices/GenreSlice"
import { fetchAuthors } from "../Store/Slices/AuthorSlice"

// Router
import { useNavigate } from "react-router-dom";

export default function BooksContainer() {

    // Get role + protect the page
    const role = useSelector((state: RootState) => state.auth.role)
    useEffect(() => {
        if (!role) { navigate("/") }
    }, [])

    const navigate = useNavigate()

    const token = useSelector((state: RootState) => state.auth.token)

    const dispatch = useDispatch<AppDispatch>();

    const [notification, setNotification] = useState<Notification | null>(null)
    const [books, setBooks] = useState<BookResponse[]>([])
    const [loading, setLoading] = useState<boolean>(false) // Books loading state
    const [openDropdown, setOpenDropdown] = useState<"genre" | "availability" | "author" | null>(null); // Drop Down
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedGenre, setSelectedGenre] = useState<number>(-1)
    const [selectedGenreName, setSelectedGenreName] = useState<string>("All Genres")
    const [selectedAuthor, setSelectedAuthor] = useState<number>(-1)
    const [selectedAuthorName, setSelectedAuthorName] = useState<string>("All Authors")
    const [availabilityFilter, setAvailabilityFilter] = useState("All")

    // Fetch genres and authors
    const genres = useSelector((state: RootState) => state.genre.genres) as Genre[];
    const authors = useSelector((state: RootState) => state.author.authors) as Author[];
    useEffect(() => {
        dispatch(fetchAuthors())
        dispatch(fetchGenres())
    }, [])

    // Get filtered books 
    async function fetchFilteredBooks() {

        setLoading(true)

        let url = "http://localhost:5067/api/books/filter?";
        const params: string[] = [];

        if (searchTerm.trim()) {
            params.push("Search=" + encodeURIComponent(searchTerm));
        }

        if (selectedGenre !== -1) {
            params.push("GenreId=" + selectedGenre);
        }

        if (selectedAuthor !== -1) {
            params.push("AuthorId=" + selectedAuthor);
        }

        if (availabilityFilter !== "All") {
            params.push("Availability=" + availabilityFilter);
        }

        url += params.join("&");

        try {
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log(url)
            setLoading(false)
            setBooks(response.data.books)
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
    useEffect(() => { fetchFilteredBooks() }, [searchTerm, selectedGenre, selectedAuthor, availabilityFilter])

    function addNotification(message: string, type: "success" | "error"): void {
        setNotification({ message, type })
        setTimeout(() => {
            setNotification(null)
        }, 3000)
    }

    return (
        <>
            <HeaderNavigation role={role} active="Home" />

            {notification && (
                <NotificationToast notification={notification} onClose={() => setNotification(null)} />
            )}

            <div className="container p-6 mx-auto">

                {/* Filters + Search Section */}
                <div className="flex flex-col gap-3 p-3 pb-4 mb-6 border border-gray-200 shadow-md bg-gray-50 lg:flex-row backdrop-blur-md rounded-2xl">

                    {/* Genre + Author */}
                    <div className="flex flex-col gap-3 lg:flex-1">

                        {/* Genre */}
                        <div className="relative flex-1">

                            <label className="mb-2 text-sm font-semibold tracking-wide text-gray-800 uppercase">Genre</label>

                            <div className="relative">

                                <button
                                    onClick={() => setOpenDropdown(openDropdown === "genre" ? null : "genre")}
                                    className="flex items-center justify-between w-full h-12 px-4 bg-white border-2 border-gray-300 shadow-sm rounded-xl focus:border-green-600 focus:ring-1 focus:ring-green-400 hover:border-green-400"
                                >
                                    {selectedGenreName}
                                    <span className={`ml-2 transition-transform ${openDropdown === "genre" ? "rotate-180" : ""}`}>▼</span>
                                </button>

                                {openDropdown === "genre" && (
                                    <ul className="absolute z-40 w-full mt-1 overflow-y-auto bg-white border-2 border-gray-300 shadow-lg rounded-xl max-h-60">
                                        <li
                                            className="p-2 cursor-pointer hover:bg-green-100"
                                            onClick={() => { setSelectedGenre(-1); setSelectedGenreName("All Genres"); setOpenDropdown(null); }}
                                        >
                                            All Genres
                                        </li>
                                        {genres.map((genre) => (
                                            <li
                                                key={genre.id}
                                                className="p-2 cursor-pointer hover:bg-green-100"
                                                onClick={() => { setSelectedGenre(genre.id); setSelectedGenreName(genre.name); setOpenDropdown(null); }}
                                            >
                                                {genre.name}
                                            </li>
                                        ))}
                                    </ul>
                                )}

                            </div>

                        </div>

                        {/* Author */}
                        <div className="relative flex-1">

                            <label className="mb-2 text-sm font-semibold tracking-wide text-gray-800 uppercase">Author</label>

                            <div className="relative">

                                <button
                                    onClick={() => setOpenDropdown(openDropdown === "author" ? null : "author")}
                                    className="flex items-center justify-between w-full h-12 px-4 bg-white border-2 border-gray-300 shadow-sm rounded-xl focus:border-green-600 focus:ring-1 focus:ring-green-400 hover:border-green-400"
                                >
                                    {selectedAuthorName}
                                    <span className={`ml-2 transition-transform ${openDropdown === "author" ? "rotate-180" : ""}`}>▼</span>
                                </button>

                                {openDropdown === "author" && (
                                    <ul className="absolute w-full mt-1 overflow-y-auto bg-white border-2 border-gray-300 shadow-lg rounded-xl max-h-60">
                                        <li
                                            className="p-2 cursor-pointer hover:bg-green-100"
                                            onClick={() => { setSelectedAuthor(-1); setSelectedAuthorName("All Authors"); setOpenDropdown(null); }}
                                        >
                                            All Authors
                                        </li>
                                        {authors.map((author) => (
                                            <li
                                                key={author.id}
                                                className="p-2 cursor-pointer hover:bg-green-100"
                                                onClick={() => { setSelectedAuthor(author.id); setSelectedAuthorName(author.name); setOpenDropdown(null); }}
                                            >
                                                {author.name}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                        </div>

                    </div>

                    {/* Search + Availability */}
                    <div className="flex flex-col gap-3 lg:flex-1">

                        {/* Search */}
                        <div className="relative flex-1">
                            <label className="mb-2 text-sm font-semibold tracking-wide text-gray-800 uppercase">
                                Search
                            </label>
                            <input
                                type="text"
                                placeholder="Search books by title or author..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full h-12 pl-4 pr-4 transition-colors border-2 border-gray-300 shadow-sm rounded-xl focus:outline-none focus:border-green-500"
                            />
                        </div>

                        {/* Availability */}
                        <div className="flex flex-col">
                            <label className="mb-2 text-sm font-semibold tracking-wide text-gray-800 uppercase">
                                Availability
                            </label>
                            <div className="flex flex-wrap gap-4">
                                {["All", "Available", "Not Available"].map((option) => (
                                    <label
                                        key={option}
                                        className={`flex items-center gap-2 px-3 py-2 border rounded-xl cursor-pointer transition ${availabilityFilter === option
                                            ? "bg-green-600 text-white border-green-600"
                                            : "border-gray-300 hover:border-green-400"
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name="availability"
                                            value={option}
                                            checked={availabilityFilter === option}
                                            onChange={() => setAvailabilityFilter(option)}
                                            className="hidden"
                                        />
                                        <span className="text-sm font-medium">{option}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                    </div>

                </div>

                {/* Content Section */}
                <div className="w-full ">

                    {
                        books.length === 0
                            ?
                            (
                                <div className="flex flex-col items-center justify-center min-h-[300px] text-center">
                                    <BookOpen className="w-16 h-16 mb-4 text-gray-400" />
                                    <h3 className="mb-2 text-lg font-semibold text-gray-900">
                                        No books found
                                    </h3>
                                </div>
                            )
                            :
                            (
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                                    {books.map((book) => (
                                        <Book key={book.id} book={book} />
                                    ))}
                                </div>
                            )
                    }
                </div>

            </div>

        </>
    )

}
