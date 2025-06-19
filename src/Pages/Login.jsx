import React, { useState } from 'react'
import shadow from '../assets/Bg-Shape.png'
import logo from '../assets/logo1.png'
import apple from '../assets/icons/apple.png'
import face from '../assets/icons/face.png'
import google from '../assets/icons/google.png'
import { useAuth } from '../Auth/AuthProvider'
import { Link, useNavigate } from 'react-router-dom'

// Helper function to decode JWT
const decodeJwt = (token) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error("Error decoding JWT:", e);
        return null;
    }
};

const Login = () => {

    const [message, setMessage] = useState('')
    const [messageType, setMessageType] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()

    const { setAuth, login } = useAuth()
    const [email, setMail] = useState('')
    const [password, setPassword] = useState('')


    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const loginData = {
            email: email,
            password: password,
        };

        const apiUrl = 'https://medscanapi.runasp.net/api/Auth/login';

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData),
            })

            const responseData = await response.json()

            if (response.ok && responseData.success) {
                setMessage('Login successful!')
                setMessageType('success')

                const token = responseData.data; // The JWT token itself
                localStorage.setItem('token', token);

                const decodedToken = decodeJwt(token);
                let userRole = null;
                if (decodedToken && decodedToken.role) {
                    userRole = decodedToken.role;
                    localStorage.setItem('userRole', userRole);
                }

                
                login({
                    email: decodedToken?.email,
                    userName: decodedToken?.email?.split('@')[0]
                }, decodedToken?.role);
                setAuth(true)

                console.log('Login successful:', responseData)
                console.log('Decoded Token:', decodedToken);
                console.log('User Role:', userRole);

                setTimeout(() => {
                    navigate('/')
                }, 2000);

            } else {
                setMessage(responseData.message || 'Login failed')
                setMessageType('failed')

                console.error('Login error:', responseData);
            }

        } catch (e) {
            console.log('Network error:', e)
            setMessage('Server connection error. Please check your internet connection.')
            setMessageType('failed')
        } finally {
            setIsLoading(false);
        }

        // Clear form
        setMail('')
        setPassword('')

        // Clear message after 5 seconds
        setTimeout(() => {
            setMessage('')
        }, 5000)
    }

    return (
        <section className=' lg:px-20 py-10 relative'>
            <img className='m-auto  w-[70%]  h-full  hidden lg:block  relative z-0' src={shadow} />
            <div className='lg:flex  lg:w-[70%]  lg:h-[86%]   lg:absolute  start-60  top-14'>
                <div className='  lg:w-1/2 bg-linear-gradient  rounded-s-3xl  hidden lg:flex justify-center items-center '>
                    <img className=' z-20  w-72' src={logo} />
                </div>
                <div className='bg-white w-full lg:w-1/2   rounded-e-3xl px-8 py-14'>
                    <h2 className='text-center font-semibold text-2xl py-10'>Sign in to your account!</h2>

                    <form onSubmit={handleSubmit}>

                        <div className='py-2'>
                            <label className='block  mb-2 text-[14px]'>Email</label>
                            <input
                                value={email}
                                onChange={(e) => setMail(e.target.value)}
                                placeholder='Email'
                                type="email"
                                required
                                disabled={isLoading}
                                className='w-full border-[1px] rounded-lg ps-3 py-1 border-slate-300 placeholder:text-sm disabled:opacity-50'
                            />
                        </div>

                        <div className='py-2'>
                            <label className='block  mb-2 text-[14px]'>Password</label>
                            <input
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                type='password'
                                placeholder='Password'
                                required
                                disabled={isLoading}
                                className='w-full border-[1px] rounded-lg ps-3 py-1 border-slate-300 placeholder:text-sm disabled:opacity-50'
                            />
                            <div className='text-right mt-1'>
                                <Link to={'/reset-password'} className='text-Primary text-sm hover:underline'>
                                    Forgot password?
                                </Link>
                            </div>
                        </div>

                        <div className='flex justify-center items-center my-2'>
                            <button
                                type='submit'
                                disabled={isLoading}
                                className='bg-Primary w-full py-2 rounded-lg text-white font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed'
                            >
                                {isLoading ? 'Signing in...' : 'Sign In'}
                            </button>
                        </div>

                        <div>
                            <p className={`text-center font-semibold py-1  ${messageType === 'failed' ? 'text-red-700' : 'text-Primary'}`}>
                                {message}
                            </p>
                        </div>

                    </form>

                    <div className='text-center py-5'>
                        <p className='py-2 text-Secondary-darkGray text-sm'>Sign in with</p>
                        <div className='flex items-center justify-center gap-4 py-2'>
                            <img src={face} alt="Facebook" />
                            <img src={google} alt="Google" />
                            <img src={apple} alt="Apple" />
                        </div>
                        <p className='pt-2 text-black-medium'>
                            Don't have an account? <Link to={'/signUp'} className='text-Primary'>Create account</Link>
                        </p>
                    </div>

                </div>
            </div>
        </section>
    )
}

export default Login


