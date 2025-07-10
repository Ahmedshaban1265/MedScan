const API_BASE_URL = 'https://medscanapi.runasp.net/api';

const getAuthToken = () => {
  return localStorage.getItem('token') || localStorage.getItem('authToken');
};

const createHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

export const notificationService = {
  async getNotifications() {
    try {
      const response = await fetch(`${API_BASE_URL}/Notification`, {
        method: 'GET',
        headers: createHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  },

  async markAsRead(notificationId) {
    try {
      const response = await fetch(`${API_BASE_URL}/Notification/${notificationId}/mark-as-read`, {
        method: 'PUT',
        headers: createHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return true;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },

  async markAllAsRead() {
    try {
      const response = await fetch(`${API_BASE_URL}/Notification/mark-all-as-read`, {
        method: 'PUT',
        headers: createHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return true;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  },

  async deleteNotification(notificationId) {
    try {
      const response = await fetch(`${API_BASE_URL}/Notification/${notificationId}`, {
        method: 'DELETE',
        headers: createHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return true;
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  }
};

export default notificationService;

