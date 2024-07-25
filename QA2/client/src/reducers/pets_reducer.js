import {
  SIDEBAR_OPEN,
  SIDEBAR_CLOSE,
  GET_PETS_BEGIN,
  GET_PETS_SUCCESS,
  GET_PETS_ERROR,
  GET_SINGLE_PET_BEGIN,
  GET_SINGLE_PET_SUCCESS,
  GET_SINGLE_PET_ERROR,
} from '../actions'

const pets_reducer = (state, action) => {
  if (action.type === SIDEBAR_OPEN) {
    return { ...state, isSidebarOpen: true }
  }
  if (action.type === SIDEBAR_CLOSE) {
    return { ...state, isSidebarOpen: false }
  }

  if (action.type === GET_PETS_BEGIN) {
    return { ...state, pets_loading: true }
  }
  if (action.type === GET_PETS_SUCCESS) {
    const featured_pets = action.payload

    return {
      ...state,
      pets_loading: false,
      pets: action.payload,
      featured_pets,
    }
  }
  if (action.type === GET_PETS_ERROR) {
    return { ...state, pets_loading: false, pets_error: true }
  }
  if (action.type === GET_SINGLE_PET_BEGIN) {
    return {
      ...state,
      single_pet_loading: true,
      single_pet_error: false,
    }
  }
  if (action.type === GET_SINGLE_PET_SUCCESS) {
    return {
      ...state,
      single_pet_loading: false,
      single_pet: action.payload,
    }
  }
  if (action.type === GET_SINGLE_PET_ERROR) {
    return {
      ...state,
      single_pet_loading: false,
      single_pet_error: true,
    }
  }
  throw new Error(`No Matching "${action.type}" - action type`)
}

export default pets_reducer
