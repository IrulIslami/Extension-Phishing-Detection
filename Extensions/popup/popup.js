document.addEventListener('DOMContentLoaded', function() {
  const checkButton = document.getElementById('checkButton');
  const emailContent = document.getElementById('emailContent');
  const resultContainer = document.getElementById('resultContainer');
  const resultText = document.getElementById('resultText');
  const confidenceText = document.getElementById('confidenceText');
  const loadingIndicator = document.getElementById('loadingIndicator');

  checkButton.addEventListener('click', async function() {
      const emailText = emailContent.value.trim();
      
      if (!emailText) {
          alert('Please paste email content first');
          return;
      }

      // Tampilkan loading indicator
      loadingIndicator.style.display = 'block';
      resultContainer.style.display = 'none';

      try {
          const response = await fetch('http://localhost:5000/predict', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ email_text: emailText }),
          });

          if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          
          // Sembunyikan loading indicator
          loadingIndicator.style.display = 'none';
          
          // Tampilkan hasil
          resultContainer.className = data.prediction === 0 ? 'result safe' : 'result phishing';
          resultText.textContent = data.prediction === 0 
              ? 'This email appears to be SAFE' 
              : 'WARNING: This email may be PHISHING!';
              
          confidenceText.textContent = `Confidence: ${(data.probability * 100).toFixed(2)}%`;
          resultContainer.style.display = 'block';

      } catch (error) {
        console.error('Error:', error);
        // Tambahkan ini untuk melihat response server jika ada
        if (error.response) {
            const errorData = await error.response.json();
            console.log("Server response:", errorData);
        }
        loadingIndicator.style.display = 'none';
        alert(`Error: ${error.message}. Check console for details.`);
    }
  });

  // Fitur tambahan: Tombol untuk menempelkan dari clipboard
  emailContent.addEventListener('click', async function() {
      try {
          const text = await navigator.clipboard.readText();
          emailContent.value = text;
      } catch (err) {
          console.log('Failed to read clipboard contents: ', err);
      }
  });
});