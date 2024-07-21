import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Navigation from '../Shared/Navigation/Navigation';
import Footer from '../Shared/Footer/Footer';
import 'bootstrap/dist/css/bootstrap.css';
import { Button, Form, Modal, Alert } from 'react-bootstrap';
import Select from 'react-select';
import './TopicPage.css';
import { Pagination } from '@mui/material';
import SubtopicListWithUsers from '../Shared/SubtopicListWithUsers/SubtopicListWithUsers';
import { UserContext } from '../Shared/UserProvider/UserProvider';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { TopicsContext } from '../Shared/TopicsProvider/TopicsProvider';
import { handleApiError } from '../Shared/ErrorHandling/ErrorHandler';
import FloatingAlert from '../Shared/ErrorHandling/FloatingAlert';
import { useAlert } from '../Shared/ErrorHandling/AlertProvider';
import DOMPurify from 'dompurify';


const TopicPage = () => {
  const { topic_title } = useParams();
  const [subtopics, setSubtopics] = useState([]);
  const [totalSubtopics, setTotalSubtopics] = useState(0);
  const [topic, setTopic] = useState({});
  const { user } = useContext(UserContext);
  const { showAlert } = useAlert();

  const iconPath = `${process.env.PUBLIC_URL}/images/favicon.png`;

  // Modal state
  const [newSubtopicTitle, setNewSubtopicTitle] = useState('');
  const [newSubtopicDesc, setNewSubtopicDesc] = useState('');
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleNewSubtopicTitleInputChange = (e) => {
    setNewSubtopicTitle(e.target.value);
  };

  const handleNewSubtopicDescInputChange = (e) => {
    setNewSubtopicDesc(e.target.value);
  };

  // Function to call API to post new subtopic
  const handleCreateSubtopic = async () => {
    try {
      const sanitizedTitle = DOMPurify.sanitize(newSubtopicTitle);
      const sanitizedDesc = DOMPurify.sanitize(newSubtopicDesc);
      const response = await axios.post(`${process.env.REACT_APP_HTTP_URL}/api/subtopics/v1/postSubTopics`, {
        topicsId: topic.topicsId,
        title: sanitizedTitle,
        description: sanitizedDesc,
      }, { withCredentials: true });

      showAlert('Subtopic posted successfully', 'success');

      // Refresh subtopics
      fetchSubtopics(topic.topicsId, currentPage, sortField, sortOrder);

    } 
    catch (error) {
      handleApiError(error, 'post subtopic', showAlert);
    }
  }

  // Function to handle new subtopic form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    handleCreateSubtopic();
    setNewSubtopicTitle("");
    setNewSubtopicDesc("");
    handleClose();
  };

  const navigate = useNavigate();
  const sortOptions = [
    { value: 'title', label: 'Title' },
    { value: 'like.count', label: 'Likes' },
    { value: 'createdAt', label: 'Created At' },
    { value: 'updatedAt', label: 'Updated At' }
  ];

  const sortOrderOptions = [
    { value: 'asc', label: 'Ascending' },
    { value: 'desc', label: 'Descending' }
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortField, setSortField] = useState('title');
  const [sortOrder, setSortOrder] = useState('asc');
  const { topics, loading: topicsLoading, error } = useContext(TopicsContext);

  // Load Topic details and List of Subtopics
  useEffect(() => {
    const fetchTopicAndSubtopics = async () => {
      const topicId = await findTopicIdByTitle(topic_title);
      if (topicId) {
        fetchSubtopics(topicId, currentPage, sortField, sortOrder);
        fetchTopic(topicId);
      } else {
        navigate('/home');
      }
    };
    fetchTopicAndSubtopics();
  }, [topic_title]);

  useEffect(() => {
    if (topic.topicsId) {
      fetchSubtopics(topic.topicsId, currentPage, sortField, sortOrder);
    }
  }, [currentPage, sortField, sortOrder, topic.topicsId]);


  // Function to find the topic's ID from global topics state
  const findTopicIdByTitle = async (title) => {
    // Uses "topics" that is fetched by TopicsProvider
    const topic = topics.find(t => t.title === title);
    return topic ? topic.topicsId : null;
  };

  // Function to call API to delete a subtopic
  const handleDeleteSubtopic = async (subtopicId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_HTTP_URL}/api/subtopics/v1/deleteSubTopics`, {
        data: {
          subTopicsId: subtopicId,
        },
        withCredentials: true
      });
      const filteredSubtopics = [...subtopics].filter(subtopic => subtopic.subTopicsId !== subtopicId);
      setSubtopics(filteredSubtopics);
      showAlert("Subtopic deleted successfully", 'warning');
      setTotalSubtopics(totalSubtopics-1)
    } 
    catch (error) {
      handleApiError(error, 'delete subtopic', showAlert);
    }
  };

  // Function to call API to like subtopic
  const handleToggleLikeSubtopic = async (subtopicId, isLiked, isDisliked) => {
    try {
      await axios.patch(`${process.env.REACT_APP_HTTP_URL}/api/subtopics/v1/likeOrDislikeSubTopics`, {
        subTopicsId: subtopicId.toString(),
        like: !isLiked,
        dislike: false,
      }, { withCredentials: true });

      const editedSubtopics = [...subtopics];
      const index = editedSubtopics.findIndex(subtopic => subtopic.subTopicsId === subtopicId);

      if (index !== -1) {
        if (!isLiked && isDisliked) {
          editedSubtopics[index] = {
            ...editedSubtopics[index],
            like: {
              ...editedSubtopics[index].like,
              count: editedSubtopics[index].like.count + 2,
              usersLike: [...editedSubtopics[index].like.usersLike, user.usersId],
              usersDislike: editedSubtopics[index].like.usersDislike.filter(listUser => listUser !== user.usersId)
            },
            updatedAt: Date.now(),
          };
        } else if (!isLiked) {
          editedSubtopics[index] = {
            ...editedSubtopics[index],
            like: {
              ...editedSubtopics[index].like,
              count: editedSubtopics[index].like.count + 1,
              usersLike: [...editedSubtopics[index].like.usersLike, user.usersId]
            },
            updatedAt: Date.now(),
          };
        } else {
          editedSubtopics[index] = {
            ...editedSubtopics[index],
            like: {
              ...editedSubtopics[index].like,
              count: editedSubtopics[index].like.count - 1,
              usersLike: editedSubtopics[index].like.usersLike.filter(listUser => listUser !== user.usersId)
            },
            updatedAt: Date.now(),
          };
        }
      }
      setSubtopics(editedSubtopics);
    } 
    catch (error) {
      handleApiError(error, 'like subtopic', showAlert);
    }
  };

  // Function to call API to dislike subtopic
  const handleToggleDislikeSubtopic = async (subtopicId, isDisliked, isLiked) => {
    try {
      await axios.patch(`${process.env.REACT_APP_HTTP_URL}/api/subtopics/v1/likeOrDislikeSubTopics`, {
        subTopicsId: subtopicId.toString(),
        like: false,
        dislike: !isDisliked,
      }, { withCredentials: true });

      const editedSubtopics = [...subtopics];
      const index = editedSubtopics.findIndex(subtopic => subtopic.subTopicsId === subtopicId);

      if (index !== -1) {
        if (!isDisliked && isLiked) {
          editedSubtopics[index] = {
            ...editedSubtopics[index],
            like: {
              ...editedSubtopics[index].like,
              count: editedSubtopics[index].like.count - 2,
              usersLike: editedSubtopics[index].like.usersLike.filter(listUser => listUser !== user.usersId),
              usersDislike: [...editedSubtopics[index].like.usersDislike, user.usersId]
            },
            updatedAt: Date.now(),
          };
        } else if (!isDisliked) {
          editedSubtopics[index] = {
            ...editedSubtopics[index],
            like: {
              ...editedSubtopics[index].like,
              count: editedSubtopics[index].like.count - 1,
              usersDislike: [...editedSubtopics[index].like.usersDislike, user.usersId]
            },
            updatedAt: Date.now(),
          };
        } else {
          editedSubtopics[index] = {
            ...editedSubtopics[index],
            like: {
              ...editedSubtopics[index].like,
              count: editedSubtopics[index].like.count + 1,
              usersDislike: editedSubtopics[index].like.usersDislike.filter(listUser => listUser !== user.usersId)
            },
            updatedAt: Date.now(),
          };
        }
      }
      setSubtopics(editedSubtopics);
    } 
    catch (error) {
      handleApiError(error, 'dislike subtopic', showAlert);
    }
  };

  // Function to call API to edit subtopic
  const handleEditSubtopic = async (subtopicId, topicsId, editedTitle, editedDesc) => {
    try {
      await axios.patch(`${process.env.REACT_APP_HTTP_URL}/api/subtopics/v1/updateSubTopics`, {
        subTopicsId: subtopicId.toString(),
        topicsId: topicsId,
        title: editedTitle,
        description: editedDesc
      }, { withCredentials: true });

      const editedSubtopics = [...subtopics];
      const index = editedSubtopics.findIndex(subtopic => subtopic.subTopicsId === subtopicId);

      if (index !== -1) {
        editedSubtopics[index] = {
          ...editedSubtopics[index],
          title: editedTitle,
          description: editedDesc,
          updatedAt: Date.now(),
        };
      }
      setSubtopics(editedSubtopics);
      showAlert("Subtopic updated successfully", 'info');
    } 
    catch (error) {
      handleApiError(error, 'update subtopic', showAlert);
    }
  };

  // Function to call API to fetch subtopics
  const fetchSubtopics = async (topicId, page = 1, sortField = 'subTopicsId', sortOrder = 'asc') => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_HTTP_URL}/api/subtopics/v1/getAllSubTopics`, {
        params: {
          topicsId: topicId,
          limit: itemsPerPage,
          offset: (page - 1) * itemsPerPage,
          sortField: sortField,
          sortOrder: sortOrder
        },
        withCredentials: true,
      });

      setSubtopics(response.data.data.result);
      setTotalSubtopics(response.data.data.total);
    } 
    catch (error) {
      handleApiError(error, 'load subtopics', showAlert);
    }
  };

  // Function to call API to fetch a topic
  const fetchTopic = async (topicId) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_HTTP_URL}/api/topics/v1/getTopics`, {
        params: {
          topicsId: topicId
        },
        withCredentials: true,
      });
      setTopic(response.data.data);
    } 
    catch (error) {
      handleApiError(error, 'load topic', showAlert);
    }
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    fetchSubtopics(topic.topicsId, value, sortField, sortOrder);
  };

  const handleSortChange = (selectedOption) => {
    const { value } = selectedOption;
    setSortField(value);
    setCurrentPage(1);
    fetchSubtopics(topic.topicsId, 1, value, sortOrder);
  };

  const handleSortOrderChange = (selectedOption) => {
    const { value } = selectedOption;
    setSortOrder(value);
    setCurrentPage(1);
    fetchSubtopics(topic.topicsId, 1, sortField, value);
  };

  return (
    <>
      <Navigation />
      <FloatingAlert />
      <div>
        <div className="header-gradient"></div>
        <Container className="subtopics-page-container">
          <div className="page-content-background">
          <Row>
            <Col>
              <a href={`/home/`} className='back-link'> <ArrowBackIcon></ArrowBackIcon> Back To Browse Topics </a>
              <div className='title-container'>
                <div className='topic-info-row'>
                  <div className='topic-image'>
                    <img src={iconPath} alt="thread icon"></img>
                  </div>
                  <div className='topic-info'>
                    <h1>{topic.title}</h1>
                    <p>{topic.description}</p>
                  </div>
                </div>
                <div className='subtopics-info'>
                  <div className='sort-subtopics'>
                    <h2>Sort By:</h2>
                    <Select
                      options={sortOptions}
                      className='sort-dropdown'
                      onChange={handleSortChange}
                      value={sortOptions.find(option => option.value === sortField)}
                    />
                 
                    <Select
                      options={sortOrderOptions}
                      className='sort-dropdown'
                      onChange={handleSortOrderChange}
                      value={sortOrderOptions.find(option => option.value === sortOrder)}
                    />
                  </div>
                  <div className='sort-subtopics'>
                    <h2>Total Subtopics: {totalSubtopics}</h2>
                  </div>
                  <div className='sort-subtopics'>
                    <Button variant="primary" size="sm" className="new-subtopic-btn" onClick={handleShow}>
                      New Subtopic
                    </Button>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col>
              {subtopics.length > 0 ? (
                <SubtopicListWithUsers
                  subtopics={subtopics}
                  self={user}
                  handleDeleteSubtopic={handleDeleteSubtopic}
                  handleToggleLikeSubtopic={handleToggleLikeSubtopic}
                  handleToggleDislikeSubtopic={handleToggleDislikeSubtopic}
                  handleEditSubtopic={handleEditSubtopic}
                />
              ) : (<div></div>)}
              <Pagination
                count={Math.ceil(totalSubtopics / itemsPerPage)}
                page={currentPage}
                onChange={handlePageChange}
                className='result-subtopics-pagination'
              />
            </Col>
          </Row>
          </div>
        </Container>
      </div>
      <Footer />
      <Modal show={show} onHide={handleClose} className='new-subtopic-modal' size="md" aria-labelledby="contained-modal-title-vcenter" centered>
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>New Subtopic</Modal.Title>
          </Modal.Header>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Title</Form.Label>
            <Form.Control as="textarea" rows={1} placeholder={newSubtopicTitle} value={newSubtopicTitle} onChange={handleNewSubtopicTitleInputChange} />
            <Form.Label>Content</Form.Label>
            <Form.Control as="textarea" rows={3} placeholder={newSubtopicDesc} value={newSubtopicDesc} onChange={handleNewSubtopicDescInputChange} />
          </Form.Group>
          <Modal.Footer>
            <Button variant="secondary" className='modal-btn' onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" className='modal-btn' type='submit'>
              Post Subtopic
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default TopicPage;
