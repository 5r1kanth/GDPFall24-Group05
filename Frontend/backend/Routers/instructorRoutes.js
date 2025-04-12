const express = require('express');

const Controller = require('../Controllers/instructorControllers.js');
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
    params: async (req, file) => {
        const ext = file.originalname.split('.').pop();
        return {
            folder: "Materials",
            resource_type: "raw",
            public_id: `${file.fieldname}-${Date.now()}.${ext}`,
            format: ext,
        };
    },
});

const uploadMaterials = multer({ storage });

// GET
router.get('/test', (req,res) => {
    res.send("Instructor route...");
});
router.get('/getCourses', Controller.getCourses);
router.get('/getCourseById/:courseId', Controller.getCourseById);
router.get('/getInstructorCourses/:userId', Controller.getInstructorCourses);
router.get('/getEnrolledStudents/:userId', Controller.getEnrolledStudents);
router.get('/modules/:CourseID', Controller.getModules);
router.get('/lectures/:id?', Controller.getLectures); 
router.get('/module/lectures/:moduleId', Controller.getLectures);
router.get('/quizzes/:courseId?', Controller.getQuiz);
router.get('/quiz/questions/:QuizID?', Controller.getQuizQuestions);
router.get('/assignments/:CourseID?', Controller.getAssignments);
router.get('/getAssignmentSubmissions', Controller.getSubmittedAssignments);
router.get('/fetchQuizAttempts', Controller.fetchQuizAttempts);

// POST
router.post('/createCourse', Controller.addCourse);
router.post('/addCourseModule', Controller.addModule);
router.post('/addLecture', uploadMaterials.single('Material'), Controller.addLecture);
router.post('/quizzes', Controller.addQuiz);
router.post('/addQuizQuestion', Controller.addQuizQuestion);
router.post('/assignments', Controller.addAssignment);
router.post("/updateSubmission", Controller.updateSubmission);



// PUT
router.put('/editModule/:ModuleID', Controller.editModule);
router.put('/editLecture/:id', uploadMaterials.single('Material'),Controller.editLecture);
router.put('/quizzes/:QuizID', Controller.editQuiz);
router.put('/editQuizQuestion/:QuestionID', Controller.editQuizQuestion);


// DELETE
router.delete('/deleteModule/:ModuleID', Controller.deleteModule);
router.delete('/deleteLecture/:id', Controller.deleteLecture);
router.delete('/quizzes/:QuizID', Controller.deleteQuiz);
router.delete('/deleteQuizQuestion/:QuestionID', Controller.deleteQuizQuestion);
router.delete('/deleteAssignment/:AssignmentID', Controller.deleteAssignment);


module.exports = router;
