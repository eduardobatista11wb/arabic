const express = require('express');
const router = express.Router();

// Define the route for the home page
router.get('/', (req, res) => {
    res.sendFile('index.html', { root: 'public' });
});

// Define other routes as needed
router.get('/blog', (req, res) => {
    res.send('Blog page');
});

router.get('/contact', (req, res) => {
    res.send('Contact page');
});

// Add more routes for the contents
router.get('/learnArabic', (req, res) => {
    res.send('Learn Arabic page');
});

router.get('/alphabet', (req, res) => {
    res.send('Alphabet page');
});

router.get('/words', (req, res) => {
    res.send('Words page');
});

router.get('/test', (req, res) => {
    res.send('Exercises page');
});

router.get('/pronounce', (req, res) => {
    res.send('Pronunciation page');
});

router.get('/dicas', (req, res) => {
    res.send('Study Tips page');
});

router.get('/arabicKeyboard', (req, res) => {
    res.send('Arabic Keyboard page');
});

module.exports = router;