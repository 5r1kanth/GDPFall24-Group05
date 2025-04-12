const db = require('../databaseConnection.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();

const JWT_SECRET = process.env.JWT_KEY;

const addCourse = async (req, res) => {
    const {
        Title,
        Description,
        Category,
        UserID,
        Language
    } = req.body;
   // // console.log(req.body);
    try {

        const query = `
            INSERT INTO Courses (Title, Description, Category, UserID, Language)
            VALUES (?, ?, ?, ?, ?)
        `;

        const result= await db.query(query, [
            Title,
            Description,
            Category,
            UserID,
            Language,
        ]);
        // console.log(result)
        res.status(201).json({
            message: "Course added successfully",
            courseId: result.insertId
        });
    } catch (error) {
        // console.error("Error adding course:", error);
        res.status(500).json({
            message: "Failed to add course",
            error: error.message
        });
    }
};

const getCourses = async (req, res) => {
    try {
        const query = `SELECT * FROM Courses`;
        const [rows] = await db.execute(query);
       // console.log(rows)
        res.status(200).send({
            message: "Courses retrieved successfully",
            data: rows
        });
    } catch (error) {
        // console.error("Error retrieving courses:", error);
        res.status(500).json({
            message: "Failed to retrieve courses",
            error: error.message
        });
    }
};

const getCourseById = async (req, res) => {
    try {
        const { courseId } = req.params;
       // // console.log(courseId)
        const query = `
            SELECT c.*, CONCAT(u.firstname, ' ', u.lastname) AS Instructor
            FROM Courses c
            JOIN Users u ON c.UserID = u.UserID
            WHERE c.CourseID = ?
        `;
        
        const [rows] = await db.execute(query, [courseId]);
  
        if (rows.length === 0) {
            return res.status(404).json({
                message: "Course not found",
            });
        }
  
        res.status(200).json({
            message: "Course retrieved successfully",
            data: rows[0]
        });
  
    } catch (error) {
        // console.error("Error retrieving course:", error);
        res.status(500).json({
            message: "Failed to retrieve course",
            error: error.message
        });
    }
};

const getInstructorCourses = async (req, res) => {
    try {
      const { userId } = req.params;
      // console.log(userId)
      const query = `
          SELECT * FROM Courses WHERE UserID = ?`;
      
      const [rows] = await db.execute(query, [userId]);
  
      if (rows.length === 0) {
          return res.status(404).json({
              message: "Course not found",
          });
      }
  
      res.status(200).json({
          message: "Courses retrieved successfully",
          data: rows
      });
  
  } catch (error) {
      // console.error("Error retrieving course:", error);
      res.status(500).json({
          message: "Failed to retrieve course",
          error: error.message
      });
  }
}

const getEnrolledStudents = async (req, res) => {
    try {
        const { userId } = req.params;

        const coursesQuery = `
            SELECT * 
            FROM Courses 
            WHERE UserID = ?
        `;
        const [courses] = await db.execute(coursesQuery, [userId]);

        if (courses.length === 0) {
            return res.status(404).json({
                message: "No courses found for the given user",
            });
        }

        const courseIds = courses.map(course => course.CourseID);

        const enrollmentsQuery = `
            SELECT e.EnrollmentID, e.CourseID, e.UserID, e.EnrollmentDate,
                   CONCAT(u.firstname, ' ', u.lastname) AS StudentName, u.email
            FROM Enrollments e
            JOIN Users u ON e.UserID = u.UserID
            WHERE e.CourseID IN (${courseIds.map(() => '?').join(', ')})
        `;
        const [enrollments] = await db.execute(enrollmentsQuery, courseIds);

        if (enrollments.length === 0) {
            return res.status(404).json({
                message: "No enrollments found for the user's courses",
            });
        }

        const enrichedEnrollments = enrollments.map(enrollment => {
            const course = courses.find(course => course.CourseID === enrollment.CourseID);
            return {
                ...enrollment,
                CourseName: course ? course.Title : null,
                CourseCategory: course ? course.Category : null,
                CourseLanguage: course ? course.Language : null
            };
        });

        res.status(200).json({
            message: "Enrollments retrieved successfully",
            data: enrichedEnrollments,
        });

    } catch (error) {
        // console.error("Error retrieving enrollments:", error);
        res.status(500).json({
            message: "Failed to retrieve enrollments",
            error: error.message,
        });
    }
};

const addModule = async (req, res) => {
    const { CourseID, Title, Description } = req.body;
    let connection;

    try {
        
        connection = await db.beginTransaction();

        const [maxOrderResult] = await connection.query(
            'SELECT MAX(`Order`) as maxOrder FROM Modules WHERE CourseID = ?',
            [CourseID]
        );
        const nextOrder = (maxOrderResult[0].maxOrder || 0) + 1;

        await connection.query(
            'INSERT INTO Modules (CourseID, Title, Description, `Order`) VALUES (?, ?, ?, ?)',
            [CourseID, Title, Description, nextOrder]
        );

        await db.commitTransaction(connection);

        res.status(201).json({ message: 'Module added successfully' });
    } catch (error) {
        if (connection) {
            await db.rollbackTransaction(connection);
        }
        // console.error(error);
        res.status(500).json({ message: 'Error adding module' });
    }
};

const editModule = async (req, res) => {
    const { ModuleID } = req.params;
    const { Title, Description, NewOrder } = req.body;
    let connection;

    try {

        connection = await db.beginTransaction();

        const [moduleResult] = await connection.query('SELECT * FROM Modules WHERE ModuleID = ?', [ModuleID]);
        if (moduleResult.length === 0) {
            return res.status(404).json({ message: 'Module not found' });
        }

        const currentModule = moduleResult[0];
        const { CourseID, Order: currentOrder } = currentModule;

        if (NewOrder && NewOrder !== currentOrder) {
            if (NewOrder > currentOrder) {
                await connection.query(
                    'UPDATE Modules SET `Order` = `Order` - 1 WHERE CourseID = ? AND `Order` > ? AND `Order` <= ?',
                    [CourseID, currentOrder, NewOrder]
                );
            } else {
                await connection.query(
                    'UPDATE Modules SET `Order` = `Order` + 1 WHERE CourseID = ? AND `Order` >= ? AND `Order` < ?',
                    [CourseID, NewOrder, currentOrder]
                );
            }
        }

        await connection.query(
            'UPDATE Modules SET Title = ?, Description = ?, `Order` = ? WHERE ModuleID = ?',
            [Title || currentModule.Title, Description || currentModule.Description, NewOrder || currentModule.Order, ModuleID]
        );

        await db.commitTransaction(connection);

        res.status(200).json({ message: 'Module updated successfully' });

    } catch (error) {
        if (connection) {
            await db.rollbackTransaction(connection);
        }
        // console.error(error);
        res.status(500).json({ message: 'Error updating module' });
    }
};

const deleteModule = async (req, res) => {
    const { ModuleID } = req.params;
    let connection;
    try {
        connection = await db.beginTransaction();
        const [moduleResult] = await connection.query('SELECT * FROM Modules WHERE ModuleID = ?', [ModuleID]);
        if (moduleResult.length === 0) {
            return res.status(404).json({ message: 'Module not found' });
        }
        const { CourseID, Order: deletedOrder } = moduleResult[0];
        await connection.query('DELETE FROM Lectures WHERE ModuleID = ?', [ModuleID]);
        await connection.query('DELETE FROM Modules WHERE ModuleID = ?', [ModuleID]);
        await connection.query(
            'UPDATE Modules SET `Order` = `Order` - 1 WHERE CourseID = ? AND `Order` > ?',
            [CourseID, deletedOrder]
        );
        await db.commitTransaction(connection);
        res.status(200).json({ message: 'Module and associated lectures deleted successfully' });
    } catch (error) {
        if (connection) {
            await db.rollbackTransaction(connection);
        }
        // console.error(error);
        res.status(500).json({ message: 'Error deleting module', error });
    }
};

const getModules = async (req, res) => {
    const { CourseID } = req.params;

    try {
        let query = 'SELECT * FROM Modules';
        const params = [];

        if (CourseID) {
            query += ' WHERE CourseID = ?';
            params.push(CourseID);
        }

        query += ' ORDER BY `Order` ASC';
        
        const modules = await db.query(query, params);

        if (modules.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No modules found for the specified course',
            });
        }

        res.status(200).json({
            success: true,
            data: modules,
        });
    } catch (error) {
        // console.error('Error fetching modules:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching modules',
        });
    }
};

const addLecture = async (req, res) => {
    const { ModuleID, Title, VideoURL } = req.body;
    const materialURL = req.file ? req.file.path : null;
    let connection;

    try {
        if (!ModuleID || !Title) {
            return res.status(400).json({ message: "ModuleID and Title are required" });
        }

        connection = await db.beginTransaction();

        const [maxOrderResult] = await connection.query(
            'SELECT MAX(`Order`) as maxOrder FROM Lectures WHERE ModuleID = ?',
            [ModuleID]
        );
        const nextOrder = (maxOrderResult[0].maxOrder || 0) + 1;

        const query = `
            INSERT INTO Lectures (ModuleID, Title, DownloadableMaterialsURL, VideoURL, \`Order\`) 
            VALUES (?, ?, ?, ?, ?)
        `;
        const values = [ModuleID, Title, materialURL, VideoURL || null, nextOrder];
        const [result] = await connection.query(query, values);

        const [newLecture] = await connection.query(
            'SELECT * FROM Lectures WHERE LectureID = ?',
            [result.insertId]
        );

        // console.log(result.insertId, newLecture);

        await db.commitTransaction(connection);

        res.status(201).json({ message: "Lecture added successfully", newLecture });
    } catch (error) {
        if (connection) {
            await db.rollbackTransaction(connection);
        }
        // console.error("Error while adding lecture:", error);
        res.status(500).json({ message: "Error adding lecture", error });
    }
};


const getLectures = async (req, res) => {
    try {
        const { id, moduleId } = req.params;
        let query = `SELECT * FROM Lectures`;
        const values = [];

        if (id) {
            query += ` WHERE LectureID = ?`;
            values.push(id);
        } else if (moduleId) {
            query += ` WHERE ModuleID = ?`;
            values.push(moduleId);
        }

        const results = await db.query(query, values);
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ message: "Error fetching lectures", error });
    }
};


const editLecture = async (req, res) => {
    try {
        const { id } = req.params;
        const { ModuleID, Title, Order } = req.body;
        const materialURL = req.file ? req.file.path : null;

        if (!id) {
            return res.status(400).json({ message: "Lecture ID is required" });
        }

        const query = `
            UPDATE Lectures
            SET Title = COALESCE(?, Title),
                VideoURL = COALESCE(?, VideoURL),
                DownloadableMaterialsURL = COALESCE(?, DownloadableMaterialsURL),
                \`Order\` = COALESCE(?, \`Order\`)
            WHERE LectureID = ?
        `;
        const values = [ Title || null, VideoURL || null, materialURL || null, Order || null, id];

        await db.query(query, values);
        res.status(200).json({ message: "Lecture updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error updating lecture", error });
    }
};


const deleteLecture = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: "Lecture ID is required" });
        }

        const query = `DELETE FROM Lectures WHERE LectureID = ?`;
        
        await db.query(query, [id]);
        res.status(200).json({ message: "Lecture deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting lecture", error });
    }
};


const addQuiz = async (req, res) => {
    const { CourseID, Title, Description, TotalPoints } = req.body;
    let connection;

    try {

        connection = await db.beginTransaction();
       
        const query = `INSERT INTO Quizzes (CourseID, Title, Description, TotalPoints) VALUES (?, ?, ?, ?)`;
        const values = [CourseID, Title, Description, TotalPoints];
        const [result] = await connection.query(query, values);

        const [newQuiz] = await connection.query(
            'SELECT * FROM Quizzes WHERE QuizID = ?',
            [result.insertId]
        );

        // console.log(result.insertId, newQuiz);

        await db.commitTransaction(connection);

        res.status(201).json({ message: "Quiz added successfully", newQuiz });
    } catch (error) {
        if (connection) {
            await db.rollbackTransaction(connection);
        }
        // console.error("Error while adding quiz:", error);
        res.status(500).json({ message: "Error adding quiz", error });
    }
};

const editQuiz = async (req, res) => {
    const { QuizID } = req.params;
    const { Title, Description, TotalPoints } = req.body;
    let connection;

    try {
        if (!QuizID) {
            return res.status(400).json({ message: "QuizID is required" });
        }

        const query = `
            UPDATE Quizzes 
            SET Title = COALESCE(?, Title), 
                Description = COALESCE(?, Description), 
                TotalPoints = COALESCE(?, TotalPoints)
            WHERE QuizID = ?
        `;
        const values = [Title || null, Description || null, TotalPoints || null, QuizID];

        const result = await db.query(query, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Quiz not found" });
        }

   
        const updatedQuiz = await db.query('SELECT * FROM Quizzes WHERE QuizID = ?', [QuizID]);

        res.status(200).json({ message: "Quiz updated successfully", updatedQuiz });
    } catch (error) {
        // console.error("Error while editing quiz:", error);
        res.status(500).json({ message: "Error editing quiz", error });
    }
};

const getQuiz = async (req, res) => {
    const { courseId } = req.params;

    try {
        let query = 'SELECT * FROM Quizzes';
        const values = [];

        if (courseId) {
            query += ' WHERE CourseID = ?';
            values.push(courseId);
        }

        const quizzes = await db.query(query, values);

        if (courseId && quizzes.length === 0) {
            return res.status(404).json({ message: "Quiz not found" });
        }

        res.status(200).json(quizzes);
    } catch (error) {
        // console.error("Error while fetching quiz:", error);
        res.status(500).json({ message: "Error fetching quiz", error });
    }
};

const deleteQuiz = async (req, res) => {
    const { QuizID } = req.params;

    try {
        if (!QuizID) {
            return res.status(400).json({ message: "QuizID is required" });
        }

        const result = await db.query('DELETE FROM Quizzes WHERE QuizID = ?', [QuizID]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Quiz not found" });
        }

        res.status(200).json({ message: "Quiz deleted successfully" });
    } catch (error) {
        // console.error("Error while deleting quiz:", error);
        res.status(500).json({ message: "Error deleting quiz", error });
    }
};


const addQuizQuestion = async (req, res) => {
    const { QuizID, Question, Type, Options, CorrectAnswer } = req.body;

    try {
        if (!QuizID || !Question || !Type || !Options || !CorrectAnswer) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const query = `
            INSERT INTO QuizQuestions (QuizID, QuestionText, QuestionType, Options, CorrectAnswer) 
            VALUES (?, ?, ?, ?, ?)
        `;
        const values = [QuizID, Question, Type, JSON.stringify(Options), CorrectAnswer];

        const result = await db.query(query, values);

        const newQuestion = await db.execute('SELECT * FROM QuizQuestions WHERE QuestionID = ?', [result.insertId]);

        res.status(201).json({ message: "Quiz question added successfully", newQuestion });
    } catch (error) {
        // console.error("Error while adding quiz question:", error);
        res.status(500).json({ message: "Error adding quiz question", error });
    }
};

const getQuizQuestions = async (req, res) => {
    const { QuizID } = req.params;

    try {
        let query = 'SELECT * FROM QuizQuestions';
        const values = [];

        if (QuizID) {
            query += ' WHERE QuizID = ?';
            values.push(QuizID);
        }

        const questions = await db.query(query, values);

        if (QuizID && questions.length === 0) {
            return res.status(404).json({ message: "No questions found for this quiz" });
        }

        res.status(200).json(questions);
    } catch (error) {
        // console.error("Error while fetching quiz questions:", error);
        res.status(500).json({ message: "Error fetching quiz questions", error });
    }
};

const getQuizQuestionById = async (req, res) => {
    const { QuestionID } = req.params;

    try {
        const [question] = await db.query('SELECT * FROM QuizQuestions WHERE QuestionID = ?', [QuestionID]);

        if (question.length === 0) {
            return res.status(404).json({ message: "Question not found" });
        }

        res.status(200).json(question[0]);
    } catch (error) {
        // console.error("Error while fetching quiz question:", error);
        res.status(500).json({ message: "Error fetching quiz question", error });
    }
};


const editQuizQuestion = async (req, res) => {
    const { QuestionID } = req.params;
    const { Question, Type, Options, CorrectAnswer } = req.body;

    try {
        if (!QuestionID) {
            return res.status(400).json({ message: "QuestionID is required" });
        }

        const query = `
            UPDATE QuizQuestions 
            SET 
                QuestionText = COALESCE(?, QuestionText), 
                QuestionType = COALESCE(?, QuestionType), 
                Options = COALESCE(?, Options), 
                CorrectAnswer = COALESCE(?, CorrectAnswer)
            WHERE QuestionID = ?
        `;
        const values = [
            Question || null,
            Type || null,
            Options ? JSON.stringify(Options) : null,
            CorrectAnswer || null,
            QuestionID,
        ];

        const [result] = await db.query(query, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Question not found" });
        }

        // Fetch the updated question
        const [updatedQuestion] = await db.query('SELECT * FROM QuizQuestions WHERE QuestionID = ?', [QuestionID]);

        res.status(200).json({ message: "Quiz question updated successfully", updatedQuestion });
    } catch (error) {
        // console.error("Error while editing quiz question:", error);
        res.status(500).json({ message: "Error editing quiz question", error });
    }
};


const deleteQuizQuestion = async (req, res) => {
    const { QuestionID } = req.params;

    try {
        if (!QuestionID) {
            return res.status(400).json({ message: "QuestionID is required" });
        }

        const result = await db.query('DELETE FROM QuizQuestions WHERE QuestionID = ?', [QuestionID]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Question not found" });
        }

        res.status(200).json({ message: "Quiz question deleted successfully" });
    } catch (error) {
        // console.error("Error while deleting quiz question:", error);
        res.status(500).json({ message: "Error deleting quiz question", error });
    }
};


const addAssignment = async (req, res) => {
    const { CourseID, Title, Description, SubmitDate } = req.body;

    try {
        if (!CourseID || !Title || !SubmitDate) {
            return res.status(400).json({ message: "CourseID, Title, and SubmitDate are required" });
        }

        const query = `
            INSERT INTO Assignments (CourseID, Title, Description, SubmitDate) 
            VALUES (?, ?, ?, ?)
        `;
        const values = [CourseID, Title, Description || null, SubmitDate];

        const [result] = await db.execute(query, values);

        const [newAssignment] = await db.query('SELECT * FROM Assignments WHERE AssignmentID = ?', [result.insertId]);

        res.status(201).json({ message: "Assignment added successfully", newAssignment });
    } catch (error) {
        console.error("Error while adding assignment:", error);
        res.status(500).json({ message: "Error adding assignment", error });
    }
};

const getAssignments = async (req, res) => {
    const { CourseID } = req.params;

    try {
        let query = 'SELECT * FROM Assignments';
        const values = [];

        if (CourseID) {
            query += ' WHERE CourseID = ?';
            values.push(CourseID);
        }

        const assignments = await db.query(query, values);

        if (CourseID && assignments.length === 0) {
            return res.status(404).json({ message: "No assignments found for this course" });
        }

        res.status(200).json(assignments);
    } catch (error) {
        // console.error("Error while fetching assignments:", error);
        res.status(500).json({ message: "Error fetching assignments", error });
    }
};

const deleteAssignment = async (req, res) => {
    const { AssignmentID } = req.params;

    try {
        if (!AssignmentID) {
            return res.status(400).json({ message: "AssignmentID is required" });
        }

        const result = await db.query('DELETE FROM Assignments WHERE AssignmentID = ?', [AssignmentID]);
        console.log(result)
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Question not found" });
        }

        res.status(200).json({ message: "Quiz question deleted successfully" });
    } catch (error) {
        console.error("Error while deleting assignment : ", error);
        res.status(500).json({ message: "Error deleting quiz question", error });
    }
};

const getSubmittedAssignments = async (req, res) => {
    const { AssignmentID } = req.query;

    if (!AssignmentID) {
        return res.status(400).json({ message: "AssignmentID is required" });
    }

    try {
        const query = `
            SELECT 
                ASB.SubmissionID, ASB.AssignmentID, ASB.UserID, ASB.SubmissionText, 
                ASB.FileURL, ASB.Points, ASB.Feedback, ASB.SubmittedAt, 
                CONCAT(U.Firstname, ' ', U.Lastname) AS StudentName 
            FROM AssignmentSubmissions AS ASB
            JOIN Users AS U ON ASB.UserID = U.UserID
            WHERE ASB.AssignmentID = ?`;

        const [submissions] = await db.execute(query, [AssignmentID]);

        if (submissions.length === 0) {
            return res.status(404).json({ message: "No submissions found for this assignment" });
        }

        res.status(200).json(submissions);
    } catch (error) {
        console.error("Error fetching submitted assignments:", error);
        res.status(500).json({ message: "Error fetching submitted assignments", error });
    }
};

const updateSubmission = async (req, res) => {
    const { SubmissionID, Points, Feedback } = req.body;

    if (!SubmissionID || Points === undefined || Feedback === undefined) {
        return res.status(400).json({ message: "SubmissionID, Points, and Feedback are required" });
    }

    try {
        const query = `
            UPDATE AssignmentSubmissions 
            SET Points = ?, Feedback = ? 
            WHERE SubmissionID = ?
        `;

        const values = [Points, Feedback, SubmissionID];

        const [result] = await db.execute(query, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Submission not found or no changes made" });
        }

        res.status(200).json({ message: "Submission updated successfully" });

    } catch (error) {
        console.error("Error updating submission:", error);
        res.status(500).json({ message: "Error updating submission", error });
    }
};

const fetchQuizAttempts = async(req,res) => {

    const {quizId} = req.query;

    if (!quizId) {
        return res.status(400).json({ message: "QuizID is required" });
    }

    try{

         const query = `
            SELECT 
                QA.AttemptID, QA.QuizID, QA.UserID, QA.SubmissionTime, 
                QA.Score,
                CONCAT(U.Firstname, ' ', U.Lastname) AS StudentName,
                Q.Title AS QuizTitle,
                Q.TotalPoints
            FROM AttemptedQuizzes AS QA
            JOIN Users AS U ON QA.UserID = U.UserID
            JOIN Quizzes AS Q ON QA.QuizID = Q.QuizID
            WHERE QA.QuizID = ?`;

        const [attempts] = await db.execute(query, [quizId]);

        if (attempts.length === 0) {
            return res.status(404).json({ message: "No attempts found for this quiz" });
        }

        res.status(200).json(attempts);


    } catch (err){
        console.error("Error fetching quiz attempts:", err);
        res.status(500).json({ message: "Error fetching quiz attempts", err });
    }
}


module.exports = { addCourse, getCourses, getCourseById, getInstructorCourses, getEnrolledStudents, addModule, editModule, deleteModule, getModules, getLectures, addLecture, editLecture, deleteLecture, addQuiz, editQuiz, getQuiz, deleteQuiz, addQuizQuestion, getQuizQuestions, getQuizQuestionById, editQuizQuestion, deleteQuizQuestion, addAssignment, getAssignments, deleteAssignment, getSubmittedAssignments, updateSubmission, fetchQuizAttempts };
