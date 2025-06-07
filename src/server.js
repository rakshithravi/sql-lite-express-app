import express from 'express';
import path, {dirname} from 'path';
import {fileURLToPath} from 'url';
import authRoutes from './routes/auth-routes.js';
import todoRoutes from './routes/todo-routes.js';
import authMiddleware from './middleware/auth-middleware.js';

const app = express();
const PORT = process.env.PORT || 5003;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Serve static files from the 'public' directory

// MIDDLEWARES
// middleware to parse JSON bodies
app.use(express.json());
// middlewate to serve static files
app.use(express.static(path.join(__dirname, '../public')));



app.get('/', (req, res) => {
  res.send('Hello, World!');
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ROUTES
app.use('/auth', authRoutes)
app.use('/todos', authMiddleware, todoRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`, `http://localhost:${PORT}`);
});