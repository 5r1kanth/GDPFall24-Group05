const studentTable = document.getElementById('studentEnrollments')
const userId = localStorage.getItem('UserID');

async function fetchEnrollments() {
    try {
        const response = await fetch(`/instructor/getEnrolledStudents/${userId}`);
        console.log(response);

        if (!response.ok) {
            throw new Error('Failed to fetch enrollments');
        }
        
        const data = await response.json();
        console.log(data);
        studentTable.innerHTML = '';
        const enrollments = data.data;
        console.log(enrollments);
        enrollments.forEach((enrollment) => {
            let date = new Date(enrollment.EnrollmentDate);
            let formattedDate = `${(date.getUTCMonth() + 1)
                .toString()
                .padStart(2, '0')}-${date.getUTCDate().toString().padStart(2, '0')}-${date.getUTCFullYear()}`;

            let template = `
            <tr>
                <td>${enrollment.StudentName}</td>
                <td>${enrollment.email}</td>
                <td>${formattedDate}</td>
                <td>${enrollment.CourseName}</td>
                <td>${enrollment.CourseCategory}</td>
                <td>${enrollment.CourseLanguage}</td>
            </tr>`;

        
            studentTable.innerHTML += template;
        });
        
    } catch (error) {
        console.error('Error fetching enrollments:', error);
    }
}

document.addEventListener('DOMContentLoaded', fetchEnrollments);