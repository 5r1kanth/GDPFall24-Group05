document.addEventListener("DOMContentLoaded", () => {

    const loginForm = document.getElementById("loginForm");

    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const role = document.querySelector('input[name="role"]:checked');
        if (!role) {
            alert("Please select a role!");
            return;
        }
        
        const formData = new FormData(loginForm);
        formData.append('Role', role.value)
        const data = Object.fromEntries(formData.entries());

        let params;


        if (role.value === 'Student') params = 'user';
        else params = 'Instructor';
        console.log(data)
        try {
            const response = await fetch(`http://localhost:8080/user/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            if (response.ok) {
                alert("Response : " + result.message);
                localStorage.setItem("token", result.token);
                localStorage.setItem("username", result.username);
                localStorage.setItem("UserID", result.userId);
                if(result.role == 'Student') window.location.href="dashboard.html";
                else window.location.href="/instructor";
            } else {
                alert("Error: " + result.error);
            }
        } catch (error) {
            console.error("Login Error:", error);
        }
    });
});

const roleRadios = document.querySelectorAll('input[name="role"]');
roleRadios.forEach(radio => {
    radio.addEventListener('change', function () {
        roleRadios.forEach(r => r.parentElement.style.color = "#000");
        this.parentElement.style.color = "#007bff";
    });
});