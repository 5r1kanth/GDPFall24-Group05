const express = require('express');
const { register, login, forgotPassword, resetPassword, getCourses, getCourseById, enrollCourse, getEnrolledCourses, getLectures, getModules, getQuiz, getQuizQuestions, getAssignments, submitAssignment, submitQuiz, updateStudentModuleProgress, getStudentModuleProgress, getCourseProgressSummary } = require('../Controllers/userControllers.js');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const router = express.Router();


cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
});


const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "profiles",
        allowed_formats: ["jpg", "png", "jpeg"],
    }
});

const uploadProfile = multer({ storage });

const storage1 = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        const ext = file.originalname.split('.').pop();
        return {
            folder: "assignments",
            resource_type: "raw",
            public_id: `${file.fieldname}-${Date.now()}.${ext}`,
            format: ext,
        };
    },
});


const uploadAssignment = multer({ storage: storage1 });

// GET
router.get('/test', (req, res) => {
    res.send("User route...");
});
router.get('/getCourses', getCourses);
router.get('/getCourseById/:courseId', getCourseById);
router.get('/getEnrolledCourses/:userId', getEnrolledCourses);
router.get('/modules/:CourseID', getModules);
router.get('/lectures/:id?', getLectures); 
router.get('/module/lectures/:moduleId', getLectures);
router.get('/quizzes/:courseId?', getQuiz);
router.get('/quiz/questions/:QuizID?', getQuizQuestions);
router.get('/assignments/:CourseID?', getAssignments);
router.get('/progress/:studentID', getStudentModuleProgress);
router.get('/progress/summary/:studentId/:courseId', getCourseProgressSummary)

// POST
router.post('/register', uploadProfile.single('ProfilePicture'), register);
router.post('/login', login);
router.post('/forgotPassword/:role', forgotPassword);
router.post('/resetPassword/:role', resetPassword );
router.post('/enrollCourse', enrollCourse);
router.post("/submitAssignment", uploadAssignment.single('file'), submitAssignment);
router.post('/quiz/submit', submitQuiz);
router.post('/update-progress', updateStudentModuleProgress);
// PUT


// DELETE


module.exports = router;
