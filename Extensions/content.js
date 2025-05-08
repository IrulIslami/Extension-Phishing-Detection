// Deteksi ketika pengguna membuka email
function checkCurrentEmail() {
    const emailBody = document.querySelector('.email-body-selector'); // Selektor spesifik untuk Gmail/Outlook
    if (emailBody) {
      chrome.runtime.sendMessage({
        action: "checkCurrentEmail",
        text: emailBody.innerText
      }, (response) => {
        if (response.isPhishing) {
          showWarningBanner();
        }
      });
    }
  }
  
  function showWarningBanner() {
    const banner = document.createElement('div');
    banner.style = "background:red; color:white; padding:10px; text-align:center;";
    banner.textContent = "WARNING: This email may be phishing!";
    document.body.prepend(banner);
  }
  
  // Pantau perubahan DOM untuk email baru
  new MutationObserver(checkCurrentEmail)
    .observe(document.body, { childList: true, subtree: true });