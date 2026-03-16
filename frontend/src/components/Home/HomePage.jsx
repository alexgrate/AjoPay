import React from 'react'
import HeroSection from './HeroSection'
import Howitworks from './Howitworks'
import CommunityStories from './Communitystories'
import Ctasection from './Ctasection'
import usePageTitle from '../../hooks/usePageTitle'



const HomePage = () => {
    usePageTitle("Home Page")
    return (
        <>
            <HeroSection />
            <Howitworks />
            <CommunityStories />
            <Ctasection />
        </>
    )
}

export default HomePage