import React, { useState } from 'react'
import { AnimatePresence } from "framer-motion";
import HeroSection from './HeroSection'
import Howitworks from './Howitworks'
import CommunityStories from './Communitystories'
import Ctasection from './Ctasection'
import usePageTitle from '../../hooks/usePageTitle'
import CoinLoader from '../CoinLoader';



const HomePage = () => {
    usePageTitle("Home Page")
    const [initLoading, setInitLoading] = useState(true);

    return (
        <>
            <AnimatePresence>
                {initLoading && <CoinLoader key="loader" onDone={() => setInitLoading(false)} text="Loading…" />}
            </AnimatePresence>

            {!initLoading && (
                <>
                    <HeroSection  />
                    <Howitworks />
                    <CommunityStories />
                    <Ctasection />
                </>
            )}
        </>

    )
}

export default HomePage