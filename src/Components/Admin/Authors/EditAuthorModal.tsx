// React
import { useState } from "react";

// External libraries
import axios from "axios";
import { Pen } from "lucide-react";

// Redux (hooks + slice methods + types)
import { fetchAuthors } from "../../../Store/Slices/AuthorSlice";
import type { RootState, AppDispatch } from "../../../Store";
import { useSelector, useDispatch } from "react-redux";

// Components
import NotificationToast from "../../NotificationToast";

// Types
import type { Author } from "../../../Models/Author";

// Router
import { useNavigate } from "react-router-dom";


type EditAuthorModalProps = {
    authorToEdit: Author | null;
    setShowEditAuthorForm: React.Dispatch<React.SetStateAction<boolean>>;
};


export default function EditAuthorModal({ setShowEditAuthorForm, authorToEdit }: EditAuthorModalProps) {

    // Get token
    const token = useSelector((state: RootState) => state.auth.token)

    const dispatch = useDispatch<AppDispatch>();

    const navigate = useNavigate();

    const [formData, setFormData] = useState<Author | null>(authorToEdit);
    const [notification, setNotification] = useState<Notification | null>(null)

    function addNotification(message: string, type: "success" | "error"): void {
        setNotification({ message, type })
        setTimeout(() => {
            setNotification(null)
        }, 3000)
    }

    // Actions handlers
    async function handleConfirm() {

        if (!formData?.name.trim() || !formData.bio.trim()) return

        const url = "http://localhost:5067/api/authors";
        
        try {
            await axios.put(
                url,
                { id: formData.id, name: formData.name, bio: formData.bio },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            addNotification("Author updated successfully", "success")
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
        setFormData(null)
        dispatch(fetchAuthors());
        setTimeout(() => setShowEditAuthorForm(false), 3000)
    };
    function handleCancel() {
        setShowEditAuthorForm(false);
    };

    return (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">

            {notification && (
                <NotificationToast notification={notification} onClose={() => setNotification(null)} />
            )}

            <div className="w-full max-w-2xl p-6 bg-white shadow-md rounded-2xl">

                {/* Modal Header */}
                <div className="pb-2 text-center border-b border-gray-200">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <Pen className="w-8 h-8 text-green-900" />
                        <h1 className="text-2xl font-bold text-green-900">Edit Author</h1>
                    </div>
                </div>

                {/* Form */}
                <form className="mt-4 space-y-4">
                    <div>
                        <label htmlFor="author-name" className="block text-sm font-medium text-gray-700">
                            Name 
                        </label>
                        <input
                            id="author-name"
                            autoFocus={true}
                            type="text"
                            value={formData?.name}
                            onChange={(e) => setFormData({ ...formData!, name: e.target.value })}
                            placeholder="Enter author name"
                            className="w-full p-2 mt-1 border border-gray-300 rounded-lg"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="author-bio" className="block text-sm font-medium text-gray-700">
                            Bio 
                        </label>
                        <textarea
                            id="author-bio"
                            value={formData?.bio}
                            onChange={(e) => setFormData({ ...formData!, bio: e.target.value })}
                            placeholder="Enter author biography"
                            rows={4}
                            className="w-full p-2 mt-1 border border-gray-300 rounded-lg"
                            required
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-2 mt-6">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="px-4 py-2 bg-gray-200 border rounded-lg hover:bg-gray-300"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleConfirm}
                            className="px-4 py-2 text-white bg-green-900 rounded-lg hover:bg-green-700"
                        >
                            Update Author
                        </button>
                    </div>
                    
                </form>

            </div>
            
        </div>

    );

}
