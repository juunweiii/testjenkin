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
import { Button, Form, Modal } from 'react-bootstrap';
import Select from 'react-select';
import './SubtopicPage.css';
import { Pagination } from '@mui/material';
import ThreadListWithUsers from '../Shared/ThreadListWithUsers/ThreadListWithUsers';
import { UserContext } from '../Shared/UserProvider/UserProvider';
import SubtopicListItem from '../Shared/SubtopicListItem/SubtopicListItem';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { handleApiError } from '../Shared/ErrorHandling/ErrorHandler';
import FloatingAlert from '../Shared/ErrorHandling/FloatingAlert';
import { useAlert } from '../Shared/ErrorHandling/AlertProvider';
import DOMPurify from 'dompurify';

const SubtopicPage = () => {
  const { subtopic_id } = useParams();
  const [threads, setThreads] = useState([]);
  const [totalThreads, setTotalThreads] = useState(0);
  const [subtopic, setSubtopic] = useState(null);
  const { showAlert } = useAlert();
  const { user } = useContext(UserContext);
  const [topicTitles, setTopicTitles] = useState([]);
  const [newThreadContent, setNewThreadContent] = useState('');
  const [show, setShow] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortField, setSortField] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('asc');

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleNewThreadInputChange = (e) => setNewThreadContent(e.target.value);

  const navigate = useNavigate();
  const sortOptions = [
    { value: 'createdAt', label: 'Created At' },
    { value: 'like.count', label: 'Likes' },
    { value: 'updatedAt', label: 'Updated At' }
  ];

  const sortOrderOptions = [
    { value: 'asc', label: 'Ascending' },
    { value: 'desc', label: 'Descending' }
  ];

  useEffect(() => {
    const fetchSubtopicAndThreads = async () => {
      fetchSubtopic(subtopic_id);
      fetchThreads(subtopic_id, currentPage, sortField, sortOrder);
    };
    fetchSubtopicAndThreads();
  }, [subtopic_id, currentPage, sortField, sortOrder]);

  const handleCreateThread = async () => {
    try {
      const sanitizedThreadContent = DOMPurify.sanitize(newThreadContent);
      await axios.post(`${process.env.REACT_APP_HTTP_URL}/api/threads/v1/postThreads`, {
        subTopicsId: subtopic.subTopicsId,
        content: sanitizedThreadContent,
      }, { withCredentials: true });

      showAlert("Thread posted successfully", 'success');

      // Refresh threads
      fetchThreads(subtopic_id, currentPage, sortField, sortOrder);
      
    } catch (error) {
      handleApiError(error, 'create thread', showAlert);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleCreateThread();
    setNewThreadContent("");
    handleClose();
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleSortChange = (selectedOption) => {
    setSortField(selectedOption.value);
    setCurrentPage(1);
  };

  const handleSortOrderChange = (selectedOption) => {
    setSortOrder(selectedOption.value);
    setCurrentPage(1);
  };

  const fetchThreads = async (subtopicId, page = 1, sortField = 'threadsId', sortOrder = 'asc') => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_HTTP_URL}/api/threads/v1/getAllThreads`, {
        params: {
          subTopicsId: subtopicId,
          limit: itemsPerPage,
          offset: (page - 1) * itemsPerPage,
          sortField: sortField,
          sortOrder: sortOrder
        },
        withCredentials: true,
      });
      setThreads(response.data.data.result);
      setTotalThreads(response.data.data.total);
    }
    catch (error) {
      handleApiError(error, 'load threads', showAlert);
    }
  };

  const fetchSubtopic = async (subtopicId) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_HTTP_URL}/api/subtopics/v1/getSubTopics`, {
        params: { subTopicsId: subtopicId },
        withCredentials: true,
      });
      setSubtopic(response.data.data);
    } 
    catch (error) {
      handleApiError(error, 'load subtopic', showAlert);
    }
  };

  const handleDeleteThread = async (threadId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_HTTP_URL}/api/threads/v1/deleteThreads`, {
        data: { threadsId: threadId },
        withCredentials: true
      });
      const filteredThreads = threads.filter(thread => thread.threadsId !== threadId);

      showAlert("Thread deleted successfully", 'warning');
      
      // Refresh threads
      setThreads(filteredThreads);
      setTotalThreads(totalThreads-1);
    } 
    catch (error) {
      handleApiError(error, 'delete thread', showAlert);
    }
  };

  const handleToggleLikeThread = async (threadId, isLiked, isDisliked) => {
    try {
      await axios.patch(`${process.env.REACT_APP_HTTP_URL}/api/threads/v1/likeOrDislikeThreads`, {
        threadsId: threadId.toString(),
        like: !isLiked,
        dislike: false,
      }, { withCredentials: true });

      const updatedThreads = threads.map(thread => {
        if (thread.threadsId === threadId) {
          if (!isLiked && isDisliked) {
            thread.like.count += 2;
            thread.like.usersLike.push(user.usersId);
            thread.like.usersDislike = thread.like.usersDislike.filter(id => id !== user.usersId);
          } else if (!isLiked) {
            thread.like.count += 1;
            thread.like.usersLike.push(user.usersId);
          } else {
            thread.like.count -= 1;
            thread.like.usersLike = thread.like.usersLike.filter(id => id !== user.usersId);
          }
          thread.updatedAt = Date.now();
        }
        return thread;
      });

      // Refresh threads
      setThreads(updatedThreads);
    } 
    catch (error) {
      handleApiError(error, 'like thread', showAlert);
    }
  };

  const handleToggleDislikeThread = async (threadId, isDisliked, isLiked) => {
    try {
      await axios.patch(`${process.env.REACT_APP_HTTP_URL}/api/threads/v1/likeOrDislikeThreads`, {
        threadsId: threadId.toString(),
        like: false,
        dislike: !isDisliked,
      }, { withCredentials: true });

      const updatedThreads = threads.map(thread => {
        if (thread.threadsId === threadId) {
          if (!isDisliked && isLiked) {
            thread.like.count -= 2;
            thread.like.usersLike = thread.like.usersLike.filter(id => id !== user.usersId);
            thread.like.usersDislike.push(user.usersId);
          } else if (!isDisliked) {
            thread.like.count -= 1;
            thread.like.usersDislike.push(user.usersId);
          } else {
            thread.like.count += 1;
            thread.like.usersDislike = thread.like.usersDislike.filter(id => id !== user.usersId);
          }
          thread.updatedAt = Date.now();
        }
        return thread;
      });

      // Refresh threads
      setThreads(updatedThreads);
    } 
    catch (error) {
      handleApiError(error, 'dislike thread', showAlert);
    }
  };

  
  const handleDeleteSubtopic = async (subtopicId) => {
    try {
      const response = await axios.delete(`${process.env.REACT_APP_HTTP_URL}/api/subtopics/v1/deleteSubTopics`, {
        data: {
          subTopicsId: subtopicId,
        },
        withCredentials: true,
      });
      navigate(`/topics/${subtopic.topics.title}`);
      showAlert('Subtopic deleted successfully', 'warning');
    } 
    catch (error) {
      handleApiError(error, 'delete subtopic', showAlert);
    }
  };
  
  const handleToggleLikeSubtopic = async (subtopicId, isLiked, isDisliked) => {
    try {
      const response = await axios.patch(`${process.env.REACT_APP_HTTP_URL}/api/subtopics/v1/likeOrDislikeSubTopics`, {
        subTopicsId: subtopicId.toString(),
        like: !isLiked,
        dislike: false,
      }, { withCredentials: true });
  
      if (!isLiked && isDisliked) {
        setSubtopic(prevSubtopic => ({
          ...prevSubtopic,
          like: {
            ...prevSubtopic.like,
            count: prevSubtopic.like.count + 2,
            usersLike: [...prevSubtopic.like.usersLike, user.usersId],
            usersDislike: prevSubtopic.like.usersDislike.filter(listUser => listUser !== user.usersId),
          },
          updatedAt: response.data.data.updatedAt,
        }));
      } else if (!isLiked) {
        setSubtopic(prevSubtopic => ({
          ...prevSubtopic,
          like: {
            ...prevSubtopic.like,
            count: prevSubtopic.like.count + 1,
            usersLike: [...prevSubtopic.like.usersLike, user.usersId],
          },
          updatedAt: response.data.data.updatedAt,
        }));
      } else {
        setSubtopic(prevSubtopic => ({
          ...prevSubtopic,
          like: {
            ...prevSubtopic.like,
            count: prevSubtopic.like.count - 1,
            usersLike: prevSubtopic.like.usersLike.filter(listUser => listUser !== user.usersId),
          },
          updatedAt: response.data.data.updatedAt,
        }));
      }
    } 
    catch (error) {
      handleApiError(error, 'like subtopic', showAlert);
    }
  };
  
  const handleToggleDislikeSubtopic = async (subtopicId, isDisliked, isLiked) => {
    try {
      const response = await axios.patch(`${process.env.REACT_APP_HTTP_URL}/api/subtopics/v1/likeOrDislikeSubTopics`, {
        subTopicsId: subtopicId.toString(),
        like: false,
        dislike: !isDisliked,
      }, { withCredentials: true });
  
      if (!isDisliked && isLiked) {
        setSubtopic(prevSubtopic => ({
          ...prevSubtopic,
          like: {
            ...prevSubtopic.like,
            count: prevSubtopic.like.count - 2,
            usersLike: prevSubtopic.like.usersLike.filter(listUser => listUser !== user.usersId),
            usersDislike: [...prevSubtopic.like.usersDislike, user.usersId],
          },
          updatedAt: response.data.data.updatedAt,
        }));
      } else if (!isDisliked) {
        setSubtopic(prevSubtopic => ({
          ...prevSubtopic,
          like: {
            ...prevSubtopic.like,
            count: prevSubtopic.like.count - 1,
            usersDislike: [...prevSubtopic.like.usersDislike, user.usersId],
          },
          updatedAt: response.data.data.updatedAt,
        }));
      } else {
        setSubtopic(prevSubtopic => ({
          ...prevSubtopic,
          like: {
            ...prevSubtopic.like,
            count: prevSubtopic.like.count + 1,
            usersDislike: prevSubtopic.like.usersDislike.filter(listUser => listUser !== user.usersId),
          },
          updatedAt: response.data.data.updatedAt,
        }));
      }
    } 
    catch (error) {
      handleApiError(error, 'dislike subtopic', showAlert);
    }
  };
  
  const handleEditSubtopic = async (subtopicId, topicsId, editedTitle, editedDesc) => {
    ("editsubtopic");
    try {
      const response = await axios.patch(`${process.env.REACT_APP_HTTP_URL}/api/subtopics/v1/updateSubTopics`, {
        subTopicsId: subtopicId.toString(),
        topicsId: topicsId,
        title: editedTitle,
        description: editedDesc,
      }, { withCredentials: true });

      showAlert('Subtopic updated successfully', 'info');
  
      setSubtopic(prevSubtopic => ({
        ...prevSubtopic,
        title: editedTitle,
        description: editedDesc,
        updatedAt: response.data.data.updatedAt,
      }));
    } 
    catch (error) {
      handleApiError(error, 'update subtopic', showAlert);
    }
  };
  
  const handleEditThread = async (threadId, subtopicsId, editedContent) => {
    try {
      const response = await axios.patch(`${process.env.REACT_APP_HTTP_URL}/api/threads/v1/updateThreads`, {
        threadsId: threadId.toString(),
        subtopicsId: subtopicsId,
        content: editedContent
      }, { withCredentials: true });

      const updatedThreads = threads.map(thread => {
        if (thread.threadsId === threadId) {
          thread.content = editedContent;
          thread.updatedAt = response.data.data.updatedAt;
        }
        return thread;
      });

      showAlert('Thread updated successfully', 'info');

      // Refresh threads
      setThreads(updatedThreads);
    } 
    catch (error) {
      handleApiError(error, 'update thread', showAlert);
    }
  };

  if (!subtopic) return <div>Loading...</div>;

  return (
    <>
      <Navigation />
      <FloatingAlert />
      <div>
        <div className="header-gradient"></div>
        <Container className="threads-page-container">
        <div className="page-content-background">
          <Row>
            <Col>
              <a href={`/topic/${subtopic.topics.title}`} className='back-link'>
                <ArrowBackIcon /> Back To {subtopic.topics.title}
              </a>
              <div className='title-container'>
                <div className='subtopic-info-row'>
                  <SubtopicListItem
                    subtopic={subtopic}
                    self={user}
                    handleDeleteSubtopic={handleDeleteSubtopic}
                    handleToggleDislikeSubtopic={handleToggleDislikeSubtopic}
                    handleToggleLikeSubtopic={handleToggleLikeSubtopic}
                    handleEditSubtopic={handleEditSubtopic}
                  />
                </div>
                <div className='threads-info'>
                  <div className='sort-threads'>
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
                  <div className='sort-threads'>
                    <h2>Total Threads: {totalThreads}</h2>
                  </div>
                  <div className='sort-threads'>
                    <Button variant="primary" size="sm" className='new-thread-btn' onClick={handleShow}>
                      New Thread
                    </Button>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col>
              {threads.length > 0 ? (
                <ThreadListWithUsers
                  threads={threads}
                  self={user}
                  onSubtopicPage={true}
                  topicTitles={topicTitles}
                  handleDeleteThread={handleDeleteThread}
                  handleToggleLikeThread={handleToggleLikeThread}
                  handleToggleDislikeThread={handleToggleDislikeThread}
                  handleEditThread={handleEditThread}
                />
              ) : (
                <div></div>
              )}
              <Pagination
                count={Math.ceil(totalThreads / itemsPerPage)}
                page={currentPage}
                onChange={handlePageChange}
                className='result-threads-pagination'
              />
            </Col>
          </Row>
          </div>
        </Container>
      </div>
      <Footer />
      <Modal show={show} onHide={handleClose} className='new-thread-modal' size="md" aria-labelledby="contained-modal-title-vcenter" centered>
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>New Thread</Modal.Title>
          </Modal.Header>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>New Thread Content</Form.Label>
            <Form.Control as="textarea" rows={3} placeholder={newThreadContent} value={newThreadContent} onChange={handleNewThreadInputChange} />
          </Form.Group>
          <Modal.Footer>
            <Button variant="secondary" className='modal-btn' onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" className='modal-btn' type='submit'>
              Save Changes
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default SubtopicPage;
