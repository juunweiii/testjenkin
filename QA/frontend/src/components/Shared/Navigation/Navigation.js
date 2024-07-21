
import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import { NavbarBrand } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import UserDropdown from '../UserDropdown/UserDropdown';
import { Dropdown , DropdownButton,InputGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import './Navigation.css'
import { UserContext } from '../UserProvider/UserProvider';

const Navigation = () => {

    const token = localStorage.getItem('token');
    const [message, setMessage] = useState('');

    const [searchOption, setSearchOption] = useState('Topics');

    const handleSelect = (e) => {
      setSearchOption(e);
      
    };
    const logoPath = `${process.env.PUBLIC_URL}/images/logo2x.png`;
    var isLoggedIn =true;
    const [query, setQuery] = useState('');
    const navigate = useNavigate();
    const handleInputChange = (e) => {
        setQuery(e.target.value);
      };
    
      const handleSubmit = (e) => {
        e.preventDefault();
        if (query == ""){
            navigate(`/searchresult/${searchOption}/default`);
        }
        else {        
        
        navigate(`/searchresult/${searchOption}/${query}`);
    }

      };

      const { user } = useContext(UserContext);


  return (
  <div className="nav-container">
    <div className="upper-nav">
        <Container className='upper-nav-container'>
                <a href="/privacypolicy">Privacy policy</a>
                {user && user.role === "admin" && <a href="/admindashboard">Admin Dashboard</a>}
                {user && user.role === "moderator" && <a href="/moderatordashboard">Moderator Dashboard</a>}    
                <a href="/codeofconduct">Code of Conduct</a>
        </Container>
    </div>
    <Navbar expand="md" className="nav-main">
        <Container className="nav-container">
            <NavbarBrand href="/home" className="nav-logo"> <img src={logoPath} alt="ThreadHub logo"title="ThreadHub logo" className='logo-img'/></NavbarBrand>
            
            
           
            

                
            <Form className="d-flex search-form" onSubmit={handleSubmit}>
                
                <InputGroup className="">
                
                
                <DropdownButton
                    as={InputGroup.Append}
                    variant="outline-secondary"
                    title={searchOption}
                    id="input-group-dropdown-2"
                    onSelect={handleSelect}
                    
                >
                    <Dropdown.Item eventKey="Topics">Topics</Dropdown.Item>
                    <Dropdown.Item eventKey="Subtopics">Subtopics</Dropdown.Item>
                    <Dropdown.Item eventKey="Threads">Threads</Dropdown.Item>
                </DropdownButton>
                <InputGroup.Text id="basic-addon1" className='search-bar-icon'>
                <FontAwesomeIcon icon={faSearch} className=''/>
                </InputGroup.Text>
                
                
                <Form.Control
                type="search"
                placeholder="Search"
                className="me-2 search-input"
                aria-label="Search"
                value={query}
                onChange={handleInputChange}
                />
                </InputGroup>




                
                <Button variant="" type='submit'className='home-btn'>Search</Button>
            </Form>

            
            <Nav
                className="my-2 my-lg-0 nav-actions"
                style={{ maxHeight: '100px' }}
                navbarScroll>

                {isLoggedIn ? (
                        <>
                        
                          
                          <UserDropdown username={ user && user.username} className="nav-user-dropdown"/>
                        
                        <div class="nav-user-picture">
                        <img className='profile-img' src={user && user.profilePicture} alt={`${user && user.username}'s profile`} />
                        <span className='nav-user-role'>{user && user.role}</span>
                        </div>
                        </>
                    ) : (
                        <>
                        <Nav.Link href="/signup">Sign up</Nav.Link>
                        <Nav.Link href="/login">Sign in</Nav.Link>
                        </>
                    )}
                </Nav>
                
                

                
        </Container>
    </Navbar>
</div>
);
};

export default Navigation;
