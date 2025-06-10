import React from 'react'
import MainSection from './MainSection'
import HowSection from './HowSection'
import WhySection from './WhySection'
import MeetDoctor from './MeetDoctor'
import AskQuestion from './AskQuestion'
import DownloadApp from './DownloadApp'
import Footer from './Footer'

const Home = () => {
  return (
    <div>
      <MainSection />
      <HowSection />
      <WhySection />
      <MeetDoctor />
      <AskQuestion />
      <DownloadApp />
    </div>
  )
}

export default Home