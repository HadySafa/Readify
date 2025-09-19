interface PropsType {
  message: string;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteConfirmationModal({ message, onClose, onConfirm}: PropsType) {
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-sm p-6 bg-white border rounded-lg shadow-lg">
        <h4 className="mb-2 text-lg font-semibold">Delete Confirmation</h4>
        <p className="mb-4 text-sm text-gray-600">
          {message}? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-100"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 text-sm text-white bg-red-600 rounded-md hover:bg-red-700"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
  
}
