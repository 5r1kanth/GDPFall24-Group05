const express = require('express');
const { login, getStudentsWithCourses, getCoursesByInstructor, toggleUserBlockStatus } = require('../Controllers/adminControllers.js');

const router = express.Router();

// GET
router.get('/test', (req,res) => {
    res.send("Admin route...");
})
router.get('/students', getStudentsWithCourses);
router.get('/instructors', getCoursesByInstructor);


// POST
router.post('/login', login);
router.post('/students/:userId/block', toggleUserBlockStatus);


// PUT


// DELETE



module.exports = router;
