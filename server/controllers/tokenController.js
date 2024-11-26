import jwt from 'jsonwebtoken';

export const createToken = (userId) => {
    return jwt.sign(
        { id: userId },
        process.env.JWT_SECRET,
        { expiresIn: '1m' }  // token expires in 1 minute
    );
};

export const createAuthHeaders = (userId) => {
    const token = createToken(userId);
    return {
        'Authorization': `Bearer ${token}`,
        'Access-Control-Expose-Headers': 'Authorization'
    };
};