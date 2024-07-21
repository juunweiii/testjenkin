import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import { Button, Dropdown,Form,Modal } from 'react-bootstrap';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import './TopicListItem.css'

const TopicListItem = ({Topic, self ,handleEditTopic, handleDeleteTopic}) => {
    const navigate = useNavigate();
    const iconPath = `${process.env.PUBLIC_URL}/images/favicon.png`;
    const [show, setShow] = useState(false);
    const [editedTitle,setEditedTitle] = useState(Topic.title)
    const [editedDesc,setEditedDesc] = useState(Topic.description)

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
        handleEditTopic(Topic.topicsId,editedTitle, editedDesc);
        handleClose(); // Close the modal after saving changes
      };


    const selectTopic = () => {
        navigate(`/topic/${Topic.id}`);
      };
    
    const canModify = self && self.role === "moderator";

    return (
      <div className='topic-list-item'>

        <div className='topic-list-item-icon'>
          <img src={iconPath} alt="thread icon"></img>
        </div>
      
        <div className='topic-list-item-content'>

          <div className='topic-list-item-title-container'>
          <h3>
            {/* <a href="#" onClick={selectTopic}>t/{Topic.name}</a> */}
            <a href={`/topic/${Topic.title}`}>t/{Topic.title}</a>
          </h3>
          {canModify &&(<Dropdown>
                <Dropdown.Toggle className="more-topic-options" id="dropdown-basic">
                    <MoreVertIcon></MoreVertIcon>
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    <Dropdown.Item onClick={() =>handleShow()}>Edit</Dropdown.Item>
                    <Dropdown.Item onClick={() =>handleDeleteTopic(Topic.topicsId.toString())}>Delete</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>)}
          </div>

          <p>{Topic.description}</p><br />

          <Modal show={show} onHide={handleClose} className='edit-topic-modal' size="md" aria-labelledby="contained-modal-title-vcenter" centered>
                <Form onSubmit={handleSubmit}>
                <Modal.Header closeButton>
                <Modal.Title>Edit Topic: {Topic.title}</Modal.Title>
                
                </Modal.Header>
                    
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>Edit Title</Form.Label>
                        <Form.Control as="textarea" rows={1} placeholder={Topic.title} value={editedTitle} onChange={handleTitleInputChange}/>
                        </Form.Group>
                        <Form.Group
                        className="mb-3"
                        controlId="exampleForm.ControlTextarea1"
                        >
                        <Form.Label>Edit Description</Form.Label>
                        <Form.Control as="textarea" rows={3} placeholder={Topic.description} value={editedDesc} onChange={handleDescInputChange}/>
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
    );

};

    export default TopicListItem;