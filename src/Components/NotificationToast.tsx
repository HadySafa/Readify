import type { Notification } from "../Models/Notification"

interface propsType {
  notification: Notification
  onClose: () => void
}

export default function NotificationToast({ notification, onClose }: propsType) {
  return (
    <div
      className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-[55] ${notification.type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"}`}
    >
      <div className="flex items-center justify-between gap-2">
        <span>{notification.message}</span>
        <button onClick={onClose} className="text-white hover:text-gray-200">
          ×
        </button>
      </div>
    </div>
  )
} 