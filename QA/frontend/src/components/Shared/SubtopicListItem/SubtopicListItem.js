import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button, Dropdown,Form,Modal } from 'react-bootstrap';

import './SubtopicListItem.css';

import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import ThumbUpIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbDownIcon from '@mui/icons-material/ThumbDownAlt';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import moment from 'moment';


const SubtopicListItem = ({subtopic,self, handleDeleteSubtopic,handleToggleLikeSubtopic,handleToggleDislikeSubtopic,handleEditSubtopic}) => {
    
    const liked = subtopic.like.usersLike.indexOf(self.usersId) >=0
    const disliked =subtopic.like.usersDislike.indexOf(self.usersId) >=0
    const [show, setShow] = useState(false);
    const [editedTitle, setEditedTitle ]= useState(subtopic.title);
    const [editedDesc, setEditedDesc ]= useState(subtopic.description);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleTitleInputChange = (e) => {
        setEditedTitle(e.target.value);
      };
    const handleDescInputChange = (e) => {
        setEditedDesc(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent default form submission
        handleEditSubtopic(subtopic.subTopicsId, subtopic.topicsId,editedTitle, editedDesc);
        handleClose(); // Close the modal after saving changes
      };

      

    const canModify = subtopic.creator.usersId === self.usersId || self.role ==="moderator" || self.role ==="admin" //to remove admin

    return (
    <div className='subtopic-list-item'>
        <div className='subtopic-content-container'>
            <div>
                <img src = {subtopic.creator.profilePicture} alt ="user-profile-picture" className='user-picture'></img>
                <span className='user-role'>{subtopic.creator.role}</span>
                <span className='user-status'>{subtopic.creator.isBanned==="true"?'Banned':'Active'}</span>
            </div>
            <div className='subtopic-info'>
            <div className='subtopic-title-info'>
                <a href={`/profile/${subtopic.creator.usersId}`}><h4 className='user-name'>{subtopic.creator.username}</h4></a>
                
                {//temporarily disabled till we can decode url properly
                /*<a href= {`/subtopic/${subtopic.topics.title}/${subtopic.title}`} className='subtopic-list-item-link'><h3>{subtopic.title}</h3></a>*/}
                <a href= {`/subtopic/${subtopic.subTopicsId}`} className='subtopic-list-item-link'><h3>{subtopic.title}</h3></a>

                <div className='subtopic-list-item-content'>
                <p className='subtopic-description'>{subtopic.description}</p><br/>
                
                <div className='subtopic-list-metadata'>
                <Button className={`rating-button ${liked && 'active'}`} onClick = {() => handleToggleLikeSubtopic(subtopic.subTopicsId, liked,disliked) }>{liked ? <ThumbUpIcon></ThumbUpIcon>:<ThumbUpOffAltIcon></ThumbUpOffAltIcon> }</Button>
                
                <p>{subtopic.like.count} </p> 
                
                <Button className={`rating-button ${disliked && 'active'}`} onClick = {() => handleToggleDislikeSubtopic(subtopic.subTopicsId, disliked,liked) }>{disliked ?  <ThumbDownIcon></ThumbDownIcon>:<ThumbDownOffAltIcon></ThumbDownOffAltIcon>}</Button>
                <div className='divider'></div>
                
                <p className='edit-date'><span></span>Edited At: {moment(subtopic.updatedAt).format( 'MMMM Do YYYY, h:mm:ss a')} </p>
                </div>
            </div>
            </div>
            
            {canModify &&(<Dropdown>
                <Dropdown.Toggle className="more-subtopic-options" id="dropdown-basic">
                    <MoreVertIcon></MoreVertIcon>
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    <Dropdown.Item onClick={() =>handleShow()}>Edit</Dropdown.Item>
                    <Dropdown.Item onClick={() =>handleDeleteSubtopic(subtopic.subTopicsId.toString())}>Delete</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>)}

            <Modal show={show} onHide={handleClose} className='edit-subtopic-modal' size="md" aria-labelledby="contained-modal-title-vcenter" centered>
                <Form onSubmit={handleSubmit}>
                <Modal.Header closeButton>
                <Modal.Title>Edit Subtopic: {subtopic.title}</Modal.Title>
                
                </Modal.Header>
                    
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>Edit Title</Form.Label>
                        <Form.Control as="textarea" rows={1} placeholder={subtopic.title} value={editedTitle} onChange={handleTitleInputChange}/>
                        </Form.Group>
                        <Form.Group
                        className="mb-3"
                        controlId="exampleForm.ControlTextarea1"
                        >
                        <Form.Label>Edit Description</Form.Label>
                        <Form.Control as="textarea" rows={3} placeholder={subtopic.description} value={editedDesc} onChange={handleDescInputChange}/>
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
        </div>


    </div>
    

    );

};

    export default SubtopicListItem;

 