import React, { useState, useEffect } from 'react';
import { useAuth } from '../Auth/AuthProvider';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


const DoctorProfile = () => {
    const navigate = useNavigate();
    const { logOut } = useAuth();
    const { user } = useAuth();
    const [profileData, setProfileData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        dateOfBirth: '',
        gender: '',
        specialization: '',
        bio: ''
    });
    const [stats, setStats] = useState({
        totalAppointments: 0,
        patientsToday: 0,
        totalPatients: 0,
        yearsOfExperience: 0
    });
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const getInitials = () => {
        const firstName = profileData.firstName || 'D';
        const lastName = profileData.lastName || 'R';
        return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
    };

    const fetchProfileData = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('No authentication token found');
                setLoading(false);
                return;
            }

            const response = await fetch('https://medscanapi.runasp.net/api/User/profile', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                setProfileData({
                    firstName: data.firstName || '',
                    lastName: data.lastName || '',
                    email: data.email || '',
                    phoneNumber: data.phoneNumber || '',
                    dateOfBirth: data.dateOfBirth ? data.dateOfBirth.split('T')[0] : '',
                    gender: data.gender || '',
                    specialization: data.specialization || '',
                    bio: data.bio || ''
                });
            } else {
                setError('Failed to fetch profile data');
            }
        } catch (err) {
            setError('Error fetching profile data');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };


    const fetchDoctorStats = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;


            const appointmentsResponse = await fetch('https://medscanapi.runasp.net/api/Appointment', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (appointmentsResponse.ok) {
                const appointments = await appointmentsResponse.json();
                const today = new Date().toDateString();
                const todayAppointments = appointments.filter(apt =>
                    new Date(apt.appointmentDate).toDateString() === today
                );


                const uniquePatients = new Set(appointments.map(apt => apt.patientId)).size;

                setStats({
                    totalAppointments: appointments.length,
                    patientsToday: todayAppointments.length,
                    totalPatients: uniquePatients,
                    yearsOfExperience: 8 
                });
            }
        } catch (err) {
            console.error('Error fetching doctor stats:', err);
        }
    };


    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('No authentication token found');
                return;
            }

            const response = await fetch('https://medscanapi.runasp.net/api/User/profile', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(profileData)
            });

            if (response.ok) {
                setIsEditing(false);
                setError('');
                alert('Profile updated successfully!');
            } else {
                setError('Failed to update profile');
            }
        } catch (err) {
            setError('Error updating profile');
            console.error('Error:', err);
        }
    };


    const handleViewPatients = () => {
        navigate('/patients');
    };

    const handleManageSchedule = () => {
        navigate('/schedule-management');
    };

    useEffect(() => {
        fetchProfileData();
        fetchDoctorStats();
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
                            <h1 className="text-3xl font-bold text-gray-900">Doctor Profile</h1>
                            <p className="text-gray-600 mt-1">Manage your professional information</p>
                        </div>
                        <div className="flex gap-4">
                            <Link
                                to="/doctor-dashboard"
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                Back to Dashboard
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

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
                                <button
                                    onClick={() => setIsEditing(!isEditing)}
                                    className="px-4 py-2 bg-Primary text-white rounded-lg hover:bg-Primary-dark transition-colors"
                                >
                                    {isEditing ? 'Cancel' : 'Edit Profile'}
                                </button>
                            </div>

                            {error && (
                                <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleUpdateProfile}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            First Name
                                        </label>
                                        <input
                                            type="text"
                                            value={profileData.firstName}
                                            onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                                            disabled={!isEditing}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-Primary disabled:bg-gray-100"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Last Name
                                        </label>
                                        <input
                                            type="text"
                                            value={profileData.lastName}
                                            onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                                            disabled={!isEditing}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-Primary disabled:bg-gray-100"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            value={profileData.email}
                                            onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                            disabled={!isEditing}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-Primary disabled:bg-gray-100"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            value={profileData.phoneNumber}
                                            onChange={(e) => setProfileData({ ...profileData, phoneNumber: e.target.value })}
                                            disabled={!isEditing}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-Primary disabled:bg-gray-100"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Date of Birth
                                        </label>
                                        <input
                                            type="date"
                                            value={profileData.dateOfBirth}
                                            onChange={(e) => setProfileData({ ...profileData, dateOfBirth: e.target.value })}
                                            disabled={!isEditing}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-Primary disabled:bg-gray-100"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Gender
                                        </label>
                                        <select
                                            value={profileData.gender}
                                            onChange={(e) => setProfileData({ ...profileData, gender: e.target.value })}
                                            disabled={!isEditing}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-Primary disabled:bg-gray-100"
                                        >
                                            <option value="">Select Gender</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            
                                        </select>
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Specialization
                                        </label>
                                        <input
                                            type="text"
                                            value={profileData.specialization}
                                            onChange={(e) => setProfileData({ ...profileData, specialization: e.target.value })}
                                            disabled={!isEditing}
                                            placeholder="e.g., Cardiology, Radiology, Internal Medicine"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-Primary disabled:bg-gray-100"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Bio
                                        </label>
                                        <textarea
                                            value={profileData.bio}
                                            onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                                            disabled={!isEditing}
                                            rows={4}
                                            placeholder="Tell patients about your experience, education, and approach to healthcare..."
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-Primary disabled:bg-gray-100"
                                        />
                                    </div>
                                </div>

                                {isEditing && (
                                    <div className="mt-6">
                                        <button
                                            type="submit"
                                            className="px-6 py-2 bg-Primary text-white rounded-lg hover:bg-Primary-dark transition-colors"
                                        >
                                            Save Changes
                                        </button>
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                            <div className="w-24 h-24 bg-Primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                                {getInitials()}
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900">
                                Dr. {profileData.firstName || 'Doctor'} {profileData.lastName}
                            </h3>
                            <p className="text-gray-600">{profileData.specialization || 'Medical Specialist'}</p>
                            <p className="text-sm text-gray-500 mt-1">{profileData.email}</p>
                            <button
                                onClick={() => setIsEditing(true)}
                                className="mt-4 w-full px-4 py-2 bg-Primary text-white rounded-lg hover:bg-Primary-dark transition-colors"
                            >
                                Edit Profile
                            </button>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Total Appointments</span>
                                    <span className="font-semibold">{stats.totalAppointments}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Patients Treated</span>
                                    <span className="font-semibold">{stats.totalPatients}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Years of Experience</span>
                                    <span className="font-semibold">{stats.yearsOfExperience}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Patients Today</span>
                                    <span className="font-semibold text-Primary">{stats.patientsToday}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                            <div className="space-y-3">
                                <Link
                                    to="/doctor-dashboard"
                                    className="block w-full px-4 py-2 bg-Primary text-white rounded-lg hover:bg-Primary-dark transition-colors text-center"
                                >
                                    View Dashboard
                                </Link>
                                <button 
                                    onClick={handleViewPatients}
                                    className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    View Patients
                                </button>
                                <button 
                                    onClick={handleManageSchedule}
                                    className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    Manage Schedule
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorProfile;


