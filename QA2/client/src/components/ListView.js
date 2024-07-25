import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const ListView = ({ pets }) => {
  return (
    <Wrapper>
      {pets.map((pet) => {
        const { _id, thumbnail, name, description, age, gender, vaccinated, spayed_neutered } = pet;
        return (
          <article key={_id}>
            <img src={thumbnail} alt={name} />
            <div>
              <h4>{name}</h4>
              <p className='desc'>{description.substring(0, 150)}...</p>
              <p className='info'><span>Age:</span> {age.years} years, {age.months} months</p>
              <p className='info'><span>Gender:</span> {gender}</p>
              <p className='info'><span>Vaccinated:</span> {vaccinated ? 'Yes' : 'No'}</p>
              <p className='info'><span>Spayed/Neutered:</span> {spayed_neutered ? 'Yes' : 'No'}</p>
              <Link to={`/pets/${_id}`} className='btn'>Details</Link>
            </div>
          </article>
        );
      })}
    </Wrapper>
  );
};

const Wrapper = styled.section`
  display: grid;
  row-gap: 3rem;

  img {
    width: 100%;
    display: block;
    width: 300px;
    height: 200px;
    object-fit: cover;
    border-radius: var(--radius);
    margin-bottom: 1rem;
  }
  h4 {
    margin-bottom: 0.5rem;
  }
  .desc {
    max-width: 45em;
    margin-bottom: 1rem;
  }
  .info {
    margin-bottom: 0.5rem;
    span {
      font-weight: bold;
    }
  }
  .btn {
    font-size: 0.85rem;
    padding: 0.25rem 0.5rem;
  }
  @media (min-width: 992px) {
    article {
      display: grid;
      grid-template-columns: auto 1fr;
      column-gap: 2rem;
      align-items: center;
    }
  }
`;

export default ListView;
