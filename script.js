const fileInput = document.getElementById("fileInput");
const uploadBtn = document.getElementById("uploadBtn");
const previewImage = document.getElementById("previewImage");
const removeBgBtn = document.getElementById("removeBgBtn");
const downloadBtn = document.getElementById("downloadBtn");

// Upload button triggers file select
uploadBtn.addEventListener("click", () => fileInput.click());

// File selected → show preview + show remove button
fileInput.addEventListener("change", function () {
  const file = this.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    previewImage.src = e.target.result;
    previewImage.style.display = "block";
    removeBgBtn.style.display = "inline-block";
  };
  reader.readAsDataURL(file);
});

// Remove background & auto resize
removeBgBtn.addEventListener("click", async () => {
  const file = fileInput.files[0];
  if (!file) return;

  removeBgBtn.innerText = "Processing...";
  removeBgBtn.disabled = true;

  const formData = new FormData();
  formData.append("image_file", file);

  try {
    const response = await fetch("https://api.remove.bg/v1.0/removebg", {
      method: "POST",
      headers: {
        "X-Api-Key": "3w5gAgyJyRWPi48sFtg4krv3"
      },
      body: formData
    });

    if (!response.ok) throw new Error("API error");

    const blob = await response.blob();
    const img = new Image();
    img.onload = function() {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = 600;
      canvas.height = 600;

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      previewImage.src = canvas.toDataURL('image/png');
      previewImage.classList.add("glow");
      downloadBtn.style.display = "inline-block";
      removeBgBtn.innerText = "Remove Background";
      removeBgBtn.disabled = false;
    };
    img.src = URL.createObjectURL(blob);

  } catch (err) {
    alert("Background remove failed. Check your API key.");
    removeBgBtn.innerText = "Remove Background";
    removeBgBtn.disabled = false;
    console.error(err);
  }
});

// Download button
downloadBtn.addEventListener("click", () => {
  fetch(previewImage.src)
    .then(res => res.blob())
    .then(blob => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "passport_photo.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    })
    .catch(err => alert("Download failed. Try again."));
});
