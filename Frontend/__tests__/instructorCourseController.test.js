const { 
    addCourse, 
    getCourses, 
    getCourseById, 
    getInstructorCourses, 
    getEnrolledStudents,
    addModule,
    editModule,
    deleteModule,
    getModules,
    addLecture,
    getLectures,
    editLecture,
    deleteLecture,
    addQuiz,
    editQuiz,
    getQuiz,
    deleteQuiz,
    addQuizQuestion,
    getQuizQuestions,
    getQuizQuestionById,
    editQuizQuestion,
    deleteQuizQuestion,
    addAssignment,
    getAssignments
} = require('../backend/Controllers/instructorControllers.js');

const db = require('../backend/databaseConnection.js');

jest.mock('../backend/databaseConnection.js', () => ({
    execute: jest.fn(),
    query: jest.fn()
}));

describe("Instructor Controller Tests", () => {
    
    afterEach(() => {
        jest.clearAllMocks();
    });

    test("addCourse should add a new course", async () => {
        const mockCourse = { CourseID: 1, Title: "New Course" };
        db.execute.mockResolvedValue([{ insertId: 1 }]);

        const req = { body: { Title: "New Course", Description: "Description", Category: "Category", UserID: 1, Language: "English" } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await addCourse(req, res);

        expect(db.execute).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ message: "Course added successfully", courseId: 1 });
    });

    test("getCourses should retrieve all courses", async () => {
        const mockCourses = [{ CourseID: 1, Title: "Course 1" }, { CourseID: 2, Title: "Course 2" }];
        db.execute.mockResolvedValue([mockCourses]);

        const req = {};
        const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

        await getCourses(req, res);

        expect(db.execute).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith({ message: "Courses retrieved successfully", data: mockCourses });
    });

    test("getCourseById should retrieve a specific course", async () => {
        const mockCourse = { CourseID: 1, Title: "Course 1" };
        db.execute.mockResolvedValue([[mockCourse]]);

        const req = { params: { courseId: 1 } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await getCourseById(req, res);

        expect(db.execute).toHaveBeenCalledWith(expect.any(String), [1]);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: "Course retrieved successfully", data: mockCourse });
    });

    test("getInstructorCourses should retrieve courses for an instructor", async () => {
        const mockCourses = [{ CourseID: 1, Title: "Course 1" }, { CourseID: 2, Title: "Course 2" }];
        db.execute.mockResolvedValue([mockCourses]);

        const req = { params: { userId: 1 } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await getInstructorCourses(req, res);

        expect(db.execute).toHaveBeenCalledWith(expect.any(String), [1]);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: "Courses retrieved successfully", data: mockCourses });
    });

    test("getEnrolledStudents should retrieve enrolled students for an instructor's courses", async () => {
        const mockCourses = [{ CourseID: 1 }, { CourseID: 2 }];
        const mockEnrollments = [{ EnrollmentID: 1, CourseID: 1, UserID: 1, StudentName: "John Doe" }];
        db.execute.mockResolvedValueOnce([mockCourses]).mockResolvedValueOnce([mockEnrollments]);

        const req = { params: { userId: 1 } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await getEnrolledStudents(req, res);

        expect(db.execute).toHaveBeenCalledTimes(2);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: "Enrollments retrieved successfully", data: expect.any(Array) });
    });

    test("addModule should add a new module", async () => {
        const mockResult = { insertId: 1 };
        db.execute.mockResolvedValueOnce([[{ maxOrder: 2 }]]).mockResolvedValueOnce(mockResult);

        const req = { body: { CourseID: 1, Title: 'New Module', Description: 'Description' } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await addModule(req, res);

        expect(db.execute).toHaveBeenCalledTimes(0);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ message: 'Module added successfully' });
    });

    test("editModule should update an existing module", async () => {
        db.execute.mockResolvedValueOnce([{ CourseID: 1, Order: 2 }]).mockResolvedValueOnce({ affectedRows: 1 });

        const req = { params: { ModuleID: 1 }, body: { Title: 'Updated Module', Description: 'Updated Description', NewOrder: 3 } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await editModule(req, res);

        expect(db.execute).toHaveBeenCalledTimes(2);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Module updated successfully' });
    });

    test("deleteModule should remove a module and associated lectures", async () => {
        db.execute.mockResolvedValueOnce([{ CourseID: 1, Order: 2 }])
            .mockResolvedValueOnce({ affectedRows: 1 })
            .mockResolvedValueOnce({ affectedRows: 1 })
            .mockResolvedValueOnce({ affectedRows: 1 });

        const req = { params: { ModuleID: 1 } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await deleteModule(req, res);

        expect(db.execute).toHaveBeenCalledTimes(4);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Module and associated lectures deleted successfully' });
    });

    test("getModules should retrieve modules for a course", async () => {
        const mockModules = [{ ModuleID: 1, Title: 'Module 1' }];
        db.execute.mockResolvedValue([mockModules]);

        const req = { params: { CourseID: 1 } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await getModules(req, res);

        expect(db.execute).toHaveBeenCalledTimes(0);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ success: true, data: mockModules });
    });

    test("addLecture should create a new lecture", async () => {
        const mockResult = { insertId: 1 };
        db.execute.mockResolvedValueOnce([[{ maxOrder: 2 }]]).mockResolvedValueOnce(mockResult);

        const req = { body: { ModuleID: 1, Title: 'New Lecture', VideoURL: 'http://example.com/video' }, file: { path: './__tests__/profile-icon.png' } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await addLecture(req, res);

        expect(db.execute).toHaveBeenCalledTimes(0);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ message: 'Lecture added successfully' });
    });

    test("getLectures should retrieve lectures", async () => {
        const mockLectures = [{ LectureID: 30002, Title: 'Whats Python' }];
        db.execute.mockResolvedValue([mockLectures]);

        const req = { params: { moduleId: 1 } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await getLectures(req, res);

        expect(db.execute).toHaveBeenCalledTimes(0);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockLectures);
    });

    test("editLecture should update an existing lecture", async () => {
        db.execute.mockResolvedValue({ affectedRows: 1 });

        const req = { params: { id: 30002 }, body: { Title: 'Whats Python', Order: 1 } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await editLecture(req, res);

        expect(db.query).toHaveBeenCalledTimes(0);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Lecture updated successfully' });
    });

    test("deleteLecture should remove a lecture", async () => {
        db.execute.mockResolvedValue({ affectedRows: 1 });

        const req = { params: { id: 30001 } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await deleteLecture(req, res);

        expect(db.query).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Lecture deleted successfully' });
    });
});
