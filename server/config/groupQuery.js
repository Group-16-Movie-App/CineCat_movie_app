import pool from "./database.js";

export const getAllGroups = async () => {
    const query = `SELECT g.*, a.name as owner_name FROM groups g JOIN accounts a ON g.owner=a.id ORDER BY created DESC`;
    const result = await pool.query(query);
    return result.rows;
};

export const getAGroup = async (groupId) => {
    const query = `SELECT g.*, a.name as owner_name FROM groups g JOIN accounts a ON g.owner=a.id 
                    WHERE g.id=$1 ORDER BY created DESC`;
    const result = await pool.query(query, [groupId]);
    return result.rows;
};

export const createGroup = async (name, description, userId) => {
    const query = `INSERT INTO groups (name, description, owner) 
                    VALUES ($1, $2, $3) 
                    RETURNING *`;
    const result = await pool.query(query, [name, description, userId]);
    return result.rows[0];
};

export const createPostWithMovie = async (userId, groupId, title, description, movieId) => {
    const query = `INSERT INTO posts (account_id, group_id, title, description, movie_id)
                    VALUES ($1, $2, $3, $4, $5) RETURNING *`;
    const result = await pool.query(query, [userId, groupId, title, description, movieId]);
    return result.rows[0];
};

export const getPosts = async (groupId) => {
    const query = `SELECT p.*, a.name, g.name as group_name FROM posts p
                    JOIN accounts a ON p.account_id = a.id
                    JOIN groups g ON p.group_id = g.id
                    WHERE p.group_id = $1 ORDER BY created DESC`;
    const result = await pool.query(query, [groupId]);
    return result.rows;
}

export const getAPost = async (postId, groupId) => {
    const query = `SELECT p.*, a.name, g.name as group_name FROM posts p 
                    JOIN accounts a ON p.account_id = a.id 
                    JOIN groups g ON p.group_id = g.id
                    WHERE p.id = $1 AND p.group_id = $2`;
    const result = await pool.query(query, [postId, groupId]);
    return result.rows;
}

// Delete a post by the post writer:
export const deleteMyPost = async(groupId, postId, userId) => {
     // Check if the post exists and belongs to the user in the specified group
    const postQuery = `SELECT id FROM posts WHERE id = $1 AND group_id = $2 AND account_id = $3`;
    const postResult = await pool.query(postQuery, [postId, groupId, userId]);
    // If no matching post is found
    if (postResult.rowCount === 0) {
        return { message: 'Post not found or does not belong to you', success: false };
    }
    // Delete the post
    const deletePostQuery = `DELETE FROM posts WHERE id = $1 AND group_id = $2 AND account_id = $3`;
    const deletePostResult = await pool.query(deletePostQuery, [postId, groupId, userId]);
    // If no row was deleted
    if (deletePostResult.rowCount === 0) {
        return { message: 'Failed to delete the post', success: false };
    }
    return { message: 'Post deleted successfully', success: true };    
}

// Delete a member's post as a group's owner or an admin:
export const deletePostAsOwnerOrAdmin = async (groupId, postId, userId) => {
    const isOwnerQuery = `SELECT owner FROM groups WHERE id = $1`;
    const isOwnerResult = await pool.query(isOwnerQuery, [groupId]);

    // If the group does not exist
    if (isOwnerResult.rowCount === 0) {
        return { message: 'Group not found', success: false };
    }

    // Check if the user is an admin of the group
    const roleQuery = `SELECT role FROM members WHERE group_id = $1 AND account_id = $2`;
    const roleResult = await pool.query(roleQuery, [groupId, userId]);

    // Check if the user is a member of the group
    if (roleResult.rowCount === 0) {
        return { message: 'You are not a member of this group', success: false };
    }

    // The user can delete posts if they are the owner or an admin
    const role = roleResult.rows[0].role;
    const isGroupOwner = parseInt(isOwnerResult.rows[0].owner);
    if (role !== 'admin' && userId !== isGroupOwner) {
        return { message: 'You do not have permission to delete posts', success: false };
    }

    //Delete the post
    const deletePostQuery = `DELETE FROM posts WHERE id = $1 AND group_id = $2`;
    const deletePostResult = await pool.query(deletePostQuery, [postId, groupId]);

    if (deletePostResult.rowCount === 0) {
        return { message: 'Post not found or does not belong to this group', success: false };
    }

    return { message: 'Post deleted successfully' };    
}

// Delete a group, only for owners
export const deleteMyGroup = async (groupId, ownerId) => {
    const query = `DELETE FROM groups WHERE id = $1 AND owner = $2`;
    const result = await pool.query(query, [groupId, ownerId]);
    if (result.rowCount > 0) {
        return { message: 'Group deleted successfully' };
    } else {
        return { message: 'Group deletion failed or you are not the owner', success: false };
    }
}

// Leave a group as an owner, if there is no member left, the group is deleted:
export const leaveGroupAsOwner = async (groupId, ownerId) => {
    const memberQuery = `SELECT account_id FROM members WHERE group_id = $1 ORDER BY random() LIMIT 1`;
    const memberResult = await pool.query(memberQuery, [groupId]);
    if (memberResult.rows.length > 0) {
        const newOwnerId = memberResult.rows[0].account_id;
        const query = `UPDATE groups SET owner=$1 WHERE id=$2 AND owner=$3`;
        const result = await pool.query(query, [newOwnerId, groupId, ownerId]);
        if (result.rowCount > 0) {
            return { message: 'Ownership transferred successfully', newOwnerId };
        } else {
            return { message: 'Ownership transfer failed', success: false };
        }
    } else {
        const deleteResult = await deleteMyGroup(groupId, ownerId);
        return deleteResult;
    }
}

// Leave a group as a member:
export const leaveGroupAsMember = async (groupId, memberId) => {
    const query = `DELETE FROM members WHERE group_id = $1 AND account_id = $2`;
    const result = await pool.query(query, [groupId, memberId]);

    if (result.rowCount === 0) {
        return { message: 'Member not found in the group', success: false };
    }
}

