import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Navigation from '../Shared/Navigation/Navigation';
import Select from 'react-select';
import { Pagination } from '@mui/material';
import { useParams, useLocation } from 'react-router-dom';
import Footer from '../Shared/Footer/Footer';
import 'bootstrap/dist/css/bootstrap.css';
import './SearchResult.css';
import TopicListItem from '../Shared/TopicListItem/TopicListItem';
import ThreadListWithUsers from '../Shared/ThreadListWithUsers/ThreadListWithUsers';
import SubtopicListWithUsers from '../Shared/SubtopicListWithUsers/SubtopicListWithUsers';
import { UserContext } from '../Shared/UserProvider/UserProvider';

const SearchResult = () => {
  const [message, setMessage] = useState('');
  const [results, setResults] = useState([]);
  const [topics, setTopics] = useState([]);
  const [subtopics, setSubtopics] = useState([]);
  const [threads, setThreads] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const { searchOption, query } = useParams();
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const { user } = useContext(UserContext);
  const [topicTitles, setTopicTitles] = useState([]);

  const navigate = useNavigate();
  
  const sortOptionsMap = {
    Subtopics: [
      { value: 'subTopicsId', label: 'Subtopic ID' },
      { value: 'title', label: 'Title' },
      { value: 'description', label: 'Description' },
      { value: 'topicsId', label: 'Topic ID' },
      { value: 'like.count', label: 'Likes' },
      { value: 'createdBy', label: 'Created By' },
      { value: 'updatedBy', label: 'Updated By' },
      { value: 'createdAt', label: 'Created At' },
      { value: 'updatedAt', label: 'Updated At' }
    ],
    Topics: [
      { value: 'topicsId', label: 'Topic ID' },
      { value: 'title', label: 'Title' },
      { value: 'description', label: 'Description' },
      { value: 'createdBy', label: 'Created By' },
      { value: 'updatedBy', label: 'Updated By' },
      { value: 'createdAt', label: 'Created At' },
      { value: 'updatedAt', label: 'Updated At' }
    ],
    Threads: [
      { value: 'threadsId', label: 'Thread ID' },
      { value: 'content', label: 'Content' },
      { value: 'subTopicsId', label: 'Subtopic ID' },
      { value: 'like.count', label: 'Likes' },
      { value: 'createdBy', label: 'Created By' },
      { value: 'updatedBy', label: 'Updated By' },
      { value: 'createdAt', label: 'Created At' },
      { value: 'updatedAt', label: 'Updated At' }
    ]
  };

  const sortOrderOptions = [
    { value: 'asc', label: 'Ascending' },
    { value: 'desc', label: 'Descending' }
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortField, setSortField] = useState(sortOptionsMap[searchOption][0].value);
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    setLoading(true);
    setSortField(sortOptionsMap[searchOption][0].value); // Reset to the first sort option for the current search type
    setSortOrder('asc'); // Reset sort order to ascending
    setCurrentPage(1); // Reset page to 1
    if (searchOption === "subtopics") {
      fetchSubtopics();
    } else if (searchOption === "topics") {
      fetchTopics();
    } else if (searchOption === "threads") {
      fetchThreads();
    }
    setLoading(false);
  }, [searchOption, query]);

  useEffect(() => {
    if (searchOption === "Subtopics") {
      fetchSubtopics();
    } else if (searchOption === "Topics") {
      fetchTopics();
    } else if (searchOption === "Threads") {
      fetchThreads();
    }
  }, [currentPage, sortField, sortOrder]);

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

  const fetchSubtopics = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_HTTP_URL}/api/subtopics/v1/getAllSubTopics`, {
        params: {
          title: query === 'default' ? '' : query,
          limit: itemsPerPage,
          offset: (currentPage - 1) * itemsPerPage,
          sortField: sortField,
          sortOrder: sortOrder
        },
        withCredentials: true,
      });
      setSubtopics(response.data.data.result);
      setTotalResults(response.data.data.total);
      setMessage('SubTopics fetched successfully');
    } catch (error) {
      handleFetchError(error, 'fetching subtopics');
    }
  };

  const fetchTopics = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_HTTP_URL}/api/topics/v1/getAllTopics`, {
        params: {
          title: query === 'default' ? '' : query,
          limit: itemsPerPage,
          offset: (currentPage - 1) * itemsPerPage,
          sortField: sortField,
          sortOrder: sortOrder
        },
        withCredentials: true,
      });
      setTopics(response.data.data.result);
      setTotalResults(response.data.data.total);
      setMessage('Topics fetched successfully');
    } catch (error) {
      handleFetchError(error, 'fetching topics');
    }
  };

  const fetchThreads = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_HTTP_URL}/api/threads/v1/getAllThreads`, {
        params: {
          content: query === 'default' ? '' : query,
          limit: itemsPerPage,
          offset: (currentPage - 1) * itemsPerPage,
          sortField: sortField,
          sortOrder: sortOrder
        },
        withCredentials: true,
      });
      setThreads(response.data.data.result);
      setTotalResults(response.data.data.total);
      setMessage('Threads fetched successfully');
    } catch (error) {
      handleFetchError(error, 'fetching threads');
    }
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

  const handleDeleteSubtopic = async (subtopicId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_HTTP_URL}/api/subtopics/v1/deleteSubTopics`, {
        data: { subTopicsId: subtopicId },
        withCredentials: true
      });
      const filteredSubtopics = subtopics.filter(subtopic => subtopic.subTopicsId !== subtopicId);
      setSubtopics(filteredSubtopics);
    } catch (error) {
      handleFetchError(error, 'deleting subtopic');
    }
  };

  const handleToggleLikeSubtopic = async (subtopicId, isLiked, isDisliked) => {
    try {
      await axios.patch(`${process.env.REACT_APP_HTTP_URL}/api/subtopics/v1/likeOrDislikeSubTopics`, {
        subTopicsId: subtopicId.toString(),
        like: !isLiked,
        dislike: false,
      }, { withCredentials: true });

      const editedSubtopics = subtopics.map(subtopic => {
        if (subtopic.subTopicsId === subtopicId) {
          const updatedSubtopic = { ...subtopic };
          if (!isLiked && isDisliked) {
            updatedSubtopic.like.count += 2;
            updatedSubtopic.like.usersLike.push(user.usersId);
            updatedSubtopic.like.usersDislike = updatedSubtopic.like.usersDislike.filter(id => id !== user.usersId);
          } else if (!isLiked) {
            updatedSubtopic.like.count += 1;
            updatedSubtopic.like.usersLike.push(user.usersId);
          } else {
            updatedSubtopic.like.count -= 1;
            updatedSubtopic.like.usersLike = updatedSubtopic.like.usersLike.filter(id => id !== user.usersId);
          }
          updatedSubtopic.updatedAt = Date.now();
          return updatedSubtopic;
        }
        return subtopic;
      });
      setSubtopics(editedSubtopics);
    } catch (error) {
      handleFetchError(error, 'liking/disliking subtopic');
    }
  };

  const handleToggleDislikeSubtopic = async (subtopicId, isDisliked, isLiked) => {
    try {
      await axios.patch(`${process.env.REACT_APP_HTTP_URL}/api/subtopics/v1/likeOrDislikeSubTopics`, {
        subTopicsId: subtopicId.toString(),
        like: false,
        dislike: !isDisliked,
      }, { withCredentials: true });

      const editedSubtopics = subtopics.map(subtopic => {
        if (subtopic.subTopicsId === subtopicId) {
          const updatedSubtopic = { ...subtopic };
          if (!isDisliked && isLiked) {
            updatedSubtopic.like.count -= 2;
            updatedSubtopic.like.usersLike = updatedSubtopic.like.usersLike.filter(id => id !== user.usersId);
            updatedSubtopic.like.usersDislike.push(user.usersId);
          } else if (!isDisliked) {
            updatedSubtopic.like.count -= 1;
            updatedSubtopic.like.usersDislike.push(user.usersId);
          } else {
            updatedSubtopic.like.count += 1;
            updatedSubtopic.like.usersDislike = updatedSubtopic.like.usersDislike.filter(id => id !== user.usersId);
          }
          updatedSubtopic.updatedAt = Date.now();
          return updatedSubtopic;
        }
        return subtopic;
      });
      setSubtopics(editedSubtopics);
    } catch (error) {
      handleFetchError(error, 'disliking subtopic');
    }
  };

  const handleEditSubtopic = async (subtopicId, topicsId, editedTitle, editedDesc) => {
    try {
      const response = await axios.patch(`${process.env.REACT_APP_HTTP_URL}/api/subtopics/v1/updateSubTopics`, {
        subTopicsId: subtopicId.toString(),
        topicsId: topicsId,
        title: editedTitle,
        description: editedDesc
      }, { withCredentials: true });

      const editedSubtopics = subtopics.map(subtopic => {
        if (subtopic.subTopicsId === subtopicId) {
          return {
            ...subtopic,
            title: editedTitle,
            description: editedDesc,
            updatedAt: response.data.data.updatedAt,
          };
        }
        return subtopic;
      });
      setSubtopics(editedSubtopics);
    } catch (error) {
      handleFetchError(error, 'editing subtopic');
    }
  };

  const handleDeleteThread = async (threadId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_HTTP_URL}/api/threads/v1/deleteThreads`, {
        data: { threadsId: threadId },
        withCredentials: true
      });
      const filteredThreads = threads.filter(thread => thread.threadsId !== threadId);
      setThreads(filteredThreads);
    } catch (error) {
      handleFetchError(error, 'deleting thread');
    }
  };

  const handleToggleLikeThread = async (threadId, isLiked, isDisliked) => {
    try {
      await axios.patch(`${process.env.REACT_APP_HTTP_URL}/api/threads/v1/likeOrDislikeThreads`, {
        threadsId: threadId.toString(),
        like: !isLiked,
        dislike: false,
      }, { withCredentials: true });

      const editedThreads = threads.map(thread => {
        if (thread.threadsId === threadId) {
          const updatedThread = { ...thread };
          if (!isLiked && isDisliked) {
            updatedThread.like.count += 2;
            updatedThread.like.usersLike.push(user.usersId);
            updatedThread.like.usersDislike = updatedThread.like.usersDislike.filter(id => id !== user.usersId);
          } else if (!isLiked) {
            updatedThread.like.count += 1;
            updatedThread.like.usersLike.push(user.usersId);
          } else {
            updatedThread.like.count -= 1;
            updatedThread.like.usersLike = updatedThread.like.usersLike.filter(id => id !== user.usersId);
          }
          updatedThread.updatedAt = Date.now();
          return updatedThread;
        }
        return thread;
      });
      setThreads(editedThreads);
    } catch (error) {
      handleFetchError(error, 'liking/disliking thread');
    }
  };

  const handleToggleDislikeThread = async (threadId, isDisliked, isLiked) => {
    try {
      await axios.patch(`${process.env.REACT_APP_HTTP_URL}/api/threads/v1/likeOrDislikeThreads`, {
        threadsId: threadId.toString(),
        like: false,
        dislike: !isDisliked,
      }, { withCredentials: true });

      const editedThreads = threads.map(thread => {
        if (thread.threadsId === threadId) {
          const updatedThread = { ...thread };
          if (!isDisliked && isLiked) {
            updatedThread.like.count -= 2;
            updatedThread.like.usersLike = updatedThread.like.usersLike.filter(id => id !== user.usersId);
            updatedThread.like.usersDislike.push(user.usersId);
          } else if (!isDisliked) {
            updatedThread.like.count -= 1;
            updatedThread.like.usersDislike.push(user.usersId);
          } else {
            updatedThread.like.count += 1;
            updatedThread.like.usersDislike = updatedThread.like.usersDislike.filter(id => id !== user.usersId);
          }
          updatedThread.updatedAt = Date.now();
          return updatedThread;
        }
        return thread;
      });
      setThreads(editedThreads);
    } catch (error) {
      handleFetchError(error, 'disliking thread');
    }
  };

  const handleEditThread = async (threadId, subtopicsId, editedContent) => {
    try {
      const response = await axios.patch(`${process.env.REACT_APP_HTTP_URL}/api/threads/v1/updateThreads`, {
        threadsId: threadId.toString(),
        subtopicsId: subtopicsId,
        content: editedContent
      }, { withCredentials: true });

      const editedThreads = threads.map(thread => {
        if (thread.threadsId === threadId) {
          return {
            ...thread,
            content: editedContent,
            updatedAt: response.data.data.updatedAt,
          };
        }
        return thread;
      });
      setThreads(editedThreads);
    } catch (error) {
      handleFetchError(error, 'editing thread');
    }
  };

  const handleDeleteTopic = async (topicId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_HTTP_URL}/api/topics/v1/deleteTopics`, {
        data: {
          topicsId: topicId,
        },
        withCredentials: true
      });
      const filteredTopics = [...topics].filter(topic => topic.topicsId !== topicId);
      setTopics(filteredTopics);
    } catch (error) {
      
    }
  };

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
    } catch (error) {
      
    }
  };

  return (
    <>
      <Navigation>navcontent</Navigation>
      <div className="header-gradient"></div>
      <Container className='search-result-container'>
        <div className="page-content-background">
        <Row>
          <Col>
            <div className='result-title-container'>
              <h1>Results For "{query}"</h1>
              <div className='result-subtopics-info'>
                <div className='sort-subtopics'>
                  <h2>Sort By:</h2>
                  <Select
                    options={sortOptionsMap[searchOption]}
                    className='sort-dropdown'
                    onChange={handleSortChange}
                    value={sortOptionsMap[searchOption].find(option => option.value === sortField)}
                  />
                  <Select
                    options={sortOrderOptions}
                    className='sort-dropdown'
                    onChange={handleSortOrderChange}
                    value={sortOrderOptions.find(option => option.value === sortOrder)}
                  />
                </div>
                <div className='sort-subtopics'>
                  <h2>Total Results: {totalResults}</h2>
                </div>
              </div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            {/*message ? <p>{message}</p> : <p>Loading...</p>*/}
            {searchOption === 'Subtopics' && subtopics.length > 0 && !loading ? (
              <SubtopicListWithUsers
                subtopics={subtopics}
                self={user}
                handleDeleteSubtopic={handleDeleteSubtopic}
                handleToggleLikeSubtopic={handleToggleLikeSubtopic}
                handleToggleDislikeSubtopic={handleToggleDislikeSubtopic}
                handleEditSubtopic={handleEditSubtopic}
              />
            ) : searchOption === 'Topics' && topics.length > 0 && !loading ? (
              topics.map((topic) => (
                <TopicListItem
                  key={topic.topicsId}
                  Topic={topic}
                  self = {user}
                  handleDeleteTopic={handleDeleteTopic}
                  handleEditTopic={handleEditTopic}
                />
              ))
            ) : searchOption === 'Threads' && threads.length > 0 && !loading ? (
              <ThreadListWithUsers
                threads={threads}
                self={user}
                onSubtopicPage={false}
                topicTitles={topicTitles}
                handleDeleteThread={handleDeleteThread}
                handleToggleLikeThread={handleToggleLikeThread}
                handleToggleDislikeThread={handleToggleDislikeThread}
                handleEditThread={handleEditThread}
              />
            ) : <p>No Results Found.</p>}
            <Pagination
              count={Math.ceil(totalResults / itemsPerPage)}
              page={currentPage}
              onChange={handlePageChange}
              className='result-subtopics-pagination'
            />
          </Col>
        </Row>
        </div>
      </Container>
      <Footer></Footer>
    </>
  );
};

export default SearchResult;
