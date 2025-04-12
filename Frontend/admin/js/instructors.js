document.addEventListener("DOMContentLoaded", function () {
    const instructorsTableBody = document.getElementById("instructors-table-body");

    function fetchInstructors() {
        fetch("/admin/instructors")
            .then(response => response.json())
            .then(data => {
                if (!data.data || data.data.length === 0) {
                    instructorsTableBody.innerHTML = "<tr><td colspan='4' class='empty-message'>No instructors found.</td></tr>";
                    return;
                }
                console.log(data)

                instructorsTableBody.innerHTML = "";
                data.data.forEach((instructor, index) => {
                    const row = document.createElement("tr");

                    row.innerHTML = `
                        <td>${index + 1}</td>
                        <td>${instructor.Name}</td>
                        <td>${instructor.Email}</td>
                        <td>${formatCourses(instructor.Courses)}</td>
                        <td>
                            <button class="block-unblock-btn ${instructor.IsBlocked ? "unblock" : "block"}" data-id="${instructor.InstructorID}" data-status="${instructor.IsBlocked}">
                                ${instructor.IsBlocked ? "Activate" : "Deactivate"}
                            </button>
                        </td>
                    `;

                    instructorsTableBody.appendChild(row);
                });

                const blockUnblockButtons = document.querySelectorAll(".block-unblock-btn");
                blockUnblockButtons.forEach(button => {
                    button.addEventListener("click", handleBlockUnblock);
                });
            })
            .catch(error => {
                console.error("Error fetching instructors:", error);
                instructorsTableBody.innerHTML = "<tr><td colspan='4' class='error-message'>Error loading instructors.</td></tr>";
            });
    }

    function formatCourses(courses) {
        if (!courses || courses.length === 0) {
            return `<span class="no-courses">No courses assigned</span>`;
        }
        return courses.map(course => `<div class="course-item">${course}</div>`).join("");
    }

    function handleBlockUnblock(event) {
        const button = event.target;
        const instructorId = button.getAttribute("data-id");
        const currentStatus = button.getAttribute("data-status") === "true";

        fetch(`/admin/students/${instructorId}/block`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ isBlocked: !currentStatus })
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    button.textContent = !currentStatus ? "Activate" : "Deactivate";
                    button.setAttribute("data-status", !currentStatus);
                    button.classList.toggle("block", !currentStatus);
                    button.classList.toggle("unblock", currentStatus);
                } else {
                    alert("Failed to update instructor status.");
                }
            })
            .catch(error => {
                console.error("Error updating instructor status:", error);
                alert("An error occurred while updating the instructor status.");
            });
    }

    fetchInstructors();
});

function logout() {
    localStorage.removeItem("adminToken");
    window.location.href = "login.html";
}
