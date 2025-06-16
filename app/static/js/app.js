// UV Demo App JavaScript

class UVDemo {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeAnimations();
    }

    setupEventListeners() {
        // Handle dynamic content loading
        document.addEventListener('DOMContentLoaded', () => {
            this.fadeInElements();
        });

        // Handle navbar collapse on mobile
        const navbarToggler = document.querySelector('.navbar-toggler');
        if (navbarToggler) {
            navbarToggler.addEventListener('click', this.toggleMobileNav);
        }

        // Handle smooth scrolling
        this.setupSmoothScrolling();
    }

    initializeAnimations() {
        // Add fade-in class to elements as they come into view
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        }, observerOptions);

        // Observe all cards and major sections
        document.querySelectorAll('.card, .hero-section, .row').forEach(el => {
            observer.observe(el);
        });
    }

    fadeInElements() {
        const elements = document.querySelectorAll('.card, .btn, .alert');
        elements.forEach((el, index) => {
            setTimeout(() => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(20px)';
                el.style.transition = 'all 0.6s ease-out';
                
                requestAnimationFrame(() => {
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                });
            }, index * 100);
        });
    }

    toggleMobileNav() {
        const navbar = document.querySelector('.navbar-collapse');
        navbar.classList.toggle('show');
    }

    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // Utility methods for API calls
    async fetchData(endpoint) {
        try {
            const response = await fetch(endpoint);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Fetch error:', error);
            return null;
        }
    }

    // Format time for display
    formatTime(seconds) {
        if (seconds < 1) {
            return `${(seconds * 1000).toFixed(0)}ms`;
        }
        return `${seconds.toFixed(1)}s`;
    }

    // Format file size
    formatFileSize(bytes) {
        const sizes = ['B', 'KB', 'MB', 'GB'];
        if (bytes === 0) return '0 B';
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
    }

    // Show loading state
    showLoading(element) {
        const originalContent = element.innerHTML;
        element.innerHTML = `
            <div class="text-center">
                <div class="spinner-border spinner-border-sm" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <span class="ms-2">Loading...</span>
            </div>
        `;
        return originalContent;
    }

    // Hide loading state
    hideLoading(element, originalContent) {
        element.innerHTML = originalContent;
    }

    // Show toast notification
    showToast(message, type = 'info') {
        const toastHtml = `
            <div class="toast align-items-center text-white bg-${type} border-0" role="alert">
                <div class="d-flex">
                    <div class="toast-body">
                        ${message}
                    </div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
                </div>
            </div>
        `;
        
        // Create toast container if it doesn't exist
        let toastContainer = document.querySelector('.toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3';
            document.body.appendChild(toastContainer);
        }
        
        // Add toast to container
        toastContainer.insertAdjacentHTML('beforeend', toastHtml);
        
        // Initialize and show toast
        const toastElement = toastContainer.lastElementChild;
        const toast = new bootstrap.Toast(toastElement);
        toast.show();
        
        // Remove toast element after it's hidden
        toastElement.addEventListener('hidden.bs.toast', () => {
            toastElement.remove();
        });
    }

    // Copy text to clipboard
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            this.showToast('Copied to clipboard!', 'success');
        } catch (err) {
            console.error('Failed to copy text: ', err);
            this.showToast('Failed to copy text', 'danger');
        }
    }

    // Generate random demo data
    generateDemoData(type) {
        switch (type) {
            case 'installTimes':
                return {
                    pip: Math.random() * 30 + 10,
                    uv: Math.random() * 2 + 0.5
                };
            case 'packageSizes':
                return {
                    total: Math.floor(Math.random() * 100) + 50,
                    cached: Math.floor(Math.random() * 30) + 10
                };
            default:
                return {};
        }
    }
}

// Chart utilities
class ChartUtils {
    static createSpeedChart(ctx, data) {
        return new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(data.pip),
                datasets: [{
                    label: 'pip (seconds)',
                    data: Object.values(data.pip),
                    backgroundColor: 'rgba(220, 53, 69, 0.8)',
                    borderColor: 'rgba(220, 53, 69, 1)',
                    borderWidth: 2
                }, {
                    label: 'uv (seconds)',
                    data: Object.values(data.uv),
                    backgroundColor: 'rgba(25, 135, 84, 0.8)',
                    borderColor: 'rgba(25, 135, 84, 1)',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    duration: 1500,
                    easing: 'easeInOutQuart'
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Time (seconds)'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    }
                }
            }
        });
    }

    static createDoughnutChart(ctx, data, labels) {
        return new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: [
                        'rgba(220, 53, 69, 0.8)',
                        'rgba(255, 193, 7, 0.8)',
                        'rgba(25, 135, 84, 0.8)',
                        'rgba(13, 110, 253, 0.8)'
                    ],
                    borderColor: [
                        'rgba(220, 53, 69, 1)',
                        'rgba(255, 193, 7, 1)',
                        'rgba(25, 135, 84, 1)',
                        'rgba(13, 110, 253, 1)'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    duration: 1500,
                    easing: 'easeInOutQuart'
                },
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
}

// Initialize the app
const uvDemo = new UVDemo();

// Add copy functionality to code blocks
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('pre code').forEach(block => {
        // Add copy button
        const copyButton = document.createElement('button');
        copyButton.className = 'btn btn-sm btn-outline-light position-absolute top-0 end-0 m-2';
        copyButton.innerHTML = '<i class="fas fa-copy"></i>';
        copyButton.title = 'Copy to clipboard';
        
        // Position the parent relatively
        block.parentElement.style.position = 'relative';
        block.parentElement.appendChild(copyButton);
        
        // Add click event
        copyButton.addEventListener('click', () => {
            uvDemo.copyToClipboard(block.textContent);
            copyButton.innerHTML = '<i class="fas fa-check"></i>';
            setTimeout(() => {
                copyButton.innerHTML = '<i class="fas fa-copy"></i>';
            }, 2000);
        });
    });
});

// Export for use in other files
window.UVDemo = UVDemo;
window.ChartUtils = ChartUtils;