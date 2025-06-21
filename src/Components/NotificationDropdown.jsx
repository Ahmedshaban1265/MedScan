import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import NotificationItem from './NotificationItem';
import { notificationService } from '../services/notificationService';

const NotificationDropdown = ({ isOpen, onClose, onNotificationUpdate }) => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    // Fetch notifications when dropdown opens
    useEffect(() => {
        if (isOpen) {
            fetchNotifications();
        }
    }, [isOpen]);

    const fetchNotifications = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await notificationService.getNotifications();
            setNotifications(data || []);
            onNotificationUpdate(data || []);
        } catch (err) {
            setError('Failed to load notifications');
            console.error('Error fetching notifications:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsRead = async (notificationId) => {
        try {
            await notificationService.markAsRead(notificationId);
            setNotifications(prev => {
                const updated = prev.map(notif =>
                    notif.id === notificationId
                        ? { ...notif, isRead: true }
                        : notif
                );
                onNotificationUpdate(updated);
                return updated;
            });
        } catch (err) {
            console.error('Error marking notification as read:', err);
        }
    };

    const handleDelete = async (notificationId) => {
        try {
            await notificationService.deleteNotification(notificationId);
            const updatedNotifications = notifications.filter(notif => notif.id !== notificationId);
            setNotifications(updatedNotifications);
            onNotificationUpdate(updatedNotifications);
        } catch (err) {
            console.error('Error deleting notification:', err);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await notificationService.markAllAsRead();
            const updatedNotifications = notifications.map(notif => ({ ...notif, isRead: true }));
            setNotifications(updatedNotifications);
            onNotificationUpdate(updatedNotifications);
        } catch (err) {
            console.error('Error marking all notifications as read:', err);
        }
    };

    if (!isOpen) return null;

    const unreadCount = notifications.filter(notif => !notif.isRead).length;
    const displayNotifications = notifications.slice(0, 5); // Show only first 5 notifications

    return (
        <div
            ref={dropdownRef}
            className="absolute top-full right-0 mt-2 w-full max-w-sm sm:w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-hidden"
        >
            {/* Header */}
            <div className="p-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                    {unreadCount > 0 && (
                        <button
                            onClick={handleMarkAllAsRead}
                            className="text-sm text-Primary hover:text-Primary-dark font-medium transition-colors duration-200"
                        >
                            Mark all as read
                        </button>
                    )}
                </div>
                {unreadCount > 0 && (
                    <p className="text-sm text-gray-600 mt-1">
                        You have {unreadCount} unread notification{unreadCount > 1 ? 's' : ''}
                    </p>
                )}
            </div>

            {/* Content */}
            <div className="max-h-80 overflow-y-auto">
                {loading ? (
                    <div className="p-8 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-Primary mx-auto"></div>
                        <p className="text-gray-600 mt-2">Loading...</p>
                    </div>
                ) : error ? (
                    <div className="p-8 text-center">
                        <p className="text-red-600">{error}</p>
                        <button
                            onClick={fetchNotifications}
                            className="mt-2 text-Primary hover:text-Primary-dark font-medium"
                        >
                            Try again
                        </button>
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="p-8 text-center">
                        <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                        <p className="text-gray-600">No notifications</p>
                    </div>
                ) : (
                    <div>
                        {displayNotifications.map((notification) => (
                            <NotificationItem
                                key={notification.id}
                                notification={notification}
                                onMarkAsRead={handleMarkAsRead}
                                onDelete={handleDelete}
                                compact={true}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
                <div className="p-3 border-t border-gray-200 bg-gray-50">
                    <Link
                        to="/notifications"
                        onClick={onClose}
                        className="block w-full text-center text-Primary hover:text-Primary-dark font-medium py-2 rounded-md hover:bg-Primary hover:bg-opacity-10 transition-colors duration-200"
                    >
                        View all notifications
                    </Link>
                </div>
            )}
        </div>
    );
};

export default NotificationDropdown;

