var courses;
const searchInput = document.getElementById('searchCourse');
const courseContainer = document.getElementById('courses');
const dummyImages = {
    "Java": "https://assets.toptal.io/images?url=https%3A%2F%2Fbs-uploads.toptal.io%2Fblackfish-uploads%2Fcomponents%2Fskill_page%2F37948%2Flogo%2Foptimized%2Fjava-159dc900b04f34f2269ae8adb9a2a451.png",
    "Python": "https://freepngimg.com/thumb/categories/1402.png",
    "Web Development Bootcamp": "https://static.vecteezy.com/system/resources/thumbnails/009/298/359/small/3d-illustration-of-web-development-png.png",
    "Data Science with R": "https://media.licdn.com/dms/image/v2/C510BAQHSc9OTV0JK1Q/company-logo_200_200/company-logo_200_200/0/1630567959858/data_science_online_training_logo?e=2147483647&v=beta&t=cI5GoN-wr2en4eDOPWskYpWq2g-W82a6QSSiWZFkmbE",
    "Machine Learning Basics": "https://static.vecteezy.com/system/resources/thumbnails/019/038/692/small/business-team-creating-artificial-intelligence-machine-learning-and-artificial-intelligence-concept-png.png",
    "Android App Development": "https://media.licdn.com/dms/image/v2/C4E03AQHNErqi_99UeA/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1618582379926?e=2147483647&v=beta&t=_DmWmHVVpUFkkV82m6KrGhzVSJH7eow1kobvgczskfE",
    "Nodejs": "https://www.smartsight.in/wp-content/uploads/2021/09/NodeJS-768x448.jpg"
};

function searchCourses() {
    const term = searchInput.value.toLowerCase().trim();
    const courseContainer = document.getElementById('courses');
    courseContainer.innerHTML = '';

    if (!term) {
        courses.forEach(course => displayCourse(course));
        return;
    }

    const filtered = courses.filter(course => {
        const nameMatch = course.Title.toLowerCase().includes(term);
        const instructorMatch = (course.Instructor || 'Unknown').toLowerCase().includes(term);
        const categoryMatch = course.Category.toLowerCase().includes(term);
        
        return nameMatch || instructorMatch || categoryMatch;
    });

    if (filtered.length > 0) {
        filtered.forEach(course => displayCourse(course));
    } else {
        courseContainer.innerHTML = '<p class="no-results">No courses found matching your search.</p>';
       // courses.forEach(course => displayCourse(course));
    }
}

async function fetchCourses() {
    try {
        const response = await fetch(`/user/getEnrolledCourses/${localStorage.getItem('UserID')}`);

        if (!response.ok) {
            throw new Error('Failed to fetch courses');
        }

        const data = await response.json();
        courses = data.data;
       // console.log(courses);

        const courseContainer = document.getElementById('courses');
        courseContainer.innerHTML = '';

        courses.forEach((course) => {
            displayCourse(course)
        });
        

    } catch (error) {
        console.error('Error fetching courses:', error);
    }
}

function displayCourse(course){
    const courseCard = document.createElement('div');
    courseCard.classList.add('course-card');


    const courseImage = document.createElement('img');
    courseImage.classList.add('course-image');
    courseImage.src = dummyImages[course.Title] || "https://freepngimg.com/thumb/categories/1402.png";
    courseImage.height = "175";
    courseImage.width = "175";
    courseImage.alt = "Course Image";

    const courseName = document.createElement('div');
    courseName.classList.add('course-name');
    courseName.textContent = course.Title;

    const courseDesc = document.createElement('div');
    courseDesc.classList.add('course-desc');
    courseDesc.textContent = course.Description;

    const courseCategory = document.createElement('div');
    courseCategory.classList.add('course-category');
    courseCategory.textContent = `Category: ${course.Category}`;

    const courseLanguage = document.createElement('div');
    courseLanguage.classList.add('course-language');
    courseLanguage.textContent = `Language: ${course.Language}`;

    const courseInstructor = document.createElement('div');
    courseInstructor.classList.add('course-instructor');
    courseInstructor.textContent = `Instructor: ${course.Instructor || 'Unknown'}`;

    const enrollButton = document.createElement('button');
    enrollButton.classList.add('enroll-button');
    enrollButton.textContent = 'View Course';

    enrollButton.addEventListener('click', async () => { 
        window.location.href = `course.html?courseId=${course.CourseID}`;
    })

    courseCard.appendChild(courseImage);
    courseCard.appendChild(courseName);
    courseCard.appendChild(courseDesc);
    courseCard.appendChild(courseCategory);
    courseCard.appendChild(courseLanguage);
    courseCard.appendChild(courseInstructor);
    courseCard.appendChild(enrollButton);

    courseContainer.appendChild(courseCard);
}


document.addEventListener('DOMContentLoaded', fetchCourses);
searchInput.addEventListener('keyup', searchCourses);
