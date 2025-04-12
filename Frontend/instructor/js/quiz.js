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
});

function getCourseIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("courseId");
}