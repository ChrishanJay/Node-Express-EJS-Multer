const express = require('express');
const router = express.Router();

const User = require('../models/user');
const multer = require('multer');

let filename = '';

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        filename = file.fieldname + "_" + Date.now() + "_" + file.originalname;
        cb(null, filename);
    }
});

var upload = multer({
    storage: storage
}).single('image');

router.post('/add', upload, (req, res) => {
    const user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        image: filename
    });

    user.save((error) => {
        if (error) {
            res.json({ message: error.message, type: 'danger' });
        } else {
            req.session.message = {
                type: 'success',
                message: 'User added successfully!'
            };
            res.redirect('/');
        }
    });
});

// Get All users
router.get('/', (req, res, next) => {
    User.find({}, (error, users) => {
        if (error) {
            res.json({ message: error.message, type: 'danger' });
        } else {
            res.render('index', { title: 'Home', users: users });
        }
    });
});

router.get('/add', (req, res) => {
    res.render('add', { title: 'Add User' });
});

module.exports = router;