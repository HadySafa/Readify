// React
import { useState, useEffect } from "react";
import type { Dispatch, SetStateAction } from "react";

// Icons
import { Tag, Plus, Trash2 } from "lucide-react";

// Types
import type { Notification } from "../../../Models/Notification";
import type { Genre } from "../../../Models/Genre";

// Components
import NotificationToast from "../../NotificationToast";

// Libraries
import axios from "axios";

// Redux
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../../Store";
import { fetchGenres, clearGenreState } from "../../../Store/Slices/GenreSlice";

interface ManageGenresProps {
    setIsGenresModalOpen: Dispatch<SetStateAction<boolean>>;
}

export default function ManageGenres({ setIsGenresModalOpen }: ManageGenresProps) {

    // Get token
    const token = useSelector((state: RootState) => state.auth.token)

    // Get genres + states
    const { genres, loading, error } = useSelector((state: RootState) => state.genre);
    
    const dispatch = useDispatch<AppDispatch>();
    
    const [openForm, setOpenForm] = useState<boolean>(false)
    const [genreFormData, setGenreFormData] = useState<{ name: string }>({ name: "" })
    const [notification, setNotification] = useState<Notification | null>(null)

    function resetGenreForm() {
        setGenreFormData({ name: "" })
    }

    function addNotification(message: string, type: "success" | "error"): void {
        setNotification({ message, type })
        setTimeout(() => {
            setNotification(null)
        }, 3000)
    }
    
    // Actions handlers
    async function handleAddGenre() {

        if (!genreFormData.name.trim()) return

        const url = "http://localhost:5067/api/genres";
        try {
            await axios.post(
                url,
                { name: genreFormData.name },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            addNotification("Genre added successfully.", "success")
            dispatch(fetchGenres());
            resetGenreForm()
            setOpenForm(false)
        }
        catch (error: unknown) {
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
    async function handleDeleteGenre(genre: Genre) {

        const url = "http://localhost:5067/api/genres/" + genre.id;
        try {
            await axios.delete(
                url,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            addNotification("Genre deleted successfully.", "success")
            dispatch(fetchGenres());
        }
        catch (error: unknown) {
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

    useEffect(() => {
        dispatch(fetchGenres());
    }, [])

    useEffect(() => { if (!loading && error) { addNotification(error, "error"); dispatch(clearGenreState()) } }, [error, loading])

    return (


        <div className="p-4">

            {notification && (
                <NotificationToast notification={notification} onClose={() => setNotification(null)} />
            )}

            {/* Dialog */}

            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

                <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[80vh] flex flex-col">

                    {/* Modal Header */}
                    <div className="flex items-center justify-between p-4 border-b">

                        <h2 className="flex items-center gap-2 text-lg font-semibold">
                            <Tag className="w-5 h-5" /> Manage Genres
                        </h2>

                        <button onClick={() => setIsGenresModalOpen(false)} className="text-gray-500 hover:text-black">
                            ✕
                        </button>

                    </div>

                    {/* Modal Content */}
                    <div className="flex-1 p-4 space-y-4 overflow-y-auto">

                        {/* Add Genre Form */}
                        <div className="p-4 border rounded-lg bg-gray-50">

                            <h3 className="mb-3 font-medium">
                                Add New Genre
                            </h3>

                            {
                                openForm && (

                                    // Form
                                    <div className="space-y-3">

                                        {/* Genre name */}
                                        <div>
                                            <input
                                                id="genre-name"
                                                value={genreFormData.name}
                                                onChange={(e) => setGenreFormData({ name: e.target.value })}
                                                placeholder="Enter genre name"
                                                autoFocus={true}
                                                className="w-full px-3 py-2 mt-1 border rounded "
                                            />
                                        </div>

                                        {/* Action buttons */}
                                        <div className="flex gap-2">
                                            <button
                                                onClick={handleAddGenre}
                                                className="px-3 py-1 text-white bg-green-900 rounded hover:bg-green-700"
                                            >
                                                Add Genre
                                            </button>
                                            <button
                                                onClick={resetGenreForm}
                                                className="px-3 py-1 border rounded hover:bg-gray-100"
                                            >
                                                Cancel
                                            </button>
                                        </div>

                                    </div>

                                )
                            }

                            {
                                // Control Form Visibility
                                !openForm && (
                                    <button
                                        onClick={() => setOpenForm(true)}
                                        className="flex items-center gap-2 px-3 py-1 text-white bg-green-900 rounded hover:bg-green-700"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Add New Genre
                                    </button>
                                )
                            }

                        </div>

                        {/* Genres List */}
                        <div className="border rounded-lg">

                            <div className="p-4 border-b bg-gray-50">
                                <h3 className="font-medium">All Genres ({genres.length})</h3>
                            </div>

                            <div className="overflow-y-auto divide-y max-h-64">

                                {
                                    loading
                                        ? <div className="flex items-center justify-center"><div className="w-10 h-10 border-4 border-t-4 border-t-[#15803D] border-gray-200 rounded-full animate-spin" ></div></div>
                                        : genres.length === 0 ? (
                                            <div className="p-8 text-center text-gray-500">
                                                <Tag className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                                <p>No genres found</p>
                                                <p className="text-sm">Add your first genre to get started</p>
                                            </div>
                                        ) : (
                                            genres.map((genre) => (
                                                <div
                                                    key={genre.id}
                                                    className="flex items-center justify-between p-3 hover:bg-gray-50"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full">
                                                            <Tag className="w-4 h-4 text-green-700" />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium">{genre.name}</p>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <button
                                                            onClick={() => handleDeleteGenre(genre)}
                                                            className="flex items-center justify-center w-8 h-8 text-red-600 border rounded hover:bg-red-50"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))
                                        )
                                }

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    )
}
