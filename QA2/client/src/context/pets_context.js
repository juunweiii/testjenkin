import axios from 'axios'
import React, { useContext, useEffect, useReducer } from 'react'
import reducer from '../reducers/pets_reducer'
import { pets_url as url } from '../utils/constants'
import {
  SIDEBAR_OPEN,
  SIDEBAR_CLOSE,
  GET_PETS_BEGIN,
  GET_PETS_SUCCESS,
  GET_PETS_ERROR,
  GET_SINGLE_PET_BEGIN,
  GET_SINGLE_PET_SUCCESS,
  GET_SINGLE_PET_ERROR,
} from '../actions';

// Import local JSON data
// import petsData from '../utils/pets.json';
// import petsDetailData from '../utils/pets_detail.json';

const initialState = {
  isSidebarOpen: false,
  pets_loading: false,
  pets_error: false,
  pets: [],
  featured_pets: [],
  single_pet_loading: false,
  single_pet_error: false,
  single_pet: {},
}

const PetsContext = React.createContext()

export const PetsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  const openSidebar = () => {
    dispatch({ type: SIDEBAR_OPEN })
  }
  const closeSidebar = () => {
    dispatch({ type: SIDEBAR_CLOSE })
  }

  const fetchPets = async (url) => {
    dispatch({ type: GET_PETS_BEGIN })
    try {
      const response = await axios.get(url);
      const pets = response.data.pets;
      // const pets = petsData;
      dispatch({ type: GET_PETS_SUCCESS, payload: pets });
    } catch (error) {
      dispatch({ type: GET_PETS_ERROR })
    }
  }
  const fetchSinglePet = async (url, id) => {
    dispatch({ type: GET_SINGLE_PET_BEGIN })
    try {
      const response = await axios.get(url);
      const singlePet = response.data.pet;
      // const singlePet = petsDetailData.find((pet) => pet.id === id);
      if (!singlePet) {
        throw new Error('Pet not found');
      }
      dispatch({ type: GET_SINGLE_PET_SUCCESS, payload: singlePet });
    } catch (error) {
      dispatch({ type: GET_SINGLE_PET_ERROR })
    }
  }

  useEffect(() => {
    fetchPets(url)
  }, [])

  return (
    <PetsContext.Provider
      value={{
        ...state,
        openSidebar,
        closeSidebar,
        fetchSinglePet,
      }}
    >
      {children}
    </PetsContext.Provider>
  )
}
// make sure use
export const usePetsContext = () => {
  return useContext(PetsContext)
}
