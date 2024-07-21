import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Navigation from '../Shared/Navigation/Navigation';
import Select from 'react-select';
import usePagination from '@mui/material/usePagination';
import { Pagination } from '@mui/material';
import Footer from '../Shared/Footer/Footer';

import Form from 'react-bootstrap/Form';
import UserList from '../Shared/UserList/UserList';
import { Dropdown, DropdownButton, InputGroup ,Alert} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.css';
import './AdminDashboard.css';
import TopicListItem from '../Shared/TopicListItem/TopicListItem';

import Button from 'react-bootstrap/Button';

import { UserContext } from '../Shared/UserProvider/UserProvider';

const AdminDashboard = () => {
    const [message, setMessage] = useState('');
    const [users, setUsers] = useState([]);
    const [userRep, setUserRep] = useState([]);
    const [totalUsers, setTotalUsers] = useState(0);
    const [query, setQuery] = useState('');
    const [sortField, setSortField] = useState('usersId');
    const [sortOrder, setSortOrder] = useState('asc');
    const { user } = useContext(UserContext);

    const navigate = useNavigate();
    const sortOptions = [
        { value: 'username', label: 'Username' },
        { value: 'email', label: 'Email' },
        { value: 'isBanned', label: 'Banned Status' },
        { value: 'role', label: 'Role' },
        { value: 'createdAt', label: 'Created At' },
        { value: 'updatedAt', label: 'Updated At' }
    ];

    const orderOptions = [
        { value: 'asc', label: 'Ascending' },
        { value: 'desc', label: 'Descending' }
    ];

    const handleUserSearchInputChange = (e) => {
        setQuery(e.target.value);
    };

    const handleBanToggle = async (id, status) => {
        const banned = status === 'true';
        try {
            const response = await axios.patch(`${process.env.REACT_APP_HTTP_URL}/api/users/v1/banUsers`, {
                usersId: id,
                isBanned: !banned,
            }, { withCredentials: true });
            const updatedUsers = users.map(user => {
                if (user.usersId === id) {
                    return { ...user, isBanned: banned ? 'false' : 'true' };
                }
                return user;
            });
            setUsers(updatedUsers);
        } catch (error) {
            handleFetchError(error, 'banning user');
        }
    };

    const handleModToggle = async (id, role) => {
        const newRole = role === 'moderator' ? 'user' : 'moderator';
        try {
            const response = await axios.patch(`${process.env.REACT_APP_HTTP_URL}/api/users/v1/updateUsersRole`, {
                usersId: id,
                role: newRole,
            }, { withCredentials: true });
            const updatedUsers = users.map(user => {
                if (user.usersId === id) {
                    return { ...user, role: newRole };
                }
                return user;
            });
            setUsers(updatedUsers);
        } catch (error) {
            handleFetchError(error, 'updating user role');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        fetchUsers();
    };

    const fetchUsers = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_HTTP_URL}/api/users/v1/getAllUsers`, {
                params: {
                    username: query,
                    limit: 0,
                    offset: 0,
                    sortField: sortField,
                    sortOrder: sortOrder
                },
                withCredentials: true,
            });
            const allUsers = response.data.data.result;
            const filteredUsers = allUsers.filter(listUser => listUser.usersId !== user.usersId && listUser.role !== 'admin');
            setUsers(filteredUsers);
            setTotalUsers(filteredUsers.length);
            setMessage('Users fetched successfully');
        } catch (error) {
            handleFetchError(error, 'fetching users');
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [user, sortField, sortOrder, query]);

    useEffect(() => {
        if (user.role !== 'admin')
            navigate('/home');
    }, user);

    useEffect(() => {
        const fetchUsersRep = async () => {
            try {
                const requests = users.map(({ usersId }) => {
                    return axios.get(`${process.env.REACT_APP_HTTP_URL}/api/users/v1/getUsersRep`, {
                        params: {
                            usersId: usersId.toString(),
                        },
                        withCredentials: true,
                    });
                });
                const responses = await Promise.all(requests);
                const responseData = responses.map(response => response.data.data);
                setUserRep(responseData);
            } catch (error) {
                handleFetchError(error, 'fetching users rep');
            }
        };
        if (users.length > 0) {
            fetchUsersRep();
        }
    }, [users]);

    const handleFetchError = (error, action) => {
        if (error.response) {
            console.error(`Error ${action}:`, error.response.data);
            setMessage(`Error ${action}: ${error.response.data.message || 'Unknown error'}`);
        } else if (error.request) {
            console.error('No response received:', error.request);
            setMessage('No response from server');
        } else {
            console.error('Error setting up request:', error.message);
            setMessage(`Error ${action}: ${error.message}`);
        }
    };

    return (
        <>
            <Navigation />
            <div className="header-gradient"></div>
            <Container className='admin-dashboard-container'>
            <div className="page-content-background">
                <Row>
                    <Col>
                        <div className='title-container'>
                        {message && (
                            <Alert variant="info" onClose={() => setMessage('')} dismissible>
                            {message}
                            </Alert>)}
                            <h1>Admin Dashboard</h1>
                            <Form className="user-search-form" onSubmit={handleSubmit}>
                                <div className='search-users'>
                                    <h2>Search Users:</h2>
                                    <InputGroup>
                                        <InputGroup.Text id="basic-addon1" className='search-bar-icon'>
                                            <FontAwesomeIcon icon={faSearch} />
                                        </InputGroup.Text>
                                        <Form.Control
                                            type="search"
                                            placeholder="Search Users"
                                            aria-label="Search"
                                            className='search-input'
                                            value={query}
                                            onChange={handleUserSearchInputChange}
                                        />
                                    </InputGroup>
                                    
                                </div>
                                <div className='user-search-options'>
                                    <div className='sort-users'>
                                        <h2>Sort By:</h2>
                                        <Select
                                            options={sortOptions}
                                            className='sort-dropdown' 
                                            onChange={(selectedOption) => setSortField(selectedOption.value)}
                                            value={sortOptions.find(option => option.value === sortField)}
                                        />
                                        <Select
                                            options={orderOptions}
                                            className='sort-dropdown' 
                                            onChange={(selectedOption) => setSortOrder(selectedOption.value)}
                                            value={orderOptions.find(option => option.value === sortOrder)}
                                        />
                                    </div>
                                    <div className='sort-users'>
                                        <h2>Total Results: {totalUsers}</h2>
                                    </div>
                                    
                                </div>
                            </Form>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        {userRep.length > 0 && users.length === userRep.length && (
                            <UserList
                                users={users}
                                userReps={userRep}
                                selfRole={user.role}
                                toggleBan={handleBanToggle}
                                toggleMod={handleModToggle}
                            />
                        )}
                        <Pagination count={Math.ceil(totalUsers / 10)} className='topics-pagination' />
                    </Col>
                </Row>
                
                </div>
            </Container>
            <Footer />
        </>
    );
};

export default AdminDashboard;
