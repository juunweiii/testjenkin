import React from 'react'
import { FeaturedPets, Hero, Services, Contact } from '../components'
const HomePage = () => {
  return (
    <main>
      <Hero />
      <FeaturedPets />
      <Services />
      <Contact />
    </main>
  )
}

export default HomePage
