import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SubtopicListItem from '../SubtopicListItem/SubtopicListItem';

const SubtopicListWithUsers = ({ subtopics ,self ,handleDeleteSubtopic , handleToggleLikeSubtopic,handleToggleDislikeSubtopic,handleEditSubtopic}) => {


    
    return (
      <div className='subtopic-list'>
        {subtopics.map((subtopic) => (
          <SubtopicListItem
            key={subtopic.subTopicsId}
            subtopic={subtopic}
            self = {self}
            handleDeleteSubtopic = {handleDeleteSubtopic}
            handleToggleLikeSubtopic={handleToggleLikeSubtopic}
            handleToggleDislikeSubtopic={handleToggleDislikeSubtopic}
            handleEditSubtopic={handleEditSubtopic}
          />
        ))}
      </div>
    );
  };

  export default SubtopicListWithUsers;