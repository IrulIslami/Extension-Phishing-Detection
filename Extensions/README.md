# Phishing Email Detector Chrome Extension

This Chrome extension analyzes email content to detect potential phishing attempts. It can be used in two ways:
1. Through the popup interface, where you can paste email content for analysis
2. Automatically when browsing Gmail or Outlook webmail, where it checks emails as you read them

## Features

- Analyzes email content for common phishing indicators
- Displays a warning banner for suspicious emails
- Shows detailed analysis of detected features
- Works with Gmail and Outlook webmail
- Simple and intuitive interface

## Installation

1. **Create the extension directory structure:**
   - Create a new folder for your extension
   - Add all the provided files to this folder

2. **Add icon files:**
   - Create an `icons` folder
   - Add three icon files: `icon16.png`, `icon48.png`, and `icon128.png`

3. **Load the extension in Chrome:**
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" in the top-right corner
   - Click "Load unpacked" and select your extension folder

## How It Works

### Background Script (background.js)
The background script contains the core logic for analyzing emails. It:
- Extracts relevant features from email text
- Applies a classification algorithm to detect phishing attempts
- Returns the results to the popup or content script

### Popup (popup.html, popup.js, popup.css)
The popup provides a user interface for:
- Pasting email content for analysis
- Displaying results (safe or phishing)
- Showing detailed analysis of detected features

### Content Script (content.js)
The content script automatically analyzes emails in Gmail and Outlook by:
- Detecting when an email is opened
- Extracting the email content
- Sending it to the background script for analysis
- Displaying a warning banner for suspicious emails

## Implementing Your Machine Learning Model

### Option 1: Use the Built-in Rule-Based Model
The extension currently uses a simplified rule-based approach that scores emails based on common phishing indicators.

### Option 2: Integrate Your .pkl Model

To use your actual .pkl model, you'll need to:

1. **Convert your model to a JavaScript-compatible format:**
   - Use tools like ONNX.js or TensorFlow.js to convert your model
   - Save the converted model in your extension directory

2. **Update the background.js file:**
   - Replace the current classification logic with code that loads and uses your converted model

3. **Example using TensorFlow.js:**
   ```javascript
   // Load the model
   async function loadModel() {
     const model = await tf.loadLayersModel('model/model.json');
     return model;
   }

   // Make predictions
   async function predict(features) {
     const tensor = tf.tensor([Object.values(features)]);
     const prediction = await model.predict(tensor);
     const isPhishing = prediction.dataSync()[0] > 0.5;
     return { isPhishing, features };
   }
   ```

