import pool from '../config/database.js';

export const getGroups = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM groups'); // Adjust the query based on your database schema
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching groups:', error);
        res.status(500).json({ message: 'Failed to fetch groups' });
    }
};

export const getAllGroups = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM groups');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching groups:', error);
        res.status(500).json({ message: 'Failed to fetch groups' });
    }
};

export const getGroupById = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query('SELECT * FROM groups WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Group not found' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching group:', error);
        res.status(500).json({ message: 'Failed to fetch group' });
    }
};

export const createGroup = async (req, res) => {
    const { name } = req.body;
    const ownerId = req.user.id; // Get the owner ID from the authenticated user

    try {
        const result = await pool.query(
            'INSERT INTO groups (name, owner) VALUES ($1, $2) RETURNING *',
            [name, ownerId]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating group:', error);
        res.status(500).json({ message: 'Failed to create group' });
    }
};

export const deleteGroup = async (req, res) => {
    const { groupId } = req.params;

    try {
        await pool.query('DELETE FROM groups WHERE id = $1', [groupId]);
        res.json({ message: 'Group deleted successfully' });
    } catch (error) {
        console.error('Error deleting group:', error);
        res.status(500).json({ message: 'Failed to delete group' });
    }
};

export const leaveGroup = async (req, res) => {
    const { groupId } = req.params;
    const memberId = req.user.id; // Get the member ID from the authenticated user

    try {
        await pool.query('DELETE FROM members WHERE group_id = $1 AND account_id = $2', [groupId, memberId]);
        res.json({ message: 'You have left the group successfully' });
    } catch (error) {
        console.error('Error leaving group:', error);
        res.status(500).json({ message: 'Failed to leave group' });
    }
};

export const getGroupMembers = async (req, res) => {
    const { groupId } = req.params;

    try {
        const result = await pool.query(
            'SELECT a.id, a.email, m.role FROM members m JOIN accounts a ON m.account_id = a.id WHERE m.group_id = $1',
            [groupId]
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching group members:', error);
        res.status(500).json({ message: 'Failed to fetch group members' });
    }
};

export const addMember = async (req, res) => {
    const { groupId } = req.params;
    const { email } = req.body;

    try {
        const accountResult = await pool.query('SELECT id FROM accounts WHERE email = $1', [email]);
        if (accountResult.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        const accountId = accountResult.rows[0].id;

        await pool.query('INSERT INTO members (group_id, account_id) VALUES ($1, $2)', [groupId, accountId]);
        res.status(201).json({ message: 'Member added successfully' });
    } catch (error) {
        console.error('Error adding member:', error);
        res.status(500).json({ message: 'Failed to add member' });
    }
};

export const removeMember = async (req, res) => {
    const { groupId, memberId } = req.params;

    try {
        await pool.query('DELETE FROM members WHERE group_id = $1 AND account_id = $2', [groupId, memberId]);
        res.json({ message: 'Member removed successfully' });
    } catch (error) {
        console.error('Error removing member:', error);
        res.status(500).json({ message: 'Failed to remove member' });
    }
};

export const getMembershipRequests = async (req, res) => {
    const { groupId } = req.params;

    try {
        const result = await pool.query(
            'SELECT a.id, a.email FROM membership_requests mr JOIN accounts a ON mr.account_id = a.id WHERE mr.group_id = $1',
            [groupId]
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching membership requests:', error);
        res.status(500).json({ message: 'Failed to fetch membership requests' });
    }
};

export const acceptMember = async (req, res) => {
    const { groupId, memberId } = req.params;

    try {
        await pool.query('DELETE FROM membership_requests WHERE group_id = $1 AND account_id = $2', [groupId, memberId]);
        await pool.query('INSERT INTO members (group_id, account_id) VALUES ($1, $2)', [groupId, memberId]);
        res.json({ message: 'Member accepted successfully' });
    } catch (error) {
        console.error('Error accepting member:', error);
        res.status(500).json({ message: 'Failed to accept member' });
    }
};

export const rejectMember = async (req, res) => {
    const { groupId, memberId } = req.params;

    try {
        await pool.query('DELETE FROM membership_requests WHERE group_id = $1 AND account_id = $2', [groupId, memberId]);
        res.json({ message: 'Member rejected successfully' });
    } catch (error) {
        console.error('Error rejecting member:', error);
        res.status(500).json({ message: 'Failed to reject member' });
    }
};

export const addMovieToGroup = async (req, res) => {
    const { groupId } = req.params;
    const { title, description } = req.body;

    try {
        // Assuming you have a movies table to store group movies
        await pool.query('INSERT INTO group_movies (group_id, title, description) VALUES ($1, $2, $3)', [groupId, title, description]);
        res.status(201).json({ message: 'Movie added to group successfully' });
    } catch (error) {
        console.error('Error adding movie to group:', error);
        res.status(500).json({ message: 'Failed to add movie to group' });
    }
};

export const getGroupMovies = async (req, res) => {
    const { groupId } = req.params;

    try {
        const result = await pool.query('SELECT * FROM group_movies WHERE group_id = $1', [groupId]);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching group movies:', error);
        res.status(500).json({ message: 'Failed to fetch group movies' });
    }
};

export const addScheduleToGroup = async (req, res) => {
    const { groupId } = req.params;
    const { movieId, showtime } = req.body;

    try {
        await pool.query('INSERT INTO group_schedules (group_id, movie_id, showtime) VALUES ($1, $2, $3)', [groupId, movieId, showtime]);
        res.status(201).json({ message: 'Schedule added to group successfully' });
    } catch (error) {
        console.error('Error adding schedule to group:', error);
        res.status(500).json({ message: 'Failed to add schedule to group' });
    }
};

export const getGroupSchedules = async (req, res) => {
    const { groupId } = req.params;

    try {
        const result = await pool.query('SELECT * FROM group_schedules WHERE group_id = $1', [groupId]);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching group schedules:', error);
        res.status(500).json({ message: 'Failed to fetch group schedules' });
    }
};