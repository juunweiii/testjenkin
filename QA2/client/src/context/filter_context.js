import React, { useEffect, useContext, useReducer } from 'react';
import reducer from '../reducers/filter_reducer';
import {
  LOAD_PETS,
  SET_GRIDVIEW,
  SET_LISTVIEW,
  UPDATE_SORT,
  SORT_PETS,
  UPDATE_FILTERS,
  FILTER_PETS,
  CLEAR_FILTERS,
} from '../actions';
import { usePetsContext } from './pets_context';

const initialState = {
  filtered_pets: [],
  all_pets: [],
  grid_view: true,
  sort: 'name-a',
  filters: {
    text: '',
    shelter: 'all',
    category: 'all',
    gender: 'all',
    vaccinated: 'all',
    spayed_neutered: 'all',
  },
};

const FilterContext = React.createContext();

export const FilterProvider = ({ children }) => {
  const { pets } = usePetsContext();
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    dispatch({ type: LOAD_PETS, payload: pets });
  }, [pets]);

  useEffect(() => {
    dispatch({ type: FILTER_PETS });
    dispatch({ type: SORT_PETS });
  }, [state.sort, state.filters]);

  const setGridView = () => {
    dispatch({ type: SET_GRIDVIEW });
  };

  const setListView = () => {
    dispatch({ type: SET_LISTVIEW });
  };

  const updateSort = (e) => {
    const value = e.target.value;
    dispatch({ type: UPDATE_SORT, payload: value });
  };

  const updateFilters = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    if (name === 'category') {
      value = e.target.textContent;
    }
    dispatch({ type: UPDATE_FILTERS, payload: { name, value } });
  };

  const clearFilters = () => {
    dispatch({ type: CLEAR_FILTERS });
  };

  return (
    <FilterContext.Provider
      value={{
        ...state,
        setGridView,
        setListView,
        updateSort,
        updateFilters,
        clearFilters,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};

export const useFilterContext = () => {
  return useContext(FilterContext);
};
