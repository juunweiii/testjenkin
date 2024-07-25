import React from 'react'
import styled from 'styled-components'
import { Filters, PetList, Sort, PageHero } from '../components'
const PetsPage = () => {
  return (
    <main>
      <PageHero title='pets' />
      <Wrapper className='page'>
        <div className='section-center pets'>
          <Filters />
          <div>
            <Sort />
            <PetList />
          </div>
        </div>
      </Wrapper>
    </main>
  )
}

const Wrapper = styled.div`
  .pets {
    display: grid;
    gap: 3rem 1.5rem;
    margin: 4rem auto;
  }
  @media (min-width: 768px) {
    .pets {
      grid-template-columns: 200px 1fr;
    }
  }
`

export default PetsPage
