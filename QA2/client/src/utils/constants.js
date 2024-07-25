import React from 'react';
import { GiCompass, GiDiamondHard, GiStabbedNote } from 'react-icons/gi';
import { useAppContext } from '../context/appContext';

export const useLinks = () => {
  const { user } = useAppContext();

  const baseLinks = [
    {
      id: 1,
      text: 'home',
      url: '/',
    },
    {
      id: 2,
      text: 'about',
      url: '/about',
    },
    {
      id: 3,
      text: 'pets',
      url: '/pets',
    },
  ];

  //Roles page is only accessible by admin users
  if (user && user.role === 'admin') {
    baseLinks.push({
      id: 4,
      text: 'roles',
      url: '/roles',
    });
  }

  //Processing of adoption page is only accessible by staff users
  else if (user && user.role === 'staff') {
    baseLinks.push({
      id: 5,
      text: 'adoption',
      url: '/adoption',
    });
  }

  return baseLinks;
};

export const services = [
  {
    id: 1,
    icon: <GiCompass />,
    title: 'mission',
    text: 'Our mission is to connect loving families with pets in need of a home. We aim to provide a safe and nurturing environment for all animals while promoting responsible pet ownership and compassion for all living beings.',
  },
  {
    id: 2,
    icon: <GiDiamondHard />,
    title: 'vision',
    text: 'We envision a world where every pet has a loving and permanent home. Through community outreach, education, and support, we strive to end pet homelessness and ensure the well-being of all animals.',
  },
  {
    id: 3,
    icon: <GiStabbedNote />,
    title: 'history',
    text: 'Founded with the belief that every pet deserves a second chance, Pawsome Friends Adoption Center has been dedicated to rescuing and rehoming pets since [Year]. Our journey started with a small group of volunteers and has grown into a community-wide effort to make a difference in the lives of countless animals.',
  },
];

export const pets_url = 'https://ict2216-secure-software-development.onrender.com/api/v1/pets/';

export const single_pet_url = `https://ict2216-secure-software-development.onrender.com/api/v1/pets/`;

// export const pets_url = '/utils/pets.json'
// export const single_pet_url = '/utils/pets_detail.json?id='
