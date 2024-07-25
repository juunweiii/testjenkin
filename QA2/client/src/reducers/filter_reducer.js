import {
  LOAD_PETS,
  SET_LISTVIEW,
  SET_GRIDVIEW,
  UPDATE_SORT,
  SORT_PETS,
  UPDATE_FILTERS,
  FILTER_PETS,
  CLEAR_FILTERS,
} from '../actions';

const filter_reducer = (state, action) => {
  if (action.type === LOAD_PETS) {
    return {
      ...state,
      all_pets: Array.isArray(action.payload) ? [...action.payload] : [],
      filtered_pets: Array.isArray(action.payload) ? [...action.payload] : [],
    };
  }
  if (action.type === SET_GRIDVIEW) {
    return { ...state, grid_view: true };
  }
  if (action.type === SET_LISTVIEW) {
    return { ...state, grid_view: false };
  }
  if (action.type === UPDATE_SORT) {
    return { ...state, sort: action.payload };
  }
  if (action.type === SORT_PETS) {
    const { sort, filtered_pets } = state;
    let tempPets = [...filtered_pets];
    if (sort === 'name-a') {
      tempPets = tempPets.sort((a, b) => a.name.localeCompare(b.name));
    }
    if (sort === 'name-z') {
      tempPets = tempPets.sort((a, b) => b.name.localeCompare(a.name));
    }
    if (sort === 'age-youngest') {
      tempPets = tempPets.sort((a, b) => (a.age.years === b.age.years ? a.age.months - b.age.months : a.age.years - b.age.years));
    }
    if (sort === 'age-oldest') {
      tempPets = tempPets.sort((a, b) => (a.age.years === b.age.years ? b.age.months - a.age.months : b.age.years - a.age.years));
    }

    return { ...state, filtered_pets: tempPets };
  }
  if (action.type === UPDATE_FILTERS) {
    const { name, value } = action.payload;
    return { ...state, filters: { ...state.filters, [name]: value } };
  }
  if (action.type === FILTER_PETS) {
    const { all_pets, filters } = state;
    const { text, category, shelter, gender, vaccinated, spayed_neutered } = filters;
    let tempPets = [...all_pets];

    if (text) {
      tempPets = tempPets.filter((pet) => pet.name.toLowerCase().includes(text.toLowerCase()));
    }
    if (category !== 'all') {
      tempPets = tempPets.filter((pet) => pet.species.toLowerCase() === category.toLowerCase());
    }
    if (shelter !== 'all') {
      tempPets = tempPets.filter((pet) => pet.shelter.toLowerCase() === shelter.toLowerCase());
    }
    if (gender !== 'all') {
      tempPets = tempPets.filter((pet) => pet.gender.toLowerCase() === gender.toLowerCase());
    }
    if (vaccinated !== 'all') {
      tempPets = tempPets.filter((pet) => (vaccinated === 'yes' ? pet.vaccinated : !pet.vaccinated));
    }
    if (spayed_neutered !== 'all') {
      tempPets = tempPets.filter((pet) => (spayed_neutered === 'yes' ? pet.spayed_neutered : !pet.spayed_neutered));
    }

    return { ...state, filtered_pets: tempPets };
  }
  if (action.type === CLEAR_FILTERS) {
    return {
      ...state,
      filters: {
        ...state.filters,
        text: '',
        shelter: 'all',
        category: 'all',
        gender: 'all',
        vaccinated: 'all',
        spayed_neutered: 'all',
      },
    };
  }
  throw new Error(`No Matching "${action.type}" - action type`);
};

export default filter_reducer;
