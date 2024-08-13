import express from 'express';
import bcrypt from 'bcrypt';
import dotenv from "dotenv"
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Groups from '../models/Groups.js';
import Invitation from '../models/Invite.js';
import authenticateToken from '../middleware/authenticationmiddleware.js';  

// Ensure you have the correct path to your User model

const router = express.Router();

dotenv.config();
const secretKey = process.env.JWT_SECRET 

//auth
router.get('/me', authenticateToken, (req, res) => {
  res.json(req.user); // Send the authenticated user's details
});

//registration
router.post('/add', async (req, res) => {
  const { Name, dob, course, yearOfjoining, interests, hobbies, currentAddress,    PermanentAddress,email, password } = req.body;
  console.log(req.body)
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      Name,
      dob,
      course,
      yearOfjoining,
      interests,
      hobbies,
      currentAddress,
      PermanentAddress,
      email,
      password: hashedPassword
    });

    // Save the user to the database
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

//login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log(req.body)
    try {
      // Check if user exists
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      // Check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      // Create and sign JWT token
      const token = jwt.sign({ id: user._id, email: user.email },  secretKey, {
        expiresIn: '7days', // Token expiration time
      });
      console.log(token);
      // Send token in response
      res.json({ token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });


//get user//
router.get('/people', authenticateToken, async (req, res) => {
  try {
    // Check if the user email exists in the token
    if (!req.user || !req.user.email) {
      return res.status(400).json({ message: 'User email not found in token' });
    }

    const loggedInUserEmail = req.user.email;

    // Fetch users excluding the logged-in user
    const peopleData = await User.find({ email: { $ne: loggedInUserEmail } });

    if (!peopleData.length) {
      return res.status(404).json({ message: 'No people found' });
    }

    res.json(peopleData);
  } catch (err) {
    console.error('Error fetching people:', err.message);
    res.status(500).json({ message: 'Failed to fetch data' });
  }
});


//group create
router.post('/groups', async (req, res) => {
  try {
    const { name, description, createdBy } = req.body;
    
    // Validate request data
    if (!name || !description || !createdBy) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Create new group
    const newGroup = new Groups({ name, description, createdBy });
    await newGroup.save();

    res.status(201).json({ message: 'Group created successfully', group: newGroup });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create group' });
  }
});


router.get('/group', async (req, res) => {
  try {
    const userId = req.query.userId; 
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    const groups = await Groups.find({ createdBy: userId }); // Query groups by createdBy field
    res.json(groups);
  } catch (error) {
    console.error('Error fetching groups:', error);
    res.status(500).json({ error: 'Failed to fetch groups' });
  }
});





router.post('/invite', authenticateToken, async (req, res) => {
  const { groupId, personId } = req.body;
  const userId = req.user.email; // Extracted from token

  try {
    // Find the group
    const group = await Groups.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Find the person
    const person = await User.findById(personId);
    if (!person) {
      return res.status(404).json({ message: 'Person not found' });
    }

    // Check if the person is already in the group
    if (group.members.includes(personId)) {
      return res.status(400).json({ message: 'Person is already a member of this group' });
    }

    // Add the person to the group's member list
    group.members.push(personId);
    await group.save();

    // Optionally, you can send a notification or email to the person
    // For simplicity, we'll skip this step

    res.status(200).json({ message: 'Invitation sent successfully' });
  } catch (err) {
    console.error('Failed to send invitation:', err);
    res.status(500).json({ message: 'Failed to send invitation' });
  }
});

//check invites
router.get('/invites',authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id; 

    // Fetch all groups where the current user is a member
    const groups = await Groups.find({ members: userId }).select('name');

    // Send the list of group names as the response
    res.status(200).json(groups.map(group => group.name));
  } catch (error) {
    console.error('Error fetching invites:', error);
    res.status(500).json({ error: 'Error fetching invites' });
  }
});



export default router;
