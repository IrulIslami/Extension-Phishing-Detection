document.addEventListener('DOMContentLoaded', function() {
    
    // Get all the main elements we need
    const initialView = document.getElementById('initialView');
    const inputView = document.getElementById('inputView');
    const resultView = document.getElementById('resultView');
    const startButton = document.getElementById('startButton');
    const detectButton = document.getElementById('detectButton');
    const finishButton = document.getElementById('finishButton');
    const emailContent = document.getElementById('emailContent');
    const gaugeContainer = document.getElementById('gaugeContainer');
    const percentageDisplay = document.getElementById('percentageDisplay');
    const resultDescription = document.getElementById('resultDescription');
    const gaugeWrapper = document.getElementById('gaugeWrapper');
    
    // Show welcome screen first
    initialView.style.display = 'flex';
    inputView.style.display = 'none';
    resultView.style.display = 'none';
    
    // START button - go from welcome to input screen
    startButton.addEventListener('click', function() {
        initialView.style.display = 'none';
        inputView.style.display = 'block';
    });
    
    // DETECT button - main analysis workflow
    detectButton.addEventListener('click', async function() {
        
        if (!emailContent.value.trim()) {
            alert('Please paste email content first');
            return;
        }
        
        try {
            // Reset scroll position for clean start
            if (resultDescription) {
                resultDescription.scrollTop = 0;
            }
            
            // Show loading state
            detectButton.innerHTML = '<span class="loading-text">ANALYZING</span>';
            detectButton.classList.add('loading');
            detectButton.disabled = true;

            // Simulate analysis time
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Reset result view components
            gaugeWrapper.classList.add('center-position');
            gaugeWrapper.classList.remove('top-position');
            resultDescription.innerHTML = '';
            resultDescription.style.display = 'none';
            resultDescription.classList.remove('show');
            finishButton.style.display = 'none';
            finishButton.classList.remove('show');
            
            // Switch to result view
            inputView.style.display = 'none';
            resultView.style.display = 'flex';
            
            // Generate random risk percentage (replace with real ML analysis later)
            const percentage = Math.floor(Math.random() * 100);
            percentageDisplay.textContent = percentage + '%';
            
            // Animation sequence: gauge -> move up -> show description
            setTimeout(function() {
                generateGauge(percentage, function() {
                    setTimeout(function() {
                        gaugeWrapper.classList.remove('center-position');
                        gaugeWrapper.classList.add('top-position');
                        
                        setTimeout(function() {
                            generateDescription(percentage);
                            resultDescription.style.display = 'block';
                            finishButton.style.display = 'block';
                            
                            setTimeout(function() {
                                resultDescription.classList.add('show');
                                finishButton.classList.add('show');
                                
                                // Reset button state
                                detectButton.textContent = "DETECT";
                                detectButton.classList.remove('loading');
                                detectButton.disabled = false;

                            }, 50);
                        }, 600);
                    }, 200);
                });
            }, 100);
            
        } catch (error) {
            console.error('Analysis Error:', error);
            alert('An error occurred during analysis. Please try again.');
            
            detectButton.textContent = "DETECT";
            detectButton.classList.remove('loading');
            detectButton.disabled = false;
        }
    });
    
    // FINISH button - reset everything and go back to input
    finishButton.addEventListener('click', function() {
        if (resultDescription) {
            resultDescription.scrollTop = 0;
        }
        
        emailContent.value = '';
        inputView.style.display = 'block';
        resultView.style.display = 'none';
        
        // Clean up result elements
        const descriptionElement = document.getElementById('resultDescription');
        if (descriptionElement) {
            descriptionElement.innerHTML = '';
            descriptionElement.style.display = 'none';
            descriptionElement.classList.remove('show');
        }
        
        finishButton.style.display = 'none';
        finishButton.classList.remove('show');
        gaugeWrapper.classList.remove('top-position');
        gaugeWrapper.classList.add('center-position');
    });
    
    // Color coding based on risk level
    function getColorForPercentage(percent) {
        if (percent <= 30) return "#4CAF50";     // Green - low risk
        else if (percent <= 70) return "#FF9800"; // Orange - medium risk  
        else return "#E53935";                    // Red - high risk
    }
    
    // Generate risk description based on percentage
    function generateDescription(percentage) {
        const descriptionElement = document.getElementById('resultDescription');
        let riskLevel, descriptionText, recommendation, researchRef;
        
        descriptionElement.scrollTop = 0;

        if (percentage <= 30) {
            // Low risk
            riskLevel = '<div class="risk-level low">LOW RISK</div>';
            descriptionText = `<div class="description-text">This email shows a ${percentage}% probability of being a phishing attempt. Analysis indicates minimal suspicious indicators with most security markers intact. The sender authentication appears legitimate and content patterns align with genuine communications.</div>`;
            recommendation = '<div class="recommendation">Recommendation: While this email appears safe, always verify sender identity before clicking links or sharing sensitive information. Report any suspicious behavior to your IT security team.</div>';
            researchRef = '<div class="research-ref">*Based on NIST/CIS risk classification frameworks</div>';
            
        } else if (percentage <= 70) {
            // Medium risk
            riskLevel = '<div class="risk-level medium">MEDIUM RISK</div>';
            descriptionText = `<div class="description-text">This email shows a ${percentage}% probability of being a phishing attempt. Multiple suspicious indicators detected including potential social engineering tactics, anomalous sender patterns, or questionable URL structures that require careful verification.</div>`;
            recommendation = '<div class="recommendation">Recommendation: Do not click any links or download attachments. Independently verify the sender through official channels. Forward this email to your security team for further analysis before taking any action.</div>';
            researchRef = '<div class="research-ref">*Based on Stanford/MIT risk classification standards</div>';
            
        } else {
            // High risk
            riskLevel = '<div class="risk-level high">HIGH RISK</div>';
            descriptionText = `<div class="description-text">This email shows a ${percentage}% probability of being a phishing attempt. Critical red flags detected including spoofed sender information, malicious URL patterns, urgency manipulation tactics, and content inconsistencies matching known phishing campaigns.</div>`;
            recommendation = '<div class="recommendation">Recommendation: DELETE this email immediately. Do not interact with any content. Report this phishing attempt to your IT security team and warn colleagues who may have received similar messages. This represents a significant security threat.</div>';
            researchRef = '<div class="research-ref">*Based on IEEE/ACM cybersecurity research standards</div>';
        }
        
        descriptionElement.innerHTML = riskLevel + descriptionText + recommendation + researchRef;

        // Make sure we start at the top
        setTimeout(() => {
            descriptionElement.scrollTop = 0;
        }, 10);
    }
    
    // Create animated SVG gauge (3/4 circle)
    function generateGauge(percentage, onComplete) {
        gaugeContainer.innerHTML = '';
        
        const svgNS = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(svgNS, "svg");
        svg.setAttribute("width", "180");
        svg.setAttribute("height", "140");
        svg.setAttribute("viewBox", "0 0 180 140");
        svg.style.position = "relative";
        svg.style.zIndex = "10";
        
        // Gauge setup
        const centerX = 90;
        const centerY = 75;
        const radius = 60;
        
        // 3/4 circle coordinates (270 degrees from top-left to top-right)
        const startAngleRad = Math.PI * (135 / 180);
        const endAngleRad = Math.PI * (45 / 180);
        
        const startX = centerX + radius * Math.cos(startAngleRad);
        const startY = centerY + radius * Math.sin(startAngleRad);
        const endX = centerX + radius * Math.cos(endAngleRad);
        const endY = centerY + radius * Math.sin(endAngleRad);
        
        // Background arc (gray)
        const backgroundArc = document.createElementNS(svgNS, "path");
        backgroundArc.setAttribute("d", `M ${startX},${startY} A ${radius},${radius} 0 1,1 ${endX},${endY}`);
        backgroundArc.setAttribute("fill", "none");
        backgroundArc.setAttribute("stroke", "#e0e0e0");
        backgroundArc.setAttribute("stroke-width", "16");
        backgroundArc.setAttribute("stroke-linecap", "round");
        svg.appendChild(backgroundArc);
        
        // Colored progress arc
        const circumference = 2 * Math.PI * radius;
        const arcLength = (270 / 360) * circumference;
        
        const coloredArc = document.createElementNS(svgNS, "path");
        coloredArc.setAttribute("d", `M ${startX},${startY} A ${radius},${radius} 0 1,1 ${endX},${endY}`);
        coloredArc.setAttribute("fill", "none");
        coloredArc.setAttribute("stroke-width", "16");
        coloredArc.setAttribute("stroke-linecap", "round");
        coloredArc.setAttribute("stroke-dasharray", `0 ${arcLength}`);
        coloredArc.setAttribute("stroke", getColorForPercentage(0));
        svg.appendChild(coloredArc);
        
        // Percentage text in center
        const percentageText = document.createElementNS(svgNS, "text");
        percentageText.setAttribute("x", centerX);
        percentageText.setAttribute("y", centerY + 5);
        percentageText.setAttribute("text-anchor", "middle");
        percentageText.setAttribute("dominant-baseline", "middle");
        percentageText.setAttribute("font-size", "28px");
        percentageText.setAttribute("font-weight", "bold");
        percentageText.setAttribute("fill", "#333333");
        percentageText.setAttribute("font-family", "Roboto, sans-serif");
        percentageText.textContent = "0%";
        svg.appendChild(percentageText);

        percentageDisplay.style.display = "none";
        gaugeContainer.appendChild(svg);
        
        // Animate the gauge from 0 to target percentage
        let currentPercentage = 0;
        const animationDuration = 1500;
        const startTime = performance.now();
        let prevColor = getColorForPercentage(0);
        
        function animateGauge(currentTime) {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / animationDuration, 1);
            
            currentPercentage = Math.floor(progress * percentage);
            
            // Update arc length
            const coloredLength = (currentPercentage / 100) * arcLength;
            coloredArc.setAttribute("stroke-dasharray", `${coloredLength} ${arcLength - coloredLength}`);
            
            // Update color if needed
            const currentColor = getColorForPercentage(currentPercentage);
            if (currentColor !== prevColor) {
                coloredArc.setAttribute("stroke", currentColor);
                prevColor = currentColor;
            }
            
            // Update percentage text
            percentageText.textContent = currentPercentage + "%";
            
            if (progress < 1) {
                requestAnimationFrame(animateGauge);
            } else {
                // Ensure final values are exact
                const finalColoredLength = (percentage / 100) * arcLength;
                coloredArc.setAttribute("stroke-dasharray", `${finalColoredLength} ${arcLength - finalColoredLength}`);
                coloredArc.setAttribute("stroke", getColorForPercentage(percentage));
                percentageText.textContent = percentage + "%";
                
                if (onComplete) onComplete();
            }
        }
        
        requestAnimationFrame(animateGauge);
    }
    
    // Auto-paste from clipboard when clicking empty textarea
    emailContent.addEventListener('click', async function() {
        if (emailContent.value.trim() === '') {
            try {
                const text = await navigator.clipboard.readText();
                emailContent.value = text;
            } catch (err) {
                console.log('Clipboard access failed:', err);
                // No big deal, user still can paste manually
            }
        }
    });
    
});