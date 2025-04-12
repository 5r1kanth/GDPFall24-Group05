const db = require('../databaseConnection.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();
const JWT_SECRET = process.env.JWT_KEY;
const EmailService = require('../Utils/mails.js');


const login = async (req, res) => {
    try {
      const { Email, Password } = req.body;
  
      console.log(Email, Password)
      const users = await db.query('SELECT * FROM Admin WHERE Email = ?', [Email]);
      if (users.length === 0) {
        return res.status(400).json({ error: 'Invalid email or password' });
      }
  
      const user = users[0];
      console.log(user)
      const isMatch = await bcrypt.compare(Password, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: 'Invalid email or password' });
      }
  
      const token = jwt.sign(
        { userId: user.adminId, role: "Admin" },
        JWT_SECRET
      );

      res.json({ message: 'Login successful', token, userId: user.adminId, role: "Admin"});
    } catch (error) {
       console.log("Error in signin ", error);
      res.status(500).json({ error: 'Server error', details: error.message });
    }
};


const getStudentsWithCourses = async (req, res) => {
    try {
        const query = `
            SELECT 
                u.UserID AS StudentID, 
                u.Firstname, 
                u.Lastname, 
                u.Email, 
                u.IsBlocked AS IsBlocked,
                c.CourseID, 
                c.Title AS CourseName, 
                CONCAT(i.Firstname, ' ', i.Lastname) AS Instructor
            FROM Users u
            LEFT JOIN Enrollments e ON u.UserID = e.UserID
            LEFT JOIN Courses c ON e.CourseID = c.CourseID
            LEFT JOIN Users i ON c.UserID = i.UserID
            WHERE u.Role = 'Student'
            ORDER BY u.UserID;
        `;

        const [students] = await db.execute(query);

        if (students.length === 0) {
            return res.status(404).json({ message: "No students found" });
        }

        const studentMap = {};

        students.forEach(student => {
            const studentId = student.StudentID;

            if (!studentMap[studentId]) {
                studentMap[studentId] = {
                    StudentID: student.StudentID,
                    Name: `${student.Firstname} ${student.Lastname}`,
                    Email: student.Email,
                    IsBlocked: !!student.IsBlocked,
                    EnrolledCourses: []
                };
            }

            if (student.CourseID) {
                studentMap[studentId].EnrolledCourses.push({
                    CourseID: student.CourseID,
                    CourseName: student.CourseName,
                    Instructor: student.Instructor
                });
            }
        });

        res.status(200).json({
            message: "Students and their enrolled courses retrieved successfully",
            data: Object.values(studentMap)
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch students",
            error: error.message
        });
    }
};

const getCoursesByInstructor = async (req, res) => {
    try {
        const query = `
            SELECT 
                i.UserID AS InstructorID,
                i.Email AS Email,
                i.IsBlocked AS IsBlocked,
                CONCAT(i.Firstname, ' ', i.Lastname) AS InstructorName,
                c.Title AS CourseName
            FROM Users i
            LEFT JOIN Courses c ON i.UserID = c.UserID
            WHERE i.Role = 'Instructor'
            ORDER BY i.UserID;
        `;

        const [instructors] = await db.execute(query);

        if (instructors.length === 0) {
            return res.status(404).json({ message: "No instructors or courses found" });
        }

        const instructorMap = {};

        instructors.forEach(instructor => {
            const instructorId = instructor.InstructorID;

            if (!instructorMap[instructorId]) {
                instructorMap[instructorId] = {
                    InstructorID: instructor.InstructorID,
                    Name: instructor.InstructorName,
                    Email: instructor.Email,
                    IsBlocked: !!instructor.IsBlocked,
                    Courses: []
                };
            }

            if (instructor.CourseName) {
                instructorMap[instructorId].Courses.push(instructor.CourseName);
            }
        });

        res.status(200).json({
            message: "Instructors and their courses retrieved successfully",
            data: Object.values(instructorMap)
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch instructors and courses",
            error: error.message
        });
    }
};


const toggleUserBlockStatus = async (req, res) => {
    const userId = req.params.userId;

    try {
        const [user] = await db.query('SELECT IsBlocked FROM Users WHERE UserID = ?', [userId]);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const currentStatus = !!user.IsBlocked; // Convert 0/1 to false/true

        // Toggle the block status
        const newStatus = currentStatus ? 0 : 1;

        await db.query('UPDATE Users SET IsBlocked = ? WHERE UserID = ?', [newStatus, userId]);

        res.status(200).json({
            success: true,
            message: `User ${newStatus === 1 ? 'deactivated' : 'activated'} successfully`,
        });
    } catch (error) {
        console.error('Error toggling user activate status:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};




module.exports = { login, getStudentsWithCourses, toggleUserBlockStatus, getCoursesByInstructor }