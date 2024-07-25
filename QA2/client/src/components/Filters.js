import React from 'react';
import styled from 'styled-components';
import { useFilterContext } from '../context/filter_context';
import { getUniqueValues } from '../utils/helpers';

const Filters = () => {
  const {
    filters: {
      text,
      category,
      shelter,
      gender,
      vaccinated,
      spayed_neutered,
      age,
    },
    updateFilters,
    clearFilters,
    all_pets,
  } = useFilterContext();

  const categories = getUniqueValues(all_pets, 'species');
  const shelters = getUniqueValues(all_pets, 'shelter');
  const genders = ['all', 'male', 'female'];
  const vaccinationStatus = ['all', 'yes', 'no'];
  const spayedNeuteredStatus = ['all', 'yes', 'no'];

  return (
    <Wrapper>
      <div className='content'>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className='form-control'>
            <input
              type='text'
              name='text'
              value={text}
              placeholder='search'
              onChange={updateFilters}
              className='search-input'
            />
          </div>
          <div className='form-control'>
            <h5>species</h5>
            <div>
              {categories.map((c, index) => (
                <button
                  key={index}
                  onClick={updateFilters}
                  type='button'
                  name='category'
                  className={`${category === c.toLowerCase() ? 'active' : ''}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div className='form-control'>
            <h5>shelter</h5>
            <select
              name='shelter'
              value={shelter}
              onChange={updateFilters}
              className='shelter-select'
            >
              {shelters.map((s, index) => (
                <option key={index} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div className='form-control'>
            <h5>gender</h5>
            <select
              name='gender'
              value={gender}
              onChange={updateFilters}
              className='gender-select'
            >
              {genders.map((g, index) => (
                <option key={index} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>
          <div className='form-control'>
            <h5>vaccinated</h5>
            <select
              name='vaccinated'
              value={vaccinated}
              onChange={updateFilters}
              className='vaccinated-select'
            >
              {vaccinationStatus.map((v, index) => (
                <option key={index} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>
          <div className='form-control'>
            <h5>spayed/neutered</h5>
            <select
              name='spayed_neutered'
              value={spayed_neutered}
              onChange={updateFilters}
              className='spayed-neutered-select'
            >
              {spayedNeuteredStatus.map((s, index) => (
                <option key={index} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </form>
        <button type='button' className='clear-btn' onClick={clearFilters}>
          clear filters
        </button>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.section`
  .form-control {
    margin-bottom: 1.25rem;
    h5 {
      margin-bottom: 0.5rem;
    }
  }
  .search-input {
    padding: 0.5rem;
    background: var(--clr-grey-10);
    border-radius: var(--radius);
    border-color: transparent;
    letter-spacing: var(--spacing);
  }
  .search-input::placeholder {
    text-transform: capitalize;
  }

  button {
    display: block;
    margin: 0.25em 0;
    padding: 0.25rem 0;
    text-transform: capitalize;
    background: transparent;
    border: none;
    border-bottom: 1px solid transparent;
    letter-spacing: var(--spacing);
    color: var(--clr-grey-5);
    cursor: pointer;
  }
  .active {
    border-color: var(--clr-grey-5);
  }
  .shelter-select, .gender-select, .vaccinated-select, .spayed-neutered-select {
    background: var(--clr-grey-10);
    border-radius: var(--radius);
    border-color: transparent;
    padding: 0.25rem;
  }
  .clear-btn {
    background: var(--clr-red-dark);
    color: var(--clr-white);
    padding: 0.25rem 0.5rem;
    border-radius: var(--radius);
  }
  @media (min-width: 768px) {
    .content {
      position: sticky;
      top: 1rem;
    }
  }
`;

export default Filters;
