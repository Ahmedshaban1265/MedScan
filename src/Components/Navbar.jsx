import React, { useEffect, useRef, useState } from 'react'
import logo from '../assets/logo.png'
import menu from '../assets/icons/menue.png'
import close from '../assets/icons/close.png'
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { getNavbarData } from '../../data'
import RegistrationBtns from './RegistrationBtns'
import { useAuth } from '../Auth/AuthProvider'
import NotificationIcon from './NotificationIcon'
import NotificationDropdown from './NotificationDropdown'
import { useNotifications } from '../Auth/NotificationContext'

const Navbar = () => {
  const { user, logOut } = useAuth()
  const { unreadCount, notifications } = useNotifications()
  const navigate = useNavigate()
  const location = useLocation()

  // Refs for dropdown menus
  const userDropdownRef = useRef(null)
  const notificationDropdownRef = useRef(null)

  // Notification dropdown state
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] = useState(false)

  const storedUsername = localStorage.getItem('userName')
  const storedUserData = localStorage.getItem('user')
  const storedFirstName = localStorage.getItem('firstName')
  const storedLastName = localStorage.getItem('lastName')
  const storedRole = localStorage.getItem("userRole")

  let displayedUsername = null
  let userRole = null

  if (user?.userName) {
    displayedUsername = user.userName
  } else if (user?.username) {
    displayedUsername = user.username
  } else if (user?.name) {
    displayedUsername = user.name
  } else if (user?.firstName) {
    displayedUsername = user.firstName
  } else if (storedFirstName) {
    displayedUsername = storedFirstName
  } else if (storedUsername) {
    displayedUsername = storedUsername
  } else if (storedUserData) {
    try {
      const userData = JSON.parse(storedUserData)
      displayedUsername = userData.userName || userData.username || userData.name || userData.firstName
    } catch (e) {
      if (storedUserData && !storedUserData.includes('@')) {
        displayedUsername = storedUserData
      }
    }
  }

  if (user?.role !== undefined) {
    userRole = user.role
  } else if (storedRole) {
    userRole = storedRole
  }

  if (displayedUsername) {
    displayedUsername = displayedUsername.replace(/['"]/g, '')
    if (displayedUsername.includes('@')) {
      displayedUsername = displayedUsername.split('@')[0]
    }
  }

  const getProfileLink = () => {
    if (userRole === "Doctor") {
      return '/doctor-dashboard'
    } else if (userRole === "Patient") {
      return '/patient-profile'
    } else {
      return '/patient-profile'
    }
  }

  // Get navbar data based on user role
  const navbarData = getNavbarData(userRole)

  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  
  // Notification handlers
  const handleNotificationClick = () => {
    setIsNotificationDropdownOpen(!isNotificationDropdownOpen)
  }

  const handleNotificationUpdate = (updatedNotifications) => {
    // This will be handled by the NotificationContext
  }

  const handlelogout = () => {
    setIsDropdownOpen(false)
    logOut()
    navigate('/')
  }

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  const renderRegistrationButtons = (gap, className) => {
    const currentPath = location.pathname

    if (currentPath === '/signup' || currentPath === '/signUp') {
      return (
        <div className={`flex ${gap} transition-all duration-300 ease-in-out`}>
          <Link
            to="/login"
            className={`${className} border-2 border-Primary text-Primary rounded-lg hover:bg-Primary hover:text-white transition-all duration-200`}
          >
            Log in
          </Link>
        </div>
      )
    } else if (currentPath === '/login') {
      return (
        <div className={`flex ${gap} transition-all duration-300 ease-in-out`}>
          <Link
            to="/signup"
            className={`${className} bg-Primary text-white rounded-lg hover:bg-Primary-dark transition-all duration-200`}
          >
            Sign UP
          </Link>
        </div>
      )
    } else {
      return (
        <div className="transition-all duration-300 ease-in-out">
          <RegistrationBtns gap={gap} className={className} />
        </div>
      )
    }
  }

  const [toggle, setToggle] = useState(false)
  const [showmenuIcon, setshowmenuIcon] = useState(false)
  const sidebarRef = useRef(null)

  const handleClickOutside = (event) => {
    if (toggle && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      setToggle(false)
    }
    
    // Close user dropdown if clicking outside
    if (isDropdownOpen && userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false)
    }
    
    // Close notification dropdown if clicking outside
    if (isNotificationDropdownOpen && notificationDropdownRef.current && !notificationDropdownRef.current.contains(event.target)) {
      setIsNotificationDropdownOpen(false)
    }
  }

useEffect(() => {
  const handleSize = () => {
    if (window.innerWidth <= 1024) {
      setshowmenuIcon(true)
    } else {
      setshowmenuIcon(false)
      setToggle(false)
    }
  }

  handleSize()
  window.addEventListener('resize', handleSize)
  document.addEventListener('mousedown', handleClickOutside)

  return () => {
    window.removeEventListener('resize', handleSize)
    document.removeEventListener('mousedown', handleClickOutside)
  }
}, [toggle, showmenuIcon, isDropdownOpen, isNotificationDropdownOpen])

  return (
    <section className='' >
      {
        showmenuIcon ? (
          <div className=' fixed top-0 w-full z-20 bg-white py-4 px-3 flex justify-between items-center shadow-lg  border-b-[3px] border-opacity-20 border-Secondary-darkGray'>
            <div className='flex items-center gap-2'>
              <img className='cursor-pointer' onClick={() => setToggle(!toggle)} width={24} height={24} src={menu} />
              <Link to="/">
                <img width={71} height={36} src={logo} />
              </Link>
            </div>
            

            <div className='flex items-center gap-3'>
              {/* Notification Icon for Mobile */}
              {user && (
                <div className="relative" ref={notificationDropdownRef}>
                  <NotificationIcon 
                    unreadCount={unreadCount}
                    onClick={handleNotificationClick}
                    className="mr-2"
                  />
                  <NotificationDropdown
                    isOpen={isNotificationDropdownOpen}
                    onClose={() => setIsNotificationDropdownOpen(false)}
                    onNotificationUpdate={handleNotificationUpdate}
                  />
                </div>
              )}

              <div className='relative' ref={userDropdownRef}>
                {
                  user ? (
                    <button onClick={toggleDropdown} className=' cursor-pointer flex items-center gap-2 px-4 py-2'>
                      <svg className='fill-Primary mb-2' width={20} height={20} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                        <path d="M182.6 470.6c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-9.2-9.2-11.9-22.9-6.9-34.9s16.6-19.8 29.6-19.8l256 0c12.9 0 24.6 7.8 29.6 19.8s2.2 25.7-6.9 34.9l-128 128z" />
                      </svg>
                      <p className='text-[14px] font-semibold capitalize'>
                        {displayedUsername || 'User'}
                      </p>
                      <p className='font-bold bg-Primary px-[10px] py-1 text-white rounded-full shadow-xl'>
                        {(displayedUsername || 'U').charAt(0).toUpperCase()}
                      </p>
                    </button>
                  ) : (
                    renderRegistrationButtons('gap-1', 'px-3 py-1 text-[12px] font-[500]')
                  )
                }

                <div>
                  {
                    isDropdownOpen &&
                    <div className='z-30 absolute top-[66px] bg-white w-full cursor-pointer border-2 text-center'>
                      <Link
                        to={getProfileLink()}
                        className='block text-black-medium font-semibold py-2 text-[15px] hover:bg-gray-100'
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        {userRole === "Doctor" ? 'Dashboard' : 'Profile'}
                      </Link>
                      {userRole === "Doctor" && (
                        <Link
                          to="/doctor-profile"
                          className='block text-black-medium font-semibold py-2 text-[15px] hover:bg-gray-100'
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          Profile
                        </Link>
                      )}
                      <button onClick={handlelogout} className='w-full text-black-medium font-semibold py-2 text-[15px] hover:bg-gray-100'>
                        Logout
                      </button>
                    </div>
                  }
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className=' bg-white px-20 py-2 flex items-center justify-between border-b-[3px] border-opacity-20 border-Secondary-darkGray'>
            <Link to="/">
              <img src={logo} width={120} height={60} />
            </Link>
            <div className='flex items-center gap-14'>
              {
                navbarData.map((item) => (
                  <div key={item.name}>
                    <NavLink className={({ isActive }) =>
                      isActive ? 'text-Primary font-[600] text-lg' : ' text-Secondary-mediumGray text-lg hover:text-Primary hover:font-[500]'
                    } to={item.path}>{item.name}</NavLink>
                  </div>
                ))
              }
            </div>

            <div className='flex items-center gap-4'>
              {/* Notification Icon for Desktop */}
              {user && (
                <div className="relative" ref={notificationDropdownRef}>
                  <NotificationIcon 
                    unreadCount={unreadCount}
                    onClick={handleNotificationClick}
                  />
                  <NotificationDropdown
                    isOpen={isNotificationDropdownOpen}
                    onClose={() => setIsNotificationDropdownOpen(false)}
                    onNotificationUpdate={handleNotificationUpdate}
                  />
                </div>
              )}

              <div className='relative' ref={userDropdownRef}>
                {
                  user ? (
                    <button onClick={toggleDropdown} className=' cursor-pointer flex items-center gap-3 px-4 py-2'>
                      <svg className='fill-Primary mb-2' width={25} height={25} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                        <path d="M182.6 470.6c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-9.2-9.2-11.9-22.9-6.9-34.9s16.6-19.8 29.6-19.8l256 0c12.9 0 24.6 7.8 29.6 19.8s2.2 25.7-6.9 34.9l-128 128z" />
                      </svg>
                      <p className='text-[14px] font-semibold capitalize'>
                        {displayedUsername || 'User'}
                      </p>
                      <p className='font-bold bg-Primary px-3 py-2 text-white rounded-full shadow-xl'>
                        {(displayedUsername || 'U').charAt(0).toUpperCase()}
                      </p>
                    </button>
                  ) : (
                    renderRegistrationButtons('gap-5', 'px-8 py-2 text-[17px] font-[600]')
                  )
                }

                <div>
                  {
                    isDropdownOpen &&
                    <div className='z-30 absolute top-[66px] bg-white w-full cursor-pointer border-2 text-center'>
                      <Link
                        to={getProfileLink()}
                        className='block text-black-medium font-semibold py-2 text-[15px] hover:bg-gray-100'
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        {userRole === "Doctor" ? 'Dashboard' : 'Profile'}
                      </Link>
                      {userRole === "Doctor" && (
                        <Link
                          to="/doctor-profile"
                          className='block text-black-medium font-semibold py-2 text-[15px] hover:bg-gray-100'
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          Profile
                        </Link>
                      )}
                      <button onClick={handlelogout} className='w-full text-black-medium font-semibold py-2 text-[15px] hover:bg-gray-100'>
                        Logout
                      </button>
                    </div>
                  }
                </div>
              </div>
            </div>
          </div>
        )
      }
      {showmenuIcon && <div className="h-16"></div>}



      {/* SideBar */}
      <div ref={sidebarRef}>
        <div className={`sidebar ${toggle ? "open" : "close"} `}>
          <div className="p-10 pt-24">
            <ul>
              {navbarData.map((item, index) => (
                <div key={item.name} className="flex justify-center mt-10">
                  <li className=' m-auto'>
                    <NavLink className={({ isActive }) =>
                      isActive ? 'text-Primary text-lg font-bold' : ' text-Secondary-mediumGray  hover:text-Primary hover:font-bold text-lg'
                    } to={item.path} onClick={() => setToggle(false)}>
                      {item.name}
                    </NavLink>
                  </li>
                </div>
              ))}
            </ul>
          </div>
          <img onClick={() => setToggle(false)} className='m-auto cursor-pointer' src={close} />
        </div>
      </div>
    </section>
  )
}

export default Navbar
