import { BrowserRouter, Route, Router, Routes } from "react-router-dom"
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
import { AuthProvider } from "./Auth/AuthProvider"

function App() {

  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signUp" element={<SignUp />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/scan" element={<Scan />} />
          <Route path="/scan-result" element={<ScanResult />} />
        </Routes>
        <Footer />
      </AuthProvider>

    </BrowserRouter>
  )
}

export default App
