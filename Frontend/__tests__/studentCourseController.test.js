const { getCourses, getCourseById, enrollCourse, getEnrolledCourses, getModules, getLectures, getQuiz, getQuizQuestions, getAssignments, submitAssignment } = require('../backend/Controllers/userControllers.js');
const db = require('../backend/databaseConnection.js'); 
const EmailService = require('../backend/Utils/mails.js');


jest.mock('../backend/databaseConnection.js', () => ({
    execute: jest.fn(),
    query: jest.fn()
}));

describe("Course Controller Tests", () => {
    
    afterEach(() => {
        jest.clearAllMocks();
    });

    test("getCourses should retrieve all courses", async () => {
        const mockCourses = [{ CourseID: 1, Title: "Python", Instructor: "Instructor" }];
        db.execute.mockResolvedValue([mockCourses]);

        const req = {};
        const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

        await getCourses(req, res);

        expect(db.execute).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith({ message: "Courses retrieved successfully", data: mockCourses });
    });

    test("getCourseById should retrieve a course by ID", async () => {
        const mockCourse = [{ CourseID: 1, Title: "Python", Instructor: "Instructor" }];
        db.execute.mockResolvedValue([mockCourse]);

        const req = { params: { courseId: 1 } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await getCourseById(req, res);

        expect(db.execute).toHaveBeenCalledWith(expect.any(String), [1]);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: "Course retrieved successfully", data: mockCourse[0] });
    });

    test("enrollCourse should enroll a user in a course", async () => {
        db.execute.mockResolvedValueOnce([[]]);
        db.execute.mockResolvedValueOnce({ insertId: 1 });

        const req = { body: { userId: 1, courseId: 2 } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await enrollCourse(req, res);

        expect(db.execute).toHaveBeenCalledTimes(2);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ message: "Enrollment successful" });
    });

    test("getEnrolledCourses should fetch enrolled courses", async () => {
        const mockCourses = [{ CourseID: 1, Title: "Python", Instructor: "Instructor" }];
        db.execute.mockResolvedValue([mockCourses]);

        const req = { params: { userId: 1 } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await getEnrolledCourses(req, res);

        expect(db.execute).toHaveBeenCalledWith(expect.any(String), [1]);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: "Enrolled courses retrieved successfully", data: mockCourses });
    });

    test("getModules should return modules for a course", async () => {
        const mockModules = [{ ModuleID: 1, Title: "Intro to Python" }];
        db.query.mockResolvedValue(mockModules);

        const req = { params: { CourseID: 1 } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await getModules(req, res);

        expect(db.query).toHaveBeenCalledWith(expect.any(String), [1]);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ success: true, data: mockModules });
    });

    test("getLectures should return lectures for a module", async () => {
        const mockLectures = [{ LectureID: 1, Title: "Python Basics" }];
        db.query.mockResolvedValue(mockLectures);

        const req = { params: { moduleId: 1 } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await getLectures(req, res);

        expect(db.query).toHaveBeenCalledWith(expect.any(String), [1]);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockLectures);
    });

    test("getQuiz should return quizzes for a course", async () => {
        const mockQuizzes = [{ QuizID: 1, Title: "Python Quiz 1" }];
        db.query.mockResolvedValue(mockQuizzes);

        const req = { params: { courseId: 1 } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await getQuiz(req, res);

        expect(db.query).toHaveBeenCalledWith(expect.any(String), [1]);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockQuizzes);
    });

    test("getQuizQuestions should return quiz questions", async () => {
        const mockQuestions = [{ QuestionID: 1, Text: "What are variables?" }];
        db.query.mockResolvedValue(mockQuestions);

        const req = { params: { QuizID: 1 } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await getQuizQuestions(req, res);

        expect(db.query).toHaveBeenCalledWith(expect.any(String), [1]);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockQuestions);
    });

    test("getAssignments should return assignments", async () => {
        const mockAssignments = [{ AssignmentID: 1, Title: "Python Homework" }];
        db.query.mockResolvedValue(mockAssignments);

        const req = { params: { CourseID: 1 } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await getAssignments(req, res);

        expect(db.query).toHaveBeenCalledWith(expect.any(String), [1]);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockAssignments);
    });

    test("submitAssignment should store a submission", async () => {
        const req = {
            body: {
                AssignmentID: 1,
                StudentID: 2,
                SubmissionText: "My answer"
            },
            file: { path: "./__tests__/profile-icon.png" }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    
        db.query.mockResolvedValue([{}]);
    
        await submitAssignment(req, res);
    
        expect(db.query).toHaveBeenCalledWith(expect.any(String), [1, 2, "My answer", "./__tests__/profile-icon.png"]);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ message: "Assignment submitted successfully", fileUrl: "./__tests__/profile-icon.png" });
    });
    
});
