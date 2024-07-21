import React, { useEffect, useState,useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Navigation from '../Shared/Navigation/Navigation';
import { Button,Form, Alert } from 'react-bootstrap';
import Footer from '../Shared/Footer/Footer';
import ThumbsUpDownIcon from '@mui/icons-material/ThumbsUpDown';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import Modal from 'react-bootstrap/Modal';
import { UserContext } from '../Shared/UserProvider/UserProvider';
import DOMPurify from 'dompurify';
import 'bootstrap/dist/css/bootstrap.css';
import './UserProfile.css';
import TopicListItem from '../Shared/TopicListItem/TopicListItem';



const UserProfile = () => {

  const [message, setMessage] = useState('');

  const [bannableRoles, setBannableRoles]  =useState([]);
  const [userInfo,setUserInfo] = useState(null);
  const [isSelf, setIsSelf]= useState(false);
  const [reputation,setReputation] = useState(0);

  const { userid } = useParams();
  const { user ,setUser} = useContext(UserContext);
  
 
  const navigate = useNavigate();

  //for modal
  const [show, setShow] = useState(false);
  const [editedProfilePicture, setEditedProfilePicture] = useState('');
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleProfilePictureInputChange = (e) => {
      setEditedProfilePicture(e.target.value);
    };

  const handleEditProfilePicture = async () => {
    try {
      const sanitizedProfilePicture = DOMPurify.sanitize(editedProfilePicture);
      const response = await axios.patch(`${process.env.REACT_APP_HTTP_URL}/api/users/v1/updateUsers`, {
          usersId: user.usersId,
          username: user.username,
          email: user.email,
          profilePicture:sanitizedProfilePicture
      },{withCredentials: true});
      
      setUser(prevUserInfo => ({
        ...prevUserInfo,
        profilePicture:editedProfilePicture,
      }))
      
    } 
    catch (error) {
      if (error.response) {
        console.error('Error updating user:', error.response.data);
        setMessage(`Error updating user: ${error.response.data.message || 'Unknown error'}`);
      } else if (error.request) {
        console.error('No response received:', error.request);
        setMessage('No response from server');
      } else {
        console.error('Error setting up request:', error.message);
        setMessage(`Error updating user: ${error.message}`);
      }
    }

  }


  const handleSubmit = (e) => {
      e.preventDefault(); // Prevent default form submission
      handleEditProfilePicture();
      handleClose(); // Close the modal after saving changes
    };




//todo convert to use context and add edit profile picture

useEffect(() => {
  if (userid === 'self' || userid === user.usersId) {
    setIsSelf(true);
  } else {
    setIsSelf(false);
  }
}, [userid, user.usersId]);

useEffect(() => {
   
    if (!isSelf){
      fetchUserData(userid);
      fetchUserReputation(userid)
      
      if(user.role === 'admin'){
 
        setBannableRoles(['moderator']) ;
 
      }else if(user.role === 'moderator'){
        setBannableRoles(['user'])
      }

    } else{
      //call new APIS
    
      fetchUserReputation(user.usersId)
      setEditedProfilePicture(user.profilePicture)
      
    }


  }, [isSelf, user]);





const handleBanToggle = async (id,status) =>{
  

  
  const banned = status === 'true';

  
 
  try {
      const response = await axios.patch(`${process.env.REACT_APP_HTTP_URL}/api/users/v1/banUsers`, {
          
          usersId:id,
          isBanned: !banned,
        
      },{withCredentials: true});
      
      setUserInfo(prevUserInfo => ({
        ...prevUserInfo,
        isBanned: !banned ? 'true' : 'false',
      }));
    } 
    catch (error) {
      if (error.response) {
        console.error('Error banning user:', error.response.data);
        setMessage(`Error banning user: ${error.response.data.message || 'Unknown error'}`);
      } else if (error.request) {
        console.error('No response received:', error.request);
        setMessage('No response from server');
      } else {
        console.error('Error setting up request:', error.message);
        setMessage(`Error banning user: ${error.message}`);
      }
    }

}

const handleModToggle = async (id,role) =>{
        
  if (role ==='moderator'){
      var newRole = 'user'
  }else if (role ==='user'){
      var newRole = 'moderator'
  }

  try {
      const response = await axios.patch(`${process.env.REACT_APP_HTTP_URL}/api/users/v1/updateUsersRole`, 
        {
          
          usersId:id,
          role: newRole,
        
      },{withCredentials: true});
      setUserInfo(prevUserInfo => ({
        ...prevUserInfo,
        role: newRole,
      }));
    } 
    catch (error) {
      if (error.response) {
        console.error('Error banning user:', error.response.data);
        setMessage(`Error banning user: ${error.response.data.message || 'Unknown error'}`);
      } else if (error.request) {
        console.error('No response received:', error.request);
        setMessage('No response from server');
      } else {
        console.error('Error setting up request:', error.message);
        setMessage(`Error banning user: ${error.message}`);
      }
    }

}


  


  const fetchUserData = async (userID) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_HTTP_URL}/api/users/v1/getUsers`, {
        params: {
          usersId:userID,
        },
        withCredentials: true,
      });
      
      setUserInfo(response.data.data)
      
      setMessage('User Fetched Sucessfully');
    } catch (error) {
      if (error.response) {
        console.error('Error fetching user data:', error.response.data);
        setMessage(`Error fetching user data: ${error.response.data.message || 'Unknown error'}`);
      } else if (error.request) {
        console.error('No response received:', error.request);
        setMessage('No response from server');
      } else {
        console.error('Error setting up request:', error.message);
        setMessage(`Error fetching topics: ${error.message}`);
      }
    }
  };

    // Function to fetch all topics
    const fetchUserReputation = async (userId) => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_HTTP_URL}/api/users/v1/getUsersRep`, {
          params: {
            usersId:userId,
          },
          withCredentials: true,
        });
        
        setReputation(response.data.data.reputation)
        setMessage('User reputation Fetched Sucessfully');
      } catch (error) {
        if (error.response) {
          console.error('Error fetching reputation:', error.response.data);
          setMessage(`Error fetching reputation: ${error.response.data.message || 'Unknown error'}`);
        } else if (error.request) {
          console.error('No response received:', error.request);
          setMessage('No response from server');
        } else {
          console.error('Error setting up request:', error.message);
          setMessage(`Error fetching topics: ${error.message}`);
        }
      }
    };

    if(isSelf){
      
    return (
      <>
    <Navigation>navcontent</Navigation>
    
    <div className="header-gradient"></div>
    <Container className='user-profile-container'>
    <div className="page-content-background">
      <Row>
          <Col>
  
  
  
            
  
  
          <div className='profile-container'>
            <div className = 'user-image-card'>
              <div className='profile-page-img-container'>
                <img src={user.profilePicture} alt="profile-picture" className = "profile-page-img"></img>
              </div>
              <button className="btn primary-btn" onClick = {() =>handleShow()}>Change Picture</button>
            
            </div>
  
            <div className = 'user-info-card'>
            
              <h1>{user.username}'s Profile</h1>
              <div className='horizontal-divider'></div>
              <p><span>Email:</span> {user.email}</p>
              <p><span>Member Since:</span> {moment(user.createdAt).format( 'MMMM Do YYYY, h:mm:ss a')}</p>
              <p><span>Role:</span> {user.role}</p>
              <p><span>Reputation: </span> {reputation}<ThumbsUpDownIcon></ThumbsUpDownIcon></p>
              <p><span>Status:</span> {user.isBanned ==="false" ?  'Active' :'Banned'}</p>

              {message && (
                <Alert variant="info" onClose={() => setMessage('')} dismissible>
                  {message}
                </Alert>
              )}
              
            </div>
          </div>
  
  
  
          
        
          </Col>
      </Row>

      <Modal show={show} onHide={handleClose} className='edit-profile-picture-modal' size="md" aria-labelledby="contained-modal-title-vcenter" centered>
                <Form onSubmit={handleSubmit}>
                <Modal.Header closeButton>
                <Modal.Title>Change Profile Picture</Modal.Title>
                
                </Modal.Header>
                        <div className="edited-preview-container">
                        <img src={editedProfilePicture} alt="profile-picture" className = "profile-page-preview-img"></img>
                        </div>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>Edit Profile Picture Link</Form.Label>
                        <Form.Control as="textarea" rows={3} placeholder={user.profilePicture} value={editedProfilePicture} onChange={handleProfilePictureInputChange}/>
                        </Form.Group>
                        <Form.Group
                        className="mb-3"
                        controlId="exampleForm.ControlTextarea1"
                        >
                       
                        </Form.Group>
                    
                <Modal.Footer>
                <Button variant="secondary" className='modal-btn' onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" className='modal-btn' type='submit' >
                    Save Changes
                </Button>
                </Modal.Footer>
                </Form>
      </Modal>
      
      </div>
    </Container>
  
    <Footer></Footer>
      </>
  )}else if(userInfo && bannableRoles){

  // User interface
  return (
    <>
  <Navigation>navcontent</Navigation>
  
  <div className="header-gradient"></div>
  <Container className='user-profile-container'>
  <div className="page-content-background">
    <Row>
        <Col>



        <div className='profile-container'>
          <div className = 'user-image-card'>
            <div className='profile-page-img-container'>
            <img src={userInfo.profilePicture} alt="profile-picture" className = "profile-page-img"></img>
            </div>
          
          
          </div>

          <div className = 'user-info-card'>
          
            <h1>{userInfo.username}'s Profile</h1>
            <div className='horizontal-divider'></div>
            <p><span>Member Since:</span> {moment(userInfo.createdAt).format( 'MMMM Do YYYY, h:mm:ss a')}</p>
            <p><span>Role:</span> {userInfo.role}</p>
            <p><span>Reputation: </span> {reputation}<ThumbsUpDownIcon></ThumbsUpDownIcon></p>
            <p><span>Status:</span> {userInfo.isBanned ==="false" ?  'Active' :'Banned'}</p>
            <div className="user-actions">
              {bannableRoles.includes(userInfo.role) &&  <Button onClick = {() => handleBanToggle(userid,userInfo.isBanned)}>{userInfo.isBanned === 'false' ? 'Ban User': 'Unban User'}</Button>}
              {!isSelf && user.role === 'admin' && userInfo.role !== 'admin' && <Button onClick = {() => handleModToggle(userid,userInfo.role)}>{userInfo.role === 'moderator' ? 'Demote To User': 'Promote To Moderator'}</Button>}
          </div>
          {message && (
                <Alert variant="info" onClose={() => setMessage('')} dismissible>
                  {message}
                </Alert>
              )}
          </div>
        </div>



        
        
        </Col>
    </Row>
    </div>
    
  </Container>

  <Footer></Footer>
  
  </>
  )}
  else{
    return (<div>loading...</div>)
  };
};

export default UserProfile;