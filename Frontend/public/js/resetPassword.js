
const params = new URLSearchParams(window.location.search);
// const userRole = params.get("role");
const userToken = params.get("token");


document.getElementById("Form").addEventListener("submit", async function (e) {
    e.preventDefault();

    const resetButton = document.getElementById("btn");
    resetButton.disabled = true;

    const newPassword = document.getElementById("password").value.trim();
    const confirmNewPassword = document.getElementById("confirmPassword").value.trim();


    if (!newPassword || !confirmNewPassword) {
        alert("All fields are required!");
        resetButton.disabled = false;
        return;
    }

    if (newPassword.length < 6) {
        alert("Password must be at least 6 characters.");
        resetButton.disabled = false;
        return;
    }

    if (newPassword !== confirmNewPassword) {
        alert("Passwords do not match. Please try again.");
        resetButton.disabled = false;
        return;
    }

    try {
        const response = await fetch("/user/resetPassword/:user", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ role: "user", token: userToken, newPassword })
        });

        const data = await response.json();

        if (response.ok) {
            alert("Your password has been successfully reset!");
            console.log("Server Response:", data);
            window.location.href = "/index.html";
        } else {
            alert(`Error: ${data.error || "An unknown error occurred."}`);
        }
    } catch (err) {
        console.error("Error resetting password:", err);
        alert("An error occurred. Please try again later.");
    } finally {
        resetButton.disabled = false;
    }
});
