import React from 'react';
import { NavDropdown } from 'react-bootstrap';
import Cookies from 'js-cookie';

const handleLogout = async () => {
  try {
    const response = await fetch(`${process.env.REACT_APP_HTTP_URL}/api/auth/v1/logout`, {
      method: 'POST',
      credentials: 'include',
    });

    if (response.ok) {
      localStorage.removeItem('token');
      Cookies.remove('token', { path: '/' });
      window.location.href = '/login';
    } else {
      // Handle error response
      console.error('Logout failed');
    }
  } catch (error) {
    console.error('Error during logout:', error);
  }
};

const UserDropdown = ({ username }) => {
  return (
    <NavDropdown title={`Hi ${username}`} id="navbarScrollingDropdown" className='user-dropdown'>
      <NavDropdown.Item href="/profile/self">View Profile</NavDropdown.Item>
      <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
    </NavDropdown>
  );
}

export default UserDropdown;