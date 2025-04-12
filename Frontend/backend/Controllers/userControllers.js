const db = require('../databaseConnection.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();

const JWT_SECRET = process.env.JWT_KEY;
const EmailService = require('../Utils/mails.js');


const register = async (req, res) => {
  try {
    const { Firstname, Lastname, Password, Email, Role, Bio } = req.body;
    const ProfilePicture = req.file ? req.file.path : ''; 

    const existingUser = await db.query('SELECT * FROM Users WHERE Email = ?', [Email]);
    // console.log(existingUser)
    if (existingUser.length > 0) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(Password, salt);

    const result = await db.query(
      'INSERT INTO Users (Firstname, Lastname, Password, Email, Role, Bio, ProfilePicture) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [Firstname, Lastname, hashedPassword, Email, Role, Bio, ProfilePicture || "Null"]
    );

    res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
  } catch (error) {
    // console.log("Error in signup ", error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};


const login = async (req, res) => {
  try {
    const { Email, Password, Role } = req.body;


    const users = await db.query('SELECT * FROM Users WHERE Email = ?', [Email]);
    if (users.length === 0) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const user = users[0];

    if(user.isBlocked){
      return res.status(300).json({ error: 'You have restricted to login into Online Learning Platform!. Please contact administration.' });
    }

    const isMatch = await bcrypt.compare(Password, user.Password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

 
    if(Role != user.Role){
        return res.status(400).json({ error: 'Invalid role selected' });
    }

    const token = jwt.sign(
      { userId: user.UserID, role: user.Role },
      JWT_SECRET
    );

    res.json({ message: 'Login successful', token, userId: user.UserID, role: user.Role, username: `${user.Firstname} ${user.Lastname}` });
  } catch (error) {
    // console.log("Error in signin ", error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};


const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const users = await db.query('SELECT * FROM Users WHERE Email = ?', [email]);
    if (users.length === 0) {
      return res.status(404).json({ error: 'User with this email does not exist' });
    }

    const user = users[0];

    const resetToken = jwt.sign(
      { userId: user.UserID },
      JWT_SECRET,
      { expiresIn: '30m' } 
    );

    const resetLink = `${req.protocol}://${req.get('host')}/resetPassword.html?token=${resetToken}`;

    // console.log(`Password reset link: ${resetLink}`);

    EmailService.sendPasswordResetLink(email, resetLink);


    res.json({ message: 'Password reset link has been sent to your email', resetLink });
  } catch (error) {
    // console.log("Error in forgot password ", error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};


const resetPassword = async (req, res) => {
  try {

    const { newPassword, token } = req.body;

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }

    const userId = decoded.userId;

    const users = await db.query('SELECT * FROM Users WHERE UserID = ?', [userId]);
    if (users.length === 0) {
      return res.status(404).json({ error: 'User does not exist' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await db.query('UPDATE Users SET Password = ? WHERE UserID = ?', [hashedPassword, userId]);

    res.json({ message: 'Password has been updated successfully' });
  } catch (error) {
    // console.log("Error in reset password ", error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};


const getCourses = async (req, res) => {
  try {
      const query = `
          SELECT c.*, CONCAT(u.firstname, ' ', u.lastname) AS Instructor
          FROM Courses c
          JOIN Users u ON c.UserID = u.UserID
      `;
      const [rows] = await db.execute(query);

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

const enrollCourse = async (req, res) => {
  try {
      const { userId, courseId } = req.body;

      if (!userId || !courseId) {
          return res.status(400).json({ message: "UserID and CourseID are required" });
      }

      const checkQuery = `
          SELECT * FROM Enrollments 
          WHERE UserID = ? AND CourseID = ?
      `;
      const [existingEnrollment] = await db.execute(checkQuery, [userId, courseId]);

      if (existingEnrollment.length > 0) {
          return res.status(400).json({ message: "User is already enrolled in this course" });
      }

      const insertQuery = `
          INSERT INTO Enrollments (UserID, CourseID) 
          VALUES (?, ?)
      `;
      await db.execute(insertQuery, [userId, courseId]);

      res.status(201).json({ message: "Enrollment successful" });

  } catch (error) {
      // console.error("Error enrolling in course:", error);
      res.status(500).json({
          message: "Failed to enroll in course",
          error: error.message
      });
  }
};


const getEnrolledCourses = async (req, res) => {
  try {
      const { userId } = req.params;

      if (!userId) {
          return res.status(400).json({ message: "User ID is required" });
      }

      const query = `
          SELECT c.*, CONCAT(u.firstname, ' ', u.lastname) AS Instructor
          FROM Enrollments e
          JOIN Courses c ON e.CourseID = c.CourseID
          JOIN Users u ON c.UserID = u.UserID
          WHERE e.UserID = ?
      `;

      const [rows] = await db.execute(query, [userId]);

      res.status(200).json({
          message: "Enrolled courses retrieved successfully",
          data: rows
      });

  } catch (error) {
      // console.error("Error fetching enrolled courses:", error);
      res.status(500).json({
          message: "Failed to fetch enrolled courses",
          error: error.message
      });
  }
};


const getModules = async (req, res) => {
  const { CourseID } = req.params;
  // console.log(CourseID)
  try {
      let query = 'SELECT * FROM Modules';
      const params = [];

      if (CourseID) {
          query += ' WHERE CourseID = ?';
          params.push(CourseID);
      }

      query += ' ORDER BY `Order` ASC';
      // console.log(query, params)
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

const getAssignments = async (req, res) => {
  const { CourseID } = req.params;
  const { UserID } = req.query;

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

      if (UserID) {
          const assignmentIds = assignments.map(a => a.AssignmentID);
          if (assignmentIds.length > 0) {
              const submissionQuery = `
                  SELECT * FROM AssignmentSubmissions 
                  WHERE UserID = ? AND AssignmentID IN (${assignmentIds.map(() => '?').join(',')})
              `;
              const submissionValues = [UserID, ...assignmentIds];
              const submissions = await db.query(submissionQuery, submissionValues);

              assignments.forEach(assignment => {
                  const submission = submissions.find(sub => sub.AssignmentID === assignment.AssignmentID);
                  assignment.submission = submission || null;
              });
          }
      }

      res.status(200).json(assignments);
  } catch (error) {
      console.error("Error while fetching assignments:", error);
      res.status(500).json({ message: "Error fetching assignments", error });
  }
};


const submitAssignment = async (req, res) => {
  const { AssignmentID, StudentID, SubmissionText } = req.body;
  
  const fileUrl = req.file ? req.file.path : null;
  const fileExt = req.file ? req.file.originalname.split('.').pop() : null;

 // console.log("Uploaded File:", req.file);
 // console.log("AssignmentID:", AssignmentID, "StudentID:", StudentID, "SubmissionText:", SubmissionText, "File URL:", fileUrl, "File Extension:", fileExt);

  try {
      if (!AssignmentID || !StudentID) {
          return res.status(400).json({ message: "AssignmentID and StudentID are required" });
      }

      const query = `
          INSERT INTO AssignmentSubmissions (AssignmentID, UserID, SubmissionText, FileURL, FileExtension, SubmittedAt) 
          VALUES (?, ?, ?, ?, ?, NOW())
      `;
      const values = [AssignmentID, StudentID, SubmissionText || null, fileUrl, fileExt];

      await db.query(query, values);

      res.status(201).json({ message: "Assignment submitted successfully" });
  } catch (error) {
      console.error("Error while submitting assignment:", error);
      res.status(500).json({ message: "Error submitting assignment", error });
  }
};

const getCorrectAnswers = async (quizId) => {
  const [questions] = await db.execute(
      `SELECT QuestionID, CorrectAnswer FROM QuizQuestions WHERE QuizID = ?`,
      [quizId]
  );
  return questions.reduce((acc, q) => {
      acc[q.QuestionID] = q.CorrectAnswer;
      return acc;
  }, {});
};

const getQuizDetails = async (quizId) => {
  const [quizDetails] = await db.execute(
      `SELECT TotalPoints, (SELECT COUNT(*) FROM QuizQuestions WHERE QuizID = ?) AS TotalQuestions
       FROM Quizzes WHERE QuizID = ?`,
      [quizId, quizId]
  );
  return quizDetails[0];
};

const submitQuiz = async (req, res) => {
  const { quizId, responses, userId } = req.body;

  if (!quizId || !responses) {
      return res.status(400).json({ message: "Invalid submission data" });
  }
  console.log(responses)
  try {
        const correctAnswers = await getCorrectAnswers(quizId);
        const quizDetails = await getQuizDetails(quizId);
        if (!quizDetails || quizDetails.TotalQuestions === 0) {
            return res.status(400).json({ message: "Quiz details not found or no questions available." });
        }

        let correctCount = 0;
        const responseEntries = Object.entries(responses);
        for (const [questionId, userAnswer] of responseEntries) {
              if (correctAnswers[questionId] === userAnswer) {
                  correctCount++;
              }
        }
        console.log(correctCount)
        const score = (quizDetails.TotalPoints / quizDetails.TotalQuestions) * correctCount;

        
        const [attempt] = await db.execute(
            `INSERT INTO AttemptedQuizzes (UserID, QuizID, Score) VALUES (?, ?, ?)`,
            [userId, quizId, score]
        );

        return res.json({ message: `Quiz submitted successfully! and Your score is ${score}.`, score });
      } catch (error) {
          console.error("Quiz submission error:", error);
          return res.status(500).json({ message: "Internal server error" });
      }
};


const updateStudentModuleProgress = async (req, res) => {
  const { studentID, moduleID, courseID } = req.body;
  console.log("Incoming progress update:", req.body);

  if (!studentID || !moduleID) {
    return res.status(400).json({ message: "studentID and moduleID are required." });
  }

  try {
  
    const [existing] = await db.execute(
      `SELECT * FROM StudentModuleProgress WHERE UserID = ? AND ModuleID = ?`,
      [studentID, moduleID]
    );

    if (existing.length > 0) {
 
      await db.execute(
        `UPDATE StudentModuleProgress 
         SET IsCompleted = TRUE, CompletionDate = NOW() 
         WHERE UserID = ? AND ModuleID = ?`,
        [studentID, moduleID]
      );

      return res.status(200).json({ message: "Module marked as completed." });
    } else {
   
      await db.execute(
        `INSERT INTO StudentModuleProgress (UserID, ModuleID, CourseID, CompletionDate, IsCompleted) 
         VALUES (?, ?, ?, NOW(), TRUE)`,
        [studentID, moduleID, courseID]
      );

      return res.status(201).json({ message: "Progress recorded successfully." });
    }
  } catch (error) {
    console.error("Error updating progress:", error);
    return res.status(500).json({ message: "Server error while updating progress." });
  }
};


const getStudentModuleProgress = async (req, res) => {
  const { studentID } = req.params;

  if (!studentID) {
    return res.status(400).json({ message: "studentID is required." });
  }

  try {
    const [progress] = await db.execute(
      `SELECT smp.ModuleID, m.Title, m.Description, smp.CompletionDate 
       FROM StudentModuleProgress smp
       JOIN Modules m ON smp.ModuleID = m.ModuleID
       WHERE smp.UserID = ? AND smp.IsCompleted = TRUE`,
      [studentID]
    );

    return res.status(200).json({
      message: "Progress fetched successfully.",
      data: progress
    });
  } catch (error) {
    console.error("Error fetching progress:", error);
    return res.status(500).json({ message: "Server error while fetching progress." });
  }
};

const getCourseProgressSummary = async (req, res) => {
  const { studentId, courseId } = req.params;

  try {
    const [[{ totalModules }]] = await db.execute(
      `SELECT COUNT(*) AS totalModules FROM Modules WHERE CourseID = ?`,
      [courseId]
    );

    const [[{ completedModules }]] = await db.execute(
      `SELECT COUNT(*) AS completedModules 
       FROM StudentModuleProgress 
       WHERE UserID = ? AND CourseID = ? AND IsCompleted = TRUE`,
      [studentId, courseId]
    );

    return res.status(200).json({
      total: totalModules,
      completed: completedModules
    });
  } catch (error) {
    console.error("Error fetching progress summary:", error);
    return res.status(500).json({ message: "Server error." });
  }
};




module.exports = { register, login, forgotPassword, resetPassword, getCourses, getCourseById, enrollCourse, getEnrolledCourses, getModules, getLectures, getQuiz, getQuizQuestions, getAssignments, submitAssignment, submitQuiz, updateStudentModuleProgress, getStudentModuleProgress, getCourseProgressSummary };
