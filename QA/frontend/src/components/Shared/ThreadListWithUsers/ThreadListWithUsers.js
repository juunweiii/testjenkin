import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ThreadListItem from '../ThreadListItem/ThreadListItem';


const ThreadListWithUsers = ({ threads,self,topicTitles , onSubtopicPage,handleDeleteThread,handleToggleLikeThread,handleToggleDislikeThread,handleEditThread}) => {


    
    
    return (
      <div className='thread-list'>
        {threads.map((thread) => (
          <ThreadListItem
            key={thread.threadsId}
            thread={thread}
            self={self}
            onSubtopicPage={onSubtopicPage}
            handleDeleteThread ={handleDeleteThread}
            handleToggleDislikeThread={handleToggleDislikeThread}
            handleToggleLikeThread={handleToggleLikeThread}
            handleEditThread={handleEditThread}
          />
        ))}
      </div>
    );
  };

  export default ThreadListWithUsers;