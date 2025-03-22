import express from 'express';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = 3001;

// Middleware to parse JSON bodies
app.use(express.json());

// Route to read from the filesystem
app.get('/read-file', (req, res) => {
    const filePath = path.join(__dirname, 'example.txt');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Unable to read file');
        }
        res.send(data);
    });
});

// Route to write to the filesystem
app.post('/write-file', (req, res) => {
    const filePath = path.join(__dirname, 'example.txt');
    const content = req.body.content;
    fs.writeFile(filePath, content, 'utf8', (err) => {
        if (err) {
            return res.status(500).send('Unable to write file');
        }
        res.send('File written successfully');
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});