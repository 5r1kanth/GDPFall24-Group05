document.addEventListener("DOMContentLoaded", () => {

    const signupForm = document.getElementById("signupForm");

    signupForm.addEventListener("submit", async (e) => {

    e.preventDefault();
    const role = document.querySelector('input[name="role"]:checked');
    if (!role) {
        alert("Please select a role!");
        return;
    }

    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const bio = document.getElementById('bio').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const profilePicture = document.getElementById('profile-pic').files[0];

    if (!role) {
        alert("Please select a role!");
        return;
    }

    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    console.log(`First Name: ${firstName}`);
    console.log(`Last Name: ${lastName}`);
    console.log(`Email: ${email}`);
    console.log(`Bio: ${bio}`);
    console.log(`Role: ${role.value}`);
    console.log(`Password: ${password}`);
    console.log(`Profile Picture: ${profilePicture ? profilePicture.name : "No file selected"}`);

    try {
        const formData = new FormData();
        formData.append("Firstname", firstName);
        formData.append("Lastname", lastName);
        formData.append("Email", email);
        formData.append("Bio", bio);
        formData.append("Role", role.value);
        formData.append("Password", password);
        if (profilePicture) {
            formData.append("ProfilePicture", profilePicture);
        }

        const response = await fetch(`http://localhost:8080/user/register`, {
            method: "POST",
            body: formData,
        });

        const result = await response.json();
        if (response.ok) {
            alert("Registration Successful: " + result.message);
            signupForm.reset();
            window.location.href="index.html";
        } else {
            alert("Error: " + result.error);
        }
    } catch (error) {
        console.error("Registration Error:", error);
    }
})

});


function previewImage(event) {
    const reader = new FileReader();
    reader.onload = function () {
        const output = document.getElementById('profile-preview');
        output.src = reader.result;
    };
    reader.readAsDataURL(event.target.files[0]);
}


const roleRadios = document.querySelectorAll('input[name="role"]');
roleRadios.forEach(radio => {
    radio.addEventListener('change', function () {
        roleRadios.forEach(r => r.parentElement.style.color = "#000");
        this.parentElement.style.color = "#007bff";
    });
});
