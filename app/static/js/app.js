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

// Advanced demo functionality
class AdvancedDemoFeatures {
    constructor() {
        this.initializeTypewriter();
        this.initializeParticles();
        this.setupPerformanceCounters();
        this.initializeRealTimeUpdates();
    }

    // Typewriter effect for terminal demonstrations
    initializeTypewriter() {
        const typewriterElements = document.querySelectorAll('.typewriter');
        typewriterElements.forEach(element => {
            const text = element.textContent;
            element.textContent = '';
            this.typeText(element, text, 50);
        });
    }

    typeText(element, text, speed = 100) {
        let i = 0;
        const timer = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(timer);
            }
        }, speed);
    }

    // Animated performance counters
    setupPerformanceCounters() {
        const counters = document.querySelectorAll('.performance-counter');
        const observerOptions = { threshold: 0.5 };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                }
            });
        }, observerOptions);

        counters.forEach(counter => observer.observe(counter));
    }

    animateCounter(element) {
        const target = parseInt(element.dataset.target);
        const duration = 2000;
        const start = 0;
        const startTime = performance.now();

        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const current = Math.floor(start + (target - start) * this.easeOutQuart(progress));
            
            element.textContent = current + (element.dataset.suffix || '');
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        };

        requestAnimationFrame(updateCounter);
    }

    easeOutQuart(t) {
        return 1 - (--t) * t * t * t;
    }

    // Particle background animation
    initializeParticles() {
        const canvas = document.getElementById('particles-canvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const particles = [];
        const particleCount = 50;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Create particles
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                radius: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.2
            });
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach(particle => {
                // Update position
                particle.x += particle.vx;
                particle.y += particle.vy;

                // Wrap around edges
                if (particle.x < 0) particle.x = canvas.width;
                if (particle.x > canvas.width) particle.x = 0;
                if (particle.y < 0) particle.y = canvas.height;
                if (particle.y > canvas.height) particle.y = 0;

                // Draw particle
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(13, 110, 253, ${particle.opacity})`;
                ctx.fill();
            });

            requestAnimationFrame(animate);
        };

        animate();

        // Handle resize
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    }

    // Real-time performance updates
    initializeRealTimeUpdates() {
        const updateInterval = 30000; // 30 seconds
        
        setInterval(async () => {
            try {
                const response = await fetch('/api/demo/stats');
                const stats = await response.json();
                this.updatePerformanceMetrics(stats);
            } catch (error) {
                console.log('Real-time updates unavailable');
            }
        }, updateInterval);
    }

    updatePerformanceMetrics(stats) {
        const metrics = document.querySelectorAll('[data-metric]');
        metrics.forEach(metric => {
            const metricName = metric.dataset.metric;
            const value = this.getNestedValue(stats, metricName);
            if (value !== undefined) {
                metric.textContent = value;
            }
        });
    }

    getNestedValue(obj, path) {
        return path.split('.').reduce((curr, prop) => curr && curr[prop], obj);
    }
}

// Enhanced chart utilities with animations
class EnhancedChartUtils extends ChartUtils {
    static createAnimatedSpeedChart(ctx, data) {
        return new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(data.pip),
                datasets: [{
                    label: 'pip (seconds)',
                    data: Object.values(data.pip),
                    backgroundColor: 'rgba(220, 53, 69, 0.8)',
                    borderColor: 'rgba(220, 53, 69, 1)',
                    borderWidth: 2,
                    borderRadius: 8,
                    borderSkipped: false,
                }, {
                    label: 'uv (seconds)',
                    data: Object.values(data.uv),
                    backgroundColor: 'rgba(25, 135, 84, 0.8)',
                    borderColor: 'rgba(25, 135, 84, 1)',
                    borderWidth: 2,
                    borderRadius: 8,
                    borderSkipped: false,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    duration: 2000,
                    easing: 'easeInOutQuart',
                    delay: (context) => context.dataIndex * 200
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Time (seconds)',
                            font: { size: 14, weight: 'bold' }
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            usePointStyle: true,
                            font: { size: 12, weight: 'bold' }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: 'white',
                        bodyColor: 'white',
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                        borderWidth: 1,
                        cornerRadius: 8,
                        callbacks: {
                            afterLabel: (context) => {
                                const improvement = context.datasetIndex === 1 ? 
                                    `${Math.round(data.pip[context.label] / data.uv[context.label])}x faster` : '';
                                return improvement;
                            }
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                }
            }
        });
    }

    static createRadialProgressChart(ctx, percentage, label) {
        return new Chart(ctx, {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: [percentage, 100 - percentage],
                    backgroundColor: [
                        'rgba(25, 135, 84, 0.8)',
                        'rgba(233, 236, 239, 0.3)'
                    ],
                    borderWidth: 0,
                    cutout: '80%'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    animateRotate: true,
                    duration: 2000
                },
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false }
                }
            },
            plugins: [{
                id: 'centerText',
                beforeDraw: (chart) => {
                    const { ctx, chartArea } = chart;
                    const centerX = (chartArea.left + chartArea.right) / 2;
                    const centerY = (chartArea.top + chartArea.bottom) / 2;
                    
                    ctx.save();
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.font = 'bold 24px system-ui';
                    ctx.fillStyle = '#198754';
                    ctx.fillText(`${percentage}%`, centerX, centerY - 10);
                    ctx.font = '12px system-ui';
                    ctx.fillStyle = '#666';
                    ctx.fillText(label, centerX, centerY + 15);
                    ctx.restore();
                }
            }]
        });
    }
}

// Interactive demo manager
class InteractiveDemoManager {
    constructor() {
        this.activeDemo = null;
        this.demoData = new Map();
        this.setupDemoSwitcher();
    }

    setupDemoSwitcher() {
        const demoButtons = document.querySelectorAll('[data-demo]');
        demoButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const demoType = e.target.dataset.demo;
                this.switchDemo(demoType);
            });
        });
    }

    async switchDemo(demoType) {
        if (this.activeDemo === demoType) return;

        // Load demo data if not cached
        if (!this.demoData.has(demoType)) {
            const data = await this.loadDemoData(demoType);
            this.demoData.set(demoType, data);
        }

        this.activeDemo = demoType;
        this.renderDemo(demoType, this.demoData.get(demoType));
    }

    async loadDemoData(demoType) {
        const endpoints = {
            'speed': '/api/benchmark/install-speed',
            'dependencies': '/api/dependencies/analysis',
            'project': '/api/project/structure',
            'python': '/api/python/versions'
        };

        try {
            const response = await fetch(endpoints[demoType]);
            return await response.json();
        } catch (error) {
            console.error(`Failed to load ${demoType} demo data:`, error);
            return null;
        }
    }

    renderDemo(demoType, data) {
        const container = document.getElementById('demo-container');
        if (!container || !data) return;

        // Clear existing content
        container.innerHTML = '';

        // Render based on demo type
        switch (demoType) {
            case 'speed':
                this.renderSpeedDemo(container, data);
                break;
            case 'dependencies':
                this.renderDependenciesDemo(container, data);
                break;
            case 'project':
                this.renderProjectDemo(container, data);
                break;
            case 'python':
                this.renderPythonDemo(container, data);
                break;
        }
    }

    renderSpeedDemo(container, data) {
        // Implementation for speed demo rendering
        container.innerHTML = `
            <div class="demo-section">
                <h3>Package Installation Speed</h3>
                <canvas id="speed-chart" width="400" height="200"></canvas>
            </div>
        `;
        
        const ctx = document.getElementById('speed-chart').getContext('2d');
        EnhancedChartUtils.createAnimatedSpeedChart(ctx, data);
    }
}

// Initialize all advanced features
document.addEventListener('DOMContentLoaded', () => {
    const advancedFeatures = new AdvancedDemoFeatures();
    const demoManager = new InteractiveDemoManager();
    
    // Add enhanced button effects
    document.querySelectorAll('.btn').forEach(btn => {
        btn.classList.add('demo-button');
    });
});

// Export for use in other files
window.UVDemo = UVDemo;
window.ChartUtils = ChartUtils;
window.EnhancedChartUtils = EnhancedChartUtils;
window.AdvancedDemoFeatures = AdvancedDemoFeatures;