// Complete popup.js file with animated 3/4 circle gauge and dynamic color change

document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const initialView = document.getElementById('initialView');
    const inputView = document.getElementById('inputView');
    const resultView = document.getElementById('resultView');
    const startButton = document.getElementById('startButton');
    const detectButton = document.getElementById('detectButton');
    const finishButton = document.getElementById('finishButton');
    const emailContent = document.getElementById('emailContent');
    const gaugeContainer = document.getElementById('gaugeContainer');
    const percentageDisplay = document.getElementById('percentageDisplay');
    
    // Set initial state
    initialView.style.display = 'flex';
    inputView.style.display = 'none';
    resultView.style.display = 'none';

    finishButton.style.width = "160px";
    finishButton.style.display = "block";
    finishButton.style.margin = "0 auto";
    
    // Event listeners
    startButton.addEventListener('click', function() {
        initialView.style.display = 'none';
        inputView.style.display = 'block';
    });
    
    detectButton.addEventListener('click', async function() {
        if (!emailContent.value.trim()) {
            alert('Please paste email content first');
            return;
        }
        
        try {
            // Simulate loading
            detectButton.textContent = "ANALYZING...";
            detectButton.disabled = true;
            
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // For demo - random percentage
            const percentage = Math.floor(Math.random() * 100);
            percentageDisplay.textContent = percentage + '%';
            
            // Generate the gauge
            generateGauge(percentage);
            
            // Show result view
            inputView.style.display = 'none';
            resultView.style.display = 'block';
            
            // Reset button
            detectButton.textContent = "DETECT";
            detectButton.disabled = false;
            
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
            detectButton.textContent = "DETECT";
            detectButton.disabled = false;
        }
    });
    
    finishButton.addEventListener('click', function() {
        // Reset and go back to input view
        emailContent.value = '';
        inputView.style.display = 'block';
        resultView.style.display = 'none';
    });
    
    // Helper function to get color based on percentage
    function getColorForPercentage(percent) {
        if (percent < 30) {
            return "#4CAF50"; // Green for low risk
        } else if (percent < 60) {
            return "#FFC107"; // Amber for medium risk
        } else {
            return "#E53935"; // Red for high risk
        }
    }
    
    // Animated gauge implementation using manual SVG and stroke-dasharray
    function generateGauge(percentage) {
        // Clear previous gauge
        gaugeContainer.innerHTML = '';
        
        // Create SVG element
        const svgNS = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(svgNS, "svg");
        svg.setAttribute("width", "200");
        svg.setAttribute("height", "150");
        svg.setAttribute("viewBox", "0 0 200 150");
        svg.style.position = "relative";
        svg.style.zIndex = "10";
        
        // Center of the gauge
        const centerX = 100;
        const centerY = 90;
        const radius = 70;
        
        // Calculate coordinates for the 3/4 circle arc (270 degrees)
        // Starting at top-left (135 degrees), ending at top-right (45 degrees)
        const startAngleRad = Math.PI * (135 / 180);
        const endAngleRad = Math.PI * (45 / 180);
        
        const startX = centerX + radius * Math.cos(startAngleRad);
        const startY = centerY + radius * Math.sin(startAngleRad);
        const endX = centerX + radius * Math.cos(endAngleRad);
        const endY = centerY + radius * Math.sin(endAngleRad);
        
        // Create the background arc (gray)
        const backgroundArc = document.createElementNS(svgNS, "path");
        // Define the path for a 270-degree arc (3/4 circle)
        backgroundArc.setAttribute("d", `M ${startX},${startY} A ${radius},${radius} 0 1,1 ${endX},${endY}`);
        backgroundArc.setAttribute("fill", "none");
        backgroundArc.setAttribute("stroke", "#dddddd");
        backgroundArc.setAttribute("stroke-width", "20");
        backgroundArc.setAttribute("stroke-linecap", "round");
        svg.appendChild(backgroundArc);
        
        // Calculate the path length of the 270-degree arc
        const circumference = 2 * Math.PI * radius;
        const arcLength = (270 / 360) * circumference; // Length of a 270-degree arc
        
        // Create the colored arc (initially at 0%)
        const coloredArc = document.createElementNS(svgNS, "path");
        coloredArc.setAttribute("d", `M ${startX},${startY} A ${radius},${radius} 0 1,1 ${endX},${endY}`);
        coloredArc.setAttribute("fill", "none");
        coloredArc.setAttribute("stroke-width", "20");
        coloredArc.setAttribute("stroke-linecap", "round");
        
        // Initial value is 0
        coloredArc.setAttribute("stroke-dasharray", `0 ${arcLength}`);
        
        // Set initial color (will be updated during animation)
        coloredArc.setAttribute("stroke", getColorForPercentage(0));
        svg.appendChild(coloredArc);
        
        // Add percentage text to the center of the gauge (initially showing 0%)
        const percentageText = document.createElementNS(svgNS, "text");
        percentageText.setAttribute("x", centerX);
        percentageText.setAttribute("y", centerY);
        percentageText.setAttribute("text-anchor", "middle");
        percentageText.setAttribute("dominant-baseline", "middle");
        percentageText.setAttribute("font-size", "24px");
        percentageText.setAttribute("font-weight", "bold");
        percentageText.setAttribute("fill", "#666666");
        percentageText.setAttribute("font-family", "Roboto, sans-serif");
        percentageText.textContent = "0%";
        svg.appendChild(percentageText);

        // Hide the original percentage display
        percentageDisplay.style.display = "none";
        
        // Add SVG to container
        gaugeContainer.appendChild(svg);
        
        // Animate the gauge
        let currentPercentage = 0;
        const animationDuration = 1500; // milliseconds
        const startTime = performance.now();
        let prevColor = getColorForPercentage(0);
        
        function animateGauge(currentTime) {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / animationDuration, 1);
            
            currentPercentage = Math.floor(progress * percentage);
            
            // Update the colored arc
            const coloredLength = (currentPercentage / 100) * arcLength;
            coloredArc.setAttribute("stroke-dasharray", `${coloredLength} ${arcLength - coloredLength}`);
            
            // Update color based on current percentage
            const currentColor = getColorForPercentage(currentPercentage);
            if (currentColor !== prevColor) {
                coloredArc.setAttribute("stroke", currentColor);
                prevColor = currentColor;
            }
            
            // Update the percentage text
            percentageText.textContent = currentPercentage + "%";
            
            if (progress < 1) {
                requestAnimationFrame(animateGauge);
            } else {
                // Ensure final state is exactly at target percentage
                const finalColoredLength = (percentage / 100) * arcLength;
                coloredArc.setAttribute("stroke-dasharray", `${finalColoredLength} ${arcLength - finalColoredLength}`);
                coloredArc.setAttribute("stroke", getColorForPercentage(percentage));
                percentageText.textContent = percentage + "%";
            }
        }
        
        requestAnimationFrame(animateGauge);
    }
    
    // Feature to paste from clipboard when clicking the textarea
    emailContent.addEventListener('click', async function() {
        if (emailContent.value.trim() === '') {
            try {
                const text = await navigator.clipboard.readText();
                emailContent.value = text;
            } catch (err) {
                console.log('Failed to read clipboard contents: ', err);
            }
        }
    });
    
    // Generate initial gauge with demo value (67%)
    generateGauge(67);
});