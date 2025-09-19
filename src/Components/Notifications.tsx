"use client"

import { useState } from "react"
import { Bell, Check, Info, AlertTriangle, CheckCircle, X } from "lucide-react"

interface Notification {
  id: string
  title: string
  message: string
  timestamp: string
  isRead: boolean
  type: "info" | "success" | "warning"
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "Welcome to the platform!",
    message: "Your account has been successfully created. Start exploring our features.",
    timestamp: "2 minutes ago",
    isRead: false,
    type: "success",
  },
  {
    id: "2",
    title: "New message received",
    message: "You have a new message from John Doe. Click to view details.",
    timestamp: "1 hour ago",
    isRead: false,
    type: "info",
  },
  {
    id: "3",
    title: "Payment reminder",
    message: "Your subscription will expire in 3 days. Please update your payment method.",
    timestamp: "2 hours ago",
    isRead: true,
    type: "warning",
  },
]

const getNotificationIcon = (type: Notification["type"]) => {
  switch (type) {
    case "success":
      return <CheckCircle className="w-5 h-5 text-green-500" />
    case "warning":
      return <AlertTriangle className="w-5 h-5 text-yellow-500" />
    case "info":
    default:
      return <Info className="w-5 h-5 text-blue-500" />
  }
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)

  const unreadCount = notifications.filter((n) => !n.isRead).length

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
  }

  const toggleNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: !n.isRead } : n)),
    )
  }

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl px-4 py-8 mx-auto">
        {/* Header */}
        <div className="flex flex-col items-start justify-between gap-4 mb-8 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Bell className="w-8 h-8 text-gray-800" />
              {unreadCount > 0 && (
                <span className="absolute flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-red-500 rounded-full -right-2 -top-2">
                  {unreadCount}
                </span>
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
              <p className="text-gray-500">
                {unreadCount > 0 ? `${unreadCount} unread notifications` : "All caught up!"}
              </p>
            </div>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-md hover:bg-gray-100 transition"
            >
              <Check className="w-4 h-4" />
              Mark all as read
            </button>
          )}
        </div>

        {/* Notifications List */}
        {notifications.length === 0 ? (
          <div className="p-12 text-center bg-white border rounded-lg">
            <Bell className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="mb-2 text-lg font-semibold text-gray-900">No notifications</h3>
            <p className="text-gray-500">You're all caught up! Check back later for updates.</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`p-4 border rounded-md flex flex-col transition-shadow hover:shadow-md cursor-pointer ${
                  !n.isRead ? "bg-blue-50 border-l-4 border-blue-500" : "bg-white border-gray-200"
                }`}
                onClick={() => toggleNotificationRead(n.id)}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">{getNotificationIcon(n.type)}</div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3
                        className={`font-semibold text-sm leading-tight ${
                          !n.isRead ? "text-gray-900" : "text-gray-500"
                        }`}
                      >
                        {n.title}
                      </h3>

                      <div className="flex items-center flex-shrink-0 gap-2">
                        <span className="text-xs text-gray-400">{n.timestamp}</span>
                        <button
                          className="w-6 h-6 p-0 text-gray-400 hover:text-gray-600"
                          onClick={(e) => {
                            e.stopPropagation()
                            removeNotification(n.id)
                          }}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    <p className={`text-sm mt-1 leading-relaxed ${!n.isRead ? "text-gray-800" : "text-gray-400"}`}>
                      {n.message}
                    </p>

                    <div className="flex items-center justify-between mt-3">
                      {!n.isRead && (
                        <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-600 bg-blue-100 rounded-full">
                          New
                        </span>
                      )}

                      <button
                        className="text-xs text-gray-600 hover:text-gray-900"
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleNotificationRead(n.id)
                        }}
                      >
                        {n.isRead ? "Mark as unread" : "Mark as read"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
