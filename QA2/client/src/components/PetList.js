import React from 'react'
import { useFilterContext } from '../context/filter_context'
import GridView from './GridView'
import ListView from './ListView'
const PetList = () => {
  const { filtered_pets: pets, grid_view } = useFilterContext()
  console.log(pets)
  if (pets.length < 1) {
    return (
      <h5 style={{ textTransform: 'none' }}>
        Sorry, no pets matched your search.
      </h5>
    )
  }

  if (grid_view === false) {
    return <ListView pets={pets} />
  }
  return <GridView pets={pets} />
}

export default PetList
