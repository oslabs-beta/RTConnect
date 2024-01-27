import React, { Component } from 'react';
import SectionOne from '../components/sections/SectionOne.jsx';
import SectionTwo from '../components/sections/SectionTwo.jsx';
import SectionThree from '../components/sections/SectionThree.jsx';
import Team from '../components/Team.jsx'
import Footer from '../components/Footer.jsx'
import RTNavBar from '../components/RTNavbar.jsx'
import RTHeader from '../components/sections/RTHeader.jsx'

const Home = () => {

  return (
    <div className="home">
      {/* <div className=' font-body bg-gradient-to-r from-indigo-900 via-sky-800 to-cyan-500'> */}
        <div class=" font-body bg-zinc-100">
       
        <RTNavBar />
        <SectionOne />
        <SectionTwo />
        <SectionThree />
        <RTHeader/>
        <Team />
        {/* <Team 
          name={'Yoojin'}
          description={'In her free time blah blah'}
        />
        <Team 
          name={'Raisa'}
          description={'In her free time blah blah'}
        />
        <Team 
          name={'Anthony'}
          description={'In her free time blah blah'}
        />
        <Team 
          name={'Louis'}
          description={'In her free time blah blah'}
        /> */}

        <Footer />
        </div>
    </div>
  );
}

export default Home;