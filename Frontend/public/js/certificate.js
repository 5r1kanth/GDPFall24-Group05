function generateCertificate(studentName, courseTitle) {
    console.log(studentName, courseTitle)
    openModal();
    const canvas = document.getElementById('certificateCanvas');
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = "#fdfdfd";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "#333";
    ctx.lineWidth = 8;
    ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

    ctx.fillStyle = "#2c3e50";
    ctx.font = "bold 40px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Certificate of Completion", canvas.width / 2, 150);

    ctx.font = "20px Arial";
    ctx.fillText("This certifies that", canvas.width / 2, 230);

    ctx.font = "bold 35px Arial";
    ctx.fillStyle = "#27ae60";
    ctx.fillText(studentName, canvas.width / 2, 290);

    ctx.font = "20px Arial";
    ctx.fillStyle = "#34495e";
    ctx.fillText(`has successfully completed the course`, canvas.width / 2, 340);
    ctx.font = "italic 28px Arial";
    ctx.fillStyle = "#2980b9";
    ctx.fillText(`"${courseTitle}"`, canvas.width / 2, 390);

    ctx.font = "16px Arial";
    ctx.fillStyle = "#7f8c8d";
    const date = new Date().toLocaleDateString();
    ctx.fillText(`Date: ${date}`, canvas.width - 150, canvas.height - 60);

    const downloadBtn = document.createElement("button");
    downloadBtn.innerText = "Download Certificate";
    downloadBtn.style.marginTop = "10px";
    downloadBtn.onclick = function () {
        const image = canvas.toDataURL("image/png");
        const link = document.createElement('a');
        link.download = `${studentName}-certificate.png`;
        link.href = image;
        link.click();
    };

    document.body.appendChild(downloadBtn);
}
