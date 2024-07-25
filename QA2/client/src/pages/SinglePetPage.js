import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePetsContext } from '../context/pets_context';
import { single_pet_url as url } from '../utils/constants';

import {
  Loading,
  Error,
  PetImages,
  AddToCart,
  PageHero,
} from '../components';

import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/appContext';

const SinglePetPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAppContext();
  const {
    single_pet_loading: loading,
    single_pet_error: error,
    single_pet: pet,
    fetchSinglePet,
  } = usePetsContext();

  useEffect(() => {
    fetchSinglePet(`${url}${id}`, id);
    // eslint-disable-next-line
  }, [id]);

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        navigate('/');
      }, 3000);
    }
    // eslint-disable-next-line
  }, [error]);

  if (loading) return <Loading />;
  if (error) return <Error />;
  
  const {
    name,
    description,
    age,
    species,
    breed,
    gender,
    images,
    vaccinated,
    spayed_neutered,
    adoption_requirements,
    personality_traits
  } = pet;
  return (
    <Wrapper>
      <PageHero title={name} pet />
      <div className='section section-center page'>
        <Link to='/pets' className='btn'>back to pets</Link>
        <div className='pet-center'>
          <PetImages images={images} />
          <section className='content'>
            <h2>{name}</h2>
            <p className='desc'>{description}</p>
            <p className='info'><span>Species:</span> {species}</p>
            <p className='info'><span>Breed:</span> {breed}</p>
            <p className='info'><span>Gender:</span> {gender}</p>
            {age && <p className='info'><span>Age:</span> {age.years} years, {age.months} months</p>}
            <p className='info'><span>Vaccinated:</span> {vaccinated ? 'Yes' : 'No'}</p>
            <p className='info'><span>Spayed/Neutered:</span> {spayed_neutered ? 'Yes' : 'No'}</p>
            <div className='tags'>
              {adoption_requirements && adoption_requirements.map((req, index) => (
                <span key={index} className='tag'>{req}</span>
              ))}
              {personality_traits && personality_traits.map((trait, index) => (
                <span key={index} className='tag'>{trait}</span>
              ))}
            </div>
            <hr />
            {user ? <AddToCart pet={pet} /> : <p>Please log in to adopt the pet.</p>}
          </section>
        </div>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.main`
  .pet-center {
    display: grid;
    gap: 4rem;
    margin-top: 2rem;
  }
  .desc {
    line-height: 2;
    max-width: 45em;
  }
  .info {
    text-transform: capitalize;
    width: 300px;
    display: grid;
    grid-template-columns: 145px 1fr;
    span {
      font-weight: 700;
    }
  }
  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin: 1rem 0;
  }
  .tag {
    // background: var(--clr-primary-6);
    border: 2px solid var(--clr-primary-5);
    color: var(--clr-primary-6);
    font-weight: 600;
    padding: 0.25rem 0.5rem;
    border-radius: var(--radius);
    font-size: 0.85rem;
  }

  @media (min-width: 992px) {
    .pet-center {
      grid-template-columns: 1fr 1fr;
      align-items: center;
    }
  }
`;

export default SinglePetPage;
