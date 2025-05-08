document.getElementById('checkPhishing').addEventListener('click', async () => {
    const emailText = document.getElementById('emailText').value;
    const resultDiv = document.getElementById('result');
    const button = document.getElementById('checkPhishing');
    
    if (!emailText) {
      resultDiv.textContent = "Please enter email text";
      resultDiv.style.color = "black";
      return;
    }
  
    // Tampilkan loading
    button.disabled = true;
    button.innerHTML = '<div class="loader"></div> Analyzing...';
    
    try {
      const response = await chrome.runtime.sendMessage({
        action: "checkPhishing",
        text: emailText
      });
  
      if (response.isPhishing) {
        resultDiv.innerHTML = "<strong>⚠️ PHISHING DETECTED!</strong>";
        resultDiv.style.backgroundColor = "#fce8e6";
        resultDiv.style.color = "#d93025";
      } else {
        resultDiv.innerHTML = "<strong>✓ Legitimate email</strong>";
        resultDiv.style.backgroundColor = "#e6f4ea";
        resultDiv.style.color = "#137333";
      }
    } catch (error) {
      resultDiv.innerHTML = "Error analyzing email";
      resultDiv.style.color = "black";
    } finally {
      button.disabled = false;
      button.textContent = "Check Email";
    }
  });