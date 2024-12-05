import { getAllGroups, getAGroup, createGroup, createPostWithMovie } from "../config/groupQuery.js";

export const getGroups = async (req, res) => {
    try {
        const groups = await getAllGroups();
        if (groups.length === 0) {
            return res.status(404).json({
                message: "No groups found",
            });
        }
        res.status(200).json(groups);
    } catch (error) {
        console.error("Error fetching groups:", error);
        res.status(500).json({
            message: "Failed to fetch groups",
            error: error.message,
        });
    }
};

export const getOneGroup = async (req, res) => {
    try {
        const { groupId } = req.params;
        const group = await getAGroup(groupId);
        console.log('GroupId: ' + groupId)
        if (group.length === 0) {
            return res.status(404).json({
                message: "No groups found",
            });
        }
        res.status(200).json(group[0]);
    } catch (error) {
        console.error("Error fetching groups:", error);
        res.status(500).json({
            message: "Failed to fetch groups",
            error: error.message,
        });
    }
}

export const createAGroup = async (req, res) => {
    try {
        const { name, description } = req.body;
        const ownerId = req.user.id;
        if (!name) {
            return res.status(400).json({
                message: "Group name is required"
            })
        }
        if (!ownerId) {
            return res.status(401).json({
                message: "User ID not found"
            })
        }
        const newGroup = await createGroup( name, description, ownerId);
        res.status(201).json({
            message: "New Group is created successfully",
            groupInfo: newGroup
        })

    } catch (error) {
        console.error("Error creating group:", error);
        res.status(500).json({
            message: "Failed to create post",
            error: error.message,
            stack: error.stack // Add stack trace to better understand the error location
        });
    }
}

export const createNewPost = async (req, res) => {
    try {
        const { title, description, movieId} = req.body;
        const { groupId } = req.params;
        const userId = req.user.id;
        if (!title || !description ||!movieId) {
            return res.status(400).json({
                message: "Title, description and movieId are required"
            })
        }
        if (!userId) {
            return res.status(401).json({
                message: "User ID not found"
            })
        }
        const newPost = await createPostWithMovie( userId, groupId, title, description, movieId);
        res.status(201).json({
            message: "New Post is created successfully",
            postInfo: newPost
        })
    } catch (error) {
        console.error("Error creating post:", error);
        res.status(500).json({
          message: "Failed to create post",
          error: error.message,
        });
    }
}
