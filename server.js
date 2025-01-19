import express from 'express';
import path from 'path';
import compression from 'compression';
import helmet from 'helmet';
import morgan from 'morgan'; // For better request logging

const app = express();
const PORT = process.env.PORT || 3000;
const __dirname = path.resolve();

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://www.gstatic.com", "https://apis.google.com"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'", "https://firestore.googleapis.com", "https://identitytoolkit.googleapis.com"],
            frameSrc: ["'self'", "https://apis.google.com"]
        }
    }
}));

// Compress responses
app.use(compression());

// Parse JSON bodies
app.use(express.json());

// Serve static files from the public directory with caching
app.use(express.static('public', {
    maxAge: '1d', // Cache static files for 1 day
    etag: true // Use ETag for caching
}));

// Request logging
app.use(morgan('combined'));

// Serve index.html for the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle 404s
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});