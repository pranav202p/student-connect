import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import { toast } from 'react-toastify';

export default function CreateGroup({ isOpen, onClose }) {
  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');
  const [userId, setUserId] = useState('');

  // Extract user ID from token
  const getUserIdFromToken = () => {
    const token = localStorage.getItem('token'); 
    if (token) {
      try {
        const decoded = jwtDecode(token); // Decode the token
        setUserId(decoded.email); 
      } catch (error) {
        console.error('Failed to decode token', error);
      }
    }
  };

  useEffect(() => {
    getUserIdFromToken();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/v1/auth/groups', {
        name: groupName,
        description,
        createdBy: userId 
      });
      toast.success('Group created successfully');
      onClose(); // Close modal on success
    } catch (error) {
      console.error('Failed to create group', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm z-40">
      <div className="fixed inset-0 flex justify-center items-center z-50">
        <div className="bg-white p-8 rounded-lg w-11/12 max-w-lg relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
            aria-label="Close"
          >
            &times;
          </button>
          <h1 className="text-3xl font-bold mb-4">Create a New Group</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="groupName">
                Group Name
              </label>
              <input
                type="text"
                id="groupName"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="border rounded-lg py-2 px-4 w-full"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="description">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border rounded-lg py-2 px-4 w-full"
                rows="4"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-teal-600 hover:bg-teal-700 text-white rounded-lg px-4 py-2"
            >
              Create Group
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
