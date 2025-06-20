import React, { useState, useEffect } from 'react';
import { useAuth } from '../Auth/AuthProvider';

const Booking = () => {
    const { user } = useAuth();
    const [doctors, setDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [formData, setFormData] = useState({
        appointmentDate: '',
        appointmentTime: '',
        additionalNotes: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    // Fetch doctors from API
    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await fetch('https://medscanapi.runasp.net/api/Doctor/all');
                if (response.ok) {
                    const data = await response.json();
                    setDoctors(data);
                }
            } catch (error) {
                console.error('Error fetching doctors:', error);
            }
        };

        fetchDoctors();
    }, []);

    const handleDoctorSelect = (doctor) => {
        setSelectedDoctor(doctor);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedDoctor) {
            setMessage('Please select a doctor first');
            return;
        }

        setLoading(true);
        setMessage('');

        try {
            const token = localStorage.getItem('token');

            const appointmentData = {
                doctorId: selectedDoctor.id,
                appointmentDate: `${formData.appointmentDate}T${formData.appointmentTime}:00Z`,
                reason: formData.additionalNotes || 'General Checkup'
            };

            const response = await fetch('https://medscanapi.runasp.net/api/Appointment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(appointmentData)
            });

            if (response.ok) {
                const result = await response.json();
                setMessage('Appointment booked successfully!');
                // Reset form
                setFormData({
                    appointmentDate: '',
                    appointmentTime: '',
                    additionalNotes: ''
                });
                setSelectedDoctor(null);
            } else {
                const error = await response.text();
                setMessage(`Error: ${error}`);
            }
        } catch (error) {
            setMessage('Error booking appointment. Please try again.');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const timeSlots = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Book Your Appointment</h1>
                    <p className="text-lg text-gray-600">Choose the right doctor and book your appointment easily</p>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Choose Doctor Section */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Choose Doctor</h2>
                        <div className="space-y-4">
                            {doctors.map((doctor) => (
                                <div
                                    key={doctor.id}
                                    onClick={() => handleDoctorSelect(doctor)}
                                    className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${selectedDoctor?.id === doctor.id
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                                            {doctor.profilePictureUrl ? (
                                                <img
                                                    src={doctor.profilePictureUrl}
                                                    alt={`Dr. ${doctor.firstName} ${doctor.lastName}`}
                                                    className="w-16 h-16 rounded-full object-cover"
                                                />
                                            ) : (
                                                <span className="text-2xl font-bold text-gray-600">
                                                    {doctor.firstName.charAt(0)}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                Dr. {doctor.firstName} {doctor.lastName}
                                            </h3>
                                            <p className="text-blue-600 font-medium">{doctor.specialization}</p>
                                            <p className="text-sm text-gray-500">Experience in medical field</p>
                                            <div className="flex items-center mt-1">
                                                <span className="text-yellow-400">★</span>
                                                <span className="text-sm text-gray-600 ml-1">4.8</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Booking Details Section */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Booking Details</h2>

                        {selectedDoctor ? (
                            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                                <p className="text-sm text-gray-600 mb-1">Selected Doctor:</p>
                                <p className="text-lg font-semibold text-blue-600">
                                    Dr. {selectedDoctor.firstName} {selectedDoctor.lastName} - {selectedDoctor.specialization}
                                </p>
                            </div>
                        ) : (
                            <div className="mb-6 p-4 bg-gray-50 rounded-lg text-center">
                                <div className="text-gray-400 mb-2">
                                    <svg className="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <p className="text-gray-500">Please select a doctor first</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Appointment Date */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Appointment Date
                                </label>
                                <input
                                    type="date"
                                    name="appointmentDate"
                                    value={formData.appointmentDate}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* Appointment Time */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Appointment Time
                                </label>
                                <div className="grid grid-cols-3 gap-2">
                                    {timeSlots.map((time) => (
                                        <button
                                            key={time}
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, appointmentTime: time }))}
                                            className={`px-3 py-2 text-sm border rounded-md transition-all duration-200 ${formData.appointmentTime === time
                                                    ? 'bg-blue-500 text-white border-blue-500'
                                                    : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                                                }`}
                                        >
                                            {time}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Patient Information */}
                            <div className="border-t pt-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Patient Information</h3>

                                <div className="space-y-4">

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Additional Notes (Optional)
                                        </label>
                                        <textarea
                                            name="additionalNotes"
                                            value={formData.additionalNotes}
                                            onChange={handleInputChange}
                                            rows={3}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Any specific concerns or notes..."
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading || !selectedDoctor}
                                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
                            >
                                {loading ? 'Booking...' : 'Confirm Booking'}
                            </button>

                            {/* Message */}
                            {message && (
                                <div className={`p-3 rounded-md ${message.includes('successfully')
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-red-100 text-red-700'
                                    }`}>
                                    {message}
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Booking;

