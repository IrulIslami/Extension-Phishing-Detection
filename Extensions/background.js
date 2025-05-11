// Variabel untuk model ML
let model;

// Fungsi mock loading model (implementasi aktual tergantung format model)
async function loadModel() {

  return {
    predict: (text) => {
      // Implementasi prediksi aktual akan diisi di sini
      console.log("Analyzing:", text.substring(0, 50) + "...");
      return Math.random() > 0.5; // Mock prediction
    }
  };
}

// Load model saat ekstensi diinisialisasi
loadModel().then(loadedModel => {
  model = loadedModel;
});

// Handler untuk pesan dari popup/content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "checkPhishing") {
    const prediction = model.predict(request.text);
    sendResponse({ isPhishing: prediction });
  }
  return true; // Diperlukan untuk response async
});