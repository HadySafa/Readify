// React
import { useEffect } from "react";

// Icons
import { BookOpen, CheckCircle, XCircle, Tag, Users, UserCheck } from "lucide-react";

// Redux
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../Store";
import { fetchStats } from "../../Store/Slices/StatsSlice";


export default function Stats( ){

    const { stats } = useSelector((state: RootState) => state.stats);

    const dispatch = useDispatch<AppDispatch>();

    useEffect ( () => {
        dispatch(fetchStats());
    },[])
    
    return(
        <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-6">
            
            {/* Total Books */}
            <div className="p-4 bg-white shadow-md rounded-2xl">
                <div className="flex items-center justify-between pb-2">
                    <h3 className="text-sm font-medium text-gray-700">Total Books</h3>
                    <BookOpen className="w-5 h-5 text-green-900" />
                </div>
                <div className="mt-2 text-2xl font-bold">{stats.totalBooks}</div>
            </div>

            {/* Available */}
            <div className="p-4 bg-white shadow-md rounded-2xl">
                <div className="flex items-center justify-between pb-2">
                    <h3 className="text-sm font-medium text-gray-700">Available</h3>
                    <CheckCircle className="w-5 h-5 text-green-700" />
                </div>
                <div className="mt-2 text-2xl font-bold text-green-700">{stats.availableBooks}</div>
            </div>

            {/* Borrowed */}
            <div className="p-4 bg-white shadow-md rounded-2xl">
                <div className="flex items-center justify-between pb-2">
                    <h3 className="text-sm font-medium text-gray-700">Borrowed</h3>
                    <XCircle className="h-5 text-red-700 w -5" />
                </div>
                <div className="mt-2 text-2xl font-bold text-red-700">{stats.borrowedBooks}</div>
            </div>

            {/* Genres */}
            <div className="p-4 bg-white shadow-md rounded-2xl">
                <div className="flex items-center justify-between pb-2">
                    <h3 className="text-sm font-medium text-gray-700">Genres</h3>
                    <Tag className="w-5 h-5 text-green-900" />
                </div>
                <div className="mt-2 text-2xl font-bold">{stats.genresCount}</div>
            </div>

            {/* Authors */}
            <div className="p-4 bg-white shadow-md rounded-2xl">
                <div className="flex items-center justify-between pb-2">
                    <h3 className="text-sm font-medium text-gray-700">Authors</h3>
                    <Users className="w-5 h-5 text-green-900" />
                </div>
                <div className="mt-2 text-2xl font-bold">{stats.totalAuthors}</div>
            </div>

            {/* Users */}
            <div className="p-4 bg-white shadow-md rounded-2xl">
                <div className="flex items-center justify-between pb-2">
                    <h3 className="text-sm font-medium text-gray-700">Users</h3>
                    <UserCheck className="w-5 h-5 text-green-900" />
                </div>
                <div className="mt-2 text-2xl font-bold">{stats.totalUsers}</div>
            </div>
            
        </div>
    )
}