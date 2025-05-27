console.log("✅ External script loaded");

document.addEventListener('DOMContentLoaded', function () {
  const extractButton = document.getElementById('extractButton');
  const inputField = document.getElementById('safeUrlInput');
  const resultDiv = document.getElementById('result');

  if (!extractButton) {
    console.log("❌ Extract button not found!");
    return;
  }

  console.log("✅ Extract button found");

  extractButton.addEventListener('click', function () {
    console.log("🔍 Button clicked");
    const inputValue = inputField.value.trim();
    console.log("📥 Input value:", inputValue);
    resultDiv.innerHTML = '';

    try {
      const url = new URL(inputValue);
      const params = new URLSearchParams(url.search);
      const originalUrl = params.get('url');
      console.log("🔓 Extracted URL param:", originalUrl);

      if (originalUrl) {
        const decodedUrl = decodeURIComponent(originalUrl);
        const link = document.createElement('a');
        link.href = decodedUrl;
        link.textContent = 'Open original link';
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        resultDiv.appendChild(link);
      } else {
        resultDiv.textContent = 'No valid \"url\" parameter found.';
      }
    } catch (err) {
      resultDiv.textContent = 'Please enter a valid SafeLinks URL.';
      console.log("❌ Error parsing input:", err);
    }
  });
});
