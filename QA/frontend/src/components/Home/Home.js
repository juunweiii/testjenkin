import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Button, Form, Modal, Alert } from 'react-bootstrap';
import Select from 'react-select';
import { Pagination } from '@mui/material';
import Navigation from '../Shared/Navigation/Navigation';
import Footer from '../Shared/Footer/Footer';
import TopicListItem from '../Shared/TopicListItem/TopicListItem';
import { UserContext } from '../Shared/UserProvider/UserProvider';
import { handleApiError } from '../Shared/ErrorHandling/ErrorHandler';
import FloatingAlert from '../Shared/ErrorHandling/FloatingAlert';
import { useAlert } from '../Shared/ErrorHandling/AlertProvider';
import DOMPurify from 'dompurify';

import 'bootstrap/dist/css/bootstrap.css';
import './Home.css';

// Define sortOptions before using it
const sortOptions = [
  { value: 'title', label: 'Title' },
];

const sortOrderOptions = [
  { value: 'asc', label: 'Ascending' },
  { value: 'desc', label: 'Descending' }
];

const Home = () => {
  const [topics, setTopics] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalTopics, setTotalTopics] = useState(0);
  const [topicsPerPage] = useState(10);
  const [selectedSortOption, setSelectedSortOption] = useState(sortOptions[0].value); // Initialize with the first sort option
  const [selectedSortOrder, setSelectedSortOrder] = useState(sortOrderOptions[0].value); // Initialize with 'asc'
  const { user } = useContext(UserContext);
  const { showAlert } = useAlert();


  // Add Topic Modal states
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [newTopicDesc, setNewTopicDesc] = useState('');
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleNewTopicTitleInputChange = (e) => {
    setNewTopicTitle(e.target.value);
  };
  const handleNewTopicDescInputChange = (e) => {
    setNewTopicDesc(e.target.value);
  };

  // Function to call API to post new topic
  const handleCreateTopic = async () => {
    const sanitizedTitle = DOMPurify.sanitize(newTopicTitle);
    const sanitizedDesc = DOMPurify.sanitize(newTopicDesc);
    const new_topic = {
      title: sanitizedTitle,
      description: sanitizedDesc
    };

    try {
      const response = await axios.post(`${process.env.REACT_APP_HTTP_URL}/api/topics/v1/postTopics`, new_topic, {
        withCredentials: true,
      });
      
      // Set success message
      showAlert(`"${sanitizedTitle}" created successfully.`, 'success');

      // Refresh topics
      fetchTopics(currentPage, topicsPerPage, selectedSortOption, selectedSortOrder)

    } 
    catch (error) {
      handleApiError(error, 'create topic', showAlert);
    }
  }
  
  // Function to handle new topic form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    handleCreateTopic();
    setNewTopicDesc("");
    setNewTopicTitle("");
    handleClose();
  };

  // Fetch topics when page is loaded
  useEffect(() => {
    fetchTopics(currentPage, topicsPerPage, selectedSortOption, selectedSortOrder);
  }, [currentPage, topicsPerPage, selectedSortOption, selectedSortOrder]);


  // Function to call API to fetch topics
  const fetchTopics = async (page, limit, sortField, sortOrder) => {
    const offset = (page - 1) * limit;
    try {
      
      const response = await axios.get(`${process.env.REACT_APP_HTTP_URL}/api/topics/v1/getAllTopics`, {
        params: {
          limit: limit,
          offset: offset,
          sortField: sortField,
          sortOrder: sortOrder
        },
        withCredentials: true,
      });
      if (response.status === 200) {
        setTopics(response.data.data.result);
        setTotalTopics(response.data.data.total);
      } 

    } catch (error) {
      handleApiError(error, 'load topics', showAlert);
    }
  };

  const handleSortChange = (selectedOption) => {
    setSelectedSortOption(selectedOption.value);
    setCurrentPage(1); // Reset to the first page when sorting changes
  };

  const handleSortOrderChange = (selectedOption) => {
    setSelectedSortOrder(selectedOption.value);
    setCurrentPage(1); // Reset to the first page when sorting changes
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  // Function to call API to delete topics
  const handleDeleteTopic = async (topicId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_HTTP_URL}/api/topics/v1/deleteTopics`, {
        data: {
          topicsId: topicId,
        },
        withCredentials: true
      });
      const filteredTopics = [...topics].filter(topic => topic.topicsId !== topicId);
      // Set success message
      showAlert('Topic deleted successfully', 'warning');
      setTopics(filteredTopics);
      setTotalTopics(totalTopics-1)
    } 
    catch (error) {
      handleApiError(error, 'delete topic', showAlert);
    }
  };

  // Function to call API to update a topic
  const handleEditTopic = async ( topicId, editedTitle, editedDesc) => {
    try {
      await axios.patch(`${process.env.REACT_APP_HTTP_URL}/api/topics/v1/updateTopics`, {
        topicsId: topicId,
        title: editedTitle,
        description: editedDesc
      }, { withCredentials: true });

      const editedTopics = [...topics];
      const index = editedTopics.findIndex(topic => topic.topicsId === topicId);

      if (index !== -1) {
        editedTopics[index] = {
          ...editedTopics[index],
          title: editedTitle,
          description: editedDesc,
          updatedAt: Date.now(),
        };
      }
      setTopics(editedTopics);
      
      showAlert("Topic updated successfully", 'info');
    } 
    catch (error) {
      handleApiError(error, 'update topic', showAlert);
    }
  };

  return (
    <>
      <Navigation />
      <FloatingAlert />
      <div className="header-gradient"></div>
      <Container className='main-container'>
        <div className="page-content-background">
        <Row>
          <Col>
            <div className='title-container'>
              <h1>Browse Topics on ThreadHub</h1>
              <div className='topics-info'>
                <div className='sort-topics'>
                  <h2>Sort By:</h2>
                  <Select 
                    options={sortOptions} 
                    className='sort-dropdown' 
                    onChange={handleSortChange}
                    value={sortOptions.find(option => option.value === selectedSortOption)}
                  />
                  <Select 
                    options={sortOrderOptions} 
                    className='sort-dropdown' 
                    onChange={handleSortOrderChange}
                    value={sortOrderOptions.find(option => option.value === selectedSortOrder)}
                  />
                </div>
                <div className='sort-topics'>
                  <h2>Total Topics: {totalTopics}</h2>
                </div>
                {user && user.role=="moderator"&&(
                <div className='sort-topics'>
                <Button variant="primary" size="sm" style={{backgroundColor:"#38A3A5"}} onClick={handleShow} className='new-topic-btn'>
                  Add New Topic
                </Button>
                </div>)}
              </div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            {topics.map((topic) => (
              <TopicListItem
                key={topic.topicsId}
                Topic={topic}
                self = {user}
                handleDeleteTopic={handleDeleteTopic}
                handleEditTopic={handleEditTopic}
              />
            ))}
            <Pagination
              count={Math.ceil(totalTopics / topicsPerPage)}
              page={currentPage}
              onChange={handlePageChange}
              className='topics-pagination'
            />
          </Col>
        </Row>
        </div>
      </Container>
      <Footer />

      <Modal show={show} onHide={handleClose} className='new-subtopic-modal' size="md" aria-labelledby="contained-modal-title-vcenter" centered>
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>New Topic</Modal.Title>
          </Modal.Header>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Title</Form.Label>
            <Form.Control as="textarea" rows={1} placeholder={newTopicTitle} value={newTopicTitle} onChange={handleNewTopicTitleInputChange} />
            <Form.Label>Description</Form.Label>
            <Form.Control as="textarea" rows={3} placeholder={newTopicDesc} value={newTopicDesc} onChange={handleNewTopicDescInputChange} />
          </Form.Group>
          <Modal.Footer>
            <Button variant="secondary" className='modal-btn' onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" className='modal-btn' type='submit'>
              Create Topic
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

    </>
  );
};

export default Home;
