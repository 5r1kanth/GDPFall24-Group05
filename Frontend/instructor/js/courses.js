
const form = document.getElementById('create-course-form');
const userId = localStorage.getItem('UserID');

form.addEventListener('submit', async (event) => {
    event.preventDefault(); 

    const formData = new FormData(form);
    formData.append('UserID', userId);
    const data = Object.fromEntries(formData.entries());
    try {

        const response = await fetch('/instructor/createCourse', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            const result = await response.json();
            alert('Course created successfully: ' + result.message);
            fetchCourses()
        } else {
            alert('Failed to create course. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while creating the course.');
    }
});


async function fetchCourses() {
    try {
        const response = await fetch(`/instructor/getInstructorCourses/${userId}`);
        console.log(response);

        if (!response.ok) {
            throw new Error('Failed to fetch courses');
        }
        
        const data = await response.json();
        console.log(data)
        const tbody = document.getElementById('tbody');
        tbody.innerHTML = '';
        const courses = data.data;
        console.log(courses);
        courses.forEach((course) => {
            const row = document.createElement('tr');
        
            const titleCell = document.createElement('td');
            titleCell.textContent = course.Title;
        
            const categoryCell = document.createElement('td');
            categoryCell.textContent = course.Category;
        
            const languageCell = document.createElement('td');
            languageCell.textContent = course.Language;
        
            const descriptionCell = document.createElement('td');
            descriptionCell.textContent = course.Description;
        
            const actionCell = document.createElement('td');
            const editButton = document.createElement('button');
            editButton.textContent = "Edit";
            editButton.classList.add("edit-btn");
        
            editButton.addEventListener("click", () => {
                window.location.href = `editcourse.html?courseId=${course.CourseID}`;
            });
        
            actionCell.appendChild(editButton);
        
     
            row.appendChild(titleCell);
            row.appendChild(categoryCell);
            row.appendChild(languageCell);
            row.appendChild(descriptionCell);
            row.appendChild(actionCell); 
        
            tbody.appendChild(row);
        });
        
    } catch (error) {
        console.error('Error fetching courses:', error);
    }
}

document.addEventListener('DOMContentLoaded', fetchCourses);
