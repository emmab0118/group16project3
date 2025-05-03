import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Admin.css'

function Admin() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('/~aselke2/WP/PW/GameOfLife/build/users.php')
      .then(response => {
        console.log(response.data);  
        if (response.data.error) {
          setError(response.data.error);
        } else {
          // Set users only if response.data is an array
          setUsers(Array.isArray(response.data) ? response.data : []);
        }
      })
      .catch(err => setError('Error fetching users'));
  }, []);

  const handleDelete = (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      axios.post('/~aselke2/WP/PW/GameOfLife/build/users.php', 
        { action: 'delete', id: userId },
        { headers: { 'Content-Type': 'application/json' } }
      )
      .then(response => {
        if (response.data.success) {
          setUsers(users.filter(user => user.id !== userId));
        } else if (response.data.error) {
          setError(response.data.error);
        }
      })
      .catch(err => {
        console.error('Error deleting user:', err);
        if (err.response && err.response.data && err.response.data.error) {
          setError(err.response.data.error);
        } else {
          setError('Error deleting user');
        }
      });
    }
  };
  

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>User List</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Password Hash</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.password}</td>
              <td>
                <button onClick={() => handleDelete(user.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Admin;
