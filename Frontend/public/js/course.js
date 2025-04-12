const dummyImages = {
    "Java": "https://assets.toptal.io/images?url=https%3A%2F%2Fbs-uploads.toptal.io%2Fblackfish-uploads%2Fcomponents%2Fskill_page%2F37948%2Flogo%2Foptimized%2Fjava-159dc900b04f34f2269ae8adb9a2a451.png",
    "Python": "https://freepngimg.com/thumb/categories/1402.png",
    "Web Development Bootcamp": "https://static.vecteezy.com/system/resources/thumbnails/009/298/359/small/3d-illustration-of-web-development-png.png",
    "Data Science with R": "https://media.licdn.com/dms/image/v2/C510BAQHSc9OTV0JK1Q/company-logo_200_200/company-logo_200_200/0/1630567959858/data_science_online_training_logo?e=2147483647&v=beta&t=cI5GoN-wr2en4eDOPWskYpWq2g-W82a6QSSiWZFkmbE",
    "Machine Learning Basics": "https://static.vecteezy.com/system/resources/thumbnails/019/038/692/small/business-team-creating-artificial-intelligence-machine-learning-and-artificial-intelligence-concept-png.png",
    "Android App Development": "https://media.licdn.com/dms/image/v2/C4E03AQHNErqi_99UeA/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1618582379926?e=2147483647&v=beta&t=_DmWmHVVpUFkkV82m6KrGhzVSJH7eow1kobvgczskfE",
    "Nodejs": "https://www.smartsight.in/wp-content/uploads/2021/09/NodeJS-768x448.jpg"
};

var courseId, Title;
var UserID = localStorage.getItem("UserID");
var progress;

document.addEventListener("DOMContentLoaded", async () => {
    courseId = getCourseIdFromURL();
    if (!courseId) {
        alert("Course ID is missing!");
        return;
    }
    console.log(courseId)
    await fetchCourseDetails(courseId);
    await fetchProgress(UserID)
    await fetchModules(courseId);
    await fetchQuiz(courseId);
    await fetchAssignments(courseId);
    await loadCourseProgress(UserID, courseId);

   
      
});

function getCourseIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("courseId");
}

async function fetchCourseDetails(courseId) {
    try {
        const response = await fetch(`/user/getCourseById/${courseId}`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to fetch course details");
        }

        const course = data.data;
        Title = course.Title;
        document.querySelector(".course-image").src =
            dummyImages[course.Title] || "https://freepngimg.com/thumb/categories/1402.png";
        document.querySelector(".course-name").textContent = course.Title;
        document.querySelector(".course-desc").textContent = `Description: ${course.Description}`;
        document.querySelector(".course-category").textContent = `Category: ${course.Category}`;
        document.querySelector(".course-language").textContent = `Language: ${course.Language}`;
        document.querySelector(".course-instructor").textContent = `Instructor: ${course.Instructor}`;
    } catch (error) {
        console.error("Error fetching course:", error);
     //   alert("Failed to load course details.");
    }
}

async function fetchProgress(userID) {
    try {
        const response = await fetch(`/user/progress/${userID}`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to fetch progress.");
        }

        progress = data.data;
        console.log("Student Progress:", progress);
    } catch (error) {
        console.error("Error fetching progress:", error);
    }
}




  

async function loadCourseProgress(studentId, courseId) {
    try {
      const response = await fetch(`/user/progress/summary/${studentId}/${courseId}`);
      const data = await response.json();
    console.log(data)
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch progress summary.");
      }
  
      const percent = data.total === 0 ? 0 : Math.round((data.completed / data.total) * 100);
      const progressCircle = document.querySelector(".progress");
      const percentageText = document.querySelector(".percentage");
      if(percent == '100'){
        document.getElementById('certificate').style.display='block';
      } else {
        document.getElementById('certificate').style.display='none';
      }
      progressCircle.setAttribute("stroke-dasharray", `${percent}, 100`);
      percentageText.textContent = `${percent}%`;
    } catch (error) {
      console.error("Error loading course progress:", error);
    }
  }
  

async function fetchModules(courseId) {
    try {
        const response = await fetch(`/user/modules/${courseId}`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to fetch modules");
        }

        const modules = data.data;
        const moduleDiv = document.querySelector("#modules");
        moduleDiv.innerHTML = "";

        modules.forEach((module) => {

            const isCompleted = progress.some(p => p.ModuleID === module.ModuleID);

            let buttonHTML = isCompleted
                ? `<div class="completed-label">✅ Completed</div>`
                : `<button class="mark-complete-btn" onclick="markModuleCompleted(${module.ModuleID})">
                        ✅ Mark as Completed
                   </button>`;

            let template = `
                <div class="module-card" id="module-${module.ModuleID}">
                    <div class="module-name">Title : ${module.Title}</div>
                    <div class="module-desc">Description : ${module.Description}</div>
                    ${buttonHTML}
                    <div class="lectures" id="lectures-${module.ModuleID}"></div>
                </div>
            `;

            moduleDiv.innerHTML += template;
            fetchLectures(module.ModuleID);
        });
    } catch (error) {
        console.error("Error fetching modules:", error);
    }
}

async function markModuleCompleted(moduleId) {
    const studentID = UserID;

    try {
        const response = await fetch("/user/update-progress", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                studentID: studentID,
                moduleID: moduleId,
                courseID: courseId
            })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Failed to update progress.");
        }

        alert(`Module marked as completed!`);
        document.querySelector(`#module-${moduleId} .mark-complete-btn`).disabled = true;
    } catch (error) {
        console.error("Error marking module as completed:", error);
        alert("An error occurred while marking the module as completed.");
    }
}



async function fetchQuiz(courseId) {
    try {
        const response = await fetch(`/user/quizzes/${courseId}`);
        const data = await response.json();
        console.log(data)
        if (!response.ok) {
            throw new Error(data.message || "Failed to fetch quiz");
        }

        const quizzes = data;
        const moduleDiv = document.querySelector("#quizzes");
        moduleDiv.innerHTML = "";

        quizzes.forEach((quiz) => {
            let template = `
                <div class="module-card" id="quiz-${quiz.QuizID}">
                    <div class="module-name">Title : ${quiz.Title}</div>
                    <div class="module-desc">Description : ${quiz.Description}</div>
                    <div class="module-points">Total Points : ${quiz.TotalPoints}</div>
                    <button class="edit button" onclick="attemptQuiz(${quiz.QuizID})">Attempt</button>
                    <div class="lectures" id="quiz-questions-${quiz.QuizID}"></div>
                </div>
            `;
            moduleDiv.innerHTML += template;
           // fetchQuizQuestions(quiz.QuizID);
        });
    } catch (error) {
        console.error("Error fetching modules:", error);
    }
}

function attemptQuiz(quizId) {
    window.open(`attemptQuiz.html?quizId=${quizId}`, '_blank');
}


async function fetchLectures(moduleId) {
    try {
        const response = await fetch(`/user/module/lectures/${moduleId}`);
        if (!response.ok) throw new Error("Failed to fetch lectures");

        const lectures = await response.json();
        const lecturesContainer = document.getElementById(`lectures-${moduleId}`);

        lecturesContainer.innerHTML = "";
        lectures.sort((a, b) => a.Order - b.Order);

        lectures.forEach((lecture) => {
            const lectureHTML = `
                <div class="lecture-item" id="lecture-${lecture.LectureID}">
                    <span class="toggle-lecture" onclick="toggleLecture('lecture-${lecture.LectureID}')">➕</span>
                    <div class="lecture-title">Lecture: ${lecture.Title}</div>
                    <div class="lecture-content" id="content-lecture-${lecture.LectureID}" style="display: none;">
                        ${
                            lecture.DownloadableMaterialsURL
                                ? `<a href="${lecture.DownloadableMaterialsURL}" target="_blank">Download Material</a><br>`
                                : ""
                        }
                        ${lecture.VideoURL}
                        
                    </div>
                </div>
            `;
            lecturesContainer.innerHTML += lectureHTML;
        });

        lecturesContainer.style.display = "block";
    } catch (error) {
        console.error("Error fetching lectures:", error);
    }
}


function toggleLecture(lectureId) {
    let content = document.getElementById(`content-${lectureId}`);
    let toggleBtn = document.querySelector(`#${lectureId} .toggle-lecture`);

    if (content.style.display === "block") {
        content.style.display = "none";
        toggleBtn.innerHTML = "➕";
    } else {
        content.style.display = "block";
        toggleBtn.innerHTML = "➖";
    }
}

function toggleOptions(questionId, type) {
    const optionsContainer = document.getElementById(`options-${questionId}`);
    if (type === "truefalse") {
        optionsContainer.innerHTML = `
            <input type="text" value="True" class="option" readonly><br>
            <input type="text" value="False" class="option" readonly><br>
        `;
    } else {
        optionsContainer.innerHTML = `
            <input type="text" placeholder="Option 1" class="option"><br>
            <input type="text" placeholder="Option 2" class="option"><br>
            <input type="text" placeholder="Option 3" class="option"><br>
            <input type="text" placeholder="Option 4" class="option"><br>
        `;
    }
}

function toggleQuestion(questionId) {
    let content = document.getElementById(`content-${questionId.split('-')[1]}`);
    let toggleBtn = document.querySelector(`#${questionId} .toggle-question`);

    if (content.style.display === "block") {
        content.style.display = "none";
        toggleBtn.innerHTML = "➕";
    } else {
        content.style.display = "block";
        toggleBtn.innerHTML = "➖";
    }
}

async function fetchQuizQuestions(quizId) {
    try {
        const response = await fetch(`/user/quiz/questions/${quizId}`);
        if (!response.ok) throw new Error("Failed to fetch quiz questions");

        const questions = await response.json();
        const quizContainer = document.getElementById(`quiz-questions-${quizId}`);

        quizContainer.innerHTML = "";
        questions.sort((a, b) => a.Order - b.Order);

        questions.forEach((question, index) => {
            const questionId = `question-${question.QuestionID}`;
            const contentId = `content-${question.QuestionID}`;
            console.log(question)
            const questionHTML = `
                <div class="quiz-question" id="${questionId}">
                    <span class="toggle-question" onclick="toggleQuestion('${questionId}')">➕</span>
                    <div class="question-title">${index + 1}. ${question.QuestionText}</div>
                    <div class="question-content" id="${contentId}" style="display: none;">
                        ${question.QuestionType === "Multiple Choice" ? createMultipleChoiceOptions(question.Options, question.QuestionID) : ""}
                        ${question.QuestionType === "True/False" ? createTrueFalseOptions(question.QuestionID) : ""}
                        <button class="submit-button" onclick="submitAnswer(${question.QuestionID}, ${quizId})">Submit</button>
                    </div>
                </div>
            `;
            quizContainer.innerHTML += questionHTML;
        });

        quizContainer.style.display = "block";
    } catch (error) {
        console.error("Error fetching quiz questions:", error);
    }
}

function createMultipleChoiceOptions(options, questionId) {
    console.log("MC")
    return options
        .map(
            (option, index) => `
        <label>
            <input type="radio" name="answer-${questionId}" value="${option}"> ${option}
        </label><br>
    `
        )
        .join("");
}

function createTrueFalseOptions(questionId) {
    console.log('TF')
    return `
        <label><input type="radio" name="answer-${questionId}" value="True"> True</label><br>
        <label><input type="radio" name="answer-${questionId}" value="False"> False</label><br>
    `;
}


async function submitAnswer(questionId, quizId) {
    alert("Quiz question submitted");
    toggleQuestion(`question-${questionId}`)
    const selectedOption = document.querySelector(`input[name="answer-${questionId}"]:checked`);

    if (!selectedOption) {
        alert("Please select an answer before submitting.");
        return;
    }

    const answer = selectedOption.value;

    try {
        const response = await fetch(`/user/quiz/submit`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                quizId,
                questionId,
                answer,
            }),
        });

        if (!response.ok) throw new Error("Failed to submit answer");

        alert("Answer submitted successfully!");
    } catch (error) {
        console.error("Error submitting answer:", error);
    }
}

document.addEventListener("submit", async function (event) {
    if (event.target.classList.contains("submit-assignment-form")) {
        event.preventDefault();
        const form = event.target;
        console.log(form)
        const assignmentId = form.getAttribute("data-assignment-id");
        const submissionText = form.querySelector('textarea[name="submissionText"]').value.trim();
        const fileInput = form.querySelector('input[type="file"]');

        if (!submissionText && fileInput.files.length === 0) {
            alert("Please provide either submission text or upload a file.");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("AssignmentID", assignmentId);
            formData.append("StudentID", localStorage.getItem("UserID"));
            formData.append("SubmissionText", submissionText || null);

            if (fileInput.files.length > 0) {
                const file = fileInput.files[0];
                
                const reader = new FileReader();
                reader.onload = function (e) {
                    console.log("File Read Successfully:", e.target.result);
                };
                
                reader.readAsDataURL(file);
                formData.append("file", file, file.name);
            }
            
            console.log(formData)
            const response = await fetch("/user/submitAssignment", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Failed to submit assignment");
            }

            const data = await response.json();
            alert(data.message);
            await fetchAssignments(courseId);
        } catch (error) {
            console.error("Error submitting assignment:", error);
            alert("Error submitting assignment. Please try again.");
        }
    }
});


function fetchAssignments(courseId) {
    const assignmentsContainer = document.getElementById("assignments");
    fetch(`/user/assignments/${courseId}?UserID=${UserID}`)
        .then(response => response.json())
        .then(assignments => {
            console.log(assignments)
            if (assignments.length === 0) {
                assignmentsContainer.innerHTML = "<p class='empty-message'>No assignments available.</p>";
            } else {
                assignmentsContainer.innerHTML = "";
                assignments.forEach((assignment, index) => {
                    const assignmentId = `${assignment.AssignmentID}`;
                    const contentId = `assignment-${assignment.AssignmentID}`;
                    const date = new Date(assignment.SubmitDate);
                    const assignmentDiv = document.createElement("div");
                    assignmentDiv.classList.add("quiz-question");
                    assignmentDiv.id = assignmentId;
                    assignmentDiv.innerHTML = `
                        <span class="toggle-assignment" onclick="toggleAssignment('${assignmentId}')">➕</span>
                        <div class="assignment-title">${index + 1}. ${assignment.Title}  - <span style="color: red;">${assignment.submission ? 'Submitted' : date.toLocaleDateString()}</span></div>
                        <div class="assignment-content" id="${contentId}" style="display: none;">
                            <p>Description : ${assignment.Description}</p>
                            ${
                                assignment.submission 
                                ? `
                                    <p><strong>Points:</strong> ${assignment.submission.Points !== null ? assignment.submission.Points : "Not graded yet!"}</p>
                                    <p><strong>Feedback:</strong> ${assignment.submission.Feedback ? assignment.submission.Feedback : "Not graded yet!"}</p>
                                `
                                : `<p><strong>Submit Before:</strong> ${date.toLocaleDateString()}</p>
                                   <form class="submit-assignment-form" data-assignment-id="${assignment.AssignmentID}">
                                       <textarea name="submissionText" placeholder="Enter your answer..."></textarea>
                                       <input type="file" name="file" />
                                       <button type="submit" class="submit-button">Submit</button>
                                   </form>`
                            }
                        </div>
                    `;
                    assignmentsContainer.appendChild(assignmentDiv);
                });
            }
        })
        .catch(error => {
            console.error("Error fetching assignments:", error);
            assignmentsContainer.innerHTML = "<p class='error-message'>Error loading assignments.</p>";
        });
}

function toggleAssignment(assignmentId) {
    let content = document.getElementById(`assignment-${assignmentId}`);
    let toggleBtn = document.getElementById(assignmentId).querySelector(".toggle-assignment");

    if (content.style.display === "block") {
        content.style.display = "none";
        toggleBtn.innerHTML = "➕";
    } else {
        content.style.display = "block";
        toggleBtn.innerHTML = "➖";
    }
}


