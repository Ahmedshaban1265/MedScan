import React, { useState } from 'react'
import shadow from '../assets/Bg-Shape.png'
import logo from '../assets/logo1.png'
import { Link } from 'react-router-dom'

const ResetPassword = () => {
    const [step, setStep] = useState(1) // 1: request reset, 2: verify code, 3: new password
    const [email, setEmail] = useState('')
    const [resetCode, setResetCode] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [message, setMessage] = useState('')
    const [messageType, setMessageType] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleRequestReset = async (e) => {
        e.preventDefault()
        setIsLoading(true)

        const apiUrl = 'http://medscanapi.runasp.net/api/Auth/request-password-reset'

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            })

            const responseData = await response.json()

            if (response.ok && responseData.success) {
                setMessage('Reset code sent to your email')
                setMessageType('success')
                setStep(2)
            } else {
                setMessage(responseData.message || 'Failed to send reset code')
                setMessageType('failed')
            }
        } catch (error) {
            console.error('Error:', error)
            setMessage('Server connection error. Please check your internet connection.')
            setMessageType('failed')
        } finally {
            setIsLoading(false)
        }

        setTimeout(() => setMessage(''), 5000)
    }

    const handleVerifyCode = async (e) => {
        e.preventDefault()
        setIsLoading(true)

        const apiUrl = 'http://medscanapi.runasp.net/api/Auth/verify-reset-code'

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    email,
                    resetCode 
                }),
            })

            const responseData = await response.json()

            if (response.ok && responseData.success) {
                setMessage('Code verified successfully')
                setMessageType('success')
                setStep(3)
            } else {
                setMessage(responseData.message || 'Invalid verification code')
                setMessageType('failed')
            }
        } catch (error) {
            console.error('Error:', error)
            setMessage('Server connection error. Please check your internet connection.')
            setMessageType('failed')
        } finally {
            setIsLoading(false)
        }

        setTimeout(() => setMessage(''), 5000)
    }

    const handleResetPassword = async (e) => {
        e.preventDefault()
        setIsLoading(true)

        if (newPassword !== confirmPassword) {
            setMessage('Passwords do not match')
            setMessageType('failed')
            setIsLoading(false)
            setTimeout(() => setMessage(''), 5000)
            return
        }

        if (newPassword.length < 6) {
            setMessage('Password must be at least 6 characters long')
            setMessageType('failed')
            setIsLoading(false)
            setTimeout(() => setMessage(''), 5000)
            return
        }

        const apiUrl = 'http://medscanapi.runasp.net/api/Auth/reset-password'

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    email,
                    resetCode,
                    newPassword 
                }),
            })

            const responseData = await response.json()

            if (response.ok && responseData.success) {
                setMessage('Password changed successfully')
                setMessageType('success')
                
                setTimeout(() => {
                    window.location.href = '/login'
                }, 2000)
            } else {
                setMessage(responseData.message || 'Failed to change password')
                setMessageType('failed')
            }
        } catch (error) {
            console.error('Error:', error)
            setMessage('Server connection error. Please check your internet connection.')
            setMessageType('failed')
        } finally {
            setIsLoading(false)
        }

        setTimeout(() => setMessage(''), 5000)
    }

    return (
        <section className='lg:px-20 py-10 relative'>
            <img className='m-auto w-[70%] h-full hidden lg:block relative z-0' src={shadow} />
            <div className='lg:flex lg:w-[70%] lg:h-[86%] lg:absolute start-60 top-14'>
                <div className='lg:w-1/2 bg-linear-gradient rounded-s-3xl hidden lg:flex justify-center items-center'>
                    <img className='z-20 w-72' src={logo} />
                </div>
                <div className='bg-white w-full lg:w-1/2 rounded-e-3xl px-8 py-14'>
                    
                    {step === 1 && (
                        <>
                            <h2 className='text-center font-semibold text-2xl py-10'>Reset Password</h2>
                            <form onSubmit={handleRequestReset}>
                                <div className='py-2'>
                                    <label className='block mb-2 text-[14px]'>Email</label>
                                    <input 
                                        value={email} 
                                        onChange={(e) => setEmail(e.target.value)} 
                                        placeholder='Email' 
                                        type="email"
                                        required
                                        disabled={isLoading}
                                        className='w-full border-[1px] rounded-lg ps-3 py-1 border-slate-300 placeholder:text-sm disabled:opacity-50' 
                                    />
                                </div>
                                <div className='flex justify-center items-center my-4'>
                                    <button 
                                        type='submit' 
                                        disabled={isLoading}
                                        className='bg-Primary w-full py-2 rounded-lg text-white font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed'
                                    >
                                        {isLoading ? 'Sending...' : 'Send Reset Code'}
                                    </button>
                                </div>
                            </form>
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <h2 className='text-center font-semibold text-2xl py-10'>Verify Code</h2>
                            <form onSubmit={handleVerifyCode}>
                                <div className='py-2'>
                                    <label className='block mb-2 text-[14px]'>Verification Code</label>
                                    <input 
                                        value={resetCode} 
                                        onChange={(e) => setResetCode(e.target.value)} 
                                        placeholder='Enter verification code' 
                                        required
                                        disabled={isLoading}
                                        className='w-full border-[1px] rounded-lg ps-3 py-1 border-slate-300 placeholder:text-sm disabled:opacity-50' 
                                    />
                                </div>
                                <div className='flex justify-center items-center my-4'>
                                    <button 
                                        type='submit' 
                                        disabled={isLoading}
                                        className='bg-Primary w-full py-2 rounded-lg text-white font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed'
                                    >
                                        {isLoading ? 'Verifying...' : 'Verify Code'}
                                    </button>
                                </div>
                            </form>
                        </>
                    )}

                    {step === 3 && (
                        <>
                            <h2 className='text-center font-semibold text-2xl py-10'>New Password</h2>
                            <form onSubmit={handleResetPassword}>
                                <div className='py-2'>
                                    <label className='block mb-2 text-[14px]'>New Password</label>
                                    <input 
                                        value={newPassword} 
                                        onChange={(e) => setNewPassword(e.target.value)} 
                                        type='password' 
                                        placeholder='New Password (min 6 characters)' 
                                        required
                                        disabled={isLoading}
                                        className='w-full border-[1px] rounded-lg ps-3 py-1 border-slate-300 placeholder:text-sm disabled:opacity-50' 
                                    />
                                </div>
                                <div className='py-2'>
                                    <label className='block mb-2 text-[14px]'>Confirm Password</label>
                                    <input 
                                        value={confirmPassword} 
                                        onChange={(e) => setConfirmPassword(e.target.value)} 
                                        type='password' 
                                        placeholder='Confirm Password' 
                                        required
                                        disabled={isLoading}
                                        className='w-full border-[1px] rounded-lg ps-3 py-1 border-slate-300 placeholder:text-sm disabled:opacity-50' 
                                    />
                                </div>
                                <div className='flex justify-center items-center my-4'>
                                    <button 
                                        type='submit' 
                                        disabled={isLoading}
                                        className='bg-Primary w-full py-2 rounded-lg text-white font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed'
                                    >
                                        {isLoading ? 'Changing Password...' : 'Change Password'}
                                    </button>
                                </div>
                            </form>
                        </>
                    )}

                    <div>
                        <p className={`text-center font-semibold py-1 ${messageType === 'failed' ? 'text-red-700' : 'text-Primary'}`}>
                            {message}
                        </p>
                    </div>

                    <div className='text-center py-5'>
                        <p className='pt-2 text-black-medium'>
                            Remember your password? <Link to={'/login'} className='text-Primary'>Sign in</Link>
                        </p>
                    </div>

                </div>
            </div>
        </section>
    )
}

export default ResetPassword

