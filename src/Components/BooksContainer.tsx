import { useEffect, useState } from "react"
import { BookOpen, Search, Loader2, Edit, Trash2, Plus, Settings } from "lucide-react"

import Book from "./Book"
import type { BookResponse } from "../Models/BookResponse"
import type { Notification } from "../Models/Notification"
import NotificationToast from "./NotificationToast"
import { HeaderNavigation } from "./Header"


// Redux
import { useSelector } from "react-redux";
import type { RootState } from "../../Store";

// Router
import { useNavigate } from "react-router-dom";

import axios from "axios"


const genres = ["All Genres", "Fiction", "Romance", "Dystopian", "Non-Fiction", "Mystery", "Sci-Fi"]
const authors = [
    "All Authors",
    "F. Scott Fitzgerald",
    "Harper Lee",
    "Jane Austen",
    "George Orwell",
    "J.D. Salinger",
    "William Golding",
]

export default function BooksContainer() {

    const navigate = useNavigate()

    const token = useSelector((state: RootState) => state.auth.token)

    const role = useSelector((state: RootState) => state.auth.role)

    function addNotification(message: string, type: "success" | "error"): void {
        setNotification({ message, type })
        setTimeout(() => {
            setNotification(null)
        }, 3000)
    }


    const [notification, setNotification] = useState<Notification | null>(null)

    const [loading, setLoading] = useState<boolean>(false)

    const [books, setBooks] = useState<BookResponse[]>([])


    async function fetchBooks() {

        setLoading(true)

        const url = "http://localhost:5067/api/users-books";

        try {
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
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

    useEffect(() => { fetchBooks() }, [])


    const [openGenre, setOpenGenre] = useState(false);
    const [openAuthor, setOpenAuthor] = useState(false);
    const [openAvailability, setOpenAvailability] = useState(false);



    const [searchTerm, setSearchTerm] = useState("")
    const [selectedGenre, setSelectedGenre] = useState("All Genres")
    const [selectedAuthor, setSelectedAuthor] = useState("All Authors")
    const [availabilityFilter, setAvailabilityFilter] = useState("All")
    const [isLoading, setIsLoading] = useState(false)

    const filteredBooks = books.filter((book) => {
        const matchesSearch =
            book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            book.author.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesGenre = selectedGenre === "All Genres" || book.genre === selectedGenre
        const matchesAuthor = selectedAuthor === "All Authors" || book.author === selectedAuthor
        const matchesAvailability =
            availabilityFilter === "All" ||
            (availabilityFilter === "Available" && book.available) ||
            (availabilityFilter === "Not Available" && !book.available)
        return matchesSearch && matchesGenre && matchesAuthor && matchesAvailability
    })

    const handleAddBook = () => console.log("Add book clicked")
    const handleManageGenres = () => console.log("Manage genres clicked")
    const handleEditBook = (bookId: number) => console.log("Edit book:", bookId)
    const handleDeleteBook = (bookId: number) => console.log("Delete book:", bookId)



    // Track which dropdown is open: "genre", "availability", "author", or null
    const [openDropdown, setOpenDropdown] = useState<"genre" | "availability" | "author" | null>(null);


    if (isLoading) {
        return (
            <div className="container p-6 mx-auto">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
                        <p className="text-gray-500">Loading books...</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <>
            <HeaderNavigation role={role}  />
            
            <div className="container mx-auto">

                {notification && (
                    <NotificationToast notification={notification} onClose={() => setNotification(null)} />
                )}

                {/* Header */}
                <div className="flex flex-col gap-6 p-6">

                    {/* Header + Search */}
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <h1 className="text-3xl font-bold text-gray-900">Books</h1>

                        <div className="relative w-full lg:max-w-xl">
                            <Search className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-4 top-1/2" />
                            <input
                                type="text"
                                placeholder="Search books by title or author..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full py-3 pl-12 pr-4 transition-colors border-2 border-gray-300 shadow-sm rounded-xl focus:outline-none focus:border-green-500"
                            />
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-col gap-4 p-5 border border-gray-200 shadow-md lg:p-6 bg-white/70 backdrop-blur-md rounded-2xl lg:flex-row lg:gap-6">

                        {/* Genre */}
                        <div className="relative flex-1">
                            <label className="mb-2 text-sm font-semibold tracking-wide text-gray-800 uppercase">Genre</label>
                            <div className="relative">
                                <button
                                    onClick={() => setOpenDropdown(openDropdown === "genre" ? null : "genre")}
                                    className="flex items-center justify-between w-full h-12 px-4 bg-white border-2 border-gray-300 shadow-sm rounded-xl focus:border-green-600 focus:ring-1 focus:ring-green-400 hover:border-green-400"
                                >
                                    {selectedGenre || "All Genres"}
                                    <span className={`ml-2 transition-transform ${openDropdown === "genre" ? "rotate-180" : ""}`}>▼</span>
                                </button>
                                {openDropdown === "genre" && (
                                    <ul className="absolute z-10 w-full mt-1 overflow-y-auto bg-white border-2 border-gray-300 shadow-lg rounded-xl max-h-60">
                                        <li
                                            className="p-2 cursor-pointer hover:bg-green-100"
                                            onClick={() => { setSelectedGenre(""); setOpenDropdown(null); }}
                                        >
                                            All Genres
                                        </li>
                                        {genres.map((genre) => (
                                            <li
                                                key={genre}
                                                className="p-2 cursor-pointer hover:bg-green-100"
                                                onClick={() => { setSelectedGenre(genre); setOpenDropdown(null); }}
                                            >
                                                {genre}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>

                        {/* Availability */}
                        <div className="relative flex-1">
                            <label className="mb-2 text-sm font-semibold tracking-wide text-gray-800 uppercase">Availability</label>
                            <div className="relative">
                                <button
                                    onClick={() => setOpenDropdown(openDropdown === "availability" ? null : "availability")}
                                    className="flex items-center justify-between w-full h-12 px-4 bg-white border-2 border-gray-300 shadow-sm rounded-xl focus:border-green-600 focus:ring-1 focus:ring-green-400 hover:border-green-400"
                                >
                                    {availabilityFilter}
                                    <span className={`ml-2 transition-transform ${openDropdown === "availability" ? "rotate-180" : ""}`}>▼</span>
                                </button>
                                {openDropdown === "availability" && (
                                    <ul className="absolute z-10 w-full mt-1 bg-white border-2 border-gray-300 shadow-lg rounded-xl">
                                        {["All", "Available", "Not Available"].map((option) => (
                                            <li
                                                key={option}
                                                className="p-2 cursor-pointer hover:bg-green-100"
                                                onClick={() => { setAvailabilityFilter(option); setOpenDropdown(null); }}
                                            >
                                                {option}
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
                                    {selectedAuthor || "All Authors"}
                                    <span className={`ml-2 transition-transform ${openDropdown === "author" ? "rotate-180" : ""}`}>▼</span>
                                </button>
                                {openDropdown === "author" && (
                                    <ul className="absolute z-10 w-full mt-1 overflow-y-auto bg-white border-2 border-gray-300 shadow-lg rounded-xl max-h-60">
                                        <li
                                            className="p-2 cursor-pointer hover:bg-green-100"
                                            onClick={() => { setSelectedAuthor(""); setOpenDropdown(null); }}
                                        >
                                            All Authors
                                        </li>
                                        {authors.map((author) => (
                                            <li
                                                key={author}
                                                className="p-2 cursor-pointer hover:bg-green-100"
                                                onClick={() => { setSelectedAuthor(author); setOpenDropdown(null); }}
                                            >
                                                {author}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>

                        {/* Clear Filters Button */}
                        <div className="flex items-end">
                            <button
                                onClick={() => {
                                    setSelectedGenre("");
                                    setAvailabilityFilter("All");
                                    setSelectedAuthor("");
                                }}
                                className="px-5 py-3 text-white transition-colors bg-green-900 shadow-md rounded-xl hover:bg-green-700"
                            >
                                Clear Filters ✕
                            </button>
                        </div>

                    </div>

                </div>




                <div className="w-full p-6 bg-gray-50 ">
                    {filteredBooks.length === 0 ? (
                        <div className="flex flex-col items-center justify-center min-h-[300px] text-center">
                            <BookOpen className="w-16 h-16 mb-4 text-gray-400" />
                            <h3 className="mb-2 text-lg font-semibold text-gray-900">
                                {searchTerm ||
                                    selectedGenre !== "All Genres" ||
                                    selectedAuthor !== "All Authors" ||
                                    availabilityFilter !== "All"
                                    ? `No results for "${searchTerm}"`
                                    : "No books found"}
                            </h3>
                            <p className="text-gray-500">
                                {searchTerm ||
                                    selectedGenre !== "All Genres" ||
                                    selectedAuthor !== "All Authors" ||
                                    availabilityFilter !== "All"
                                    ? "Try adjusting your search or filters"
                                    : "Add your first book to get started"}
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {books.map((book) => (
                                <Book key={book.id} book={book} />
                            ))}
                        </div>
                    )}
                </div>


            </div>
        </>
    )
}
