import React, { useState } from 'react';
import styled from 'styled-components';
import { useCartContext } from '../context/cart_context';
import { useCheckoutContext } from '../context/checkout_context';
import { useNavigate } from 'react-router-dom';

const initialState = {
  name: '',
  email: '',
  address: '',
  phone: '',
  comments: '',
};

const CheckoutForm = () => {
  const { cart, clearCart } = useCartContext();
  const { submitRequest, isLoading, showAlert, alertText, alertType } = useCheckoutContext();
  const navigate = useNavigate();
  const [values, setValues] = useState(initialState);

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = { ...values, cart };
    submitRequest(formData);
    clearCart();
    navigate('/');
  };

  return (
    <Wrapper>
      <form className='form' onSubmit={handleSubmit}>
        <h3>Checkout</h3>
        {showAlert && <p className={`alert alert-${alertType}`}>{alertText}</p>}
        <div className='form-row'>
          <label htmlFor='name' className='form-label'>
            Name
          </label>
          <input
            type='text'
            name='name'
            className='form-input'
            value={values.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className='form-row'>
          <label htmlFor='email' className='form-label'>
            Email
          </label>
          <input
            type='email'
            name='email'
            className='form-input'
            value={values.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className='form-row'>
          <label htmlFor='address' className='form-label'>
            Address
          </label>
          <input
            type='text'
            name='address'
            className='form-input'
            value={values.address}
            onChange={handleChange}
            required
          />
        </div>
        <div className='form-row'>
          <label htmlFor='phone' className='form-label'>
            Phone
          </label>
          <input
            type='tel'
            name='phone'
            className='form-input'
            value={values.phone}
            onChange={handleChange}
            required
          />
        </div>
        <div className='form-row'>
          <label htmlFor='comments' className='form-label'>
            Comments or Preferences
          </label>
          <textarea
            name='comments'
            className='form-input'
            value={values.comments}
            onChange={handleChange}
          />
        </div>
        <button type='submit' className='btn btn-block' disabled={isLoading}>
          {isLoading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </Wrapper>
  );
};

const Wrapper = styled.section`
  form {
    background-color: #fff;
    padding: 2rem;
    border-radius: 0.5rem;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    max-width: 400px;
    width: 100%;
    text-align: center;
  }

  .form-row {
    margin-bottom: 1rem;
  }

  .form-label {
    display: block;
    text-align: left;
    margin-bottom: 0.5rem;
    color: #555;
    font-weight: bold;
  }

  .form-input {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 0.25rem;
    font-size: 1rem;
  }

  button {
    display: block;
    width: 100%;
    padding: 0.75rem;
    border: none;
    border-radius: 0.25rem;
    font-size: 1rem;
    cursor: pointer;
    margin-top: 1rem;
    background-color: #007bff;
    color: #fff;
  }

  button:hover {
    background-color: #0056b3;
  }

  .alert {
    margin-bottom: 1rem;
    padding: 0.5rem;
    border-radius: 0.25rem;
  }

  .alert-success {
    background-color: #d4edda;
    color: #155724;
  }

  .alert-danger {
    background-color: #f8d7da;
    color: #721c24;
  }
`;

export default CheckoutForm;
