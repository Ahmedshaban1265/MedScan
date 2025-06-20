import { BrowserRouter, Routes, Route } from "react-router-dom"
import PrivateRoute from './Auth/PrivateRoute'
import Home from "./Components/Home"
import Navbar from "./Components/Navbar"
import Footer from "./Components/Footer"
import Services from "./Pages/Services"
import AboutUs from "./Pages/AboutUs"
import ContactUs from "./Pages/ContactUs"
import Login from "./Pages/Login"
import SignUp from "./Pages/SignUp"
import ResetPassword from "./Pages/ResetPassword"
import Scan from "./Pages/Scan"
import ScanResult from "./Pages/ScanResult"
import Booking from "./Pages/Booking"
import PatientProfile from "./Pages/PatientProfile"
import DoctorProfile from "./Pages/DoctorProfile"
import AllAppointments from "./Pages/AllAppointments"
import DoctorDashboard from "./Pages/DoctorDashboard"
import { AuthProvider } from "./Auth/AuthProvider"

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/booking" element={<PrivateRoute><Booking /></PrivateRoute> } />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signUp" element={<SignUp />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/scan-result" element={<ScanResult />} />
          <Route path="/scan" element={<PrivateRoute> <Scan /> </PrivateRoute>} />
          <Route path="/patient-profile" element={ <PrivateRoute> <PatientProfile /> </PrivateRoute>} />
          <Route path="/doctor-profile" element={ <PrivateRoute> <DoctorProfile /> </PrivateRoute>} />
          <Route path="/doctor-dashboard" element={<PrivateRoute> <DoctorDashboard /> </PrivateRoute>} />
          <Route path="/all-appointments" element={ <PrivateRoute> <AllAppointments /> </PrivateRoute>} />
        </Routes>
        <Footer />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
