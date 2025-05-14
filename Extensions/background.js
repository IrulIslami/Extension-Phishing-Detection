// Bisa digunakan untuk logika tambahan
chrome.runtime.onInstalled.addListener(() => {
  console.log('Phishing Detector extension installed');
});

// Contoh: Deteksi saat pengguna membuka halaman email
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url.includes('mail.google.com')) {
      console.log('Gmail tab detected');
      // Bisa tambahkan logika khusus untuk Gmail
  }
});