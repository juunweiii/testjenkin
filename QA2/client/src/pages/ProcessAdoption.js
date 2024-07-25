import React from 'react';
import styled from 'styled-components';
import { useCartContext } from '../context/cart_context';
import { useAppContext } from '../context/appContext';

const ProcessAdoption = () => {
  const { adoption_requests, removeItem } = useCartContext();
  const { user } = useAppContext();

  const handleApprove = (id) => {
    console.log(`Pet ${id} approved for adoption`);
    removeItem(id);
  };

  const handleDisapprove = (id) => {
    console.log(`Pet ${id} disapproved for adoption`);
    removeItem(id);
  };

  return (
    <Wrapper>
      <h2>Process Adoption Requests</h2>
      {user.role === 'staff' && adoption_requests.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Pet</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {adoption_requests.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>
                  <button onClick={() => handleApprove(item.id)}>Approve</button>
                  <button onClick={() => handleDisapprove(item.id)}>Disapprove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div>
          
        </div>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.section`
  margin: 2rem;
  table {
    width: 100%;
    border-collapse: collapse;
    th, td {
      padding: 1rem;
      border: 1px solid #ddd;
      text-align: left;
    }
    th {
      background-color: #f4f4f4;
    }
    button {
      margin-right: 1rem;
    }
  }
`;

export default ProcessAdoption;
