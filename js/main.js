document.addEventListener('DOMContentLoaded', () => {
    // Theme switcher functionality - FIXED
    const themeToggle = document.getElementById('theme-toggle');
    const themeDropdown = document.querySelector('.theme-dropdown');
    const themeOptions = document.querySelectorAll('.theme-option');
    
    // Check for saved theme preference or use preferred color scheme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.setAttribute('data-theme', 'dark');
        updateThemeIcon('dark');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        updateThemeIcon('light');
    }
    
    // Toggle dropdown visibility when theme toggle is clicked
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            themeDropdown.classList.toggle('show');
        });
    }
    
    // Handle theme option selection
    themeOptions.forEach(option => {
        option.addEventListener('click', () => {
            const selectedTheme = option.getAttribute('data-theme');
            document.documentElement.setAttribute('data-theme', selectedTheme);
            localStorage.setItem('theme', selectedTheme);
            themeDropdown.classList.remove('show');
            
            // Update active state for theme options
            themeOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            
            // Update theme icon in the toggle button
            updateThemeIcon(selectedTheme);
        });
    });
    
    // Function to update the theme icon in the toggle button
    function updateThemeIcon(theme) {
        const iconElement = themeToggle.querySelector('i');
        if (!iconElement) return;
        
        // Remove all existing icon classes
        iconElement.className = '';
        
        // Add appropriate icon class based on theme
        switch(theme) {
            case 'light':
                iconElement.className = 'fas fa-sun';
                themeToggle.querySelector('span').textContent = 'Light';
                break;
            case 'dark':
                iconElement.className = 'fas fa-moon';
                themeToggle.querySelector('span').textContent = 'Dark';
                break;
            case 'blue':
                iconElement.className = 'fas fa-water';
                themeToggle.querySelector('span').textContent = 'Blue';
                break;
            case 'green':
                iconElement.className = 'fas fa-leaf';
                themeToggle.querySelector('span').textContent = 'Green';
                break;
            case 'purple':
                iconElement.className = 'fas fa-palette';
                themeToggle.querySelector('span').textContent = 'Purple';
                break;
            default:
                iconElement.className = 'fas fa-paint-brush';
                themeToggle.querySelector('span').textContent = 'Theme';
        }
    }
    
    // Set initial active state based on current theme
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const activeThemeOption = document.querySelector(`.theme-option[data-theme="${currentTheme}"]`);
    if (activeThemeOption) {
        activeThemeOption.classList.add('active');
    }
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (themeDropdown && themeDropdown.classList.contains('show') && 
            !e.target.closest('.theme-dropdown') && 
            !e.target.closest('#theme-toggle')) {
            themeDropdown.classList.remove('show');
        }
    });
    
    // Scroll-triggered animations - define observers first to fix initialization order issues
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            }
        });
    }, observerOptions);
    
    // Create a new observer for progress bars
    const progressObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Find all progress bars in this category
                const progressBars = entry.target.querySelectorAll('.progress');
                
                // Animate each progress bar with a slight delay
                progressBars.forEach((bar, index) => {
                    const percent = bar.getAttribute('data-percent');
                    setTimeout(() => {
                        bar.style.width = percent + '%';
                    }, index * 100);
                });
                
                // Unobserve after animation
                progressObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2
    });
    
    // Typing animation for the hero section
    const typingText = document.getElementById('typing-text');
    
    if (typingText) {
        const phrases = [
            "Transforming ideas into engaging digital experiences",
            "Crafting beautiful & functional websites",
            "Creating memorable brand identities",
            "Turning visions into digital reality"
        ];
        let currentPhraseIndex = 0;
        let currentCharIndex = 0;
        let isDeleting = false;
        let typingSpeed = 100;
        
        function typeEffect() {
            const currentPhrase = phrases[currentPhraseIndex];
            
            if (isDeleting) {
                // Deleting text
                typingText.textContent = currentPhrase.substring(0, currentCharIndex - 1);
                currentCharIndex--;
                typingSpeed = 50; // Faster when deleting
            } else {
                // Typing text
                typingText.textContent = currentPhrase.substring(0, currentCharIndex + 1);
                currentCharIndex++;
                typingSpeed = 100; // Normal speed when typing
            }
            
            // Change direction if reached end of phrase
            if (!isDeleting && currentCharIndex === currentPhrase.length) {
                isDeleting = true;
                typingSpeed = 1500; // Pause at the end
            } else if (isDeleting && currentCharIndex === 0) {
                isDeleting = false;
                // Move to next phrase
                currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length;
                typingSpeed = 500; // Pause before starting next phrase
            }
            
            setTimeout(typeEffect, typingSpeed);
        }
        
        // Start typing animation
        setTimeout(typeEffect, 1000);
    }
    
    // Initialize skill progress bars
    function initProgressBars() {
        const progressBars = document.querySelectorAll('.progress');
        
        // Only run this when the elements are visible
        progressBars.forEach(bar => {
            const percent = bar.getAttribute('data-percent');
            bar.style.width = '0%';
            
            // Set the observer on the parent skill category
            const skillCategory = bar.closest('.skill-category');
            if (skillCategory) {
                progressObserver.observe(skillCategory);
            }
        });
    }
    
    // Back to top button functionality
    const backToTopButton = document.querySelector('.back-to-top');
    
    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        });
        
        backToTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Initialize the skills progress bars
    initProgressBars();
    
    // Apply fade-in animations to elements
    document.querySelectorAll('.skill-category, .contact-card, .section-title, .quote-container').forEach(element => {
        element.classList.add('fade-in-element');
        observer.observe(element);
    });
    
    // Mobile Navigation Toggle
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navLinks = document.getElementById('nav-links');
    
    if (mobileMenuToggle && navLinks) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileMenuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
        
        // Close mobile menu when clicking on a link
        const navItems = navLinks.querySelectorAll('a');
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                if (navLinks.classList.contains('active')) {
                    mobileMenuToggle.classList.remove('active');
                    navLinks.classList.remove('active');
                    document.body.classList.remove('menu-open');
                }
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', (event) => {
            if (navLinks.classList.contains('active') && 
                !event.target.closest('.nav-links') && 
                !event.target.closest('#mobile-menu-toggle')) {
                mobileMenuToggle.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
    }
    
    // Animated scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.scrollY - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Form submission handling
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }
    
    function handleFormSubmit(e) {
        e.preventDefault();
        
        const nameInput = contactForm.querySelector('input[placeholder="Your Name"]');
        const emailInput = contactForm.querySelector('input[placeholder="Your Email"]');
        const messageInput = contactForm.querySelector('textarea');
        const submitButton = contactForm.querySelector('.submit-btn');
        
        // Simple validation
        if (!nameInput.value || !emailInput.value || !messageInput.value) {
            showNotification('Please fill out all required fields', 'error');
            return;
        }
        
        // Disable the button and show loading state
        submitButton.disabled = true;
        submitButton.innerHTML = '<span class="loading-animation"></span> Sending...';
        
        // Simulate sending the message (replace with actual form submission in production)
        setTimeout(() => {
            // Reset the form
            contactForm.reset();
            
            // Restore the button
            submitButton.disabled = false;
            submitButton.textContent = 'Send Message';
            
            // Show success message
            showNotification('Your message has been sent successfully! I will get back to you soon.', 'success');
        }, 1500);
    }
    
    // Skill items hover effect
    const skillItems = document.querySelectorAll('.skill-item');
    
    skillItems.forEach(item => {
        item.addEventListener('mouseover', function() {
            skillItems.forEach(otherItem => {
                if (otherItem !== this) {
                    otherItem.style.opacity = '0.7';
                    otherItem.style.transform = 'scale(0.95)';
                }
            });
        });
        
        item.addEventListener('mouseout', function() {
            skillItems.forEach(otherItem => {
                otherItem.style.opacity = '1';
                otherItem.style.transform = 'scale(1)';
            });
        });
    });
    
    // Create notification system
    function showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        // Add icon based on notification type
        let icon = '';
        switch(type) {
            case 'success':
                icon = '<i class="fas fa-check-circle"></i>';
                break;
            case 'error':
                icon = '<i class="fas fa-exclamation-circle"></i>';
                break;
            case 'info':
                icon = '<i class="fas fa-info-circle"></i>';
                break;
        }
        
        notification.innerHTML = `
            <div class="notification-content">
                ${icon}
                <p>${message}</p>
            </div>
            <button class="notification-close">×</button>
        `;
        
        // Append to body
        document.body.appendChild(notification);
        
        // Add active class after a small delay (for animation)
        setTimeout(() => {
            notification.classList.add('active');
        }, 10);
        
        // Close notification when close button is clicked
        notification.querySelector('.notification-close').addEventListener('click', () => {
            closeNotification(notification);
        });
        
        // Auto close after 5 seconds
        setTimeout(() => {
            closeNotification(notification);
        }, 5000);
    }
    
    function closeNotification(notification) {
        notification.classList.remove('active');
        
        // Remove from DOM after animation completes
        notification.addEventListener('transitionend', function(e) {
            // Only execute if the transition is for the opacity property
            if (e.propertyName === 'bottom' || e.propertyName === 'opacity') {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }
        });
    }
    
    // Quote functionality
    const getQuoteBtn = document.getElementById('get-quote-btn');
    const shareQuoteBtn = document.getElementById('share-quote-btn');
    const quoteText = document.querySelector('.quote-text');
    const quoteAuthor = document.querySelector('.quote-author');
    const quoteCanvas = document.getElementById('quote-canvas');
    
    // Collection of quotes to randomly display
    const quotes = [
        { text: "The best way to predict the future is to create it.", author: "Abraham Lincoln" },
        { text: "Your time is limited, don't waste it living someone else's life.", author: "Steve Jobs" },
        { text: "Design is not just what it looks like and feels like. Design is how it works.", author: "Steve Jobs" },
        { text: "Creativity is intelligence having fun.", author: "Albert Einstein" },
        { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
        { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
        { text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs" },
        { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
        { text: "Strive not to be a success, but rather to be of value.", author: "Albert Einstein" },
        { text: "The only limit to our realization of tomorrow will be our doubts of today.", author: "Franklin D. Roosevelt" },
        { text: "Everything you can imagine is real.", author: "Pablo Picasso" },
        { text: "The best revenge is massive success.", author: "Frank Sinatra" },
        { text: "The purpose of our lives is to be happy.", author: "Dalai Lama" },
        { text: "Life is what happens when you're busy making other plans.", author: "John Lennon" },
        { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" }
    ];
    
    let currentQuote = null;
    
    if (getQuoteBtn) {
        getQuoteBtn.addEventListener('click', () => {
            // Show loading state
            getQuoteBtn.disabled = true;
            getQuoteBtn.innerHTML = '<span class="loading-animation"></span> Loading...';
            
            // Generate random quote (simulate API call with timeout)
            setTimeout(() => {
                const randomIndex = Math.floor(Math.random() * quotes.length);
                currentQuote = quotes[randomIndex];
                
                // Update quote display
                quoteText.textContent = currentQuote.text;
                quoteAuthor.textContent = currentQuote.author;
                
                // Enable share button
                shareQuoteBtn.disabled = false;
                
                // Reset button
                getQuoteBtn.disabled = false;
                getQuoteBtn.innerHTML = 'Get Another Quote';
                
                // Generate the quote image in the hidden canvas for sharing
                generateQuoteImage(currentQuote.text, currentQuote.author);
            }, 1000);
        });
    }
    
    if (shareQuoteBtn) {
        shareQuoteBtn.addEventListener('click', () => {
            if (!currentQuote) return;
            
            // WhatsApp sharing
            const quoteTextForShare = encodeURIComponent(`"${currentQuote.text}" — ${currentQuote.author}`);
            const whatsappUrl = `https://wa.me/?text=${quoteTextForShare}`;
            
            window.open(whatsappUrl, '_blank');
        });
    }
    
    // Function to generate image from quote for potential sharing
    function generateQuoteImage(text, author) {
        const ctx = quoteCanvas.getContext('2d');
        const width = quoteCanvas.width;
        const height = quoteCanvas.height;
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        // Set background (based on current theme)
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        ctx.fillStyle = currentTheme === 'light' ? '#f8f9fa' : '#121212';
        ctx.fillRect(0, 0, width, height);
        
        // Draw decorative elements
        ctx.fillStyle = currentTheme === 'light' ? '#3a6186' : '#89253e';
        ctx.fillRect(0, 0, width, 10); // Top border
        ctx.fillRect(0, height - 10, width, 10); // Bottom border
        
        // Set quote text properties
        ctx.font = 'bold italic 32px "Segoe UI", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillStyle = currentTheme === 'light' ? '#333' : '#e0e0e0';
        
        // Draw quote text with word wrapping
        wrapText(ctx, `"${text}"`, width / 2, height / 2 - 40, width - 100, 40);
        
        // Draw author
        ctx.font = '24px "Segoe UI", sans-serif';
        ctx.fillStyle = currentTheme === 'light' ? '#555' : '#aaa';
        ctx.fillText(`— ${author}`, width / 2, height / 2 + 100);
        
        // Draw watermark
        ctx.font = '16px "Segoe UI", sans-serif';
        ctx.fillStyle = currentTheme === 'light' ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.3)';
        ctx.fillText('Md Amshar - Web Developer & Graphic Designer', width / 2, height - 30);
    }
    
    // Function to wrap text in canvas
    function wrapText(context, text, x, y, maxWidth, lineHeight) {
        const words = text.split(' ');
        let line = '';
        let testLine = '';
        let lineArray = [];
        
        // First determine number of lines
        for (let n = 0; n < words.length; n++) {
            testLine = line + words[n] + ' ';
            const metrics = context.measureText(testLine);
            const testWidth = metrics.width;
            
            if (testWidth > maxWidth && n > 0) {
                lineArray.push(line);
                line = words[n] + ' ';
            } else {
                line = testLine;
            }
        }
        
        // Push the last line
        lineArray.push(line);
        
        // Center the text vertically
        y = y - ((lineArray.length - 1) * lineHeight) / 2;
        
        // Render each line
        for (let n = 0; n < lineArray.length; n++) {
            context.fillText(lineArray[n], x, y);
            y += lineHeight;
        }
    }
    
    // Fade-in animation for elements
    const fadeInElements = document.querySelectorAll('.fade-in-element');
    
    const fadeInObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                fadeInObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    fadeInElements.forEach(element => {
        fadeInObserver.observe(element);
    });

    // WhatsApp Contact Form Integration
    const whatsappForm = document.getElementById('whatsapp-contact-form');
    const whatsappSubmit = document.getElementById('whatsapp-submit');
    
    if (whatsappForm) {
        whatsappForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('contact-name').value.trim();
            const email = document.getElementById('contact-email').value.trim();
            const subject = document.getElementById('contact-subject').value.trim();
            const message = document.getElementById('contact-message').value.trim();
            
            // Validate form fields
            if (!name || !email || !message) {
                alert('Please fill in all required fields (Name, Email, and Message).');
                return;
            }
            
            // Phone number for WhatsApp (update with your number)
            const phoneNumber = "919060419628";
            
            // Create message text
            const whatsappMessage = 
                `*Name:* ${name}%0A` +
                `*Email:* ${email}%0A` +
                `*Subject:* ${subject}%0A` +
                `*Message:* ${message}`;
            
            // Create WhatsApp URL
            const whatsappURL = `https://wa.me/${phoneNumber}?text=${whatsappMessage}`;
            
            // Show confirmation toast
            showToast('Redirecting to WhatsApp...');
            
            // Redirect to WhatsApp
            setTimeout(() => {
                window.open(whatsappURL, '_blank');
            }, 1000);
            
            // Reset form
            whatsappForm.reset();
        });
    }
    
    // Toast notification function
    function showToast(message) {
        // Create toast element if it doesn't exist
        let toast = document.getElementById('toast-notification');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'toast-notification';
            document.body.appendChild(toast);
        }
        
        // Set message and show toast
        toast.textContent = message;
        toast.classList.add('show');
        
        // Hide toast after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // Mathematical Reasoning Game
    initMathGame();
});

function initMathGame() {
    // Game elements
    const startGameBtn = document.getElementById('start-game');
    const resetGameBtn = document.getElementById('reset-game');
    const playAgainBtn = document.getElementById('play-again');
    const shareResultsBtn = document.getElementById('share-results');
    const submitAnswerBtn = document.getElementById('submit-answer');
    const nextQuestionBtn = document.getElementById('next-question');
    const answerInput = document.getElementById('answer-input');
    const questionDisplay = document.getElementById('question-display');
    const feedbackText = document.getElementById('feedback-text');
    const questionNumber = document.getElementById('question-number');
    const totalQuestions = document.getElementById('total-questions');
    const scoreValue = document.getElementById('score-value');
    const streakValue = document.getElementById('streak-value');
    const accuracyValue = document.getElementById('accuracy-value');
    const timerProgress = document.getElementById('timer-progress');
    const timerText = document.getElementById('timer-text');
    const gameResults = document.getElementById('game-results');
    const finalScore = document.getElementById('final-score');
    const correctAnswers = document.getElementById('correct-answers');
    const totalAnswered = document.getElementById('total-answered');
    const finalAccuracy = document.getElementById('final-accuracy');
    const bestStreak = document.getElementById('best-streak');

    // Game mode buttons
    const gameModeButtons = document.querySelectorAll('.game-mode-btn');
    const difficultyButtons = document.querySelectorAll('.difficulty-btn');
    
    // Game state
    let gameState = {
        active: false,
        currentQuestion: 1,
        totalQuestions: 10,
        score: 0,
        streak: 0,
        bestStreak: 0,
        correct: 0,
        answered: 0,
        timeLeft: 30,
        timerInterval: null,
        currentMode: 'arithmetic',
        currentDifficulty: 'medium',
        currentAnswer: null
    };

    // Game initialization
    function setupGame() {
        // Reset game state
        gameState.active = true;
        gameState.currentQuestion = 1;
        gameState.score = 0;
        gameState.streak = 0;
        gameState.correct = 0;
        gameState.answered = 0;
        
        // Update UI
        questionNumber.textContent = gameState.currentQuestion;
        totalQuestions.textContent = gameState.totalQuestions;
        scoreValue.textContent = gameState.score;
        streakValue.textContent = gameState.streak;
        accuracyValue.textContent = '0%';
        
        // Hide results, show game board
        gameResults.style.display = 'none';
        resetGameBtn.disabled = false;
        
        // Generate first question
        generateQuestion();
    }

    // Generate a math question based on current mode and difficulty
    function generateQuestion() {
        clearTimeout(gameState.timerInterval);
        
        answerInput.value = '';
        answerInput.disabled = false;
        submitAnswerBtn.disabled = false;
        nextQuestionBtn.disabled = true;
        feedbackText.textContent = '';
        
        let question, answer;
        
        switch(gameState.currentMode) {
            case 'arithmetic':
                [question, answer] = generateArithmeticQuestion(gameState.currentDifficulty);
                break;
            case 'equation':
                [question, answer] = generateEquationQuestion(gameState.currentDifficulty);
                break;
            case 'sequence':
                [question, answer] = generateSequenceQuestion(gameState.currentDifficulty);
                break;
            default:
                [question, answer] = generateArithmeticQuestion(gameState.currentDifficulty);
        }
        
        questionDisplay.innerHTML = `<p>${question}</p>`;
        gameState.currentAnswer = answer;
        
        // Start timer
        startTimer();
    }

    // Generate arithmetic question
    function generateArithmeticQuestion(difficulty) {
        let num1, num2, num3, operation, question, answer;
        
        switch(difficulty) {
            case 'easy':
                num1 = Math.floor(Math.random() * 10) + 1;
                num2 = Math.floor(Math.random() * 10) + 1;
                operation = Math.random() < 0.5 ? '+' : '-';
                
                question = `What is ${num1} ${operation} ${num2}?`;
                answer = operation === '+' ? num1 + num2 : num1 - num2;
                break;
                
            case 'medium':
                num1 = Math.floor(Math.random() * 20) + 10;
                num2 = Math.floor(Math.random() * 20) + 5;
                operation = ['×', '÷', '+', '-'][Math.floor(Math.random() * 4)];
                
                if (operation === '÷') {
                    // Ensure division results in a whole number
                    num1 = num2 * (Math.floor(Math.random() * 10) + 1);
                }
                
                question = `Calculate ${num1} ${operation} ${num2}`;
                
                switch(operation) {
                    case '+': answer = num1 + num2; break;
                    case '-': answer = num1 - num2; break;
                    case '×': answer = num1 * num2; break;
                    case '÷': answer = num1 / num2; break;
                }
                break;
                
            case 'hard':
                num1 = Math.floor(Math.random() * 50) + 20;
                num2 = Math.floor(Math.random() * 30) + 10;
                num3 = Math.floor(Math.random() * 20) + 5;
                
                let operations = ['+', '-', '×'];
                let op1 = operations[Math.floor(Math.random() * 3)];
                let op2 = operations[Math.floor(Math.random() * 3)];
                
                question = `Calculate ${num1} ${op1} ${num2} ${op2} ${num3}`;
                
                // Calculate answer following order of operations
                if ((op1 === '+' || op1 === '-') && (op2 === '×')) {
                    let temp = num2 * num3;
                    answer = op1 === '+' ? num1 + temp : num1 - temp;
                } else if ((op1 === '×') && (op2 === '+' || op2 === '-')) {
                    let temp = num1 * num2;
                    answer = op2 === '+' ? temp + num3 : temp - num3;
                } else {
                    // Left to right when same precedence
                    if (op1 === '+') answer = num1 + num2;
                    else if (op1 === '-') answer = num1 - num2;
                    else answer = num1 * num2;
                    
                    if (op2 === '+') answer += num3;
                    else if (op2 === '-') answer -= num3;
                    else answer *= num3;
                }
                break;
        }
        
        return [question, answer];
    }

    // Generate equation question
    function generateEquationQuestion(difficulty) {
        let x, a, b, c, question, answer;
        
        switch(difficulty) {
            case 'easy':
                x = Math.floor(Math.random() * 10) + 1;
                a = Math.floor(Math.random() * 5) + 1;
                b = Math.floor(Math.random() * 20);
                
                question = `Find the value of x: ${a}x + ${b} = ${a*x + b}`;
                answer = x;
                break;
                
            case 'medium':
                x = Math.floor(Math.random() * 12) + 1;
                a = Math.floor(Math.random() * 5) + 1;
                b = Math.floor(Math.random() * 10) + 1;
                c = Math.floor(Math.random() * 30);
                
                question = `Solve for x: ${a}x + ${b} = ${a*x + b + c - c}`;
                answer = x;
                break;
                
            case 'hard':
                x = Math.floor(Math.random() * 10) + 1;
                a = Math.floor(Math.random() * 5) + 1;
                b = Math.floor(Math.random() * 10) + 1;
                c = Math.floor(Math.random() * 20);
                
                // Create a quadratic equation: ax² + bx + c = d
                let d = a*x*x + b*x + c;
                question = `Find the positive value of x where ${a}x² + ${b}x + ${c} = ${d}`;
                answer = x;
                break;
        }
        
        return [question, answer];
    }

    // Generate number sequence question
    function generateSequenceQuestion(difficulty) {
        let sequence = [];
        let rule, nextNumber, question;
        
        switch(difficulty) {
            case 'easy':
                // Simple arithmetic progression
                let start = Math.floor(Math.random() * 10);
                let diff = Math.floor(Math.random() * 5) + 1;
                
                for (let i = 0; i < 4; i++) {
                    sequence.push(start + diff * i);
                }
                nextNumber = start + diff * 4;
                
                question = `What comes next in the sequence? ${sequence.join(', ')}, ?`;
                break;
                
            case 'medium':
                // Geometric progression or alternating pattern
                if (Math.random() < 0.5) {
                    // Geometric
                    start = Math.floor(Math.random() * 5) + 1;
                    let factor = Math.floor(Math.random() * 3) + 2;
                    
                    for (let i = 0; i < 4; i++) {
                        sequence.push(start * Math.pow(factor, i));
                    }
                    nextNumber = start * Math.pow(factor, 4);
                } else {
                    // Alternating pattern
                    start = Math.floor(Math.random() * 10);
                    diff = Math.floor(Math.random() * 5) + 1;
                    let diff2 = Math.floor(Math.random() * 5) + 1;
                    
                    sequence.push(start);
                    sequence.push(start + diff);
                    sequence.push(sequence[1] + diff2);
                    sequence.push(sequence[2] + diff);
                    
                    nextNumber = sequence[3] + diff2;
                }
                
                question = `Find the next number: ${sequence.join(', ')}, ?`;
                break;
                
            case 'hard':
                // Quadratic sequence or complex pattern
                let a = Math.floor(Math.random() * 2) + 1;
                let b = Math.floor(Math.random() * 5);
                let c = Math.floor(Math.random() * 10);
                
                // Quadratic: an² + bn + c
                for (let i = 1; i <= 4; i++) {
                    sequence.push(a*i*i + b*i + c);
                }
                nextNumber = a*5*5 + b*5 + c;
                
                question = `Continue the sequence: ${sequence.join(', ')}, ?`;
                break;
        }
        
        return [question, nextNumber];
    }

    // Start timer for current question
    function startTimer() {
        gameState.timeLeft = 30;
        timerText.textContent = gameState.timeLeft;
        timerProgress.style.width = '100%';
        
        gameState.timerInterval = setInterval(() => {
            gameState.timeLeft -= 1;
            timerText.textContent = gameState.timeLeft;
            timerProgress.style.width = `${(gameState.timeLeft / 30) * 100}%`;
            
            if (gameState.timeLeft <= 10) {
                timerProgress.style.backgroundColor = '#ff6b6b';
            } else {
                timerProgress.style.backgroundColor = '#4caf50';
            }
            
            if (gameState.timeLeft <= 0) {
                clearInterval(gameState.timerInterval);
                handleTimeUp();
            }
        }, 1000);
    }

    // Handle when time is up
    function handleTimeUp() {
        answerInput.disabled = true;
        submitAnswerBtn.disabled = true;
        nextQuestionBtn.disabled = false;
        
        feedbackText.textContent = `Time's up! The correct answer was ${gameState.currentAnswer}.`;
        feedbackText.style.color = '#ff6b6b';
        
        gameState.streak = 0;
        gameState.answered++;
        streakValue.textContent = gameState.streak;
        updateAccuracy();
    }

    // Check the user's answer
    function checkAnswer() {
        const userAnswer = answerInput.value.trim();
        let isCorrect = false;
        
        if (userAnswer === gameState.currentAnswer.toString()) {
            isCorrect = true;
        } else {
            // For equations, allow different forms of the same answer
            try {
                if (gameState.currentMode === 'equation' && 
                    Math.abs(parseFloat(userAnswer) - gameState.currentAnswer) < 0.001) {
                    isCorrect = true;
                }
            } catch (e) {
                isCorrect = false;
            }
        }
        
        clearInterval(gameState.timerInterval);
        answerInput.disabled = true;
        submitAnswerBtn.disabled = true;
        nextQuestionBtn.disabled = false;
        
        if (isCorrect) {
            feedbackText.textContent = 'Correct! Well done.';
            feedbackText.style.color = '#4caf50';
            
            // Update score based on time left and difficulty
            let difficultyMultiplier = 1;
            if (gameState.currentDifficulty === 'medium') difficultyMultiplier = 1.5;
            if (gameState.currentDifficulty === 'hard') difficultyMultiplier = 2;
            
            // Time bonus
            let timeBonus = Math.max(1, Math.floor(gameState.timeLeft / 5));
            
            let pointsEarned = Math.floor(10 * difficultyMultiplier + timeBonus);
            gameState.score += pointsEarned;
            gameState.streak++;
            gameState.correct++;
            
            if (gameState.streak > gameState.bestStreak) {
                gameState.bestStreak = gameState.streak;
            }
        } else {
            feedbackText.textContent = `Incorrect. The correct answer is ${gameState.currentAnswer}.`;
            feedbackText.style.color = '#ff6b6b';
            gameState.streak = 0;
        }
        
        gameState.answered++;
        
        // Update UI
        scoreValue.textContent = gameState.score;
        streakValue.textContent = gameState.streak;
        updateAccuracy();
    }

    // Update accuracy display
    function updateAccuracy() {
        const accuracy = gameState.answered > 0 ? 
            Math.round((gameState.correct / gameState.answered) * 100) : 0;
        accuracyValue.textContent = `${accuracy}%`;
    }

    // Move to next question or end game
    function nextQuestion() {
        if (gameState.currentQuestion >= gameState.totalQuestions) {
            endGame();
        } else {
            gameState.currentQuestion++;
            questionNumber.textContent = gameState.currentQuestion;
            generateQuestion();
        }
    }

    // End the game and show results
    function endGame() {
        gameState.active = false;
        
        // Update final stats
        finalScore.textContent = gameState.score;
        correctAnswers.textContent = gameState.correct;
        totalAnswered.textContent = gameState.answered;
        
        const finalAccuracyValue = gameState.answered > 0 ? 
            Math.round((gameState.correct / gameState.answered) * 100) : 0;
        finalAccuracy.textContent = `${finalAccuracyValue}%`;
        
        bestStreak.textContent = gameState.bestStreak;
        
        // Show results, hide game board
        gameResults.style.display = 'block';
        resetGameBtn.disabled = true;
    }

    // Event listeners for game controls
    if (startGameBtn) {
        startGameBtn.addEventListener('click', setupGame);
    }
    
    if (resetGameBtn) {
        resetGameBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to reset the game? Your progress will be lost.')) {
                setupGame();
            }
        });
    }
    
    if (submitAnswerBtn) {
        submitAnswerBtn.addEventListener('click', () => {
            if (answerInput.value.trim() !== '') {
                checkAnswer();
            }
        });
        
        // Also submit with Enter key
        answerInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && answerInput.value.trim() !== '' && !answerInput.disabled) {
                checkAnswer();
            }
        });
    }
    
    if (nextQuestionBtn) {
        nextQuestionBtn.addEventListener('click', nextQuestion);
    }
    
    if (playAgainBtn) {
        playAgainBtn.addEventListener('click', setupGame);
    }
    
    if (shareResultsBtn) {
        shareResultsBtn.addEventListener('click', () => {
            const text = `I scored ${gameState.score} points in the Math Game with ${gameState.correct}/${gameState.answered} correct answers and a ${gameState.bestStreak} answer streak!`;
            
            if (navigator.share) {
                navigator.share({
                    title: 'My Math Game Results',
                    text: text
                });
            } else {
                // Fallback - copy to clipboard
                navigator.clipboard.writeText(text).then(() => {
                    alert('Result copied to clipboard! You can paste it to share.');
                });
            }
        });
    }
    
    // Game mode selection
    gameModeButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active button
            gameModeButtons.forEach(b => b.classList.remove('active'));
            button.classList.add('active');
            
            // Update game mode
            gameState.currentMode = button.getAttribute('data-mode');
            
            // If game is active, generate new question
            if (gameState.active) {
                generateQuestion();
            }
        });
    });
    
    // Difficulty selection
    difficultyButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active button
            difficultyButtons.forEach(b => b.classList.remove('active'));
            button.classList.add('active');
            
            // Update difficulty
            gameState.currentDifficulty = button.getAttribute('data-difficulty');
            
            // If game is active, generate new question
            if (gameState.active) {
                generateQuestion();
            }
        });
    });
}