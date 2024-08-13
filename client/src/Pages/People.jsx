import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode'; // Correct import statement for jwt-decode
import { RiUserFill } from "react-icons/ri";

function People({ filter }) {
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [peopleData, setPeopleData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPeople, setFilteredPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [groups, setGroups] = useState([]);
  const [showGroupSelector, setShowGroupSelector] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [UserId, setUserId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // Pagination state
  const [itemsPerPage] = useState(8); // Number of items per page
  const token = localStorage.getItem('token');

  const getUserIdFromToken = () => {
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
  }, [token]);

  useEffect(() => {
    const fetchPeopleData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/v1/auth/people', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setPeopleData(response.data);
        setFilteredPeople(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch data');
        setLoading(false);
      }
    };

    fetchPeopleData();
  }, [token]);

  const fetchGroups = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/v1/auth/group', {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params: {
          userId: UserId
        }
      });
      setGroups(response.data);
    } catch (err) {
      console.error('Failed to fetch groups', err);
    }
  };

  useEffect(() => {
    if (UserId) {
      fetchGroups();
    }
  }, [UserId]);

  const handleCardClick = (person) => {
    setSelectedPerson(person);
  };

  const handleCloseDetails = () => {
    setSelectedPerson(null);
  };

  const handleShowGroupSelector = () => {
    setShowGroupSelector(true);
    fetchGroups(); // Call fetchGroups here if you want to load groups when opening the modal
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const handleGroupSelect = async (groupId) => {
    setSelectedGroupId(groupId);
    if (selectedPerson) {
      try {
        await axios.post('http://localhost:5000/api/v1/auth/invite', {
          groupId,
          personId: selectedPerson._id
        }, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        alert('Invitation sent successfully!');
        setShowGroupSelector(false); // Close the modal after sending invitation
      } catch (err) {
        console.error('Failed to send invitation', err);
        alert('Failed to send invitation');
      }
    }
  };

  useEffect(() => {
    // Apply filter to peopleData
    const filtered = peopleData.filter(person => {
      return Object.keys(filter).every(key => {
        if (!filter[key]) return true;
        if (Array.isArray(person[key])) {
          return person[key].some(item => item.toLowerCase().includes(filter[key].toLowerCase()));
        }
        return person[key]?.toString().toLowerCase().includes(filter[key].toLowerCase());
      });
    });
    setFilteredPeople(filtered);
  }, [filter, peopleData]);

  // Pagination logic
  const indexOfLastPerson = currentPage * itemsPerPage;
  const indexOfFirstPerson = indexOfLastPerson - itemsPerPage;
  const currentPeople = filteredPeople.slice(indexOfFirstPerson, indexOfLastPerson);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <div className="grid grid-cols sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 py-10">
        {currentPeople.map(person => (
          <div
            key={person._id}
            className="bg-white shadow-xl rounded-lg mt-11 text-gray-900 cursor-pointer hover:shadow-2xl transition-shadow duration-300 flex flex-col"
            onClick={() => handleCardClick(person)}
          >
            <div className="relative flex-grow">
              <div className="bg-cover mx-24 w-1/2 h-1/2 rounded-t-lg">
                <RiUserFill size={96} />
              </div>
            </div>
            <div className="text-center mt-16 mb-4 px-4">
              <h2 className="font-semibold text-xl">{person.Name}</h2>
            </div>
            <ul className="py-4 px-3 text-gray-700 space-y-2 flex-grow">
              <li className="flex space-x-2">
                <strong className="text-gray-900">Course:</strong>
                <span>{person.course}</span>
              </li>
              <li className="flex ">
                <strong className="text-gray-900">Interests:</strong>
                <span>{person.interests.join(', ')}</span>
              </li>
              <li className="flex space-x-2">
                <strong className="text-gray-900">Hobbies:</strong>
                <span>{person.hobbies.join(', ')}</span>
              </li>
            </ul>
            <div className="p-4 border-t">
              <button 
                className="w-full rounded-full bg-red-600 hover:bg-gray-800 text-white font-semibold px-6 py-2"
                onClick={handleShowGroupSelector}
              >
                follow
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedPerson && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative">
            <button className="absolute top-2 right-2 text-gray-500" onClick={handleCloseDetails}>
              <svg className="w-6 h-6 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M12 10.293l4.707-4.707 1.414 1.414L13.414 12l4.707 4.707-1.414 1.414L12 13.414l-4.707 4.707-1.414-1.414L10.586 12 5.879 7.293l1.414-1.414L12 10.293z"/>
              </svg>
            </button>
            <div className="">
              <div className="mx-44 w-32 h-32 rounded-full bg-cover">
                <RiUserFill size={96} />
              </div>
              <div className="text-left p-4">
                <h2 className="text-2xl font-bold text-center mb-4">{selectedPerson.Name}</h2>
                <p className="text-gray-700 mt-2"><strong>DOB:</strong> {formatDate(selectedPerson.dob)}</p>
                <p className="text-gray-700 mt-2"><strong>Year of Joining:</strong> {selectedPerson.yearOfjoining}</p>
                <p className="text-gray-700 mt-2"><strong>Interests:</strong> {selectedPerson.interests.join(', ')}</p>
                <p className="text-gray-700 mt-2"><strong>Hobbies:</strong> {selectedPerson.hobbies.join(', ')}</p>
                <p className="text-gray-700 mt-2"><strong>Current Address:</strong> {selectedPerson.currentAddress}</p>
                <p className="text-gray-700 mt-2"><strong>Permanent Address:</strong> {selectedPerson.PermanentAddress}</p>
              </div>
            </div>
            <div className="mt-4 flex justify-center">
              <button 
                className="bg-green-500 text-white px-4 py-2 rounded-lg ml-4 hover:bg-green-600" 
                onClick={handleShowGroupSelector}
              >
                Invite to Group
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Group Selector Modal */}
      {showGroupSelector && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative">
            <button className="absolute top-2 right-2 text-gray-500" onClick={() => setShowGroupSelector(false)}>
              <svg className="w-6 h-6 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M12 10.293l4.707-4.707 1.414 1.414L13.414 12l4.707 4.707-1.414 1.414L12 13.414l-4.707 4.707-1.414-1.414L10.586 12 5.879 7.293l1.414-1.414L12 10.293z"/>
              </svg>
            </button>
            <h2 className="text-2xl font-bold mb-4">Select a Group</h2>
            <ul className="space-y-2">
              {groups.map(group => (
                <li 
                  key={group._id} 
                  className={`cursor-pointer text-blue-600 hover:underline ${selectedGroupId === group._id ? 'font-bold' : ''}`}
                  onClick={() => handleGroupSelect(group._id)}
                >
                  {group.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex justify-center mt-6">
        <button 
          className="px-4 py-2 bg-gray-800 text-white rounded-l-lg"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="px-4 py-2 bg-gray-200 text-gray-800">{currentPage}</span>
        <button 
          className="px-4 py-2 bg-gray-800 text-white rounded-r-lg"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={indexOfLastPerson >= filteredPeople.length}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default People;
