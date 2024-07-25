import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAppContext } from '../context/appContext';

const Roles = () => {
  const { users, getUsers, updateUserRole } = useAppContext();
  const [selectedRoles, setSelectedRoles] = useState({});

  useEffect(() => {
    getUsers();
  }, []);

  useEffect(() => {
    const roles = {};
    users.forEach(user => {
      roles[user._id] = user.role;
    });
    setSelectedRoles(roles);
  }, [users]);

  const handleChange = (userId, event) => {
    const { value } = event.target;
    setSelectedRoles(prevRoles => ({
      ...prevRoles,
      [userId]: value,
    }));
  };

  const handleSubmit = (userId) => {
    const newRole = selectedRoles[userId];
    updateUserRole(userId, newRole);
  };

  return (
    <Wrapper>
      <h2>User Roles</h2>
      <table>
        <thead>
          <tr>
            <th>User Name</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>
                <select
                  value={selectedRoles[user._id]}
                  onChange={(e) => handleChange(user._id, e)}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value = "staff">Staff</option>
                </select>
              </td>
              <td>
                <button onClick={() => handleSubmit(user._id)}>Save</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  margin-top: 20px;

  table {
    width: 100%;
    border-collapse: collapse;
  }

  th, td {
    border: 1px solid #dddddd;
    text-align: left;
    padding: 8px;
  }
`;

export default Roles;
