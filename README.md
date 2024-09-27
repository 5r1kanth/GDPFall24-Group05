# Welcome to Chaduvuko
### Online Learning Platform
**Brief Description:** A platform offering a variety of online courses with video lectures, quizzes, and certificates of completion.

1. **Course Creation and Management:**
    * **Instructor Dashboard:** Tools for creating, editing, and managing courses, including modules, lessons, and multimedia content.
    * **Course Templates:** Predefined templates to streamline course creation.
    * **Content Management:** Upload and organize video lectures, documents, and other resources.
  
    **Instructor Dashboard**

     * **Comprehensive Toolset:** Equip the dashboard with a suite of tools for creating and editing courses. This should include features for designing course structures (modules, lessons), adding and arranging content, and 
         setting up assessments.
     * **Intuitive Interface:** Ensure the dashboard has an intuitive and user-friendly interface, with drag-and-drop functionality for easy rearrangement of course elements and seamless navigation between different course 
         components.
     * **Analytics and Monitoring:** Integrate analytics tools to help instructors track course performance, student progress, and engagement metrics. Provide insights into which sections are most or least effective, and offer 
         data-driven recommendations for improvement.
      * **Communication Tools:** Include features for instructor-student communication, such as discussion boards, messaging systems, and announcement tools, to facilitate interaction and feedback.
      * **Notification Center:** Alerts and Reminders: Automated notifications for course deadlines, student interactions,  Direct communication with students and other instructors and system updates.
      * **User Management**:Enrollment Tracking: Manage student enrollment status, attendance, and progress.

 
      
2. **Quizzes and Automated Grading:**
    * **Quiz Builder:** Create multiple-choice, true/false, and other types of questions.
    * **Automated Grading:** Instant feedback and grading for quizzes.
    * **Analytics:** Track quiz performance and identify areas where students may need additional help.
  
        **Efficient Automated Grading System**
        * **Real-Time Feedback:** Implement a system that provides immediate feedback after quiz submission, highlighting correct and incorrect answers with explanations when applicable.
        * **Customizable Scoring:** Allow educators to set custom scoring rules, such as partial credit for partially correct answers or penalties for incorrect answers, and include 
          options for varying the difficulty level of questions.
        * **Error Handling:** Include features to handle errors or inconsistencies, such as detecting and correcting typographical errors or ambiguous questions.
        * **Quiz Builder Flexibility:** Allow for multiple question types: multiple-choice, true/false, fill-in-the-blank, matching, and short answers. Teachers should be able to easily 
          create and customize quizzes.
        * **Timed Quizzes:** Allow the creation of timed quizzes to simulate real exam scenarios. Include visible timers that count down during the quiz.

3.	**Certificates of Completion:**
    * **Customizable Certificates:** Design and issue certificates based on course completion.

      **Design and Creation:**
         * **Template Options:** Offer different certificate designs that can be adjusted to fit various themes or branding.
         * **Personalization:** Let you add the participant’s name, course details, completion date, and any signatures or logos.
         * **Aesthetic Elements:** Use borders, backgrounds, and fonts that match your brand or the course style.
   
       **Issuance:**
         * **Automatic Generation:** Set up a system to create certificates automatically when someone finishes a course.
         * **Manual Issuance:** Allow instructors or admins to manually issue certificates if needed.
   
       **Format:**
         * **Digital Format:** Provide certificates as PDFs, which are easy to share and print.
         * **Print Option:** Make sure the design is high quality for those who want to print it.

    * **Digital Badges:** Option to award badges for achievements or milestones.

      **Design and Creation:**
        * **Badge Design:** Create badges that show specific achievements using design tools or badge-making platforms.
        * **Metadata:** Add details to badges about what they mean and what’s needed to earn them.
          
      **Issuance and Management:**
        * **Automatic Awarding:** Set up rules to automatically give badges when certain milestones are reached.
        * **Manual Awarding:** Let instructors give badges manually for outstanding achievements.

      **Tracking and Analytics:**
        * **Progress Tracking:** Keep track of who has received badges and their progress.
        * **Feedback Collection:** Get feedback on how useful and motivating the badges are.


4. **Multi-Language Support:**
    * **Localization:** Provide content in multiple languages.
    * **Translation Tools:** Support for translating course materials and user interfaces.
    * **Language-Specific Feedback Mechanisms:** Developing a system that offers personal feedback in the users preferred language.
    * **Font-Styles:** Applying different font styles to the subtitles in the video.
    * **Language Management:** Allows the instructor to create and manage the videos in different languages.
    * **Content Switching:** Allows the user to switch the languages without loosing any progress.
    * **Course Materials:** Translate lesson texts, videos (subtitles), quizzes, and supplementary materials.
    * **Help and Support:** Translate FAQ sections, helpdesk instructions, and support chat into supported languages.
      
      **Fallback Mechanism:**
       * **Default Language Fallback:** Allow the user to use the content in the default language when user's preferred language is not available.

5. **Course Catalog and Search:**
    * **Search Functionality:** Users can search for courses based on keywords, categories, or instructors.
    * **Filters:** Options to sort by difficulty, duration, ratings, or language.
      
       **Search Functionality:**
        * **Keyword Search:** Implement a search bar where users can enter keywords. This should search through course titles, descriptions.
        * **Category Search:** Allow users to filter courses by categories. 
        * **Instructor Search:** Enable users to search for courses taught by instructors.

       **Filters:**
        * **Difficulty Level:** Add a filter option for sorting courses by difficulty (e.g., beginner, intermediate, advanced).
        * **Duration:** Allow users to filter by course length (e.g., under 1 hour, 1-2 hours, 3+ hours).
        * **Ratings:** Implement a filter for user ratings. 
        * **Language:** Provide an option to filter courses by language.



6. **Progress Tracking and User Interface:**
    * **Progress Bar:** Visual representation of course progress.
      * **Visual Representation:** Use a bar to show how much of the course is completed. You can use a horizontal bar, a circular indicator, or both.
      * **Milestones:** Add markers on the bar for key sections or modules to show major progress points
    * **Completion Tracking:** Monitor and display progress for each module or lesson.
      * **Module-Level Tracking:** Show how much of each module or lesson is done, and what’s left to complete.
      * **Completion Status:** Use colors or icons to show if a module is in progress, completed, or not started.
    * **User Dashboard:** Personalized area where students can track their courses and achievements.
      * **Course Summary:** Provide an overview of current courses, including progress, upcoming lessons, and deadlines.
      * **Achievements:** Display earned certificates and badges, plus any other achievements.
  
7. **Scalability and Performance:** 
    *  **Load Balancing:** Ensure the platform can handle high traffic volumes. 
    *  **Scalable Infrastructure:** Use cloud services to dynamically scale resources as needed.
    *  **Elastic Load Testing:** Regularly conduct elastic load testing to simulate high traffic and ensure your platform performs well under various conditions, such as sudden spikes in 
        user activity.
    *  **Data Compression:** Use GZIP or Brotli compression for data transfers to reduce the size of HTTP responses, speeding up load times, especially for users with slow network 
        connections.
    *  **API Rate Limiting** Apply rate limiting to your API to control the number of requests a user can make in a certain time frame, preventing overload.
    *  **Horizontal Scaling over Vertical Scaling:** Focus on scaling horizontally (adding more servers) rather than vertically (upgrading the same server) to handle increasing traffic.
    *  **Microservices Architecture:** Break the application into smaller, independent services that can be scaled individually, enabling each service to scale according to its own demand.
    *  **Efficient Database Indexing:** Ensure efficient database indexing strategies are in place to speed up query execution times, especially as the data grows.
    *  **Caching:** Implement caching mechanisms (e.g., Redis, Memcached) to store frequently accessed data in memory, reducing database load and speeding up response times.
    *  **Lazy Loading:** Implement lazy loading for non-critical content, such as images or additional scripts, so that the initial page loads faster and only required resources are 
         loaded first.
    *  **Multi-Tenancy Support:** Design the platform to support multi-tenancy, allowing the same infrastructure to serve multiple clients or institutions efficiently while isolating 
         their data.

       **Optimize API & Database Management**
       * **Database Sharding & Replication:** Use read replicas to offload read-heavy operations, increasing availability.
       * **Connection Pooling:** mplement database connection pooling to reduce the overhead of creating new database connections.

8. **Video Streaming and Downloadable Content:** 
   * **High-Quality Streaming**: Support for various resolutions and adaptive bitrate streaming.
   * **Background Audio Playback:** Enable background audio playback, especially for mobile devices, so users can listen to lecture audio while multitasking or with the screen turned off.
   * **Watermarked Downloads:** For downloadable videos or PDFs, add watermarks (e.g., user ID, email) to discourage unauthorized sharing or redistribution.
       has context menu 
   * **Download Options**: Allow students to download course materials for offline access.
   * **Custom Thumbnails & Previews:** Support custom video thumbnails and hover previews so users can get a sneak peek of the video content before playing it.
   * **Playback Resume Feature:** Ensure that users can resume watching a video from where they left off across different sessions and devices. 
   * **CDN Integration**: Use Content Delivery Networks to ensure smooth video playback.
   *  **High-Quality Video Encoding:** Ensure that videos are encoded in multiple resolutions (480p, 720p, 1080p, etc.) to cater to different devices and internet speeds.
   *  **Video Player Customization:** Include features like playback speed control, captions, a full-screen mode, volume adjustment, and video scrubbing (allowing users to jump to specific sections).
   *  **Subtitle Support:** Offer subtitles and closed captions for videos to make content accessible to non-native speakers and users with hearing impairments.
   *  **Offline Viewing via App:** If you have a mobile app, offer an offline viewing mode that allows students to download and access videos even without internet access.
   *  **Video Search & Bookmarking:** Provide a search feature within videos for users to quickly find specific topics or sections. Allow them to bookmark or annotate important sections for later review.
   *  **Multi-Device Sync:** Allow users to pause a video on one device (e.g., laptop) and resume it on another (e.g., mobile) from the same point, syncing across devices.
   *  **Low-Latency Streaming:** Optimize for low-latency streaming to minimize the delay between the video content and what users see, providing a real-time experience.
        has context menu


9.  **Role-Based Access Control:**
    * **Instructor Roles:** Permissions for creating and managing courses, viewing analytics, etc.
    * **Student Roles:** Access to course materials, quizzes, and certificates.
    * **Admin Roles:** Oversight and management of users, content, and platform settings.

      **Instructor Role:**
       * **Permissions:** Create and manage courses, view analytics, grade assignments, and interact with students.
       * **User Interface Elements:** Dashboards for course management, analytics, grading, and messaging.
       * **Design Tips:** For managing courses and students, make sure the user interface is clear and easy to use, with dashboards customised to various roles.

      **Student Role:**
      * **Permissions:**
        * Access Course Materials: View videos, readings, and assignments.
        * Take Quizzes and Exams: Participate in assessments with timed tests and instant feedback.
        * View Grades and Feedback: Check grades and read instructor feedback on assignments.
        * Download Certificates: Obtain completion certificates in various formats.
      * **User Interface Elements:** Course pages, quiz interfaces, and certificate download options.

      **Admin Role:**
      * **Permissions:** Manage users, manage content, adjust settings, and monitor platform activity.
      * **User Interface Elements:** User management interface, content oversight panels, settings configuration, and activity dashboards.

 10. **Multi-Language Support:**
      * **Text Generator:** Providing the text(sub-titles) for the audio in different styles and colours.
      * **Translation Tools:** Support for translating the text(sub-titles) in different languages.
    
11. **Video Player Features:**
      * **Speed Control:** Allow users to adjust playback speed.
      * **Subtitles:** Support for multiple subtitle tracks.

## Documentation:
  * **Investigation Requirements Engineering:** Changing the Investigation Requirements Engineering documentation about functional requirements and non-functional requirements by using the changes mentioned by the client.
  * **List of Proposed Prototypes:** Updated the list of proposed prototypes by adding User Login and Registration Interface, Course Creation Dashboard and Course Catalog Page for the course learning platform.
 

 ## Key Elements of a Student Login Page for an Online Learning Platform
   * **Logo:** Displays the platform’s branding for recognition and trust.
   * **Page Title:** Clearly indicates the purpose of the page (e.g., "Login to Your Account").
   * **Email Input Field:** Where users enter their registered email address.
   * **Password Input Field:** Where users enter their password for account access.
   * **Password Visibility Toggle:** Allows users to view or hide their password as they type.
   * **Login Button:** Prominent button for submitting login credentials.
   * **Forgot Password Link:** Directs users to reset their password if forgotten.
   * **Sign-Up Link:** Provides a pathway for new users to create an account.
   * **Error Messages:** Displays real-time feedback for any input errors.
   * **Privacy Policy Link:** Connects to the platform's privacy policy for user assurance.
   * **Terms of Service Link:** Links to the terms governing the use of the platform.

 ## Key Elements of a Student Home Page for an Online Learning Platform
   * **Header:** Contains navigation links and the logo.
   * **Personalized Dashboard:**
     * **Progress Bar:** Visual representation of overall course completion.
     * **Upcoming Assignments:** List format showing due dates.
   * **Course Cards:** Two course cards side by side for quick access to current courses.
   * **Notification Center:** Alerts section for new notifications and messages.
   * **Search Bar:** Centered for easy access to search for courses or resources.
   * **Community Links:** Quick links to forums or group discussions.
   * **Resource Links:** Section for downloadable course materials.
   * **Footer:** Contains links to policies and contact information.

 ## Key Elements of a Student Course Catalog Screen UI Elements for an Online Learning Platform
   * **Header:** Contains the platform logo, navigation menu, and search bar for easy access to key areas.
   * **Filter Options:** Allows users to filter and sort courses by category, level, and popularity.
   * **Course Cards:** Displays individual courses with thumbnails, titles, descriptions, instructor names, ratings, and enrollment buttons.
   * **Pagination Controls:** Provides navigation buttons for browsing through multiple pages of courses.
   * **Featured Courses Section:** Showcases recommended courses based on user preferences and trends.
   * **Recently Viewed Courses:** Offers quick access to courses the student has recently explored.
   * **Popular Courses Section:** Highlights courses that are currently trending among students.
   * **Additional Resources:** Links to supplementary materials or guides related to course content.
   * **Footer:** Includes essential links such as contact information, privacy policy, and support resources.

## Key Elements of a Student Course Detail Page UI Elements
   * **Header:** Platform logo, navigation, and search bar.
   * **Course Title & Banner:** Displays course title with an image or video.
   * **Instructor Info:** Brief bio and other courses by the instructor.
   * **Course Overview:** Short course description and objectives.
   * **Curriculum:** Expandable list of course topics.
   * **Enrollment Button:** Clear call-to-action with pricing info.
   * **Ratings & Reviews:** Average rating and key feedback from students.
   * **Progress Tracking:** Track student progress through the course.
   * **Related Courses:** Suggestions for similar courses.
   * **Footer:** Links to support and platform policies.


