import React, { useState, useEffect } from 'react';
import { useAuth } from '../Auth/AuthProvider';
import { Link, useNavigate } from 'react-router-dom';

const Patients = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [patients, setPatients] = useState([]);
    const [filteredPatients, setFilteredPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('name');
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [showPatientModal, setShowPatientModal] = useState(false);

    const fetchPatients = async () => {
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
                const appointments = await response.json();
                
                const patientsMap = new Map();
                
                appointments.forEach(appointment => {
                    if (appointment.patient) {
                        const patientId = appointment.patient.id || appointment.patient.email;
                        
                        if (!patientsMap.has(patientId)) {
                            patientsMap.set(patientId, {
                                id: patientId,
                                firstName: appointment.patient.firstName || 'Unknown',
                                lastName: appointment.patient.lastName || '',
                                email: appointment.patient.email || 'No email',
                                phone: appointment.patient.phone || 'No phone',
                                appointments: [],
                                totalAppointments: 0,
                                lastAppointment: null,
                                nextAppointment: null,
                                completedAppointments: 0,
                                pendingAppointments: 0,
                                confirmedAppointments: 0
                            });
                        }
                        
                        const patient = patientsMap.get(patientId);
                        patient.appointments.push(appointment);
                        patient.totalAppointments++;
                        
                        switch (appointment.status) {
                            case 0: patient.pendingAppointments++; break;
                            case 1: patient.confirmedAppointments++; break;
                            case 2: patient.completedAppointments++; break;
                        }
                        
                        const appointmentDate = new Date(appointment.appointmentDate);
                        const now = new Date();
                        
                        if (appointmentDate < now) {
                            if (!patient.lastAppointment || appointmentDate > new Date(patient.lastAppointment.appointmentDate)) {
                                patient.lastAppointment = appointment;
                            }
                        } else {
                            if (!patient.nextAppointment || appointmentDate < new Date(patient.nextAppointment.appointmentDate)) {
                                patient.nextAppointment = appointment;
                            }
                        }
                    }
                });
                
                const patientsArray = Array.from(patientsMap.values());
                setPatients(patientsArray);
                setFilteredPatients(patientsArray);
                setError('');
            } else {
                const errorText = await response.text();
                setError(`Failed to fetch patients: ${errorText}`);
            }
        } catch (err) {
            setError('Network error. Please check your connection.');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let filtered = patients;

        if (searchTerm) {
            filtered = filtered.filter(patient => 
                patient.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                patient.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                patient.email.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'name':
                    return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
                case 'email':
                    return a.email.localeCompare(b.email);
                case 'appointments':
                    return b.totalAppointments - a.totalAppointments;
                case 'lastVisit':
                    const aDate = a.lastAppointment ? new Date(a.lastAppointment.appointmentDate) : new Date(0);
                    const bDate = b.lastAppointment ? new Date(b.lastAppointment.appointmentDate) : new Date(0);
                    return bDate - aDate;
                default:
                    return 0;
            }
        });

        setFilteredPatients(filtered);
    }, [patients, searchTerm, sortBy]);

    useEffect(() => {
        fetchPatients();
    }, []);

    const PatientModal = ({ patient, onClose }) => {
        if (!patient) return null;

        const statusNames = {
            0: 'Pending',
            1: 'Confirmed',
            2: 'Completed'
        };

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-2xl font-bold text-gray-900">
                            {patient.firstName} {patient.lastName}
                        </h3>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="font-semibold text-gray-900 mb-3">Contact Information</h4>
                            <div className="space-y-2">
                                <p className="text-sm"><span className="font-medium">Email:</span> {patient.email}</p>
                                <p className="text-sm"><span className="font-medium">Phone:</span> {patient.phone}</p>
                            </div>
                        </div>

                        <div className="bg-blue-50 rounded-lg p-4">
                            <h4 className="font-semibold text-gray-900 mb-3">Appointment Statistics</h4>
                            <div className="space-y-2">
                                <p className="text-sm"><span className="font-medium">Total:</span> {patient.totalAppointments}</p>
                                <p className="text-sm"><span className="font-medium">Completed:</span> {patient.completedAppointments}</p>
                                <p className="text-sm"><span className="font-medium">Confirmed:</span> {patient.confirmedAppointments}</p>
                                <p className="text-sm"><span className="font-medium">Pending:</span> {patient.pendingAppointments}</p>
                            </div>
                        </div>

                        <div className="bg-green-50 rounded-lg p-4">
                            <h4 className="font-semibold text-gray-900 mb-3">Recent Activity</h4>
                            <div className="space-y-2">
                                {patient.lastAppointment && (
                                    <p className="text-sm">
                                        <span className="font-medium">Last Visit:</span><br />
                                        {new Date(patient.lastAppointment.appointmentDate).toLocaleDateString()}
                                    </p>
                                )}
                                {patient.nextAppointment && (
                                    <p className="text-sm">
                                        <span className="font-medium">Next Visit:</span><br />
                                        {new Date(patient.nextAppointment.appointmentDate).toLocaleDateString()}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-semibold text-gray-900 mb-4">Appointment History</h4>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
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
                                            Notes
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {patient.appointments
                                        .sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate))
                                        .map((appointment, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {new Date(appointment.appointmentDate).toLocaleDateString()}<br />
                                                <span className="text-gray-500">
                                                    {new Date(appointment.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {appointment.appointmentType || 'Routine Checkup'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                    statusNames[appointment.status] === 'Confirmed' ? 'bg-green-100 text-green-800' :
                                                    statusNames[appointment.status] === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                                    statusNames[appointment.status] === 'Completed' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {statusNames[appointment.status] || 'Unknown'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                {appointment.notes || '-'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="flex justify-end mt-6">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-lg text-gray-600">Loading patients...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Patients</h1>
                            <p className="text-gray-600 mt-1">Manage your patient database</p>
                        </div>
                        <div className="flex gap-4">
                            <Link
                                to="/doctor-dashboard"
                                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                            >
                                ← Back to Dashboard
                            </Link>
                            <button
                                onClick={fetchPatients}
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

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <h3 className="text-2xl font-bold text-blue-600">{patients.length}</h3>
                                <p className="text-gray-600">Total Patients</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-green-100 text-green-600">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <h3 className="text-2xl font-bold text-green-600">
                                    {patients.filter(p => p.completedAppointments > 0).length}
                                </h3>
                                <p className="text-gray-600">Active Patients</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <h3 className="text-2xl font-bold text-yellow-600">
                                    {patients.filter(p => p.nextAppointment).length}
                                </h3>
                                <p className="text-gray-600">Upcoming Visits</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <h3 className="text-2xl font-bold text-purple-600">
                                    {patients.filter(p => p.totalAppointments === 1).length}
                                </h3>
                                <p className="text-gray-600">New Patients</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Search Patients
                            </label>
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-Primary"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Sort By
                            </label>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-Primary"
                            >
                                <option value="name">Name (A-Z)</option>
                                <option value="email">Email</option>
                                <option value="appointments">Most Appointments</option>
                                <option value="lastVisit">Recent Visit</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="mb-6">
                    <p className="text-gray-600">
                        Showing {filteredPatients.length} of {patients.length} patients
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPatients.length === 0 ? (
                        <div className="col-span-full text-center py-12">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No patients found</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                {searchTerm ? 'Try adjusting your search' : 'No patients have been registered yet'}
                            </p>
                        </div>
                    ) : (
                        filteredPatients.map((patient) => (
                            <div key={patient.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                                <div className="flex items-center mb-4">
                                    <div className="flex-shrink-0 h-12 w-12">
                                        <div className="h-12 w-12 rounded-full bg-Primary text-white flex items-center justify-center font-semibold text-lg">
                                            {patient.firstName.charAt(0)}{patient.lastName.charAt(0)}
                                        </div>
                                    </div>
                                    <div className="ml-4 flex-1">
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            {patient.firstName} {patient.lastName}
                                        </h3>
                                        <p className="text-sm text-gray-600">{patient.email}</p>
                                    </div>
                                </div>

                                <div className="space-y-2 mb-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Total Appointments:</span>
                                        <span className="font-medium">{patient.totalAppointments}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Completed:</span>
                                        <span className="font-medium text-green-600">{patient.completedAppointments}</span>
                                    </div>
                                    {patient.lastAppointment && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Last Visit:</span>
                                            <span className="font-medium">
                                                {new Date(patient.lastAppointment.appointmentDate).toLocaleDateString()}
                                            </span>
                                        </div>
                                    )}
                                    {patient.nextAppointment && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Next Visit:</span>
                                            <span className="font-medium text-blue-600">
                                                {new Date(patient.nextAppointment.appointmentDate).toLocaleDateString()}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={() => {
                                        setSelectedPatient(patient);
                                        setShowPatientModal(true);
                                    }}
                                    className="w-full px-4 py-2 bg-Primary text-white rounded-lg hover:bg-Primary-dark transition-colors"
                                >
                                    View Details
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {showPatientModal && selectedPatient && (
                    <PatientModal 
                        patient={selectedPatient} 
                        onClose={() => {
                            setShowPatientModal(false);
                            setSelectedPatient(null);
                        }} 
                    />
                )}
            </div>
        </div>
    );
};

export default Patients;

