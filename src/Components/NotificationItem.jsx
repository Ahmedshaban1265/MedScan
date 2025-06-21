import React from 'react';

const NotificationItem = ({
    notification,
    onMarkAsRead,
    onDelete,
    showActions = true,
    compact = false
}) => {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMinutes = Math.floor((now - date) / (1000 * 60));

        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hour${Math.floor(diffInMinutes / 60) > 1 ? 's' : ''} ago`;
        return `${Math.floor(diffInMinutes / 1440)} day${Math.floor(diffInMinutes / 1440) > 1 ? 's' : ''} ago`;
    };

    const handleMarkAsRead = (e) => {
        e.stopPropagation();
        onMarkAsRead(notification.id);
    };

    const handleDelete = (e) => {
        e.stopPropagation();
        onDelete(notification.id);
    };

    return (
        <div
            className={`
        ${compact ? 'p-3' : 'p-4'} 
        border-b border-gray-100 
        ${!notification.isRead ? 'bg-blue-50 border-l-4 border-l-Primary' : 'bg-white'} 
        hover:bg-gray-50 transition-colors duration-200
        ${compact ? 'cursor-pointer' : ''}
      `}
        >
            <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                    {/* Title */}
                    <div className="flex items-center gap-2 mb-1">
                        <h4 className={`
              ${compact ? 'text-sm' : 'text-base'} 
              font-semibold text-gray-900 
              ${!notification.isRead ? 'font-bold' : ''}
            `}>
                            {notification.title}
                        </h4>
                        {!notification.isRead && (
                            <span className="w-2 h-2 bg-Primary rounded-full flex-shrink-0"></span>
                        )}
                    </div>

                    {/* Body */}
                    <p className={`
            ${compact ? 'text-xs' : 'text-sm'} 
            text-gray-600 
            ${compact ? 'line-clamp-2' : 'line-clamp-3'}
          `}>
                        {notification.body}
                    </p>

                    {/* Time */}
                    <p className={`
            ${compact ? 'text-xs' : 'text-sm'} 
            text-gray-400 
            ${compact ? 'mt-1' : 'mt-2'}
          `}>
                        {formatDate(notification.createdAt)}
                    </p>
                </div>

                {/* Actions */}
                {showActions && (
                    <div className="flex items-center gap-2 ml-3">
                        {!notification.isRead && (
                            <button
                                onClick={handleMarkAsRead}
                                className="text-Primary hover:text-Primary-dark text-sm font-medium transition-colors duration-200"
                                title="Mark as read"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </button>
                        )}

                        <button
                            onClick={handleDelete}
                            className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors duration-200"
                            title="Delete"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationItem;

