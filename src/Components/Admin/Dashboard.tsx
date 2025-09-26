// React
import { useEffect, useState } from "react";

// Icons
import { BookOpen, Users, UserCheck, Search } from "lucide-react";

// Components
import Stats from "./Stats";
import AuthorsContainer from "./Authors/AuthorsContainer";
import UsersTable from "./Users/UsersTable";
import { BooksContainer } from "./Books/BooksContainer";
import ManageGenres from "./Genres/ManageGenres";

// Redux
import { useSelector } from "react-redux";
import type { RootState } from "../../Store";

// Router
import { useNavigate } from "react-router-dom";
import { HeaderNavigation } from "../Header";

interface Tabs {
    name: "books" | "authors" | "users";
}

export default function Dashboard() {

    const navigate = useNavigate()

    // Get role + protect the page
    const role = useSelector((state: RootState) => state.auth.role)
    useEffect(() => {
        if (role !== 'admin') { navigate("/") }
    },[])

    const [activeTab, setActiveTab] = useState<Tabs>({ name: "books" });
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [isGenresModalOpen, setIsGenresModalOpen] = useState(false);

    return (

        <>
            <HeaderNavigation role="admin" active="Dashboard" />
            <div className="min-h-screen p-4 bg-gray-50 sm:p-6 lg:p-8">

                {/* Top Section (Stats + Tabs + Search) */}
                <div className="p-6 space-y-6 bg-white shadow-md rounded-2xl">

                    {/* Stats */}
                    <Stats />

                    {/* Tabs + Search */}
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                        {/* Tabs */}
                        <div className="flex justify-center w-full max-w-lg p-2 border border-gray-200 shadow-sm bg-gray-50 rounded-2xl">
                            <div className="grid w-full grid-cols-3 gap-2">
                                {[
                                    { name: "books", icon: BookOpen, label: "Books" },
                                    { name: "authors", icon: Users, label: "Authors" },
                                    { name: "users", icon: UserCheck, label: "Users" },
                                ].map((tab) => (
                                    <button
                                        key={tab.name}
                                        onClick={() => setActiveTab({ name: tab.name as Tabs["name"] })}
                                        className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${activeTab.name === tab.name
                                            ? "bg-green-700 text-white shadow hover:bg-green-900"
                                            : "hover:bg-green-100 text-gray-700"
                                            }`}
                                    >
                                        <tab.icon className="w-4 h-4" />
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Search Bar */}
                        <div className="relative flex-1 w-full max-w-2xl">
                            <Search className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                            <input
                                autoFocus
                                type="text"
                                placeholder={
                                    activeTab.name === "books"
                                        ? "Search books by title..."
                                        : activeTab.name === "authors"
                                            ? "Search authors by name..."
                                            : "Search users by name..."
                                }
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full h-12 pl-10 text-base transition-all duration-300 ease-in-out bg-white border border-gray-300 rounded-2xl focus:outline-none focus:border-green-900 focus:ring-4 focus:ring-green-200 focus:shadow-lg"
                            />
                        </div>

                    </div>

                </div>


                {/* Content Section */}
                <div className="p-6 mt-8 bg-gray-100 shadow-inner rounded-2xl">
                    {activeTab.name === "authors" ? (
                        <AuthorsContainer searchTerm={searchTerm} />
                    ) : activeTab.name === "users" ? (
                        <UsersTable searchTerm={searchTerm} />
                    ) : activeTab.name === "books" ? (
                        <BooksContainer searchTerm={searchTerm} />
                    ) : (
                        <div>null</div>
                    )}
                </div>

                {/* Genres Modal */}
                {isGenresModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
                        <ManageGenres setIsGenresModalOpen={setIsGenresModalOpen} />
                    </div>
                )}

            </div>
        </>

    );

}
