import React, { useState } from 'react'
import shadow from '../assets/Bg-Shape.png'
import logo from '../assets/logo1.png'
import apple from '../assets/icons/apple.png'
import face from '../assets/icons/face.png'
import google from '../assets/icons/google.png'
import { useAuth } from '../Auth/AuthProvider'
import { Link, useNavigate } from 'react-router-dom'

const SignUp = () => {

    const { login, setAuth } = useAuth()
    const [message, setMessage] = useState('')
    const [messageType, setMessageType] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()
    const [registerData, setRegisterData] = useState({
        firstName: '',
        lastName: '',
        userName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phoneNumber: '',
        gender: '',
        dateOfBirth: '',
        role: '',
        specialization: '',
        bio: '',
        profilePictureUrl: ''
    })

    const handleRegisterChange = (e) => {
        const { name, value } = e.target;
        setRegisterData({ ...registerData, [name]: value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (registerData.password !== registerData.confirmPassword) {
            setMessage('Passwords do not match')
            setMessageType('failed')
            setIsLoading(false);
            setTimeout(() => setMessage(''), 5000)
            return
        }

        if (registerData.password.length < 6) {
            setMessage('Password must be at least 6 characters long')
            setMessageType('failed')
            setIsLoading(false);
            setTimeout(() => setMessage(''), 5000)
            return
        }

        if (registerData.role === 'Doctor') {
            if (!registerData.specialization.trim()) {
                setMessage('Specialization is required for doctors')
                setMessageType('failed')
                setIsLoading(false);
                setTimeout(() => setMessage(''), 5000)
                return
            }
        }

        const apiData = {
            FirstName: registerData.firstName,
            LastName: registerData.lastName,
            UserName: registerData.userName,
            Email: registerData.email,
            Password: registerData.password,
            ConfirmPassword: registerData.confirmPassword,
            PhoneNumber: registerData.phoneNumber || '',
            Gender: registerData.gender || '',
            DateOfBirth: registerData.dateOfBirth || new Date().toISOString(),
            Role: registerData.role,
            Specialization: registerData.specialization || '',
            Bio: registerData.bio || '',
            ProfilePictureUrl: registerData.profilePictureUrl || ''
        }

        console.log('Sending registration data:', apiData);

        const apiUrl = 'https://medscanapi.runasp.net/api/Auth/register'

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(apiData), 
            })

            const responseData = await response.json()

            if (response.ok && responseData.success) {
                setMessage('Account created successfully!')
                setMessageType('success')

                console.log('Registration successful:', responseData)

                if (responseData.data?.userName || responseData.data?.email) {
                    login(responseData.data.userName || responseData.data.email)
                    setAuth(true)
                }

                setTimeout(() => {
                    navigate('/login')
                }, 2000)

            } else {
                setMessage(responseData.message || 'Account creation failed')
                setMessageType('failed')

                console.error('Registration error:', responseData);
            }
        } catch (e) {
            console.error('Network error:', e)
            setMessage('Server connection error. Please check your internet connection.')
            setMessageType('failed')
        } finally {
            setIsLoading(false);
        }

        setRegisterData({
            firstName: '',
            lastName: '',
            userName: '',
            email: '',
            password: '',
            confirmPassword: '',
            phoneNumber: '',
            gender: '',
            dateOfBirth: '',
            role: 'Patient',
            specialization: '',
            bio: '',
            profilePictureUrl: ''
        })

        setTimeout(() => {
            setMessage('')
        }, 5000)
    }

    return (
        <section className=' lg:px-20 py-10 relative'>
            <img className='m-auto  w-[70%]  h-full  hidden lg:block  relative z-0' src={shadow} />
            <div className='lg:flex  lg:w-[70%] lg:h-[86%]      lg:absolute  start-60  top-14'>
                <div className='lg:w-1/2 bg-linear-gradient  rounded-s-3xl  hidden lg:flex justify-center items-center '>
                    <img className=' z-20 w-72' src={logo} />
                </div>
                <form onSubmit={handleSubmit} className='bg-white w-full lg:w-1/2 h-full lg:w-1/2 overflow-y-auto  rounded-e-3xl px-8 py-5'>
                    <h2 className='text-center font-semibold text-2xl py-3'>Create your account!</h2>

                    <div className='py-2'>
                        <label className='block mb-2 text-[14px] font-semibold'>Account Type</label>
                        <select
                            name="role"
                            value={registerData.role}
                            onChange={handleRegisterChange}
                            disabled={isLoading}
                            className='w-full border-[1px] rounded-lg ps-3 py-1 border-slate-300 text-sm disabled:opacity-50'
                        >
                            <option value="Patient">Patient</option>
                            <option value="Doctor">Doctor</option>
                        </select>
                    </div>

                    <div className='flex gap-3 py-1'>
                        <div className=''>
                            <label className='block  mb-2 text-[14px]'>First Name</label>
                            <input
                                onChange={handleRegisterChange}
                                name='firstName'
                                value={registerData.firstName}
                                placeholder='First Name'
                                required
                                disabled={isLoading}
                                className='w-full border-[1px] rounded-lg ps-3 py-1 border-slate-300 placeholder:text-sm disabled:opacity-50'
                            />
                        </div>
                        <div>
                            <label className='block  mb-2 text-[14px]'>Last Name</label>
                            <input
                                onChange={handleRegisterChange}
                                name='lastName'
                                value={registerData.lastName}
                                placeholder='Last Name'
                                required
                                disabled={isLoading}
                                className='w-full border-[1px] rounded-lg ps-3 py-1 border-slate-300 placeholder:text-sm disabled:opacity-50'
                            />
                        </div>
                    </div>

                    <div className='py-1'>
                        <label className='block  mb-2 text-[14px]'>Username</label>
                        <input
                            onChange={handleRegisterChange}
                            name='userName'
                            value={registerData.userName}
                            placeholder='Username'
                            required
                            disabled={isLoading}
                            className='w-full border-[1px] rounded-lg ps-3 py-1 border-slate-300 placeholder:text-sm disabled:opacity-50'
                        />
                    </div>

                    <div className='py-1'>
                        <label className='block  mb-2 text-[14px]'>Email</label>
                        <input
                            onChange={handleRegisterChange}
                            name='email'
                            value={registerData.email}
                            placeholder='Email'
                            type="email"
                            required
                            disabled={isLoading}
                            className='w-full border-[1px] rounded-lg ps-3 py-1 border-slate-300 placeholder:text-sm disabled:opacity-50'
                        />
                    </div>

                    {registerData.role === 'Doctor' && (
                        <>
                            <div className='py-1'>
                                <label className='block mb-2 text-[14px]'>Specialization *</label>
                                <input
                                    onChange={handleRegisterChange}
                                    name='specialization'
                                    value={registerData.specialization}
                                    placeholder='e.g., Cardiology, Radiology, Internal Medicine'
                                    required
                                    disabled={isLoading}
                                    className='w-full border-[1px] rounded-lg ps-3 py-1 border-slate-300 placeholder:text-sm disabled:opacity-50'
                                />
                            </div>
                            <div className='py-1'>
                                <label className='block mb-2 text-[14px]'>Bio (Optional)</label>
                                <textarea
                                    onChange={handleRegisterChange}
                                    name='bio'
                                    value={registerData.bio}
                                    placeholder='Brief description about your experience and approach...'
                                    rows={3}
                                    disabled={isLoading}
                                    className='w-full border-[1px] rounded-lg ps-3 py-1 border-slate-300 placeholder:text-sm disabled:opacity-50 resize-none'
                                />
                            </div>
                        </>
                    )}

                    <div className='flex gap-3 py-1'>
                        <div className='w-1/2'>
                            <label className='block mb-2 text-[14px]'>Gender (Optional)</label>
                            <select
                                onChange={handleRegisterChange}
                                name='gender'
                                value={registerData.gender}
                                disabled={isLoading}
                                className='w-full border-[1px] rounded-lg ps-3 py-1 border-slate-300 text-sm disabled:opacity-50'
                            >
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                
                            </select>
                        </div>
                        <div className='w-1/2'>
                            <label className='block mb-2 text-[14px]'>Date of Birth (Optional)</label>
                            <input
                                onChange={handleRegisterChange}
                                name='dateOfBirth'
                                value={registerData.dateOfBirth}
                                type="date"
                                disabled={isLoading}
                                className='w-full border-[1px] rounded-lg ps-3 py-1 border-slate-300 text-sm disabled:opacity-50'
                            />
                        </div>
                    </div>

                    <div className='py-1'>
                        <label className='block mb-2 text-[14px]'>Phone Number (Optional)</label>
                        <input
                            onChange={handleRegisterChange}
                            name='phoneNumber'
                            value={registerData.phoneNumber}
                            placeholder='Phone Number'
                            type="tel"
                            disabled={isLoading}
                            className='w-full border-[1px] rounded-lg ps-3 py-1 border-slate-300 placeholder:text-sm disabled:opacity-50'
                        />
                    </div>

                    <div className='py-1'>
                        <label className='block  mb-2 text-[14px]'>Password</label>
                        <input
                            onChange={handleRegisterChange}
                            name='password'
                            value={registerData.password}
                            type='password'
                            placeholder='Password (min 6 characters)'
                            required
                            disabled={isLoading}
                            className='w-full border-[1px] rounded-lg ps-3 py-1 border-slate-300 placeholder:text-sm disabled:opacity-50'
                        />
                    </div>

                    <div className='py-1'>
                        <label className='block  mb-2 text-[14px]'>Confirm Password</label>
                        <input
                            onChange={handleRegisterChange}
                            name='confirmPassword'
                            value={registerData.confirmPassword}
                            type='password'
                            placeholder='Confirm Password'
                            required
                            disabled={isLoading}
                            className='w-full border-[1px] rounded-lg ps-3 py-1 border-slate-300 placeholder:text-sm disabled:opacity-50'
                        />
                    </div>

                    <div className='flex justify-center items-center my-1 '>
                        <button
                            className='bg-Primary w-full py-1 rounded-lg text-white font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed'
                            type='submit'
                            disabled={isLoading}
                        >
                            {isLoading ? 'Creating Account...' : `Create ${registerData.role} Account`}
                        </button>
                    </div>

                    <div>
                        <p className={`text-center font-semibold py-1  ${messageType === 'failed' ? 'text-red-700' : 'text-Primary'}`}>
                            {message}
                        </p>
                    </div>

                    <div className='text-center '>
                        <p className=' text-Secondary-darkGray text-sm'>Sign up with</p>
                        <div className='flex items-center justify-center gap-4 py-2'>
                            <img src={face} alt="Facebook" />
                            <img src={google} alt="Google" />
                            <img src={apple} alt="Apple" />
                        </div>
                        <p className=' text-black-medium'>
                            Already have an account? <Link to={'/login'} className='text-Primary'>Sign in</Link>
                        </p>
                    </div>

                </form>
            </div>
        </section>
    )
}

export default SignUp

