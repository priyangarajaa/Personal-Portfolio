/**
 * ============================================
 * PRIYANGA RAJA - PORTFOLIO JAVASCRIPT
 * Handles navigation, animations, and interactions
 * ============================================
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavbar();
    initMobileMenu();
    initSmoothScroll();
    initScrollReveal();
    initSkillBars();
    initContactForm();
});

/**
 * ========== NAVBAR FUNCTIONALITY ==========
 * Handles navbar scroll effect and active link highlighting
 */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    // Add scrolled class when page is scrolled
    function handleNavbarScroll() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    // Highlight active navigation link based on scroll position
    function highlightActiveLink() {
        const scrollPosition = window.scrollY + window.innerHeight / 3;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                // Remove active class from all links
                navLinks.forEach(link => link.classList.remove('active'));
                
                // Add active class to current section link
                const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }

    // Add scroll event listeners
    window.addEventListener('scroll', handleNavbarScroll);
    window.addEventListener('scroll', highlightActiveLink);

    // Run on load
    handleNavbarScroll();
    highlightActiveLink();
}

/**
 * ========== MOBILE MENU FUNCTIONALITY ==========
 * Handles mobile navigation menu toggle
 */
function initMobileMenu() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle mobile menu
    navToggle.addEventListener('click', function() {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking a nav link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

/**
 * ========== SMOOTH SCROLL FUNCTIONALITY ==========
 * Handles smooth scrolling to sections
 */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            
            // Handle special case for top of page
            if (targetId === '#') {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                return;
            }

            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const navbarHeight = document.getElementById('navbar').offsetHeight;
                const targetPosition = targetElement.offsetTop - navbarHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * ========== SCROLL REVEAL ANIMATION ==========
 * Handles reveal animations on scroll
 */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal');

    // Options for Intersection Observer
    const observerOptions = {
        root: null, // Use viewport as root
        rootMargin: '0px',
        threshold: 0.15 // Trigger when 15% of element is visible
    };

    // Callback function for observer
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // Optional: Stop observing after reveal (for one-time animation)
                // observer.unobserve(entry.target);
            }
        });
    };

    // Create observer
    const observer = new IntersectionObserver(revealCallback, observerOptions);

    // Observe all reveal elements
    revealElements.forEach(element => {
        observer.observe(element);
    });
}

/**
 * ========== SKILL BARS ANIMATION ==========
 * Animates skill progress bars when they come into view
 */
function initSkillBars() {
    const skillProgressBars = document.querySelectorAll('.skill-progress');

    // Options for Intersection Observer
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    };

    // Callback function for observer
    const animateCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const progress = progressBar.getAttribute('data-progress');
                
                // Animate the width
                progressBar.style.width = `${progress}%`;
                
                // Stop observing after animation
                observer.unobserve(progressBar);
            }
        });
    };

    // Create observer
    const observer = new IntersectionObserver(animateCallback, observerOptions);

    // Observe all skill progress bars
    skillProgressBars.forEach(bar => {
        observer.observe(bar);
    });
}

/**
 * ========== CONTACT FORM VALIDATION ==========
 * Handles form validation and submission
 */
function initContactForm() {
    const form = document.getElementById('contact-form');
    
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Get form fields
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const messageInput = document.getElementById('message');

        // Clear previous errors
        clearErrors();

        // Validate fields
        let isValid = true;

        // Validate name
        if (!validateName(nameInput.value)) {
            showError(nameInput, 'Please enter a valid name (at least 2 characters)');
            isValid = false;
        }

        // Validate email
        if (!validateEmail(emailInput.value)) {
            showError(emailInput, 'Please enter a valid email address');
            isValid = false;
        }

        // Validate message
        if (!validateMessage(messageInput.value)) {
            showError(messageInput, 'Please enter a message (at least 10 characters)');
            isValid = false;
        }

        // If valid, simulate form submission
        if (isValid) {
            handleFormSubmission(form, nameInput, emailInput, messageInput);
        }
    });

    // Real-time validation on blur
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });

        input.addEventListener('input', function() {
            // Clear error when user starts typing
            this.classList.remove('error');
            const errorMessage = this.parentElement.querySelector('.error-message');
            if (errorMessage) {
                errorMessage.textContent = '';
            }
        });
    });
}

/**
 * Validates a name (at least 2 characters, letters and spaces only)
 * @param {string} name - The name to validate
 * @returns {boolean} - Whether the name is valid
 */
function validateName(name) {
    const trimmedName = name.trim();
    return trimmedName.length >= 2 && /^[a-zA-Z\s'-]+$/.test(trimmedName);
}

/**
 * Validates an email address
 * @param {string} email - The email to validate
 * @returns {boolean} - Whether the email is valid
 */
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
}

/**
 * Validates a message (at least 10 characters)
 * @param {string} message - The message to validate
 * @returns {boolean} - Whether the message is valid
 */
function validateMessage(message) {
    return message.trim().length >= 10;
}

/**
 * Validates a single field based on its type
 * @param {HTMLElement} field - The input/textarea element to validate
 */
function validateField(field) {
    const value = field.value;
    const type = field.type || field.tagName.toLowerCase();
    const name = field.name;

    // Clear previous error
    field.classList.remove('error');
    const errorMessage = field.parentElement.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.textContent = '';
    }

    // Validate based on field
    if (name === 'name' && !validateName(value) && value.length > 0) {
        showError(field, 'Please enter a valid name');
    } else if (name === 'email' && !validateEmail(value) && value.length > 0) {
        showError(field, 'Please enter a valid email');
    } else if (name === 'message' && !validateMessage(value) && value.length > 0) {
        showError(field, 'Message must be at least 10 characters');
    }
}

/**
 * Shows an error message for a field
 * @param {HTMLElement} field - The input/textarea element
 * @param {string} message - The error message to display
 */
function showError(field, message) {
    field.classList.add('error');
    const errorElement = field.parentElement.querySelector('.error-message');
    if (errorElement) {
        errorElement.textContent = message;
    }
}

/**
 * Clears all error messages
 */
function clearErrors() {
    const errorFields = document.querySelectorAll('.error');
    const errorMessages = document.querySelectorAll('.error-message');

    errorFields.forEach(field => field.classList.remove('error'));
    errorMessages.forEach(message => message.textContent = '');
}

/**
 * Handles form submission (simulated)
 * @param {HTMLFormElement} form - The form element
 * @param {HTMLInputElement} nameInput - Name input
 * @param {HTMLInputElement} emailInput - Email input
 * @param {HTMLTextAreaElement} messageInput - Message textarea
 */
function handleFormSubmission(form, nameInput, emailInput, messageInput) {
    const submitButton = form.querySelector('.btn-submit');
    const originalText = submitButton.innerHTML;

    // Show loading state
    submitButton.innerHTML = '<span>Sending...</span>';
    submitButton.disabled = true;

    // Simulate API call with timeout
    setTimeout(() => {
        // Show success state
        submitButton.innerHTML = '<span>Message Sent!</span> ✓';
        submitButton.style.background = 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)';

        // Reset form
        form.reset();

        // Reset button after delay
        setTimeout(() => {
            submitButton.innerHTML = originalText;
            submitButton.style.background = '';
            submitButton.disabled = false;
        }, 3000);

    }, 1500);
}

/**
 * ========== UTILITY FUNCTIONS ==========
 */

/**
 * Throttle function to limit execution frequency
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} - Throttled function
 */
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Debounce function to delay execution
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} - Debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}
