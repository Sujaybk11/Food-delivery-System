import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Users = () => {
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem('token');

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/admin/users', {
        headers: { token }
      });
      if (response.data.success) {
        setUsers(response.data.users);
      }
    } catch (error) {
      toast.error("Failed to fetch users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>User Management</h2>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8f9fa' }}>
              <th style={{ padding: '12px', border: '1px solid #ddd' }}>Name</th>
              <th style={{ padding: '12px', border: '1px solid #ddd' }}>Email</th>
              <th style={{ padding: '12px', border: '1px solid #ddd' }}>Role</th>
              <th style={{ padding: '12px', border: '1px solid #ddd' }}>Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id}>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>{user.name}</td>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>{user.email}</td>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>{user.role || 'Customer'}</td>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;