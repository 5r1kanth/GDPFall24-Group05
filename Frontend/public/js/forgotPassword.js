document.addEventListener("DOMContentLoaded", () => {

    const loginForm = document.getElementById("Form");

    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const role = document.querySelector('input[name="role"]:checked');
        if (!role) {
            alert("Please select a role!");
            return;
        }
        
        const email = document.getElementById('email').value;

        let params;

        const data = {email : email}

        if (role.value === 'Student') params = 'user';
        else params = 'instructor';
        console.log(data)
        try {
            const response = await fetch(`user/forgotPassword/${params}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            if (response.ok) {
                alert("Response : " + result.message);
                window.location.href = "/index.html"
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