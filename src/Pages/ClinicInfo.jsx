import React, { useState, useEffect } from 'react';
import { useAuth } from '../Auth/AuthProvider';
import { useNavigate } from 'react-router-dom';

const ClinicInfo = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [clinicData, setClinicData] = useState({
        clinicName: '',
        address: '',
        phoneNumber: '',
        email: '',
        description: '',
        specializations: '',
        workingHours: '',
        emergencyContact: '',
        website: '',
        location: '',
        workingTime: '',
        weeklySchedule: '',
        workingDays: [{ dayOfWeek: '', workingHours: '' }]
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const fetchClinicInfo = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('No authentication token found');
                setLoading(false);
                return;
            }

            const response = await fetch('https://medscanapi.runasp.net/api/ClinicInfo/my-info', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                setClinicData({
                    clinicName: data.clinicName || '',
                    address: data.address || '',
                    phoneNumber: data.phoneNumber || '',
                    email: data.email || '',
                    description: data.description || '',
                    specializations: data.specializations || '',
                    workingHours: data.workingHours || '',
                    emergencyContact: data.emergencyContact || '',
                    website: data.website || '',
                    location: data.location || '',
                    workingTime: data.workingTime || '',
                    weeklySchedule: data.weeklySchedule || '',
                    workingDays: data.workingDays?.length ? data.workingDays : [{ dayOfWeek: '', workingHours: '' }]
                });
            } else {
                setError('Failed to fetch clinic information');
            }
        } catch (err) {
            console.error(err);
            setError('Error fetching clinic information');
        } finally {
            setLoading(false);
        }
    };

    const saveClinicInfo = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        setSuccessMessage('');

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('No authentication token found');
                setSaving(false);
                return;
            }

            const response = await fetch('https://medscanapi.runasp.net/api/ClinicInfo/my-info', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    clinicName: clinicData.clinicName,
                    email: clinicData.email,
                    phoneNumber: clinicData.phoneNumber,
                    emergencyContact: clinicData.emergencyContact,
                    description: clinicData.description,
                    specializations: clinicData.specializations,
                    website: clinicData.website,
                    location: clinicData.address,
                    workingTime: clinicData.workingTime,
                    weeklySchedule: clinicData.weeklySchedule,
                    workingDays: clinicData.workingDays
                })
            });

            if (response.ok) {
                setSuccessMessage('Clinic information saved successfully!');
                setTimeout(() => setSuccessMessage(''), 3000);
            } else {
                const errorText = await response.text();
                setError(`Failed to save clinic information: ${errorText}`);
            }
        } catch (err) {
            console.error(err);
            setError('Network error. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const handleInputChange = (field, value) => {
        setClinicData(prev => ({ ...prev, [field]: value }));
    };

    const handleWorkingDayChange = (index, field, value) => {
        const updatedDays = [...clinicData.workingDays];
        updatedDays[index][field] = value;
        setClinicData(prev => ({ ...prev, workingDays: updatedDays }));
    };

    const addWorkingDay = () => {
        setClinicData(prev => ({
            ...prev,
            workingDays: [...prev.workingDays, { dayOfWeek: '', workingHours: '' }]
        }));
    };

    const removeWorkingDay = (index) => {
        const updatedDays = clinicData.workingDays.filter((_, i) => i !== index);
        setClinicData(prev => ({ ...prev, workingDays: updatedDays }));
    };

    useEffect(() => {
        fetchClinicInfo();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold">Clinic Information</h1>
                        <p className="text-gray-600">Update your clinic details</p>
                    </div>
                    <button
                        onClick={() => navigate('/doctor-dashboard')}
                        className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
                    >
                        Back
                    </button>
                </div>

                {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
                {successMessage && <div className="bg-green-100 text-green-700 p-3 rounded mb-4">{successMessage}</div>}

                <form onSubmit={saveClinicInfo} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <inputField label="Clinic Name" value={clinicData.clinicName} required onChange={e => handleInputChange('clinicName', e.target.value)} />
                        <inputField label="Email" type="email" value={clinicData.email} required onChange={e => handleInputChange('email', e.target.value)} />
                        <inputField label="Phone Number" value={clinicData.phoneNumber} required onChange={e => handleInputChange('phoneNumber', e.target.value)} />
                        <inputField label="Emergency Contact" value={clinicData.emergencyContact} onChange={e => handleInputChange('emergencyContact', e.target.value)} />
                        <inputField label="Website" type="url" value={clinicData.website} onChange={e => handleInputChange('website', e.target.value)} />
                        <inputField label="Specializations" value={clinicData.specializations} onChange={e => handleInputChange('specializations', e.target.value)} />
                        <inputField label="Working Hours" value={clinicData.workingHours} onChange={e => handleInputChange('workingHours', e.target.value)} />
                        <inputField label="Working Time *" value={clinicData.workingTime} required onChange={e => handleInputChange('workingTime', e.target.value)} />
                        <inputField label="Weekly Schedule *" value={clinicData.weeklySchedule} required onChange={e => handleInputChange('weeklySchedule', e.target.value)} />
                    </div>

                    <div>
                        <label className="block font-medium mb-2">Address *</label>
                        <textarea
                            value={clinicData.address}
                            required
                            onChange={(e) => handleInputChange('address', e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:ring focus:ring-blue-200"
                            rows={3}
                        />
                    </div>

                    <div>
                        <label className="block font-medium mb-2">Clinic Description</label>
                        <textarea
                            value={clinicData.description}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:ring focus:ring-blue-200"
                            rows={4}
                        />
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold mb-2">Working Days</h2>
                        {clinicData.workingDays.map((day, index) => (
                            <div key={index} className="flex gap-4 items-center mb-2">
                                <input
                                    type="text"
                                    placeholder="Day"
                                    value={day.dayOfWeek}
                                    onChange={e => handleWorkingDayChange(index, 'dayOfWeek', e.target.value)}
                                    className="flex-1 border px-3 py-2 rounded"
                                />
                                <input
                                    type="text"
                                    placeholder="Hours"
                                    value={day.workingHours}
                                    onChange={e => handleWorkingDayChange(index, 'workingHours', e.target.value)}
                                    className="flex-1 border px-3 py-2 rounded"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeWorkingDay(index)}
                                    className="text-red-600 hover:underline"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addWorkingDay}
                            className="mt-2 px-4 py-2 bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
                        >
                            + Add Day
                        </button>
                    </div>

                    <div className="text-right pt-4">
                        <button
                            type="submit"
                            disabled={saving}
                            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                        >
                            {saving ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const inputField = ({ label, value, onChange, type = "text", required = false }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
        <input
            type={type}
            value={value}
            required={required}
            onChange={onChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
    </div>
);

export default ClinicInfo;
