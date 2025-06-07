import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization']
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decodes) => {
        if (err) {
            return res.status(403).json({ message: 'Failed to authenticate token' });
        }
        // Save userId from the decoded token to the request object
        req.userId = decodes.id;
        next();
    })
};  

export default authMiddleware; 