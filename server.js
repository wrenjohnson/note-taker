const express = require('express');
const fs = require('fs');
const path = require('path');
const uuid = require('uuid');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', 'utf8', (error, data) => {
        if (error) {
            res.status(500).json({ error: 'Unable to read notes.' });
        } else {
            const notes = JSON.parse(data);
            res.json(notes);
        }
    });
});

app.post('/api/notes', (req, res) => {
    const newNote = req.body;
    fs.readFile('./db/db.json', 'utf8', (error, data) => {
        if (error) {
            res.status(500).json({ error: 'Unable to read notes.' });
        } else {
            const notes = JSON.parse(data);
            newNote.id = uuid.v4();
            notes.push(newNote);
            fs.writeFile('./db/db.json', JSON.stringify(notes), (error) => {
                if (error) {
                    res.status(500).json({ error: 'Unable to write notes.' });
                } else {
                    res.json(newNote);
                }
            });
        }
    });
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/notes.html'));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(PORT, () => {
    console.log(`App listening on PORT: ${PORT}`);
});