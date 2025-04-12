document.addEventListener("DOMContentLoaded", () => {

    const loginForm = document.getElementById("loginForm");

    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
  

        const formData = new FormData(loginForm);

        const data = Object.fromEntries(formData.entries());
        console.log(data)
        try {
            const response = await fetch(`http://localhost:8080/admin/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            if (response.ok) {
                alert("Response : " + result.message);
                localStorage.setItem("token", result.token);
                localStorage.setItem("username", result.username);
                localStorage.setItem("AdminID", result.userId);
                window.location.href="dashboard.html";
            } else {
                alert("Error: " + result.error);
            }
        } catch (error) {
            console.error("Login Error:", error);
        }
    });
});
