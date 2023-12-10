
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Serve static files
app.use(express.static('public'));

// Array to store photo data
let photos = [];

// Endpoint to handle photo uploads
app.post('/upload', upload.single('photo'), (req, res) => {
    const photo = {
        url: '/uploads/' + req.file.filename,
        description: req.body.description
    };
    photos.push(photo);
    res.json({ success: true });
});

// Endpoint to serve photos
app.get('/photos', (req, res) => {
    res.json(photos);
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
