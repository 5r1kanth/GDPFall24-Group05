document.addEventListener("DOMContentLoaded", function () {
    const studentsTableBody = document.getElementById("students-table-body");

    function fetchStudents() {
        fetch("/admin/students")
            .then(response => response.json())
            .then(data => {
                if (!data.data || data.data.length === 0) {
                    studentsTableBody.innerHTML = "<tr><td colspan='5' class='empty-message'>No students found.</td></tr>";
                    return;
                }
                console.log(data)

                studentsTableBody.innerHTML = "";
                data.data.forEach((student, index) => {
                    const row = document.createElement("tr");

                    row.innerHTML = `
                        <td>${index + 1}</td>
                        <td>${student.Name}</td>
                        <td>${student.Email}</td>
                        <td>${formatCourses(student.EnrolledCourses)}</td>
                        <td>
                            <button class="block-unblock-btn ${student.IsBlocked ? "unblock" : "block"}" data-id="${student.StudentID}" data-status="${student.IsBlocked}">
                                ${student.IsBlocked ? "Activate" : "Deactivate"}
                            </button>
                        </td>
                    `;

                    studentsTableBody.appendChild(row);
                });

                const blockUnblockButtons = document.querySelectorAll(".block-unblock-btn");
                blockUnblockButtons.forEach(button => {
                    button.addEventListener("click", handleBlockUnblock);
                });
            })
            .catch(error => {
                console.error("Error fetching students:", error);
                studentsTableBody.innerHTML = "<tr><td colspan='5' class='error-message'>Error loading students.</td></tr>";
            });
    }

    function formatCourses(courses) {
        if (courses.length === 0) {
            return `<span class="no-courses">Not enrolled</span>`;
        }
        return courses.map(course => `<div class="course-item">${course.CourseName} <span class="instructor">(${course.Instructor})</span></div>`).join("");
    }

    function handleBlockUnblock(event) {
        const button = event.target;
        const studentId = button.getAttribute("data-id");
        const currentStatus = button.getAttribute("data-status") === "true";

        fetch(`/admin/students/${studentId}/block`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ isBlocked: !currentStatus })
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    button.textContent = !currentStatus ? "Activate" : "Deactivate";
                    button.setAttribute("data-status", !currentStatus);
                } else {
                    alert("Failed to update student status.");
                }
            })
            .catch(error => {
                console.error("Error updating student status:", error);
                alert("An error occurred while updating the student status.");
            });
    }

    fetchStudents();
});

function logout() {
    localStorage.removeItem("adminToken");
    window.location.href = "login.html";
}
