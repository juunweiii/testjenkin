import React from 'react'
import { FaShoppingCart, FaUserMinus, FaUserPlus } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { usePetsContext } from '../context/pets_context'
import { useCartContext } from '../context/cart_context'
import { useAppContext } from '../context/appContext'

const CartButton = () => {
  const { closeSidebar } = usePetsContext()
  const { total_items, clearCart } = useCartContext()
  const { user, logout } = useAppContext(); // Use user to determine if user is logged in or not

  return (
    <Wrapper className='cart-btn-wrapper'>
      {user ? ( // If user is logged in then provide a welcome user feedback
        <>
          <Link to='/cart' className='cart-btn' onClick={closeSidebar}>
            Cart
            <span className='cart-container'>
              <FaShoppingCart />
              <span className='cart-value'>{total_items}</span>
            </span>
          </Link>
          <Link
            to='/'
            className='auth-btn'
            onClick={() => {
              clearCart();
              localStorage.removeItem('user');
              logout();
            }}
          >
            {`Welcome, ${user.name || user.nickname}`} <FaUserMinus />
          </Link>
        </>
      ) : (
        // Otherwise bring them to the login page
        <Link type='button' className='auth-btn' to='/login'>
          Login <FaUserPlus />
        </Link>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  width: 225px;

  .cart-btn {
    color: var(--clr-grey-1);
    font-size: 1.5rem;
    letter-spacing: var(--spacing);
    color: var(--clr-grey-1);
    display: flex;

    align-items: center;
  }
  .cart-container {
    display: flex;
    align-items: center;
    position: relative;
    svg {
      height: 1.6rem;
      margin-left: 5px;
    }
  }
  .cart-value {
    position: absolute;
    top: -10px;
    right: -16px;
    background: var(--clr-primary-5);
    width: 16px;
    height: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    font-size: 0.75rem;
    color: var(--clr-white);
    padding: 12px;
  }
  .auth-btn {
    display: flex;
    align-items: center;
    background: transparent;
    border-color: transparent;
    font-size: 1.5rem;
    cursor: pointer;
    color: var(--clr-grey-1);
    letter-spacing: var(--spacing);
    svg {
      margin-left: 5px;
    }
  }
`
export default CartButton
