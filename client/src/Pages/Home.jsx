import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/image.png';
import logo2 from '../assets/image2.jpg';
import Footer from '../components/footer.jsx';
import AuthContext from '../Authentication/AuthContext.jsx';
import { FaUser, FaUsers } from 'react-icons/fa'; 
import { FcInvite } from "react-icons/fc";
import People from './People.jsx';
import { SiGooglemaps } from "react-icons/si";
import axios from 'axios';

export default function Home() {
  const { user, loading, logout } = useContext(AuthContext);
  
  const [location, setLocation] = useState('Banglore, IN');
  const [searchValue, setSearchValue] = useState(''); 
  const[searchType,setsearchType]=useState(' ');
  const [filterType, setFilterType] = useState(''); 
  const [filterValue, setFilterValue] = useState('');
  const [showInvites, setShowInvites] = useState(false); // State for modal visibility
  const [invites, setInvites] = useState([]); // Ensure invites is an array

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(fetchLocation);
    }
  }, []);

  const fetchLocation = async (position) => {
    const { latitude, longitude } = position.coords;
  
    try {
      const response = await axios.get('https://nominatim.openstreetmap.org/reverse', {
        params: {
          lat: latitude,
          lon: longitude,
          format: 'json'
        }
      });
  
      const { address } = response.data;
  
      const district = address.city || address.suburb || address.neighbourhood || 'Unknown District';
      const state = address.state || 'Unknown State';
  
      const formattedLocation = `${district}, ${state}`;
  
      setLocation(formattedLocation);
    } catch (error) {
      console.error('Error fetching location:', error.message);
      setLocation('Location not available');
    }
  };

  const handleLocationChange = (event) => {
    setLocation(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  const handleFilterTypeChange = (event) => {
    setFilterType(event.target.value);
    setFilterValue(''); // Reset filter value when changing filter type
  };

  const handleFilterValueChange = (event) => {
    setFilterValue(event.target.value);
  };

  const applyFilters = () => {
    // If searchType is set, use it for filtering
    if (searchType) {
      setFilterType(searchType);
      setFilterValue(searchValue);
    } else {
      setFilterType(filterType);
      setFilterValue(filterValue);
    }
  };

  const fetchInvites = async () => {
    try {
      const response = await axios.get('/api/invites'); // Adjust the API endpoint as needed
      console.log(response.data); // Log the response to check its structure
      setInvites(Array.isArray(response.data) ? response.data : []); // Ensure invites is always an array
    } catch (error) {
      console.error('Error fetching invites:', error.message);
      setInvites([]); // Set invites to an empty array on error
    }
  };
  
  const handleShowInvites = async () => {
    await fetchInvites();
    setShowInvites(true);
  };

  const handleCloseModal = () => {
    setShowInvites(false);
  };

  const handleAcceptInvite = async (inviteId) => {
    try {
      await axios.post(`/api/invites/${inviteId}/accept`);
      setInvites(invites.filter(invite => invite.id !== inviteId));
    } catch (error) {
      console.error('Error accepting invite:', error.message);
    }
  };

  const handleRejectInvite = async (inviteId) => {
    try {
      await axios.post(`/api/invites/${inviteId}/reject`);
      setInvites(invites.filter(invite => invite.id !== inviteId));
    } catch (error) {
      console.error('Error rejecting invite:', error.message);
    }
  };

  const filter = filterType ? { [filterType]: filterValue } : {};
  
  return (
    <div>
      <div className="max-w-screen mx-auto px-24 py-8">
        {loading && <div>Loading...</div>}
        {!loading && (
          <>
            <header className="flex items-center mb-8">
              <img src={logo} alt="student Connect" className="bg-cover h-16 flex-shrink-0 pr-24 mr-8" />
              {user ? (
                <div className="flex flex-grow items-center mx-auto">
                  {searchValue && (
                    <div className="relative mr-4">
                      <input
                        type="text"
                        id="searchValue"
                        placeholder="Search for people"
                        onChange={handleSearchChange}
                        className="border rounded-lg py-2 px-4 pr-10 w-full"
                      />
                      <svg
                        className="w-4 h-4 absolute right-3 top-3 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </div>
                  )}
                  <input
                    type="text"
                    value={location}
                    onChange={handleLocationChange}
                    className="border rounded-lg py-2 px-4 mr-4"
                  />
                </div>
              ) : (
                <div className="absolute top-4 right-4 flex space-x-4">
                  <Link to='/signup'>
                    <button className="border hover:bg-slate-300 rounded-lg px-4 py-2">Log in</button>
                  </Link>
                  <Link to='/signup'>
                    <button className="bg-red-500 hover:bg-red-700 text-white rounded-lg px-4 py-2">Sign up</button>
                  </Link>
                </div>
              )}
              {user && (
                <button onClick={logout} className="bg-red-500 hover:bg-red-700 text-white rounded-lg px-4 py-2 ml-4">
                  Logout
                </button>
              )}
            </header>
            
            <main className="flex items-center mt-24 mx-24">
              <div className="w-full pr-8">
                <h1 className="text-5xl font-bold mb-4">
                  The Student platform—Where interests become friendships
                </h1>
                <p className="text-xl">
                  Join a community where students connect based on shared interests and goals.
                </p>
                <p className='text-xl mb-6'>
                  Discover, collaborate, and thrive with peers who share your passions and ambitions.
                </p>
                
                <Link to='signup'>
                  <button className="bg-teal-600 hover:bg-teal-800 text-white rounded-lg px-6 py-3 text-lg">
                    Join Now
                  </button>
                </Link>
              </div>
              <div className="w-1/2 mx-auto">
                <img src={logo2} alt="Meetup illustration" className="bg-cover w-3/4" />
              </div>
            </main>

            {user && (
              <div className='mt-24 mx-24'>
                <div className="flex justify-between items-center mb-20">
                  <div className="w-1/2">
                    <h2 className="text-2xl font-bold mb-4">Filter Users</h2>
                    <div className="mb-4">
                      <label className="block text-sm mb-3 font-medium text-gray-700" htmlFor="filterType">
                        Filter by
                      </label>
                      <select
                        id="filterType"
                        value={filterType}
                        onChange={handleFilterTypeChange}
                        className="border rounded-lg py-2 px-4 w-full"
                      >
                        <option value="">Select filter</option>
                        <option value="Name">Name</option>
                        <option value="dob">Date of Birth</option>
                        <option value="course">Course</option>
                        <option value="yearOfJoining">Year of Joining</option>
                        <option value="interests">Interests</option>
                        <option value="hobbies">Hobbies</option>
                        <option value="currentAddress">Current Address</option>
                        <option value="permanentAddress">Permanent Address</option>
                      </select>
                    </div>
                    {filterType && (
                      <div className="mb-4">
                        <input
                          type="text"
                          id="filterValue"
                          value={filterValue}
                          onChange={handleFilterValueChange}
                          className="border rounded-lg py-2 px-4 w-full"
                        />
                      </div>
                    )}
                    <button
                      onClick={applyFilters}
                      className="bg-teal-600 hover:bg-teal-700 text-white rounded-lg px-4 py-2"
                    >
                      Apply Filters
                    </button>
                  </div>

                  <div className="flex items-center space-x-4">
                    <Link to="/create-group" className="flex items-center space-x-7 p-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg px-4 py-2">
                      <FaUsers size={28} />
                      <span>Create Group</span>
                    </Link>
                    <button
                      onClick={handleShowInvites}
                      className="flex items-center space-x-7 p-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg px-4 py-2"
                    >
                      <FcInvite size={28} />
                      <span>Invites</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center space-x-10 mb-5">
                  <h1 className="text-3xl font-bold">
                    𝘗𝘦𝘰𝘱𝘭𝘦 𝘕𝘦𝘢𝘳 𝘔𝘦
                  </h1>
                  <div className="flex items-center space-x-2">
                    <p className="text-2xl underline text-green-700">
                      {location}
                    </p>
                    <div className='text-green-700'>
                      <SiGooglemaps size={24}/>
                    </div>
                  </div>
                </div>
                
                <People filter={filter} />
              </div>
            )}
          </>
        )}
      </div>
      <Footer/>

      {/* Modal for showing invites */}
      {showInvites && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg w-11/12 max-w-lg">
            <h2 className="text-2xl font-bold mb-4">Group Join Invites</h2>
            {invites.length > 0 ? (
              <ul>
                {invites.map((invite) => (
                  <li key={invite.id} className="border-b py-2">
                    <p><strong>Group:</strong> {invite.groupName}</p>
                    <p><strong>From:</strong> {invite.fromUser}</p>
                    <p><strong>Message:</strong> {invite.message}</p>
                    <div className="flex space-x-4 mt-2">
                      <button
                        onClick={() => handleAcceptInvite(invite.id)}
                        className="bg-green-500 hover:bg-green-700 text-white rounded-lg px-4 py-2"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleRejectInvite(invite.id)}
                        className="bg-red-500 hover:bg-red-700 text-white rounded-lg px-4 py-2"
                      >
                        Reject
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No invites found.</p>
            )}
            <button
              onClick={handleCloseModal}
              className="mt-4 bg-red-500 hover:bg-red-700 text-white rounded-lg px-4 py-2"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
