import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Dropdown,Form } from 'react-bootstrap';

import './ThreadListItem.css'
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import ThumbUpIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbDownIcon from '@mui/icons-material/ThumbDownAlt';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import moment from 'moment';
import Modal from 'react-bootstrap/Modal';

const ThreadListItem = ({thread ,self, onSubtopicPage ,handleDeleteThread,handleToggleLikeThread,handleToggleDislikeThread,handleEditThread}) => {

    const liked = thread.like.usersLike.indexOf(self.usersId) >=0
    const disliked = thread.like.usersDislike.indexOf(self.usersId) >=0
    const [show, setShow] = useState(false);

    const [editedContent, setEditedContent ]= useState(thread.content);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleContentInputChange = (e) => {
        setEditedContent(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent default form submission
        handleEditThread(thread.threadsId, thread.subTopicsId, editedContent);
        handleClose(); // Close the modal after saving changes
      };

      

    const canModify = thread.creator.usersId === self.usersId || self.role ==="moderator" || self.role ==="admin" //to remove admin
    return (
    <div className='thread-list-item'>
        <div className='thread-content-container'>
            <div>
                <img src = {thread.creator.profilePicture} alt ="user-profile-picture" className='user-picture'></img>
                <span className='user-role'>{thread.creator.role}</span>
                <span className='user-status'>{thread.creator.isBanned==="true"?'Banned':'Active'}</span>
            </div>
            <div className='thread-info'>
            <div className='thread-title-info'>
                <a href={`/profile/${thread.creator.usersId}`}><h4 className='user-name'>{thread.creator.username}</h4></a>
                <p className='thread-content'>{thread.content}</p><br/>
                <div className='thread-list-item-content'>
                    <div className='thread-list-metadata'>
                    <Button className={`rating-button ${liked && 'active'}`} onClick = {() => handleToggleLikeThread(thread.threadsId, liked,disliked) }>{liked ? <ThumbUpIcon></ThumbUpIcon>:<ThumbUpOffAltIcon></ThumbUpOffAltIcon> }</Button>
                    <p>{thread.like.count} </p> 
                    <Button className={`rating-button ${disliked && 'active'}`} onClick = {() => handleToggleDislikeThread(thread.threadsId, disliked,liked) }>{disliked ?  <ThumbDownIcon></ThumbDownIcon>:<ThumbDownOffAltIcon></ThumbDownOffAltIcon>}</Button>
                    <div className='divider'></div>
                    <p className='edit-date'><span></span>Edited At: {moment(thread.updatedAt).format( 'MMMM Do YYYY, h:mm:ss a')} </p>
                    </div>
                </div>
            </div>
            {(!onSubtopicPage || canModify) && (
            <Dropdown>
                <Dropdown.Toggle className="more-thread-options" id="dropdown-basic">
                    <MoreVertIcon></MoreVertIcon>
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    {canModify &&(<>
                    <Dropdown.Item onClick={() =>handleShow()}>Edit</Dropdown.Item>
                    <Dropdown.Item onClick={() =>handleDeleteThread(thread.threadsId.toString())}>Delete</Dropdown.Item>
                    </>)}
                    {!onSubtopicPage && (<Dropdown.Item href={`/subtopic/${thread.subTopicsId}`}>Go To Subtopic</Dropdown.Item>)}

                </Dropdown.Menu>
            </Dropdown>
            )}

            <Modal show={show} onHide={handleClose} className='edit-thread-modal' size="md" aria-labelledby="contained-modal-title-vcenter" centered>
                <Form onSubmit={handleSubmit}>
                <Modal.Header closeButton>
                <Modal.Title>Edit Thread:</Modal.Title>
                
                </Modal.Header>
                    

                        <Form.Group
                        className="mb-3"
                        controlId="exampleForm.ControlTextarea1"
                        >
                        <Form.Label>Edit Content</Form.Label>
                        <Form.Control as="textarea" rows={3} placeholder={thread.content} value={editedContent} onChange={handleContentInputChange}/>
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

    export default ThreadListItem;