import { Edit, Trash2 } from "lucide-react";
import type { Author } from "../../../Models/Author";

interface PropsType {
    author: Author,
    handleEdit: (author: Author) => void
    handleDelete: (author: Author) => void
}

export default function Author({ author, handleEdit, handleDelete }: PropsType) {


    return (

        <div
            key={author.id}
            className="h-full transition-shadow duration-200 bg-white border shadow-sm rounded-xl hover:shadow-lg"
        >

            {/* Author's Name */}
            <div className="p-4 border-b">
                <div className="flex items-start gap-4">
                    <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold leading-tight text-gray-900">
                            {author.name}
                        </h3>
                    </div>
                </div>
            </div>

            {/* Author's Bio + Actions */}
            <div className="p-4">

                <p className="mb-4 text-sm leading-relaxed text-gray-700">
                    {author.bio}
                </p>

                <div className="flex gap-2 pt-2">

                    {/* Edit button */}
                    <button
                        onClick={() => handleEdit(author)}
                        className="flex items-center justify-center flex-1 gap-1 px-3 py-2 text-sm transition border rounded-md hover:bg-gray-100"
                    >
                        <Edit className="w-4 h-4" />
                        Edit
                    </button>

                    {/* Delete button */}
                    <button
                        onClick={() => handleDelete(author)}
                        className="flex items-center justify-center flex-1 gap-1 px-3 py-2 text-sm text-red-600 transition border rounded-md hover:text-red-700 hover:bg-red-50"
                    >
                        <Trash2 className="w-4 h-4" />
                        Delete
                    </button>

                </div>

            </div>

        </div>
    )

}