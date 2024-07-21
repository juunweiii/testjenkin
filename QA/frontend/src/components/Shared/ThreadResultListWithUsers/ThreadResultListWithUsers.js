import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ThreadListItem from '../ThreadListItem/ThreadListItem';

const ThreadResultListWithUsers = ({ threads, users }) => {

    (threads)
    ('threads with users')
    (users)
    
    return (
      <div className='thread-list'>
        {threads.map((thread, index) => (
          <ThreadListItem
            key={thread.threadId}
            thread={{
              id:thread.subTopicsId,
              content: thread.content,
              subtopicLink: `/subtopic/${thread.subTopicsId}`,
              likes:thread.like.count,
              updatedAt: thread.updatedAt
            }}
            user={{
                profilePicture :users[index].profilePicture,
                link:`/profiledev/${users[index].usersId}`,
                username:users[index].username,
                usersId:users[index].usersId,
                role:users[index].role,
            }}
          />
        ))}
      </div>
    );
  };

  export default ThreadResultListWithUsers;