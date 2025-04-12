
async function fetchLectures(moduleId) {
    try {
        const response = await fetch(`/module/lectures/${moduleId}`);
        if (!response.ok) throw new Error('Failed to fetch lectures');

        const lectures = await response.json();
        const lecturesContainer = document.getElementById(`lectures-${moduleId}`);

        lecturesContainer.innerHTML = '';
        lectures.forEach(lecture => {
            const lectureHTML = `
                <div class="lecture-item" id="lecture-${lecture.LectureID}">
                    <span class="toggle-lecture" onclick="toggleLecture('lecture-${lecture.LectureID}')">➕</span>
                    <div class="lecture-title">Lecture: ${lecture.Title}</div>
                    <div class="lecture-content" id="content-lecture-${lecture.LectureID}">
                        <input type="text" placeholder="Lecture Title" class="lecture-input" value="${lecture.Title}"><br>
                        <a href="${lecture.DownloadableMaterialsURL}" target="_blank">Download Material</a><br>
                        <input type="text" placeholder="YouTube Video URL" class="lecture-yt"><br>
                        <div class="actions"> 
                            <button class="edit button" onclick="editLecture(${lecture.LectureID})">Edit</button>
                            <button class="delete button" style="display: inline-block !important;" onclick="deleteLecture(${lecture.LectureID}, ${moduleId})">Delete</button>
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

    const lectureId = `lecture-${Date.now()}`;
    const lectureHTML = `
        <div class="lecture-item" id="${lectureId}">
            <span class="toggle-lecture" onclick="toggleLecture('${lectureId}')">➕</span>
            <div class="lecture-title">Lecture: Untitled</div>
            <div class="lecture-content" id="content-${lectureId}">
                <input type="text" placeholder="Lecture Title" class="lecture-input"><br>
                <input type="file" class="lecture-file"><br>
                <input type="text" placeholder="YouTube Video URL" class="lecture-yt"><br>
                <button class="edit button" onclick="editLecture('${lectureId}')">Edit</button>
                <button class="delete button" onclick="deleteLecture('${lectureId}')">Delete</button>
            </div>
        </div>
    `;

    lecturesContainer.innerHTML += lectureHTML;
    lecturesContainer.style.display = "block";
}

async function addLecture(moduleId, btn) {
    try {
        const lecturesContainer = document.getElementById(`lectures-${moduleId}`);
        const lectureTitle = prompt("Enter the lecture title:");
        const videoURL = prompt("Enter YouTube Video URL:");

        if (!lectureTitle || !videoURL) return alert("Title and Video URL are required!");

        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = ".pdf,.doc,.docx,.ppt,.pptx,.txt";
        fileInput.click();

        fileInput.onchange = async () => {
            const selectedFile = fileInput.files[0]; 

            const formData = new FormData();
            formData.append("ModuleID", moduleId);
            formData.append("Title", lectureTitle);
            formData.append("VideoURL", videoURL);
            if (selectedFile) {
                formData.append("material", selectedFile);
            }

            const response = await fetch('/addLecture', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error('Failed to add lecture');

            const newLecture = await response.json();
            const lectureHTML = `
                <div class="lecture-item" id="lecture-${newLecture.lectureID}">
                    <span class="toggle-lecture" onclick="toggleLecture('lecture-${newLecture.lectureID}')">➕</span>
                    <div class="lecture-title">Lecture: ${newLecture.Title}</div>
                    <div class="lecture-content" id="content-lecture-${newLecture.lectureID}">
                        <input type="text" placeholder="Lecture Title" class="lecture-input" value="${newLecture.Title}"><br>
                        ${
                            newLecture.DownloadableMaterialsURL
                                ? `<a href="${newLecture.DownloadableMaterialsURL}" target="_blank">Download Material</a><br>`
                                : ""
                        }
                        <input type="text" placeholder="YouTube Video URL" class="lecture-yt" value="${videoURL}"><br>
                        <div class="actions"> 
                            <button class="edit button" onclick="editLecture(${newLecture.lectureID})">Edit</button>
                            <button class="delete button" style="display: inline-block !important;" onclick="deleteLecture(${newLecture.lectureID}, ${moduleId})">Delete</button>
                        </div>
                    </div>
                </div>
            `;

            lecturesContainer.innerHTML += lectureHTML;
        };
    } catch (error) {
        console.error('Error adding lecture:', error);
    }
}

async function editLecture(lectureId) {
    try {
        const titleInput = document.querySelector(`#lecture-${lectureId} .lecture-input`);
        const newTitle = prompt("Enter new lecture title:", titleInput.value);

        if (!newTitle) return;

        const response = await fetch(`/lectures/${lectureId}`, {
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

        const response = await fetch(`/lectures/${lectureId}`, { method: 'DELETE' });

        if (!response.ok) throw new Error('Failed to delete lecture');
        document.getElementById(`lecture-${lectureId}`).remove();

    } catch (error) {
        console.error('Error deleting lecture:', error);
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
