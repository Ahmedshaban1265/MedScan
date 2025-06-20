import React, { useState, useEffect } from 'react';
import { useAuth } from '../Auth/AuthProvider';
import { Link, useNavigate } from 'react-router-dom';

const AllAppointments = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [appointments, setAppointments] = useState([]);
    const [filteredAppointments, setFilteredAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [dateFilter, setDateFilter] = useState('all');
    const [updatingAppointments, setUpdatingAppointments] = useState(new Set());

    // Status mapping for API
    const statusMap = {
        'Pending': 0,
        'Confirmed': 1,
        'Completed': 2
    };

    const statusNames = {
        0: 'Pending',
        1: 'Confirmed',
        2: 'Completed'
    };

    // Fetch all appointments
    const fetchAppointments = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            if (!token) {
                setError('No authentication token found');
                setLoading(false);
                return;
            }

            const response = await fetch('https://medscanapi.runasp.net/api/Appointment', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                setAppointments(data);
                setFilteredAppointments(data);
                setError('');
            } else {
                const errorText = await response.text();
                setError(`Failed to fetch appointments: ${errorText}`);
            }
        } catch (err) {
            setError('Network error. Please check your connection.');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    // Update appointment status with improved feedback
    const updateAppointmentStatus = async (appointmentId, statusText) => {
        const status = statusMap[statusText];
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Authentication token not found. Please login again.');
            return;
        }

        // Add to updating set
        setUpdatingAppointments(prev => new Set(prev).add(appointmentId));

        try {
            const response = await fetch(`https://medscanapi.runasp.net/api/Appointment/${appointmentId}/status`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status })
            });

            if (response.ok) {
                // Immediately update local state
                const updateAppointmentInList = (appointments) => 
                    appointments.map(apt => 
                        apt.id === appointmentId 
                            ? { ...apt, status: status }
                            : apt
                    );

                setAppointments(prev => updateAppointmentInList(prev));
                setFilteredAppointments(prev => updateAppointmentInList(prev));

                // Show success message
                alert(`Appointment ${statusText.toLowerCase()} successfully!`);
            } else {
                const errText = await response.text();
                console.error('Error response:', errText);
                alert(`Failed to update appointment status: ${errText}`);
            }
        } catch (err) {
            console.error('Error updating appointment status:', err);
            alert('Network error. Please check your connection and try again.');
        } finally {
            // Remove from updating set
            setUpdatingAppointments(prev => {
                const newSet = new Set(prev);
                newSet.delete(appointmentId);
                return newSet;
            });
        }
    };

    // Delete appointment
    const deleteAppointment = async (appointmentId) => {
        if (!window.confirm('Are you sure you want to delete this appointment?')) {
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            alert('Authentication token not found. Please login again.');
            return;
        }

        setUpdatingAppointments(prev => new Set(prev).add(appointmentId));

        try {
            const response = await fetch(`https://medscanapi.runasp.net/api/Appointment/${appointmentId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                // Remove from local state
                setAppointments(prev => prev.filter(apt => apt.id !== appointmentId));
                setFilteredAppointments(prev => prev.filter(apt => apt.id !== appointmentId));
                alert('Appointment deleted successfully!');
            } else {
                const errText = await response.text();
                console.error('Error response:', errText);
                alert(`Failed to delete appointment: ${errText}`);
            }
        } catch (err) {
            console.error('Error deleting appointment:', err);
            alert('Network error. Please check your connection and try again.');
        } finally {
            setUpdatingAppointments(prev => {
                const newSet = new Set(prev);
                newSet.delete(appointmentId);
                return newSet;
            });
        }
    };

    // Filter appointments based on search and filters
    useEffect(() => {
        let filtered = appointments;

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(apt => 
                (apt.patient?.firstName?.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (apt.patient?.lastName?.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (apt.patient?.email?.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (apt.appointmentType?.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        // Status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter(apt => statusNames[apt.status] === statusFilter);
        }

        // Date filter
        if (dateFilter !== 'all') {
            const today = new Date();
            const tomorrow = new Date(today);
            tomorrow.setDate(today.getDate() + 1);
            const nextWeek = new Date(today);
            nextWeek.setDate(today.getDate() + 7);

            filtered = filtered.filter(apt => {
                const aptDate = new Date(apt.appointmentDate);
                switch (dateFilter) {
                    case 'today':
                        return aptDate.toDateString() === today.toDateString();
                    case 'tomorrow':
                        return aptDate.toDateString() === tomorrow.toDateString();
                    case 'week':
                        return aptDate >= today && aptDate <= nextWeek;
                    case 'past':
                        return aptDate < today;
                    default:
                        return true;
                }
            });
        }

        setFilteredAppointments(filtered);
    }, [appointments, searchTerm, statusFilter, dateFilter]);

    useEffect(() => {
        fetchAppointments();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-lg text-gray-600">Loading appointments...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">All Appointments</h1>
                            <p className="text-gray-600 mt-1">Manage all patient appointments</p>
                        </div>
                        <div className="flex gap-4">
                            <Link
                                to="/doctor-dashboard"
                                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                            >
                                ← Back to Dashboard
                            </Link>
                            <button
                                onClick={fetchAppointments}
                                className="px-4 py-2 bg-Primary text-white rounded-lg hover:bg-Primary-dark transition-colors"
                            >
                                Refresh
                            </button>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                    </div>
                )}

                {/* Filters */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Search */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Search Patients
                            </label>
                            <input
                                type="text"
                                placeholder="Search by name, email, or appointment type..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-Primary"
                            />
                        </div>

                        {/* Status Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Status
                            </label>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-Primary"
                            >
                                <option value="all">All Statuses</option>
                                <option value="Pending">Pending</option>
                                <option value="Confirmed">Confirmed</option>
                                <option value="Completed">Completed</option>
                            </select>
                        </div>

                        {/* Date Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Date
                            </label>
                            <select
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-Primary"
                            >
                                <option value="all">All Dates</option>
                                <option value="today">Today</option>
                                <option value="tomorrow">Tomorrow</option>
                                <option value="week">This Week</option>
                                <option value="past">Past Appointments</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Results Summary */}
                <div className="mb-6">
                    <p className="text-gray-600">
                        Showing {filteredAppointments.length} of {appointments.length} appointments
                    </p>
                </div>

                {/* Appointments List */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    {filteredAppointments.length === 0 ? (
                        <div className="text-center py-12">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No appointments found</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                {searchTerm || statusFilter !== 'all' || dateFilter !== 'all' 
                                    ? 'Try adjusting your filters' 
                                    : 'No appointments have been scheduled yet'}
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Patient
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Date & Time
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Type
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredAppointments.map((appointment) => {
                                        const isUpdating = updatingAppointments.has(appointment.id);
                                        const currentStatus = statusNames[appointment.status];
                                        
                                        return (
                                            <tr key={appointment.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10">
                                                            <div className="h-10 w-10 rounded-full bg-Primary text-white flex items-center justify-center font-semibold">
                                                                {appointment.patient?.firstName?.charAt(0) || 'P'}
                                                            </div>
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {appointment.patient?.firstName} {appointment.patient?.lastName}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                {appointment.patient?.email}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">
                                                        {new Date(appointment.appointmentDate).toLocaleDateString()}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {new Date(appointment.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {appointment.appointmentType || 'Routine Checkup'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                        currentStatus === 'Confirmed' ? 'bg-green-100 text-green-800' :
                                                        currentStatus === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                                        currentStatus === 'Completed' ? 'bg-blue-100 text-blue-800' :
                                                        'bg-gray-100 text-gray-800'
                                                    }`}>
                                                        {currentStatus || 'Unknown'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex space-x-2">
                                                        {currentStatus !== 'Confirmed' && (
                                                            <button
                                                                onClick={() => updateAppointmentStatus(appointment.id, 'Confirmed')}
                                                                disabled={isUpdating}
                                                                className={`px-2 py-1 rounded transition-colors ${
                                                                    isUpdating 
                                                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                                                                        : 'text-green-600 hover:text-green-900 bg-green-100 hover:bg-green-200'
                                                                }`}
                                                            >
                                                                {isUpdating ? 'Updating...' : 'Confirm'}
                                                            </button>
                                                        )}
                                                        {currentStatus !== 'Completed' && (
                                                            <button
                                                                onClick={() => updateAppointmentStatus(appointment.id, 'Completed')}
                                                                disabled={isUpdating}
                                                                className={`px-2 py-1 rounded transition-colors ${
                                                                    isUpdating 
                                                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                                                                        : 'text-blue-600 hover:text-blue-900 bg-blue-100 hover:bg-blue-200'
                                                                }`}
                                                            >
                                                                {isUpdating ? 'Updating...' : 'Complete'}
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => deleteAppointment(appointment.id)}
                                                            disabled={isUpdating}
                                                            className={`px-2 py-1 rounded transition-colors ${
                                                                isUpdating 
                                                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                                                                    : 'text-red-600 hover:text-red-900 bg-red-100 hover:bg-red-200'
                                                            }`}
                                                        >
                                                            {isUpdating ? 'Deleting...' : 'Delete'}
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AllAppointments;

