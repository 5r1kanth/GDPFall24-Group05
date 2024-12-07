## Data Types and Sizes for Each Entity

### 1. Users
- **UserID**: `INT` (AUTO_INCREMENT)
- **Username**: `VARCHAR(50)`, `UNIQUE`, `NOT NULL`
- **Password**: `VARCHAR(255)`
- **Email**: `VARCHAR(255)`, `UNIQUE`, `NOT NULL`
- **Role**: `ENUM ('Instructor', 'Student')` or `VARCHAR(20)`
- **Name**: `VARCHAR(100)`, `NOT NULL`
- **Bio**: `VARCHAR(255)`
- **ProfilePicture**: `BLOB`

### 2. Courses
- **CourseID**: `INT` (AUTO_INCREMENT)
- **Title**: `VARCHAR(200)`, `NOT NULL`
- **Description**: `VARCHAR(255)`
- **Category**: `VARCHAR(100)`
- **UserID**: `INT` (Foreign Key)
- **Language**: `VARCHAR(10)`
- **Thumbnail**: `BLOB`
- **CreationDate**: `TIMESTAMP`, `DEFAULT CURRENT_TIMESTAMP`
- **LastUpdatedDate**: `TIMESTAMP`, `ON UPDATE CURRENT_TIMESTAMP`
- **Progress**: `DECIMAL(5,2)` or `INT`

### 3. Modules
- **ModuleID**: `INT` (AUTO_INCREMENT)
- **CourseID**: `INT` (Foreign Key)
- **Title**: `VARCHAR(200)`, `NOT NULL`
- **Description**: `VARCHAR(255)`
- **Order**: `INT`

### 4. Lectures
- **LectureID**: `INT` (AUTO_INCREMENT)
- **ModuleID**: `INT` (Foreign Key)
- **Title**: `VARCHAR(200)`, `NOT NULL`
- **DownloadableMaterialsURL**: `VARCHAR(255)`
- **Order**: `INT`

### 5. Quizzes
- **QuizID**: `INT` (AUTO_INCREMENT)
- **CourseID**: `INT` (Foreign Key)
- **Title**: `VARCHAR(200)`, `NOT NULL`
- **Description**: `VARCHAR(255)`
- **TotalPoints**: `INT`

### 6. QuizQuestions
- **QuestionID**: `INT` (AUTO_INCREMENT)
- **QuizID**: `INT` (Foreign Key)
- **QuestionText**: `VARCHAR(255)`
- **QuestionType**: `ENUM ('Multiple Choice', 'True/False')` or `VARCHAR(20)`
- **Options**: `JSON`
- **CorrectAnswer**: `VARCHAR(255)`

### 7. Enrollments
- **EnrollmentID**: `INT` (AUTO_INCREMENT)
- **UserID**: `INT` (Foreign Key)
- **CourseID**: `INT` (Foreign Key)
- **EnrollmentDate**: `TIMESTAMP`, `DEFAULT CURRENT_TIMESTAMP`


### 8. Certificates
- **CertificateID**: `INT` (AUTO_INCREMENT)
- **UserID**: `INT` (Foreign Key)
- **CourseID**: `INT` (Foreign Key)
- **IssueDate**: `DATE` or `TIMESTAMP`
- **CertificateURL**: `VARCHAR(255)`

### 9. Videos
- **VideoID**: `INT` (AUTO_INCREMENT)
- **LectureID**: `INT` (Foreign Key)
- **VideoURL**: `VARCHAR(255)`, `NOT NULL`
- **Duration**: `INT` (in seconds)
- **DRMProtected**: `BOOLEAN`

## Relationships and Cardinality

### 1. Users and Enrollments
- **Relationship**: Users enroll in Courses.
- **Cardinality**: One-to-Many (One User can have many Enrollments).

### 2. Users and Courses (Instructors)
- **Relationship**: Instructors create Courses.
- **Cardinality**: One-to-Many (One Instructor can create many Courses).

### 3. Courses and Enrollments
- **Relationship**: Courses have many Enrollments.
- **Cardinality**: One-to-Many (One Course can have many Enrollments).

### 4. Courses and Modules
- **Relationship**: Courses consist of Modules.
- **Cardinality**: One-to-Many (One Course has many Modules).

### 5. Modules and Lectures
- **Relationship**: Modules contain Lectures.
- **Cardinality**: One-to-Many (One Module has many Lectures).

### 6. Lectures and Videos
- **Relationship**: Lectures have Videos.
- **Cardinality**: One-to-One (One Lecture has one Video).

### 7. Courses and Quizzes
- **Relationship**: Courses have Quizzes.
- **Cardinality**: One-to-Many (One Course has many Quizzes).

### 8. Quizzes and QuizQuestions
- **Relationship**: Quizzes contain QuizQuestions.
- **Cardinality**: One-to-Many (One Quiz has many QuizQuestions).

### 9. Users and Certificates
- **Relationship**: Users receive Certificates upon Course completion.
- **Cardinality**: One-to-Many (One User can have many Certificates).

### 10. Courses and Certificates
- **Relationship**: Certificates are issued for Courses.
- **Cardinality**: One-to-Many (One Course can have many Certificates).

## Entity-Relationship (ER) Diagram

- **Users** can enroll in multiple **Courses** (Many-to-Many via **Enrollments**).
- **Instructors** (a role of **Users**) can create multiple **Courses** (One-to-Many).
- Each **Course** consists of multiple **Modules** (One-to-Many).
- Each **Module** contains multiple **Lectures** (One-to-Many).
- Each **Lecture** can have one **Video** and multiple Downloadable Materials.
- Each **Course** can have multiple **Quizzes** (One-to-Many).
- Each **Quiz** contains multiple **QuizQuestions** (One-to-Many).
- **Certificates** are issued to **Users** upon completing **Courses** (One-to-Many from **Users** and **Courses**).
![ER Diagram](https://github.com/5r1kanth/GDPFall24-Group05/blob/main/ER%20Diagram%20-%20Final.png)

## Data Security Plan

### Access Restrictions
- **Role-Based Access Control (RBAC)**:
  - **Instructors**: Can create and manage their own courses, modules, lectures, quizzes, and view enrolled students.
  - **Students**: Can enroll in courses, access course content, take quizzes, and view certificates.
  - **Administrators**: Full access to manage all aspects of the platform.

### Data Encryption
- **At Rest**:
  - Sensitive data such as user passwords will be hashed using bcrypt with salts.
  - Encryption of stored video files using DRM (Digital Rights Management) to prevent unauthorized access.
- **In Transit**:
  - All data transmission will use HTTPS to ensure data is encrypted during transfer.

### Secure Video Streaming
- Implement DRM to protect video content from unauthorized distribution and piracy.
- Use token-based authentication for accessing video streams.

### Database Security
- Utilize prepared statements and parameterized queries to prevent SQL injection.
- Regular security audits and vulnerability assessments.
- Implement least privilege principle for database access.

### Backup and Recovery
- Regular automated backups of all data.
- Secure storage of backups with encryption.
- Disaster recovery plan to restore data in case of data loss incidents.

## 5. Mapping Functional Requirements to Data Storage

| **Functional Requirement**                         | **Data Storage Mapping**                                                                                                                                                        |
|----------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Course creation and management by instructors      | **Courses**, **Modules**, **Lectures**, **Quizzes**, **QuizQuestions** tables store all course-related data.                                                                    |
| Video streaming and downloadable course materials  | **Videos** and **Lectures** tables store video URLs and material links, integrated with CDN for streaming.                                                                         |
| Quizzes and automated grading                      | **Quizzes** and **QuizQuestions** tables store quiz structures; **Enrollments** track quiz attempts and scores.                                                                   |
| Certificate generation and issuance                | **Certificates** table records issued certificates with user and course references.                                                                                               |
| Scalability to support large numbers of concurrent users | Utilize cloud-based databases with horizontal scaling; integrate CDN for efficient content delivery.                                                                             |
| Multi-language support                             | **Languages** table stores supported languages; user preferences and course language fields manage localization.                                                                  |
| Course catalog with filtering and search options   | **Courses** table with fields like **Category**, **Language**, **Title**, and **Description** enable filtering and searching.                                                     |
| Video player with speed control and subtitles      | **Videos** table includes URLs with support for subtitles; front-end player settings handle speed control.                                                                          |
| Progress tracking and quiz interface               | **Enrollments** table tracks user progress; **Quizzes** and **QuizQuestions** manage quiz interactions.                                                                            |
| CDN integration for video streaming                | **VideoURL** fields in **Videos** table store CDN links for efficient streaming.                                                                                                 |
| RESTful API for course management and user data    | All entities are exposed via RESTful API endpoints, secured with authentication tokens.                                                                                            |
| Secure video streaming with DRM protection         | **Videos** table includes DRM-protected URLs; secure streaming protocols are enforced.                                                                                             |
| Role-based access control for instructors and students | **Users** table with **Role** field and RBAC implementation in the application layer.                                                                                             |

---