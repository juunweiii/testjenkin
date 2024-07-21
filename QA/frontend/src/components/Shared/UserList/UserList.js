import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserListItem from '../UserListItem/UserListItem';

const UserList = ({ users, userReps,selfRole,toggleBan,toggleMod }) => {

    
    
    return (
      <div className='user-list'>
        {users.map((user, index) => (
          <UserListItem
            key={user.usersId}
            user={{
              username: user.username,
              id:user.usersId,
              role:user.role,
              profilePicture:user.profilePicture,
              link: `/profile/${user.usersId}`,
              isBanned: user.isBanned,
              createdAt: user.createdAt
            }}
            rep={userReps[index].reputation.toString()}
            selfRole={selfRole}
            toggleBan={toggleBan}
            toggleMod={toggleMod}
          />
        ))}
      </div>
    );
  };

  export default UserList;