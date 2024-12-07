# SQL Script for Setting Up and Seeding Database

## 1. Drop Existing Tables
```sql
-- Drop tables if they already exist
DROP TABLE IF EXISTS Videos, Certificates, Enrollments, QuizQuestions, Quizzes, Lectures, Modules, Courses, Users;
```
## 2. Create and Seed Users Table
```sql
-- Users Table
CREATE TABLE Users (
    UserID INT AUTO_INCREMENT PRIMARY KEY,
    Username VARCHAR(50) UNIQUE NOT NULL,
    Password VARCHAR(255),
    Email VARCHAR(255) UNIQUE NOT NULL,
    Role ENUM('Instructor', 'Student') NOT NULL,
    Name VARCHAR(100) NOT NULL,
    Bio TEXT,
    ProfilePicture VARCHAR(255)
);
```
```sql
INSERT INTO Users (Username, Password, Email, Role, Name, Bio, ProfilePicture) VALUES
('viplav', 'password1', 'viplav@gmail.com', 'Student', 'Viplav Billa', 'Loves learning', 'profile1.jpg'),
('srikanth', 'password2', 'srikanth@gmail.com', 'Instructor', 'Srikanth Pamulapati', 'Expert in Mathematics', 'profile2.jpg'),
('bharath', 'password3', 'bharath@gmail.com', 'Student', 'Bharath Kothapeta', 'Curious about tech', 'profile3.jpg'),
('charan', 'password4', 'charan@gmail.com', 'Instructor', 'Charan Suravarapu', 'Programming teacher', 'profile4.jpg'),
('priya', 'password5', 'priya@gmail.com', 'Student', 'Priyanka Bolem', 'Art enthusiast', 'profile5.jpg'),
('satya', 'password6', 'satya@gmail.com', 'Instructor', 'Satya Bayagani', 'Science expert', 'profile6.jpg'),
('prasad', 'password7', 'prasad@gmail.com', 'Student', 'Prasad Karamanchi', 'Aspiring coder', 'profile7.jpg'),
('varun', 'password8', 'varun@gmail.com', 'Instructor', 'Varun Kumar', 'Physics lover', 'profile8.jpg'),
('suprabath', 'password9', 'suprabath@gmail.com', 'Student', 'Suprabath Teegala', 'Engineer in training', 'profile9.jpg'),
('shashank', 'password10', 'shashank@gmail.com', 'Instructor', 'Shashank Vuppugalla', 'Software architect', 'profile10.jpg');
```

## 3. Create and Seed Courses Table
```sql
-- Courses Table
CREATE TABLE Courses (
    CourseID INT AUTO_INCREMENT PRIMARY KEY,
    Title VARCHAR(200) NOT NULL,
    Description TEXT,
    Category VARCHAR(100),
    UserID INT,
    Language VARCHAR(10),
    Thumbnail VARCHAR(255),
    CreationDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    LastUpdatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    Progress DECIMAL(5,2),
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);
```
```sql
INSERT INTO Courses (Title, Description, Category, UserID, Language, Thumbnail, Progress) VALUES
('Introduction to Programming', 'Learn the basics of programming', 'Programming', 2, 'ENGLISH', 'thumb1.jpg', 30.0),
('Math', 'Basic Mathematics course', 'Mathematics', 4, 'ENGLISH', 'thumb2.jpg', 45.0),
('Science Basics', 'Fundamentals of Science', 'Science', 6, 'ENGLISH', 'thumb3.jpg', 55.5),
('Art History', 'Introduction to Art History', 'Art', 10, 'ENGLISH', 'thumb4.jpg', 60.0),
('Advanced Programming', 'Deep dive into programming', 'Programming', 2, 'ENGLISH', 'thumb5.jpg', 75.0),
('Physics Principles', 'Explore the physics', 'Science', 8, 'ENGLISH', 'thumb6.jpg', 80.0),
('Digital Design', 'Basics of digital design', 'Design', 10, 'ENGLISH', 'thumb7.jpg', 20.0),
('Biology Basics', 'Introduction to Biology', 'Biology', 6, 'ENGLISH', 'thumb8.jpg', 10.0),
('Web Development', 'Build your first website', 'Programming', 2, 'ENGLISH', 'thumb9.jpg', 15.0),
('Data Science', 'Fundamentals of data science', 'Data Science', 10, 'ENGLISH', 'thumb10.jpg', 50.0);
```

## 4. Create and Seed Modules Table
```sql
-- Modules Table
CREATE TABLE Modules (
    ModuleID INT AUTO_INCREMENT PRIMARY KEY,
    CourseID INT,
    Title VARCHAR(200) NOT NULL,
    Description TEXT,
    `Order` INT,
    FOREIGN KEY (CourseID) REFERENCES Courses(CourseID)
);
```
```sql
INSERT INTO Modules (CourseID, Title, Description, `Order`) VALUES
(1, 'Introduction to Variables', 'Learn about variables in programming', 1),
(1, 'Basic Control Structures', 'Introduction to if-else and loops', 2),
(2, 'Algebra', 'Understand algebra basics', 1),
(2, 'Geometry', 'Intro to geometric shapes and principles', 2),
(3, 'Physics Concepts', 'Learn physics basics', 1),
(4, 'Renaissance Art', 'Explore the Renaissance period', 1),
(5, 'OOPS Concepts', 'Introduction to Object-Oriented Programming', 1),
(6, 'Force and Motion', 'Basics of force and motion', 1),
(7, 'Principles of Design', 'Learn design principles', 1),
(8, 'Genetics', 'Introduction to genetics', 1);
```

## 5. Create and Seed Lectures Table
```sql
-- Lectures Table
CREATE TABLE Lectures (
    LectureID INT AUTO_INCREMENT PRIMARY KEY,
    ModuleID INT,
    Title VARCHAR(200) NOT NULL,
    DownloadableMaterialsURL VARCHAR(255),
    `Order` INT,
    FOREIGN KEY (ModuleID) REFERENCES Modules(ModuleID)
);
```
```sql
INSERT INTO Lectures (ModuleID, Title, DownloadableMaterialsURL, `Order`) VALUES
(1, 'What is a Variable?', 'materials/variables.pdf', 1),
(1, 'Data Types', 'materials/data_types.pdf', 2),
(2, 'If Statements', 'materials/if_statements.pdf', 1),
(3, 'What is Algebra?', 'materials/algebra.pdf', 1),
(4, 'Angles and Lines', 'materials/geometry.pdf', 1),
(5, 'Newton\'s Laws', 'materials/newton_laws.pdf', 1),
(6, 'Mona Lisa', 'materials/mona_lisa.pdf', 1),
(7, 'Classes and Objects', 'materials/classes_objects.pdf', 1),
(8, 'Understanding Gravity', 'materials/gravity.pdf', 1),
(9, 'Basics of Color', 'materials/color_basics.pdf', 1);
```

## 6. Create and Seed Videos Table
```sql
-- Videos Table
CREATE TABLE Videos (
    VideoID INT AUTO_INCREMENT PRIMARY KEY,
    LectureID INT,
    VideoURL VARCHAR(255) NOT NULL,
    Duration INT,
    DRMProtected BOOLEAN,
    FOREIGN KEY (LectureID) REFERENCES Lectures(LectureID)
);
```
```sql
INSERT INTO Videos (LectureID, VideoURL, Duration, DRMProtected) VALUES
(1, 'videos/variable.mp4', 600, FALSE),
(2, 'videos/data_types.mp4', 500, TRUE),
(3, 'videos/if_statements.mp4', 450, FALSE),
(4, 'videos/algebra.mp4', 550, FALSE),
(5, 'videos/geometry.mp4', 700, TRUE),
(6, 'videos/newton_laws.mp4', 650, FALSE),
(7, 'videos/mona_lisa.mp4', 800, TRUE),
(8, 'videos/classes_objects.mp4', 720, FALSE),
(9, 'videos/gravity.mp4', 540, TRUE),
(10, 'videos/color_basics.mp4', 600, FALSE);
```

## 7. Create and Seed Quizzes Table
```sql
-- Quizzes Table
CREATE TABLE Quizzes (
    QuizID INT AUTO_INCREMENT PRIMARY KEY,
    CourseID INT,
    Title VARCHAR(200) NOT NULL,
    Description TEXT,
    TotalPoints INT,
    FOREIGN KEY (CourseID) REFERENCES Courses(CourseID)
);
```
```sql
INSERT INTO Quizzes (CourseID, Title, Description, TotalPoints) VALUES
(1, 'Variables Quiz', 'Test your knowledge of variables', 10),
(2, 'Control Structures Quiz', 'Evaluation of your understanding on control structures', 10),
(3, 'Algebra Quiz', 'Algebra basics test', 10),
(4, 'Geometry Quiz', 'Geometry principles quiz', 10),
(5, 'Physics Quiz', 'Basic physics quiz', 10),
(6, 'Renaissance Art Quiz', 'Art history quiz', 10),
(7, 'OOPS Quiz', 'Object-oriented programming basics', 10),
(8, 'Design Principles Quiz', 'Evaluate design principles', 10),
(9, 'Biology Quiz', 'Test on genetics basics', 10),
(10, 'Web Development Quiz', 'Introduction to web development', 10);
```

## 8. Create and Seed QuizQuestions Table
```sql
-- QuizQuestions Table
CREATE TABLE QuizQuestions (
    QuestionID INT AUTO_INCREMENT PRIMARY KEY,
    QuizID INT,
    QuestionText TEXT,
    QuestionType ENUM('Multiple Choice', 'True/False', 'Short Answer') NOT NULL,
    Points INT,
    FOREIGN KEY (QuizID) REFERENCES Quizzes(QuizID)
);
```
```sql
INSERT INTO QuizQuestions (QuizID, QuestionText, QuestionType, Points) VALUES
(1, 'What is a variable?', 'Multiple Choice', 2),
(2, 'What is an if statement used for?', 'Multiple Choice', 2),
(3, 'Define algebra.', 'Short Answer', 5),
(4, 'What is a right angle?', 'Multiple Choice', 2),
(5, 'State Newton\'s first law.', 'Short Answer', 5);
```

## 9. Create and Seed Enrollments Table
```sql
-- Enrollments Table
CREATE TABLE Enrollments (
    EnrollmentID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT,
    CourseID INT,
    EnrollmentDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Progress DECIMAL(5,2),
    FOREIGN KEY (UserID) REFERENCES Users(UserID),
    FOREIGN KEY (CourseID) REFERENCES Courses(CourseID)
);
```
```sql
INSERT INTO Enrollments (UserID, CourseID, Progress) VALUES
(1, 1, 50.0),
(3, 2, 30.0),
(5, 3, 40.0),
(7, 4, 60.0),
(9, 5, 20.0);
```

## 10. Create and Seed Certificates Table
```sql
-- Certificates Table
CREATE TABLE Certificates (
    CertificateID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT,
    CourseID INT,
    CertificateURL VARCHAR(255),
    IssueDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (UserID) REFERENCES Users(UserID),
    FOREIGN KEY (CourseID) REFERENCES Courses(CourseID)
);
```
```sql
INSERT INTO Certificates (UserID, CourseID, CertificateURL) VALUES
(1, 1, 'certificates/viplav_certificate.pdf'),
(3, 2, 'certificates/bharath_certificate.pdf'),
(5, 3, 'certificates/priya_certificate.pdf'),
(7, 4, 'certificates/prasad_certificate.pdf'),
(9, 5, 'certificates/suprabath_certificate.pdf');
```