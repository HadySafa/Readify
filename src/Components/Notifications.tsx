"use client"

import { useState } from "react"
import { Bell, Check, Info, AlertTriangle, CheckCircle, X, Clock, Megaphone } from "lucide-react"

import { HeaderNavigation } from "./Header"

import NotificationToast from "./NotificationToast"

import axios from "axios"

import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

import type { Notification } from "../Models/Notification(2)"

import type { Notification as NotificationToastType } from "../Models/Notification"

// Redux
import { useSelector } from "react-redux";
import type { RootState } from "../Store";


export default function NotificationsPage() {

  const token = useSelector((state: RootState) => state.auth.token)

  const navigate = useNavigate()

  const role = useSelector((state: RootState) => state.auth.role)
  useEffect(() => {
    if (!role) { navigate("/") }
  }, [])

  const [notifications, setNotifications] = useState<Notification[]>([])
  const [notification, setNotification] = useState<NotificationToastType | null>(null)
  const [unreadCount, setUnreadCount] = useState<number>(-1)

  function addNotification(message: string, type: "success" | "error"): void {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification(null)
    }, 3000)
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "alert":
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />
      case "announcement":
        return <Megaphone className="w-5 h-5 text-purple-500" />
      case "reminder":
        return <Clock className="w-5 h-5 text-blue-500" />
      default:
        return <Info className="w-5 h-5 text-gray-500" />
    }

  }

  // Get Notifications
  async function fetchNotifications() {

    const url = "http://localhost:5067/api/notifications"

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setNotifications(response.data.notifications)
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
  }

  // Mark notification as read
  async function readNotification(id: number) {

    const url = "http://localhost:5067/api/notifications/" + id

    try {
      await axios.post(url, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      fetchNotifications()
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
    }
  }

  // Delete Notification
  async function removeNotification(id: number) {

    const url = "http://localhost:5067/api/notifications/" + id

    try {
      const response = await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      addNotification('Notification removed successfully.', 'success');
      fetchNotifications()
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
            }
          }
        } else if (error.request) {
          addNotification("Unable to reach the server. Please try again.", "error")
        }
      }
    }
  }

  // format date
  const formatDate = (dateString: string) => {

    const utcString = dateString.split("+")[0] + "Z"
    const date = new Date(utcString)
    const formatted = date.toLocaleString("en-US", {
      day: "2-digit",
      month: "short",
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    });
    return formatted;
  };

  useEffect(() => { fetchNotifications() }, [])
  // Calculate the number of unread notifications 
  useEffect(() => {
    const count = notifications.filter(obj => !obj.isRead).length;
    setUnreadCount(count);
  }, [notifications])

  return (

    <>

      <HeaderNavigation role={role} active="Notifications" />

      {notification && (
        <NotificationToast notification={notification} onClose={() => setNotification(null)} />
      )}

      <div className="min-h-screen bg-gray-50">

        <div className="max-w-4xl px-4 py-8 mx-auto">

          {/* Header */}
          <div className="flex items-center gap-3 mb-8">

            {/* Bell icon & count */}
            <div className="relative">
              <Bell className="w-8 h-8 text-green-900" />
              {
                unreadCount > 0 && (
                  <span className="absolute flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-red-500 rounded-full -right-2 -top-2">
                    {unreadCount}
                  </span>
                )
              }
            </div>

            {/* Notifications & text under it */}
            <div>
              <h1 className="text-3xl font-bold text-green-900">Notifications</h1>
              <p className="text-gray-500">
                {unreadCount > 0 ? `${unreadCount} unread notifications` : "All caught up!"}
              </p>
            </div>

          </div>

          {/* Notifications List */}
          {
            notifications.length === 0
              ? // All caught up!
              (
                <div className="p-12 text-center bg-white border rounded-lg">
                  <Bell className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="mb-2 text-lg font-semibold text-gray-900">No notifications</h3>
                  <p className="text-gray-500">You're all caught up! Check back later for updates.</p>
                </div>
              )
              : // Notifications exists
              (
                <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                  {
                    notifications.map((n) => (

                      <div
                        key={n.id}
                        className={`p-4 border rounded-md flex flex-col transition-shadow hover:shadow-md cursor-default ${!n.is_read ? "bg-green-50 border-l-4 border-green-600" : "bg-white border-gray-200"}`}
                      >

                        <div className="flex items-start gap-4">

                          {/* Icon */}
                          <div className="flex-shrink-0 mt-1">{getNotificationIcon(n.type)}</div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">

                            <div className="flex items-start justify-between gap-2">

                              {/* Title */}
                              <h3 className={`font-semibold text-sm leading-tight text-gray-900"`}>
                                {n.type.toUpperCase()}
                              </h3>

                              {/* Timestamp + Remove button */}
                              <div className="flex items-center flex-shrink-0 gap-2">

                                <span className="text-xs text-gray-500">{formatDate(n.created_at)}</span>

                                <button
                                  className="w-6 h-6 p-0 text-gray-500 hover:text-gray-900"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    removeNotification(n.id)
                                  }}
                                >
                                  <X className="w-4 h-4" />
                                </button>

                              </div>

                            </div>

                            {/* Message */}
                            <p className={`text-sm mt-1 leading-relaxed text-gray-800`}>
                              {n.message}
                            </p>

                            {/* Mark as read */}
                            {
                              !n.is_read && (
                                <div className="flex items-center justify-end pr-3 mt-3">
                                  <button
                                    className="text-xs text-gray-600 hover:text-gray-900"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      readNotification(n.id)
                                    }}
                                  >
                                    Mark as read
                                  </button>
                                </div>
                              )
                            }

                          </div>

                        </div>

                      </div>
                    ))
                  }
                </div>
              )
          }

        </div>

      </div>

    </>
  )

}
