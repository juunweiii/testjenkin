import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from 'react-bootstrap';
import './UserListItem.css'

import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import ToggleButton from 'react-bootstrap/ToggleButton';

import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Dropdown } from 'react-bootstrap';
import moment from 'moment';

const UserListItem = ({user, rep, selfRole, toggleBan,toggleMod}) => {
    var bannableRoles =[]
    if(selfRole === 'admin'){
        bannableRoles = [ 'moderator'];
    }else if(selfRole === 'moderator'){
        bannableRoles = ['user']
    }

    

    
    return (
    <div className='user-list-item'>
        <div className='user-content-container'>
            <div>
                <img src = {user.profilePicture} alt ="user-profile-picture" className='user-picture'></img>
               
            </div>
           
            <div className='user-content'>
              
                <a href={user.link}><span className='user-role'>{user.role}</span><h4 className='user-name'>{user.username}</h4></a>
                <div className='user-info'>
                <p><span>Status:</span> {user.isBanned === 'false' ? 'Active':'Banned'}</p>
                <p><span>Member Since:</span> {moment(user.createdAt).format('MMMM Do YYYY, h:mm:ss a')}</p>
                <p><span>Reputation:</span> {rep}</p>
                </div>
                
                <div className='user-actions'>
                    {bannableRoles.indexOf(user.role) >=0 &&  <Button onClick = {() => toggleBan(user.id,user.isBanned)}>{user.isBanned === 'false' ? 'Ban User': 'Unban User'}</Button>}
                    

                    {selfRole === 'admin' && <Button onClick = {() => toggleMod(user.id,user.role)}>{user.role === 'moderator' ? 'Demote To User': 'Promote To Moderator'}</Button>}
                </div>
                
            </div>
            
           
            
        </div>


    </div>
    

    );

};

    export default UserListItem;