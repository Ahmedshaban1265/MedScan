import React, { useState, useEffect } from 'react';
import { useAuth } from '../Auth/AuthProvider';
import { Link, useNavigate } from 'react-router-dom';


const DoctorDashboard = () => {
    const navigate = useNavigate();
    const { logOut } = useAuth();
    const { user } = useAuth();
    const [dashboardData, setDashboardData] = useState({
        appointmentsToday: [],
        upcomingAppointments: [],
        stats: {
            appointmentsToday: 0,
            newPatients: 0,
            totalPatients: 0
        }
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showAddAppointmentModal, setShowAddAppointmentModal] = useState(false);
    const [showScheduleModal, setShowScheduleModal] = useState(false);

    // Get user name for welcome message
    const getDoctorName = () => {
        const storedFirstName = localStorage.getItem('firstName');
        const storedUserData = localStorage.getItem('user');

        if (user?.firstName) {
            return user.firstName;
        } else if (storedFirstName) {
            return storedFirstName;
        } else if (storedUserData) {
            try {
                const userData = JSON.parse(storedUserData);
                return userData.firstName || userData.userName || 'Doctor';
            } catch (e) {
                return 'Doctor';
            }
        }
        return 'Doctor';
    };

    // Fetch dashboard data
    const fetchDashboardData = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('No authentication token found');
                setLoading(false);
                return;
            }

            // Fetch appointments
            const appointmentsResponse = await fetch('https://medscanapi.runasp.net/api/Appointment', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (appointmentsResponse.ok) {
                const appointments = await appointmentsResponse.json();

                // Filter appointments for today
                const today = new Date();
                const todayString = today.toDateString();

                const appointmentsToday = appointments.filter(apt => {
                    const aptDate = new Date(apt.appointmentDate);
                    return aptDate.toDateString() === todayString;
                });

                // Filter upcoming appointments (next 7 days)
                const nextWeek = new Date();
                nextWeek.setDate(today.getDate() + 7);

                const upcomingAppointments = appointments.filter(apt => {
                    const aptDate = new Date(apt.appointmentDate);
                    return aptDate > today && aptDate <= nextWeek;
                }).slice(0, 5); // Show only next 5 appointments

                // Calculate stats
                const thisWeek = new Date();
                thisWeek.setDate(today.getDate() - 7);

                const newPatientsThisWeek = appointments.filter(apt => {
                    const aptDate = new Date(apt.appointmentDate);
                    return aptDate >= thisWeek && apt.isNewPatient;
                }).length;

                const uniquePatients = new Set(appointments.map(apt => apt.patientId)).size;

                setDashboardData({
                    appointmentsToday,
                    upcomingAppointments,
                    stats: {
                        appointmentsToday: appointmentsToday.length,
                        newPatients: newPatientsThisWeek,
                        totalPatients: uniquePatients
                    }
                });
            } else {
                setError('Failed to fetch appointments data');
            }
        } catch (err) {
            setError('Error fetching dashboard data');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };
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

    // Update appointment status with improved UI feedback
    const updateAppointmentStatus = async (appointmentId, statusText) => {
        const status = statusMap[statusText];
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Authentication token not found. Please login again.');
            return;
        }

        // Show loading state
        const buttonElement = document.querySelector(`[data-appointment-id="${appointmentId}"][data-action="${statusText}"]`);
        if (buttonElement) {
            buttonElement.disabled = true;
            buttonElement.textContent = 'Updating...';
        }

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
                // Immediately update the local state for better UX
                setDashboardData(prevData => {
                    const updateAppointmentInList = (appointments) => 
                        appointments.map(apt => 
                            apt.id === appointmentId 
                                ? { ...apt, status: status } // Use numeric status
                                : apt
                        );

                    return {
                        ...prevData,
                        appointmentsToday: updateAppointmentInList(prevData.appointmentsToday),
                        upcomingAppointments: updateAppointmentInList(prevData.upcomingAppointments)
                    };
                });

                // Then fetch fresh data from server
                await fetchDashboardData();
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
            // Reset button state
            if (buttonElement) {
                buttonElement.disabled = false;
                buttonElement.textContent = statusText;
            }
        }
    };

    // Quick Actions Functions
    const handleAddNewAppointment = () => {
        setShowAddAppointmentModal(true);
    };

    const handleViewPatients = () => {
        navigate('/patients');
    };

    const handleManageSchedule = () => {
        setShowScheduleModal(true);
    };

    // Add New Appointment Modal Component
    const AddAppointmentModal = () => {
        const [appointmentData, setAppointmentData] = useState({
            patientEmail: '',
            appointmentDate: '',
            appointmentTime: '',
            appointmentType: 'Routine Checkup',
            notes: ''
        });
        const [isSubmitting, setIsSubmitting] = useState(false);

        const handleSubmit = async (e) => {
            e.preventDefault();
            setIsSubmitting(true);

            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    alert('Authentication token not found. Please login again.');
                    return;
                }

                // Combine date and time
                const appointmentDateTime = new Date(`${appointmentData.appointmentDate}T${appointmentData.appointmentTime}`);

                const response = await fetch('https://medscanapi.runasp.net/api/Appointment', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        patientEmail: appointmentData.patientEmail,
                        appointmentDate: appointmentDateTime.toISOString(),
                        appointmentType: appointmentData.appointmentType,
                        notes: appointmentData.notes
                    })
                });

                if (response.ok) {
                    alert('Appointment created successfully!');
                    setShowAddAppointmentModal(false);
                    setAppointmentData({
                        patientEmail: '',
                        appointmentDate: '',
                        appointmentTime: '',
                        appointmentType: 'Routine Checkup',
                        notes: ''
                    });
                    fetchDashboardData(); // Refresh data
                } else {
                    const errorText = await response.text();
                    alert(`Failed to create appointment: ${errorText}`);
                }
            } catch (err) {
                console.error('Error creating appointment:', err);
                alert('Network error. Please check your connection and try again.');
            } finally {
                setIsSubmitting(false);
            }
        };

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">Add New Appointment</h3>
                        <button
                            onClick={() => setShowAddAppointmentModal(false)}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Patient Email
                            </label>
                            <input
                                type="email"
                                required
                                value={appointmentData.patientEmail}
                                onChange={(e) => setAppointmentData({...appointmentData, patientEmail: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-Primary"
                                placeholder="patient@example.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Date
                            </label>
                            <input
                                type="date"
                                required
                                value={appointmentData.appointmentDate}
                                onChange={(e) => setAppointmentData({...appointmentData, appointmentDate: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-Primary"
                                min={new Date().toISOString().split('T')[0]}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Time
                            </label>
                            <input
                                type="time"
                                required
                                value={appointmentData.appointmentTime}
                                onChange={(e) => setAppointmentData({...appointmentData, appointmentTime: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-Primary"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Appointment Type
                            </label>
                            <select
                                value={appointmentData.appointmentType}
                                onChange={(e) => setAppointmentData({...appointmentData, appointmentType: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-Primary"
                            >
                                <option value="Routine Checkup">Routine Checkup</option>
                                <option value="Follow-up">Follow-up</option>
                                <option value="Consultation">Consultation</option>
                                <option value="Emergency">Emergency</option>
                                <option value="Scan Review">Scan Review</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Notes (Optional)
                            </label>
                            <textarea
                                value={appointmentData.notes}
                                onChange={(e) => setAppointmentData({...appointmentData, notes: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-Primary"
                                rows="3"
                                placeholder="Additional notes..."
                            />
                        </div>

                        <div className="flex gap-3 pt-4">
                            <button
                                type="button"
                                onClick={() => setShowAddAppointmentModal(false)}
                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1 px-4 py-2 bg-Primary text-white rounded-md hover:bg-Primary-dark transition-colors disabled:opacity-50"
                            >
                                {isSubmitting ? 'Creating...' : 'Create Appointment'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    };

    // Schedule Management Modal Component
    const ScheduleModal = () => {
        const [scheduleData, setScheduleData] = useState({
            workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            startTime: '09:00',
            endTime: '17:00',
            breakStart: '12:00',
            breakEnd: '13:00',
            appointmentDuration: 30
        });

        const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

        const handleDayToggle = (day) => {
            setScheduleData(prev => ({
                ...prev,
                workingDays: prev.workingDays.includes(day)
                    ? prev.workingDays.filter(d => d !== day)
                    : [...prev.workingDays, day]
            }));
        };

        const handleSaveSchedule = () => {
            // Here you would typically save to API
            alert('Schedule settings saved successfully!');
            setShowScheduleModal(false);
        };

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-4">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">Manage Schedule</h3>
                        <button
                            onClick={() => setShowScheduleModal(false)}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="space-y-6">
                        {/* Working Days */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Working Days
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                {daysOfWeek.map(day => (
                                    <label key={day} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={scheduleData.workingDays.includes(day)}
                                            onChange={() => handleDayToggle(day)}
                                            className="mr-2"
                                        />
                                        <span className="text-sm">{day}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Working Hours */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Start Time
                                </label>
                                <input
                                    type="time"
                                    value={scheduleData.startTime}
                                    onChange={(e) => setScheduleData({...scheduleData, startTime: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-Primary"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    End Time
                                </label>
                                <input
                                    type="time"
                                    value={scheduleData.endTime}
                                    onChange={(e) => setScheduleData({...scheduleData, endTime: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-Primary"
                                />
                            </div>
                        </div>

                        {/* Break Time */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Break Start
                                </label>
                                <input
                                    type="time"
                                    value={scheduleData.breakStart}
                                    onChange={(e) => setScheduleData({...scheduleData, breakStart: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-Primary"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Break End
                                </label>
                                <input
                                    type="time"
                                    value={scheduleData.breakEnd}
                                    onChange={(e) => setScheduleData({...scheduleData, breakEnd: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-Primary"
                                />
                            </div>
                        </div>

                        {/* Appointment Duration */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Appointment Duration (minutes)
                            </label>
                            <select
                                value={scheduleData.appointmentDuration}
                                onChange={(e) => setScheduleData({...scheduleData, appointmentDuration: parseInt(e.target.value)})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-Primary"
                            >
                                <option value={15}>15 minutes</option>
                                <option value={30}>30 minutes</option>
                                <option value={45}>45 minutes</option>
                                <option value={60}>60 minutes</option>
                            </select>
                        </div>

                        <div className="flex gap-3 pt-4">
                            <button
                                onClick={() => setShowScheduleModal(false)}
                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveSchedule}
                                className="flex-1 px-4 py-2 bg-Primary text-white rounded-md hover:bg-Primary-dark transition-colors"
                            >
                                Save Schedule
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };


    useEffect(() => {
        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-Primary"></div>
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
                            <h1 className="text-3xl font-bold text-gray-900">
                                Welcome Dr. {getDoctorName()}
                            </h1>
                            <p className="text-gray-600 mt-1">Doctor Dashboard</p>
                        </div>
                        <div className="flex gap-4">
                            <Link
                                to="/doctor-profile"
                                className="px-4 py-2 bg-Primary text-white rounded-lg hover:bg-Primary-dark transition-colors"
                            >
                                Profile
                            </Link>
                            <button
                                onClick={() => {
                                    logOut();
                                    navigate('/');
                                }}
                                className="w-full sm:w-auto px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                    </div>
                )}

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <h3 className="text-2xl font-bold text-blue-600">{dashboardData.stats.appointmentsToday}</h3>
                                <p className="text-gray-600">Appointments Today</p>
                                <p className="text-sm text-gray-500">scheduled appointments</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-green-100 text-green-600">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <h3 className="text-2xl font-bold text-green-600">{dashboardData.stats.newPatients}</h3>
                                <p className="text-gray-600">New Patients</p>
                                <p className="text-sm text-gray-500">this week</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <h3 className="text-2xl font-bold text-purple-600">{dashboardData.stats.totalPatients}</h3>
                                <p className="text-gray-600">Total Patients</p>
                                <p className="text-sm text-gray-500">registered patients</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Today's Appointments */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-gray-900">Appointments Today</h2>
                            <span className="text-sm text-gray-500">
                                {dashboardData.appointmentsToday.length} appointments
                            </span>
                        </div>

                        {dashboardData.appointmentsToday.length === 0 ? (
                            <div className="text-center py-8">
                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <h3 className="mt-2 text-sm font-medium text-gray-900">No appointments today</h3>
                                <p className="mt-1 text-sm text-gray-500">You have a free day!</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {dashboardData.appointmentsToday.map((appointment, index) => (
                                    <div key={index} className="border-l-4 border-Primary pl-4 py-3 bg-gray-50 rounded-r-lg">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-medium text-gray-900">
                                                    {appointment.patient?.firstName} {appointment.patient?.lastName}
                                                </h4>
                                                <p className="text-sm text-gray-600">
                                                    {new Date(appointment.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {appointment.appointmentType || 'Routine Checkup'}
                                                </p>
                                                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                                                    statusNames[appointment.status] === 'Confirmed' ? 'bg-green-100 text-green-800' :
                                                    statusNames[appointment.status] === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                                    statusNames[appointment.status] === 'Completed' ? 'bg-blue-100 text-blue-800' :
                                                        'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {statusNames[appointment.status] || 'Unknown'}
                                                </span>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    data-appointment-id={appointment.id}
                                                    data-action="Confirmed"
                                                    onClick={() => updateAppointmentStatus(appointment.id, 'Confirmed')}
                                                    disabled={statusNames[appointment.status] === 'Confirmed'}
                                                    className={`px-3 py-1 text-xs rounded transition-colors ${
                                                        statusNames[appointment.status] === 'Confirmed' 
                                                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                                                            : 'bg-green-500 text-white hover:bg-green-600'
                                                    }`}
                                                >
                                                    {statusNames[appointment.status] === 'Confirmed' ? 'Confirmed' : 'Confirm'}
                                                </button>
                                                <button
                                                    data-appointment-id={appointment.id}
                                                    data-action="Completed"
                                                    onClick={() => updateAppointmentStatus(appointment.id, 'Completed')}
                                                    disabled={statusNames[appointment.status] === 'Completed'}
                                                    className={`px-3 py-1 text-xs rounded transition-colors ${
                                                        statusNames[appointment.status] === 'Completed' 
                                                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                                                            : 'bg-blue-500 text-white hover:bg-blue-600'
                                                    }`}
                                                >
                                                    {statusNames[appointment.status] === 'Completed' ? 'Completed' : 'Complete'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Upcoming Appointments */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-gray-900">Upcoming Appointments</h2>
                            <Link
                                to="/all-appointments"
                                className="text-Primary hover:text-Primary-dark text-sm font-medium"
                            >
                                View All Appointments →
                            </Link>
                        </div>

                        {dashboardData.upcomingAppointments.length === 0 ? (
                            <div className="text-center py-8">
                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <h3 className="mt-2 text-sm font-medium text-gray-900">No upcoming appointments</h3>
                                <p className="mt-1 text-sm text-gray-500">Your schedule is clear for the next week.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {dashboardData.upcomingAppointments.map((appointment, index) => (
                                    <div key={index} className="border-l-4 border-gray-300 pl-4 py-3">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-medium text-gray-900">
                                                    {appointment.patient?.firstName} {appointment.patient?.lastName}
                                                </h4>
                                                <p className="text-sm text-gray-600">
                                                    {new Date(appointment.appointmentDate).toLocaleDateString()} at {new Date(appointment.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {appointment.appointmentType || 'Consultation'}
                                                </p>
                                                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${appointment.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                                                    appointment.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {appointment.status || 'Pending'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <button 
                            onClick={handleAddNewAppointment}
                            className="p-4 bg-Primary text-white rounded-lg hover:bg-Primary-dark transition-colors text-center"
                        >
                            <svg className="w-6 h-6 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Add New Appointment
                        </button>

                        <button 
                            onClick={handleViewPatients}
                            className="p-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-center"
                        >
                            <svg className="w-6 h-6 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            View Patients
                        </button>

                        <button 
                            onClick={handleManageSchedule}
                            className="p-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-center"
                        >
                            <svg className="w-6 h-6 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Manage Schedule
                        </button>

                        <Link
                            to="/clinic-info"
                            className="p-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-center block"
                        >
                            <svg className="w-6 h-6 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            Clinic Information
                        </Link>

                        <Link
                            to="/doctor-profile"
                            className="p-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-center block"
                        >
                            <svg className="w-6 h-6 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            Profile Settings
                        </Link>
                    </div>
                </div>

                {/* Modals */}
                {showAddAppointmentModal && <AddAppointmentModal />}
                {showScheduleModal && <ScheduleModal />}
            </div>
        </div>
    );
};

export default DoctorDashboard;

