const dummyImages = {
    "Java": "https://assets.toptal.io/images?url=https%3A%2F%2Fbs-uploads.toptal.io%2Fblackfish-uploads%2Fcomponents%2Fskill_page%2F37948%2Flogo%2Foptimized%2Fjava-159dc900b04f34f2269ae8adb9a2a451.png",
    "Python": "https://freepngimg.com/thumb/categories/1402.png",
    "Web Development Bootcamp": "https://static.vecteezy.com/system/resources/thumbnails/009/298/359/small/3d-illustration-of-web-development-png.png",
    "Data Science with R": "https://media.licdn.com/dms/image/v2/C510BAQHSc9OTV0JK1Q/company-logo_200_200/company-logo_200_200/0/1630567959858/data_science_online_training_logo?e=2147483647&v=beta&t=cI5GoN-wr2en4eDOPWskYpWq2g-W82a6QSSiWZFkmbE",
    "Machine Learning Basics": "https://static.vecteezy.com/system/resources/thumbnails/019/038/692/small/business-team-creating-artificial-intelligence-machine-learning-and-artificial-intelligence-concept-png.png",
    "Android App Development": "https://media.licdn.com/dms/image/v2/C4E03AQHNErqi_99UeA/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1618582379926?e=2147483647&v=beta&t=_DmWmHVVpUFkkV82m6KrGhzVSJH7eow1kobvgczskfE",
    "Nodejs": "https://www.smartsight.in/wp-content/uploads/2021/09/NodeJS-768x448.jpg"
};

var courseId;

document.addEventListener("DOMContentLoaded", async () => {
    courseId = getCourseIdFromURL();
    if (!courseId) {
        alert("Course ID is missing!");
        return;
    }

    await fetchCourseDetails(courseId);
    await fetchModules(courseId);
    await fetchQuiz(courseId);
    await fetchAssignments(courseId);

});

function getCourseIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("courseId");
}

async function fetchCourseDetails(courseId) {
    try {
        const response = await fetch(`/instructor/getCourseById/${courseId}`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to fetch course details");
        }

        const course = data.data;
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

async function fetchModules(courseId) {
    try {
        const response = await fetch(`/instructor/modules/${courseId}`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to fetch modules");
        }

        const modules = data.data;
        console.log(courseId, modules)
        const moduleDiv = document.querySelector("#modules");
        moduleDiv.innerHTML = "";

        modules.forEach((module) => {
            let template = `
                <div class="module-card" id="module-${module.ModuleID}">
                    <div class="module-name">Title : ${module.Title}</div>
                    <div class="module-desc">Description : ${module.Description}</div>
                    <button class="edit button" onclick="editModule(${module.ModuleID}, this)">Edit</button>
                    <button class="delete button" onclick="deleteModule(${module.ModuleID}, this)">Delete</button>
                    <button class="add-lecture button" onclick="newLecture(${module.ModuleID}, this)">New Lecture</button>
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

async function fetchQuiz(courseId) {
    try {
        const response = await fetch(`/instructor/quizzes/${courseId}`);
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
                    <button class="edit button" onclick="editQuiz(${quiz.QuizID}, this)">Edit</button>
                    <button class="delete button" onclick="deleteQuiz(${quiz.QuizID}, this)">Delete</button>
                    <button class="add-lecture button" onclick="newQuizQuestion(${quiz.QuizID}, this)">New Quiz</button>
                    <button class="edit button" onclick="fetchQuizAttempts('${quiz.QuizID}', '${quiz.Title}')">View Quiz Attempts</button>
                    <div class="lectures" id="quiz-questions-${quiz.QuizID}"></div>
                </div>
            `;
            moduleDiv.innerHTML += template;
            fetchQuizQuestions(quiz.QuizID);
        });
    } catch (error) {
        console.error("Error fetching modules:", error);
    }
}

async function fetchAssignments(courseId) {
    try {
        const response = await fetch(`/instructor/assignments/${courseId}`);
        const data = await response.json();
        const assignmentDiv = document.querySelector("#assignments");
        assignmentDiv.innerHTML = "";

        if (!response.ok) {
            alert(data.message || "Failed to fetch assignments");
            return;
        }

        data.forEach((assignment) => {
            let formattedDate = assignment.SubmitDate 
                ? new Date(assignment.SubmitDate).toISOString().split("T")[0] 
                : "";

            let template = `
                <div class="lecture-item" id="assignment-${assignment.AssignmentID}">
                    <span class="toggle-assignment" onclick="toggleAssignment('assignment-${assignment.AssignmentID}')">➕</span>
                    <div class="lecture-title">Title: ${assignment.Title}</div>
                    <div class="lecture-content" id="content-assignment-${assignment.AssignmentID}" style="display: none;">
                        <input type="text" class="lecture-input" value="${assignment.Title}"><br>
                        <input type="text" class="lecture-input" value="${assignment.Description}"><br>
                        <input type="date" class="lecture-date" value="${formattedDate}"><br>

                        <div class="actions"> 
                            <button class="edit button" onclick="editAssignment(${assignment.AssignmentID})">Edit</button>
                            <button class="delete button" onclick="deleteAssignment(${assignment.AssignmentID}, ${courseId})">Delete</button>
                            <button class="view-submissions button" onclick="fetchSubmissions(${assignment.AssignmentID})">View Submissions</button>
                        </div>
                    </div>
                </div>
            `;
            assignmentDiv.innerHTML += template;
        });
    } catch (error) {
        console.error("Error fetching assignment:", error);
    }
}

async function fetchSubmissions(assignmentId) {
    try {
        const response = await fetch(`/instructor/getAssignmentSubmissions?AssignmentID=${assignmentId}`);
        const data = await response.json();
        console.log(data)
        if (!response.ok) {
            alert(data.message || "Failed to fetch submissions");
            return;
        }

        openSubmissionsPopup(data, assignmentId);
    } catch (error) {
        console.error("Error fetching submissions:", error);
    }
}

async function fetchQuizAttempts(quizId, title) {
    try {
        const response = await fetch(`/instructor/fetchQuizAttempts?quizId=${quizId}`);
        const data = await response.json();
      //  console.log(data)
        if (!response.ok) {
            alert(data.message || "Failed to fetch quiz attempts");
            return;
        }
      //  console.log(data)
        viewQuizAttempts(data, quizId, title);
    } catch (error) {
        console.error("Error fetching quiz attempts:", error);
    }
}

function openSubmissionsPopup(submissions, assignmentId) {
    let popupContainer = document.createElement("div");
    popupContainer.classList.add("popup-container");

    let popupContent = `
        <div class="popup">
            <span class="close-popup" onclick="closePopup()">✖</span>
            <h2>Submissions for Assignment ${assignmentId}</h2>
            <table>
                <thead>
                    <tr>
                        <th>Student</th>
                        <th>Text</th>
                        <th>File</th>
                        <th>Grade</th>
                        <th>Feedback</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
    `;

    submissions.forEach(submission => {
        const fileDownload = submission.FileURL 
            ? `<a href="${submission.FileURL}" target="_blank" class="download-link">Download</a>` 
            : "No File";

        popupContent += `
            <tr id="submission-${submission.SubmissionID}">
                <td>${submission.StudentName}</td>
                <td>${submission.SubmissionText}</td>
                <td>${fileDownload}</td>
                <td><input type="number" id="grade-${submission.SubmissionID}" value="${submission.Points || ""}" min="0" max="100"></td>
                <td><input type="text" id="feedback-${submission.SubmissionID}" value="${submission.Feedback || ""}"></td>
                <td><button class="save-btn" onclick="updateGrade(${submission.SubmissionID})">Save</button></td>
            </tr>
        `;
    });

    popupContent += `
                </tbody>
            </table>
        </div>
    `;

    popupContainer.innerHTML = popupContent;
    document.body.appendChild(popupContainer);
}

function viewQuizAttempts(submissions, quizId, title) {
    let popupContainer = document.createElement("div");
    popupContainer.classList.add("popup-container");

    let popupContent = `
        <div class="popup">
            <span class="close-popup" onclick="closePopup()">✖</span>
            <h2>Quiz Attempts for ${title}</h2>
            <table>
                <thead>
                    <tr>
                        <th>Student</th>
                        <th>Score / Total Points</th>
                        <th>Attempted Time</th>
                    </tr>
                </thead>
                <tbody>
    `;

    submissions.forEach(submission => {
        let date =new Date(submission.SubmissionTime)
        popupContent += `
            <tr>
                <td>${submission.StudentName}</td>
                <td>${submission.Score || ""} / ${submission.TotalPoints}</td>
                <td>${date.toLocaleString() || ""}</td>
            </tr>
        `;
    });

    popupContent += `
                </tbody>
            </table>
        </div>
    `;

    popupContainer.innerHTML = popupContent;
    document.body.appendChild(popupContainer);
}

function closePopup() {
    document.querySelector(".popup-container").remove();
}

async function updateGrade(submissionId) {
    const grade = document.getElementById(`grade-${submissionId}`).value;
    const feedback = document.getElementById(`feedback-${submissionId}`).value;

    try {
        const response = await fetch("/instructor/updateSubmission", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ SubmissionID: submissionId, Points: grade, Feedback: feedback }),
        });

        const data = await response.json();
        if (!response.ok) {
            alert(data.message || "Failed to update submission");
            return;
        }

        alert("Grade and feedback updated successfully!");
    } catch (error) {
        console.error("Error updating submission:", error);
    }
}



function showModuleForm() {
    const form = document.getElementById("moduleForm");
    form.style.display = "block";
}

function showQuizForm() {
    const form = document.getElementById("quizForm");
    form.style.display = "block";
}

function showAssignmentForm() {
    const form = document.getElementById("assignmentForm");
    form.style.display = "block";
}

function undoModule() {
    const form = document.getElementById("moduleForm");
    form.style.display = "none";
}

function undoQuiz() {
    const form = document.getElementById("quizForm");
    form.style.display = "none";
}

function undoAssignment(){
    const form = document.getElementById('assignmentForm')
    form.style.display = "none";
}

async function addModule() {
    const title = document.getElementById("moduleTitle").value.trim();
    const desc = document.getElementById("moduleDesc").value.trim();
    const courseId = getCourseIdFromURL();
    if (!title || !desc) {
        alert("Please fill all fields!");
        return;
    }
    try {
        const response = await fetch(`/instructor/addCourseModule`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ CourseID: courseId, Title: title, Description: desc }),
        });
        if (!response.ok) {
            throw new Error("Failed to add module");
        }
        await fetchModules(courseId);
        document.getElementById("moduleTitle").value = "";
        document.getElementById("moduleDesc").value = "";
        document.getElementById("moduleForm").style.display = "none";
    } catch (error) {
        console.error("Error adding module:", error);
        alert("Failed to add module.");
    }
}

async function addQuiz() {
    const title = document.getElementById("quizTitle").value.trim();
    const desc = document.getElementById("quizDesc").value.trim();
    const totalPoints = document.getElementById('totalPoints').value.trim();
    const courseId = getCourseIdFromURL();
    if (!title || !desc || !totalPoints) {
        alert("Please fill all fields!");
        return;
    }
    try {
        const response = await fetch(`/instructor/quizzes`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ CourseID: courseId, Title: title, Description: desc, TotalPoints: totalPoints }),
        });
        if (!response.ok) {
            throw new Error("Failed to add module");
        }
        await fetchQuiz(courseId);
        document.getElementById("moduleTitle").value = "";
        document.getElementById("moduleDesc").value = "";
        document.getElementById("moduleForm").style.display = "none";
    } catch (error) {
        console.error("Error adding quiz:", error);
        alert("Failed to add quiz.");
    }
}

async function addAssignment() {
    const title = document.getElementById("assignmentTitle").value.trim();
    const desc = document.getElementById("assignmentDesc").value.trim();
    const submitDate = document.getElementById('assignmentSubmitDate').value.trim();

    if (!title || !desc || !submitDate) {
        alert("Please fill all fields!");
        return;
    }
    try {
        const response = await fetch(`/instructor/assignments`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ CourseID: courseId, Title: title, Description: desc, SubmitDate: submitDate }),
        });
        console.log(response)
        alert("Assignment Added!")
        await fetchAssignments(courseId);
        document.getElementById("assignmentTitle").value = "";
        document.getElementById("assignmentDesc").value = "";
        document.getElementById("assignmentSubmitDate").value = "";
        document.getElementById("assignmentForm").style.display = "none";
    } catch (error) {
        console.error("Error adding assignment:", error);
        alert("Failed to add assignment.");
    }
}

function createModuleRow(module) {
    const newRow = document.createElement("tr");

    newRow.innerHTML = `
        <td>${module.Title}</td>
        <td>${module.Description}</td>
        <td class="actions">
            <button class="edit-button" onclick="editModule(${module.ModuleID}, this)">Edit</button>
            <button class="delete-button" onclick="deleteModule(${module.ModuleID}, this)">Delete</button>
            <button class="add-quiz-button" onclick="addQuiz(${module.ModuleID})">Add Quiz</button>
        </td>
    `;

    return newRow;
}

async function editModule(moduleID, button) {

    const moduleCard = button.closest(".module-card");
    const titleElement = moduleCard.querySelector(".module-name");
    const descElement = moduleCard.querySelector(".module-desc");
    const currentTitle = titleElement.textContent.replace("Title : ", "").trim();
    const currentDesc = descElement.textContent.replace("Description : ", "").trim();
    document.getElementById("moduleTitle").value = currentTitle;
    document.getElementById("moduleDesc").value = currentDesc;
    showModuleForm();
    document.querySelector("#moduleForm button").onclick = async () => {
        const title = document.getElementById("moduleTitle").value.trim();
        const desc = document.getElementById("moduleDesc").value.trim();
        if (!title || !desc) {
            alert("Please fill all fields!");
            return;
        }
        try {
            const response = await fetch(`/instructor/editModule/${moduleID}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ Title: title, Description: desc }),
            });

            if (!response.ok) {
                throw new Error("Failed to edit module");
            }
            titleElement.textContent = `Title : ${title}`;
            descElement.textContent = `Description : ${desc}`;
            document.getElementById("moduleTitle").value = "";
            document.getElementById("moduleDesc").value = "";
            document.getElementById("moduleForm").style.display = "none";
        } catch (error) {
            console.error("Error editing module:", error);
            alert("Failed to edit module.");
        }
    };
}

async function deleteModule(moduleID, button) {
    if (!confirm("Are you sure you want to delete this module?")) return;

    try {
        const response = await fetch(`/instructor/deleteModule/${moduleID}`, { method: "DELETE" });

        if (!response.ok) {
            throw new Error("Failed to delete module");
        }

        await fetchModules(courseId);
        
    } catch (error) {
        console.error("Error deleting module:", error);
        alert("Failed to delete module.");
    }
}

async function editQuiz(QuizID, button) {

    const moduleCard = button.closest(".module-card");
    const titleElement = moduleCard.querySelector(".module-name");
    const descElement = moduleCard.querySelector(".module-desc");
    const totalPoints = moduleCard.querySelector(".module-points");
    const currentTitle = titleElement.textContent.replace("Title : ", "").trim();
    const currentDesc = descElement.textContent.replace("Description : ", "").trim();
    const currentPoints = totalPoints.textContent.replace("Total Points : ", "").trim();
    document.getElementById("quizTitle").value = currentTitle;
    document.getElementById("quizDesc").value = currentDesc;
    document.getElementById("totalPoints").value = currentPoints
    showQuizForm();
    document.querySelector("#quizForm button").onclick = async () => {
        const title = document.getElementById("quizTitle").value.trim();
        const desc = document.getElementById("quizDesc").value.trim();
        const points = document.getElementById("totalPoints").value.trim();
        if (!title || !desc || !totalPoints) {
            alert("Please fill all fields!");
            return;
        }
        try {
            const response = await fetch(`/instructor/quizzes/${QuizID}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ Title: title, Description: desc, TotalPoints: points }),
            });

            if (!response.ok) {
                throw new Error("Failed to edit module");
            }
            titleElement.textContent = `Title : ${title}`;
            descElement.textContent = `Description : ${desc}`;
            totalPoints.textContent = `Total Points : ${points}`
            document.getElementById("moduleTitle").value = "";
            document.getElementById("moduleDesc").value = "";
            document.getElementById("totalPoints").value = "";
            document.getElementById("quizForm").style.display = "none";
        } catch (error) {
            console.error("Error editing quiz:", error);
            alert("Failed to edit quiz.");
        }
    };
}

async function deleteQuiz(QuizID, button) {
    if (!confirm("Are you sure you want to delete this module?")) return;

    try {
        const response = await fetch(`/instructor/quizzes/${QuizID}`, { method: "DELETE" });

        if (!response.ok) {
            throw new Error("Failed to delete module");
        }

        await fetchQuiz(courseId);
        
    } catch (error) {
        console.error("Error deleting quiz:", error);
        alert("Failed to delete quiz.");
    }
}

async function fetchLectures(moduleId) {
    try {
        const response = await fetch(`/instructor/module/lectures/${moduleId}`);
        if (!response.ok) throw new Error('Failed to fetch lectures');

        const lectures = await response.json();
        const lecturesContainer = document.getElementById(`lectures-${moduleId}`);

        lecturesContainer.innerHTML = '';
        lectures.sort((a, b) => a.Order - b.Order);

        lectures.forEach(lecture => {
            const lectureHTML = `
                <div class="lecture-item" id="lecture-${lecture.LectureID}">
                    <span class="toggle-lecture" onclick="toggleLecture('lecture-${lecture.LectureID}')">➕</span>
                    <div class="lecture-title">Lecture: ${lecture.Title}</div>
                    <div class="lecture-content" id="content-lecture-${lecture.LectureID}" style="display: none;">
                        <input type="text" class="lecture-input" value="${lecture.Title}"><br>
                        ${
                            lecture.DownloadableMaterialsURL
                                ? `<a href="${lecture.DownloadableMaterialsURL}" target="_blank">Download Material</a><br>`
                                : ""
                        }
                        <input type="text" class="lecture-yt" value='${lecture.VideoURL}'><br>
                        <div class="actions"> 
                            <button class="edit button" onclick="editLecture(${lecture.LectureID})">Edit</button>
                            <button class="delete button" onclick="deleteLecture(${lecture.LectureID}, ${moduleId})">Delete</button>
                        </div>
                    </div>
                </div>
            `;
            lecturesContainer.innerHTML += lectureHTML;
        });

        lecturesContainer.style.display = "block";
    } catch (error) {
        console.error('Error fetching lectures:', error);
    }
}


function newLecture(moduleId, btn) {
    let lecturesContainer = document.getElementById(`lectures-${moduleId}`);

    if (!lecturesContainer) {
        lecturesContainer = document.createElement("div");
        lecturesContainer.id = `lectures-${moduleId}`;
        lecturesContainer.classList.add("lectures");
        btn.parentElement.appendChild(lecturesContainer);
    }

    const lectureId = `new-lecture-${Date.now()}`;
    const lectureHTML = `
        <div class="lecture-item new-lecture" id="${lectureId}">
            <span class="toggle-lecture" onclick="toggleLecture('${lectureId}')">➕</span>
            <div class="lecture-title">New Lecture</div>
            <div class="lecture-content" id="content-${lectureId}" style="display: block;">
                <input type="text" placeholder="Lecture Title" class="lecture-input"><br>
                <input type="file" class="lecture-file"><br>
                <input type="text" placeholder="YouTube Video URL" class="lecture-yt"><br>
                <button class="save button" onclick="addLecture('${lectureId}', ${moduleId})">Save</button>
                <button class="remove button" onclick="removeNewLecture('${lectureId}')">Remove</button>
            </div>
        </div>
    `;

    lecturesContainer.innerHTML += lectureHTML;
    lecturesContainer.style.display = "block";
}


async function editLecture(lectureId) {
    try {
        const titleInput = document.querySelector(`#lecture-${lectureId} .lecture-input`);
        const newTitle = prompt("Enter new lecture title:", titleInput.value);

        if (!newTitle) return;

        const response = await fetch(`/instructor/editLecture/${lectureId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ Title: newTitle }),
        });

        if (!response.ok) throw new Error('Failed to edit lecture');

        titleInput.value = newTitle;
        document.querySelector(`#lecture-${lectureId} .lecture-title`).innerText = `Lecture: ${newTitle}`;
    } catch (error) {
        console.error('Error editing lecture:', error);
    }
}

async function deleteLecture(lectureId, moduleId) {
    try {
        const confirmDelete = confirm("Are you sure you want to delete this lecture?");
        
        if (!confirmDelete) return;

        const response = await fetch(`/instructor/deleteLecture/${lectureId}`, { method: 'DELETE' });

        if (!response.ok) throw new Error('Failed to delete lecture');
        document.getElementById(`lecture-${lectureId}`).remove();

    } catch (error) {
        console.error('Error deleting lecture:', error);
    }
}


function removeNewLecture(lectureId) {
    document.getElementById(lectureId).remove();
}

async function addLecture(lectureId, moduleId) {
    try {
        const lectureElement = document.getElementById(lectureId);
        const titleInput = lectureElement.querySelector(".lecture-input");
        const videoInput = lectureElement.querySelector(".lecture-yt");
        const fileInput = lectureElement.querySelector(".lecture-file");

        const lectureTitle = titleInput.value.trim();
        const videoURL = videoInput.value.trim();

        if (!lectureTitle) {
            alert("Title are required!");
            return;
        }

        const formData = new FormData();
        formData.append("ModuleID", moduleId);
        formData.append("Title", lectureTitle);
        formData.append("VideoURL", videoURL || null);

        if (fileInput.files.length > 0) {
            formData.append("Material", fileInput.files[0]);
        }

        const response = await fetch('/instructor/addLecture', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) throw new Error('Failed to add lecture');

        const res = await response.json();
       // console.log(newLecture)
       let newLecture =  res.newLecture[0]
        lectureElement.outerHTML = `
            <div class="lecture-item" id="lecture-${newLecture.LectureID}">
                <span class="toggle-lecture" onclick="toggleLecture('lecture-${newLecture.LectureID}')">➕</span>
                <div class="lecture-title">Lecture: ${newLecture.Title}</div>
                <div class="lecture-content" id="content-lecture-${newLecture.LectureID}" style="display: none;">
                    <input type="text" class="lecture-input" value="${newLecture.Title}"><br>
                    ${
                        newLecture.DownloadableMaterialsURL
                            ? `<a href="${newLecture.DownloadableMaterialsURL}" target="_blank">Download Material</a><br>`
                            : ""
                    }
                    <input type="text" class="lecture-yt" value='${videoURL}'><br>
                    <div class="actions"> 
                        <button class="edit button" onclick="editLecture(${newLecture.LectureID})">Edit</button>
                        <button class="delete button" onclick="deleteLecture(${newLecture.LectureID}, ${moduleId})">Delete</button>
                    </div>
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Error adding lecture:', error);
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

function toggleAssignment(lectureId) {
    let content = document.getElementById(`content-${lectureId}`);
    let toggleBtn = document.querySelector(`#${lectureId} .toggle-assignment`);

    if (content.style.display === "block") {
        content.style.display = "none";
        toggleBtn.innerHTML = "➕";
    } else {
        content.style.display = "block";
        toggleBtn.innerHTML = "➖";
    }
}


function showQuizForm() {
    const form = document.getElementById("quizForm");
    form.style.display = "block";
}

function newQuizQuestion(quizId, btn) {
    let quizContainer = document.getElementById(`quiz-questions-${quizId}`);

    if (!quizContainer) {
        quizContainer = document.createElement("div");
        quizContainer.id = `quiz-questions-${quizId}`;
        quizContainer.classList.add("quiz-questions");
        btn.parentElement.appendChild(quizContainer);
    }

    const questionId = `new-question-${Date.now()}`;
    const questionHTML = `
        <div class="quiz-question" id="${questionId}">
            <span class="toggle-question" onclick="toggleQuestion('${questionId}')">➕</span>
            <div class="question-title">New Question</div>
            <div class="question-content" id="content-${questionId}" style="display: block;">
                <input type="text" placeholder="Question" class="question-input"><br>
                <select class="question-type" onchange="toggleOptions('${questionId}', this.value)">
                    <option value="Multiple Choice">Multiple Choice</option>
                    <option value="True/False">True/False</option>
                </select><br>
                <div class="question-options" id="options-${questionId}">
                    <input type="text" placeholder="Option 1" class="option"><br>
                    <input type="text" placeholder="Option 2" class="option"><br>
                    <input type="text" placeholder="Option 3" class="option"><br>
                    <input type="text" placeholder="Option 4" class="option"><br>
                </div>
                <input type="text" placeholder="Correct Answer" class="correct-answer"><br>
                <div class="actions"> 
                <button class="save button" onclick="addQuizQuestion('${questionId}', ${quizId})">Save</button>
                <button class="remove button" onclick="removeNewQuestion('${questionId}')">Remove</button>
                </div>
            </div>
        </div>
    `;

    quizContainer.innerHTML += questionHTML;
    quizContainer.style.display = "block";
}

function toggleOptions(questionId, type) {
    const optionsContainer = document.getElementById(`options-${questionId}`);
    if (type === "True/False") {
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

function removeNewQuestion(questionId) {
    document.getElementById(questionId).remove();
}

async function addQuizQuestion(questionId, quizId) {
    try {
        const questionElement = document.getElementById(questionId);
        const questionInput = questionElement.querySelector(".question-input");
        const questionType = questionElement.querySelector(".question-type").value;
        const correctAnswer = questionElement.querySelector(".correct-answer").value;
        const options = Array.from(questionElement.querySelectorAll(".option")).map(input => input.value.trim());

        if (!questionInput.value.trim() || !correctAnswer.trim()) {
            alert("Question and correct answer are required!");
            return;
        }

        const questionData = {
            QuizID: quizId,
            Question: questionInput.value.trim(),
            Type: questionType,
            Options: options,
            CorrectAnswer: correctAnswer.trim()
        };

        const response = await fetch('/instructor/addQuizQuestion', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(questionData),
        });

        if (!response.ok) throw new Error('Failed to add quiz question');

        const res = await response.json();
        const newQuestion = res.newQuestion[0][0]
        console.log(newQuestion)
        questionElement.outerHTML = `
            <div class="quiz-question" id="question-${newQuestion.QuestionID}">
                <span class="toggle-question" onclick="toggleQuestion('question-${newQuestion.QuestionID}')">➕</span>
                <div class="question-title">Question: ${newQuestion.QuestionText}</div>
                <div class="question-content" id="content-question-${newQuestion.QuestionID}" style="display: none;">
                    <input type="text" class="question-input" value="${newQuestion.QuestionText}"><br>
                    <select class="question-type" disabled>
                        <option value="Multiple Choice" ${newQuestion.QuestionType === "Multiple Choice" ? "selected" : ""}>Multiple Choice</option>
                        <option value="True/False" ${newQuestion.QuestionType === "True/False" ? "selected" : ""}>True/False</option>
                    </select><br>
                    <div class="question-options">
                        ${newQuestion.Options.map(option => `<input type="text" class="option" value="${option}" readonly><br>`).join("")}
                    </div>
                    <input type="text" class="correct-answer" value="${newQuestion.CorrectAnswer}" readonly><br>
                    <button class="edit button" onclick="editQuizQuestion(${newQuestion.QuestionID})">Edit</button>
                    <button class="delete button" onclick="deleteQuizQuestion(${newQuestion.QuestionID}, ${quizId})">Delete</button>
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Error adding quiz question:', error);
    }
}

async function editQuizQuestion(questionId) {
    try {
        const questionElement = document.getElementById(`question-${questionId}`);
        const questionInput = questionElement.querySelector(".question-input");
        const correctAnswer = questionElement.querySelector(".correct-answer");

        const newQuestion = prompt("Edit Question:", questionInput.value);
        const newCorrectAnswer = prompt("Edit Correct Answer:", correctAnswer.value);

        if (!newQuestion || !newCorrectAnswer) return;

        const response = await fetch(`/instructor/editQuizQuestion/${questionId}`, {
            method: 'PUT',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ Question: newQuestion, CorrectAnswer: newCorrectAnswer }),
        });

        if (!response.ok) throw new Error('Failed to edit quiz question');

        questionInput.value = newQuestion;
        correctAnswer.value = newCorrectAnswer;
        questionElement.querySelector(".question-title").textContent = `Question: ${newQuestion}`;
    } catch (error) {
        console.error('Error editing quiz question:', error);
    }
}

async function deleteQuizQuestion(questionId, quizId) {
    try {
        if (!confirm("Are you sure you want to delete this question?")) return;

        const response = await fetch(`/instructor/deleteQuizQuestion/${questionId}`, { method: "DELETE" });

        if (!response.ok) throw new Error("Failed to delete quiz question");

        document.getElementById(`question-${questionId}`).remove();
    } catch (error) {
        console.error("Error deleting quiz question:", error);
    }
}

function toggleQuestion(questionId) {
    let content = document.getElementById(`content-${questionId}`);
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
        const response = await fetch(`/instructor/quiz/questions/${quizId}`);
        console.log(response)
        if (!response.ok) throw new Error("Failed to fetch quiz questions");

        const questions = await response.json();
        const quizContainer = document.getElementById(`quiz-questions-${quizId}`);

        quizContainer.innerHTML = "";  
        questions.sort((a, b) => a.Order - b.Order);

        questions.forEach((question) => {
            const questionHTML = `
                <div class="quiz-question" id="question-${question.QuestionID}">
                    <span class="toggle-question" onclick="toggleQuestion('question-${question.QuestionID}')">➕</span>
                    <div class="question-title">Question: ${question.QuestionText}</div>
                    <div class="question-content" id="content-question-${question.QuestionID}" style="display: none;">
                        <input type="text" class="question-input" value="${question.QuestionText}"><br>
                        <select class="question-type" disabled>
                            <option value="multiple" ${question.Type === "Multiple Choice" ? "selected" : ""}>Multiple Choice</option>
                            <option value="truefalse" ${question.Type === "True/False" ? "selected" : ""}>True/False</option>
                        </select><br>
                        <div class="question-options">
                            ${question.Options.map(
                                (option) => `<input type="text" class="option" value="${option}" readonly><br>`
                            ).join("")}
                        </div>
                        <input type="text" class="correct-answer" value="${question.CorrectAnswer}" readonly><br>
                        <button class="edit button" onclick="editQuizQuestion(${question.QuestionID})">Edit</button>
                        <button class="delete button" onclick="deleteQuizQuestion(${question.QuestionID}, ${quizId})">Delete</button>
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


async function deleteAssignment(AssignmentID, button) {
    if (!confirm("Are you sure you want to delete this module?")) return;

    try {
        const response = await fetch(`/instructor/deleteAssignment/${AssignmentID}`, { method: "DELETE" });

        if (!response.ok) {
            throw new Error("Failed to delete assignment");
        }
        alert("Assignment Deleted")
        await fetchAssignments(courseId);
        
    } catch (error) {
        console.error("Error deleting module:", error);
        alert("Failed to delete assignment.");
    }
}
