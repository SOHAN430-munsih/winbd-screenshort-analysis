
function extractText() {
  const imageInput = document.getElementById('imageInput');
  const output = document.getElementById('output');
  const preview = document.getElementById('preview');

  if (imageInput.files.length === 0) {
    output.innerText = "Please upload an image first.";
    return;
  }

  const file = imageInput.files[0];
  const reader = new FileReader();

  reader.onload = function (e) {
    preview.src = e.target.result;
    preview.style.display = "block";

    Tesseract.recognize(e.target.result, 'eng').then(({ data: { text } }) => {
      const numbers = text.match(/\d+\.\d+/g) || [];
      output.innerHTML = "<strong>Extracted Multipliers:</strong><br>" + numbers.join(", ");

      if (numbers.length >= 10) {
        const last10 = numbers.slice(-10);
        const avg = last10.reduce((sum, n) => sum + parseFloat(n), 0) / last10.length;
        output.innerHTML += `<br><br><strong>Prediction:</strong> ${avg > 2.0 ? "🟢 High chance" : "🔴 Low chance"}`;
      } else {
        output.innerHTML += "<br><br>Need at least 10 multipliers for prediction.";
      }
    });
  };
  reader.readAsDataURL(file);
}
