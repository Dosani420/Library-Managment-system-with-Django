// Enhanced UI JavaScript - enhanced_ui.js

// ========================================
// TOAST NOTIFICATION SYSTEM
// ========================================

class ToastManager {
    constructor() {
        this.container = this.createContainer();
    }

    createContainer() {
        let container = document.querySelector('.toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'toast-container';
            document.body.appendChild(container);
        }
        return container;
    }

    show(message, type = 'info', duration = 5000) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;

        const icons = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ℹ'
        };

        const titles = {
            success: 'Success',
            error: 'Error',
            warning: 'Warning',
            info: 'Info'
        };

        toast.innerHTML = `
            <div class="toast-icon">${icons[type]}</div>
            <div class="toast-content">
                <div class="toast-title">${titles[type]}</div>
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close" onclick="this.parentElement.remove()">×</button>
        `;

        this.container.appendChild(toast);

        // Auto remove after duration
        if (duration > 0) {
            setTimeout(() => {
                toast.style.animation = 'slideInRight 0.3s ease-out reverse';
                setTimeout(() => toast.remove(), 300);
            }, duration);
        }

        return toast;
    }

    success(message, duration) {
        return this.show(message, 'success', duration);
    }

    error(message, duration) {
        return this.show(message, 'error', duration);
    }

    warning(message, duration) {
        return this.show(message, 'warning', duration);
    }

    info(message, duration) {
        return this.show(message, 'info', duration);
    }
}

// Initialize toast manager
const toast = new ToastManager();

// ========================================
// LOADING STATES
// ========================================

function showLoading(element) {
    const originalContent = element.innerHTML;
    element.dataset.originalContent = originalContent;
    element.disabled = true;
    element.innerHTML = `
        <span class="spinner" style="width: 16px; height: 16px; border-width: 2px; display: inline-block; vertical-align: middle;"></span>
        <span style="margin-left: 0.5rem;">Loading...</span>
    `;
}

function hideLoading(element) {
    element.disabled = false;
    element.innerHTML = element.dataset.originalContent || element.innerHTML;
}

// ========================================
// CONFIRMATION DIALOGS
// ========================================

function showConfirmDialog(options) {
    const {
        title = 'Confirm Action',
        message = 'Are you sure you want to proceed?',
        confirmText = 'Confirm',
        cancelText = 'Cancel',
        onConfirm = () => { },
        onCancel = () => { },
        type = 'warning'
    } = options;

    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';

    const icons = {
        warning: '⚠️',
        danger: '🗑️',
        info: 'ℹ️',
        success: '✓'
    };

    overlay.innerHTML = `
        <div class="modal-content">
            <div style="text-align: center; margin-bottom: 1.5rem;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">${icons[type]}</div>
                <h2 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 0.5rem;">${title}</h2>
                <p style="color: var(--text-secondary);">${message}</p>
            </div>
            <div style="display: flex; gap: 1rem; justify-content: center;">
                <button class="btn btn-secondary cancel-btn">${cancelText}</button>
                <button class="btn btn-primary confirm-btn">${confirmText}</button>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);

    const confirmBtn = overlay.querySelector('.confirm-btn');
    const cancelBtn = overlay.querySelector('.cancel-btn');

    confirmBtn.onclick = () => {
        onConfirm();
        overlay.remove();
    };

    cancelBtn.onclick = () => {
        onCancel();
        overlay.remove();
    };

    overlay.onclick = (e) => {
        if (e.target === overlay) {
            onCancel();
            overlay.remove();
        }
    };

    return overlay;
}

// ========================================
// SMOOTH SCROLL
// ========================================

function smoothScrollTo(element, duration = 500) {
    const target = typeof element === 'string' ? document.querySelector(element) : element;
    if (!target) return;

    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = ease(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }

    function ease(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }

    requestAnimationFrame(animation);
}

// ========================================
// FORM VALIDATION HELPERS
// ========================================

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[\d\s\-\+\(\)]+$/;
    return re.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

function showFieldError(input, message) {
    // Remove existing error
    const existingError = input.parentElement.querySelector('.field-error');
    if (existingError) existingError.remove();

    // Add error message
    const error = document.createElement('div');
    error.className = 'field-error';
    error.style.cssText = 'color: var(--danger); font-size: 0.85rem; margin-top: 0.25rem;';
    error.textContent = message;
    input.parentElement.appendChild(error);

    // Add error styling to input
    input.style.borderColor = 'var(--danger)';
}

function clearFieldError(input) {
    const error = input.parentElement.querySelector('.field-error');
    if (error) error.remove();
    input.style.borderColor = '';
}

// ========================================
// COPY TO CLIPBOARD
// ========================================

async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        toast.success('Copied to clipboard!');
        return true;
    } catch (err) {
        toast.error('Failed to copy to clipboard');
        return false;
    }
}

// ========================================
// DEBOUNCE UTILITY
// ========================================

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ========================================
// LOCAL STORAGE HELPERS
// ========================================

const storage = {
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error('Storage error:', e);
            return false;
        }
    },

    get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (e) {
            console.error('Storage error:', e);
            return defaultValue;
        }
    },

    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (e) {
            console.error('Storage error:', e);
            return false;
        }
    },

    clear() {
        try {
            localStorage.clear();
            return true;
        } catch (e) {
            console.error('Storage error:', e);
            return false;
        }
    }
};

// ========================================
// ANIMATION OBSERVERS
// ========================================

// Intersection Observer for scroll animations
const observeElements = () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
};

// ========================================
// INITIALIZE ON DOM READY
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize scroll animations
    observeElements();

    // Add animation classes to stat cards
    document.querySelectorAll('.stat-card').forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.add('fade-in');
    });

    // Add animation to feature cards
    document.querySelectorAll('.feature-card, .book-card').forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.add('scale-in');
    });

    // Convert Django messages to toasts
    const djangoMessages = document.querySelectorAll('[data-django-message]');
    djangoMessages.forEach(msg => {
        const type = msg.dataset.messageType || 'info';
        const text = msg.textContent.trim();
        toast.show(text, type);
        msg.remove();
    });

    // Enhanced form submission
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', function (e) {
            const submitBtn = this.querySelector('button[type="submit"]');
            if (submitBtn && !submitBtn.disabled) {
                showLoading(submitBtn);
            }
        });
    });

    // Add ripple effect to buttons
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function (e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.5);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;

            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        });
    });
});

// Add ripple animation
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ========================================
// BASE TEMPLATE FUNCTIONALITY
// ========================================

class DashboardBase {
    static initSidebar() {
        const sidebar = document.getElementById('sidebar');
        const toggleBtn = document.getElementById('sidebarToggle');
        if (!sidebar || !toggleBtn) return;

        const body = document.body;

        // Check local storage
        if (storage.get('sidebar-collapsed', false)) {
            body.classList.add('collapsed');
        }

        toggleBtn.addEventListener('click', () => {
            body.classList.toggle('collapsed');
            storage.set('sidebar-collapsed', body.classList.contains('collapsed'));
        });
    }

    static initDropdown() {
        const profileTrigger = document.querySelector('.profile-trigger');
        if (!profileTrigger) return;

        profileTrigger.addEventListener('click', function (e) {
            e.stopPropagation();
            const dropdown = document.getElementById('myDropdown');
            if (dropdown) {
                dropdown.classList.toggle('show');
            }
        });

        // Close dropdown if clicked outside
        document.addEventListener('click', function (event) {
            if (!event.target.closest('.profile-trigger') && !event.target.closest('.dropdown-content')) {
                const dropdowns = document.getElementsByClassName('dropdown-content');
                for (let i = 0; i < dropdowns.length; i++) {
                    dropdowns[i].classList.remove('show');
                }
            }
        });
    }

    static init() {
        this.initSidebar();
        this.initDropdown();
    }
}

// ========================================
// THEME MANAGER
// ========================================

class ThemeManager {
    constructor() {
        this.theme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        console.log('ThemeManager initializing...');
        // Apply saved theme
        this.applyTheme(this.theme);

        // Listen for theme toggle clicks (header button)
        document.addEventListener('click', (e) => {
            const toggle = e.target.closest('#themeToggle');
            if (toggle) {
                console.log('Theme toggle clicked');
                e.preventDefault(); // Prevent any default behavior
                this.toggleTheme();
            }
        });

        // Listen for radio button changes (settings page)
        const themeRadios = document.querySelectorAll('input[name="theme"]');
        themeRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                console.log('Theme radio changed', e.target.value);
                this.setTheme(e.target.value);
            });
        });

        // Initialize radio buttons if they exist
        this.updateRadios();
    }

    setTheme(newTheme) {
        console.log('Setting theme to:', newTheme);
        this.theme = newTheme;
        localStorage.setItem('theme', newTheme);
        this.applyTheme(newTheme);
        this.updateRadios();
        this.updateToggleButton();
    }

    toggleTheme() {
        const newTheme = this.theme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }

    applyTheme(theme) {
        const root = document.documentElement;
        if (theme === 'dark') {
            root.setAttribute('data-theme', 'dark');
            document.body.setAttribute('data-theme', 'dark');
        } else {
            root.removeAttribute('data-theme');
            document.body.removeAttribute('data-theme');
        }
    }

    updateRadios() {
        const radio = document.querySelector(`input[name="theme"][value="${this.theme}"]`);
        if (radio) {
            radio.checked = true;
            // Also update parent visual state if needed
            document.querySelectorAll('.theme-option').forEach(opt => {
                if (opt.querySelector(`input[value="${this.theme}"]`)) {
                    opt.classList.add('selected');
                } else {
                    opt.classList.remove('selected');
                }
            });
        }
    }

    updateToggleButton() {
        const btn = document.querySelector('#themeToggle');
        if (btn) {
            // Lucide replaces the <i> tag with an <svg>, so we can't just find 'i'.
            // Instead, we should clear the button content and re-add the icon with the correct attribute.
            const iconName = this.theme === 'dark' ? 'moon' : 'sun';

            // Re-create the inner HTML
            btn.innerHTML = `<i data-lucide="${iconName}" style="width: 20px; height: 20px;"></i>`;

            // Re-initialize icons just for this element if possible, or globally
            if (window.lucide) {
                window.lucide.createIcons();
            }
        }
    }
}

// Initialize Theme Manager
const themeManager = new ThemeManager();

// ========================================
// REUSABLE SEARCH & FILTER COMPONENT
// ========================================

class SearchableList {
    constructor(options) {
        this.container = typeof options.container === 'string'
            ? document.querySelector(options.container)
            : options.container;
        this.itemsSelector = options.itemsSelector;
        this.searchInput = typeof options.searchInput === 'string'
            ? document.querySelector(options.searchInput)
            : options.searchInput;
        this.filters = options.filters || {};
        this.sortSelect = typeof options.sortSelect === 'string'
            ? document.querySelector(options.sortSelect)
            : options.sortSelect;
        this.emptyStateElement = options.emptyStateElement
            ? (typeof options.emptyStateElement === 'string'
                ? document.querySelector(options.emptyStateElement)
                : options.emptyStateElement)
            : null;
        this.resultsCountElement = options.resultsCountElement
            ? (typeof options.resultsCountElement === 'string'
                ? document.querySelector(options.resultsCountElement)
                : options.resultsCountElement)
            : null;
        this.onUpdate = options.onUpdate || null;
        this.searchFields = options.searchFields || ['title', 'author'];
        this.sortOptions = options.sortOptions || {};

        this.items = Array.from(document.querySelectorAll(this.itemsSelector));
        this.init();
    }

    init() {
        if (!this.searchInput) return;

        // Debounced search
        const debouncedSearch = debounce(() => this.performSearch(), 300);

        // Event listeners
        this.searchInput.addEventListener('input', debouncedSearch);

        // Filter listeners
        Object.values(this.filters).forEach(filter => {
            if (filter) {
                filter.addEventListener('change', () => this.performSearch());
            }
        });

        // Sort listener
        if (this.sortSelect) {
            this.sortSelect.addEventListener('change', () => this.performSort());
        }

        // Reset button
        const resetBtn = document.querySelector('[data-reset-filters]');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetFilters());
        }
    }

    performSearch() {
        const searchTerm = this.searchInput ? this.searchInput.value.toLowerCase() : '';
        let visibleCount = 0;

        this.items.forEach(item => {
            let matchesSearch = true;
            let matchesFilters = true;

            // Search matching
            if (searchTerm) {
                matchesSearch = this.searchFields.some(field => {
                    const value = item.dataset[field] || '';
                    return value.toLowerCase().includes(searchTerm);
                });
            }

            // Filter matching
            Object.entries(this.filters).forEach(([key, filterElement]) => {
                if (filterElement && filterElement.value) {
                    const filterValue = filterElement.value.toLowerCase();
                    const itemValue = (item.dataset[key] || '').toLowerCase();

                    if (key === 'fine') {
                        // Special handling for fine filter
                        const fine = parseFloat(item.dataset.fine) || 0;
                        if (filterValue === 'with-fine') {
                            matchesFilters = matchesFilters && fine > 0;
                        } else if (filterValue === 'no-fine') {
                            matchesFilters = matchesFilters && fine === 0;
                        }
                    } else if (key === 'status') {
                        // Special handling for status filter
                        const status = (item.dataset.status || '').toLowerCase();
                        matchesFilters = matchesFilters && (!filterValue || status === filterValue);
                    } else {
                        matchesFilters = matchesFilters && (!filterValue || itemValue === filterValue);
                    }
                }
            });

            // Show/hide item
            if (matchesSearch && matchesFilters) {
                item.style.display = '';
                item.classList.remove('hidden');
                visibleCount++;
            } else {
                item.style.display = 'none';
                item.classList.add('hidden');
            }
        });

        // Update results count
        if (this.resultsCountElement) {
            this.resultsCountElement.textContent = visibleCount;
        }

        // Show/hide empty state
        if (this.emptyStateElement) {
            if (visibleCount === 0 && this.items.length > 0) {
                if (this.container) this.container.style.display = 'none';
                this.emptyStateElement.style.display = 'block';
            } else {
                if (this.container) this.container.style.display = '';
                this.emptyStateElement.style.display = 'none';
            }
        }

        // Callback
        if (this.onUpdate) {
            this.onUpdate(visibleCount, this.items.filter(item => !item.classList.contains('hidden')));
        }

        // Perform sort after filtering
        this.performSort();
    }

    performSort() {
        if (!this.sortSelect) return;

        const sortValue = this.sortSelect.value;
        const visibleItems = this.items.filter(item => !item.classList.contains('hidden'));

        visibleItems.sort((a, b) => {
            // Use custom sort options if provided
            if (this.sortOptions[sortValue]) {
                return this.sortOptions[sortValue](a, b);
            }

            // Default sort options
            switch (sortValue) {
                case 'title-asc':
                    return (a.dataset.title || '').localeCompare(b.dataset.title || '');
                case 'title-desc':
                    return (b.dataset.title || '').localeCompare(a.dataset.title || '');
                case 'author-asc':
                    return (a.dataset.author || '').localeCompare(b.dataset.author || '');
                case 'price-low':
                    return parseFloat(a.dataset.price || 0) - parseFloat(b.dataset.price || 0);
                case 'price-high':
                    return parseFloat(b.dataset.price || 0) - parseFloat(a.dataset.price || 0);
                case 'fine-high':
                    return parseFloat(b.dataset.fine || 0) - parseFloat(a.dataset.fine || 0);
                case 'fine-low':
                    return parseFloat(a.dataset.fine || 0) - parseFloat(b.dataset.fine || 0);
                case 'newest':
                    return new Date(b.dataset.date || b.dataset.borrowDate || 0) - new Date(a.dataset.date || a.dataset.borrowDate || 0);
                case 'oldest':
                    return new Date(a.dataset.date || a.dataset.borrowDate || 0) - new Date(b.dataset.date || b.dataset.borrowDate || 0);
                default:
                    return 0;
            }
        });

        // Re-append sorted items
        visibleItems.forEach(item => {
            if (this.container && this.container.nodeName !== 'TBODY') {
                this.container.appendChild(item);
            } else if (this.container && this.container.nodeName === 'TBODY') {
                // For tbody, append to the container directly
                this.container.appendChild(item);
            } else {
                // Fallback to parent
                const parent = item.parentElement;
                if (parent) {
                    parent.appendChild(item);
                }
            }
        });
    }

    resetFilters() {
        if (this.searchInput) this.searchInput.value = '';
        Object.values(this.filters).forEach(filter => {
            if (filter) filter.value = '';
        });
        if (this.sortSelect) this.sortSelect.value = 'newest';
        this.performSearch();
    }
}

// ========================================
// VIEW TOGGLE FUNCTIONALITY
// ========================================

class ViewToggle {
    constructor(options) {
        this.gridView = typeof options.gridView === 'string'
            ? document.querySelector(options.gridView)
            : options.gridView;
        this.listView = typeof options.listView === 'string'
            ? document.querySelector(options.listView)
            : options.listView;
        this.gridBtn = typeof options.gridBtn === 'string'
            ? document.querySelector(options.gridBtn)
            : options.gridBtn;
        this.listBtn = typeof options.listBtn === 'string'
            ? document.querySelector(options.listBtn)
            : options.listBtn;
        this.onSwitch = options.onSwitch || null;

        this.init();
    }

    init() {
        if (this.gridBtn) {
            this.gridBtn.addEventListener('click', () => this.switchView('grid'));
        }
        if (this.listBtn) {
            this.listBtn.addEventListener('click', () => this.switchView('list'));
        }
    }

    switchView(view) {
        if (view === 'grid') {
            if (this.gridView) this.gridView.style.display = 'grid';
            if (this.listView) this.listView.style.display = 'none';
            if (this.gridBtn) {
                this.gridBtn.style.background = 'var(--bg-surface)';
                this.gridBtn.style.boxShadow = '0 2px 4px var(--shadow-sm)';
            }
            if (this.listBtn) {
                this.listBtn.style.background = 'transparent';
                this.listBtn.style.boxShadow = 'none';
            }
        } else {
            if (this.gridView) this.gridView.style.display = 'none';
            if (this.listView) this.listView.style.display = 'block';
            if (this.listBtn) {
                this.listBtn.style.background = 'var(--bg-surface)';
                this.listBtn.style.boxShadow = '0 2px 4px var(--shadow-sm)';
            }
            if (this.gridBtn) {
                this.gridBtn.style.background = 'transparent';
                this.gridBtn.style.boxShadow = 'none';
            }
        }

        if (this.onSwitch) {
            this.onSwitch(view);
        }
    }
}

// ========================================
// PAGE-SPECIFIC FUNCTIONS
// ========================================

// Delete Book Function
function deleteBook(bookId, bookTitle) {
    showConfirmDialog({
        title: 'Delete Book',
        message: `Are you sure you want to delete "${bookTitle}"? This action cannot be undone.`,
        type: 'danger',
        confirmText: 'Delete',
        onConfirm: () => {
            window.location.href = `/delete_book/${bookId}`;
        }
    });
}

// Return Book Function
function returnBook(bookId, bookTitle) {
    showConfirmDialog({
        title: 'Return Book',
        message: `Are you sure you want to return "${bookTitle}"?`,
        type: 'info',
        confirmText: 'Return Book',
        onConfirm: () => {
            window.location.href = `/return_book/${bookId}`;
        }
    });
}

// Toggle Initial ID (for signup form)
function toggleInitialId() {
    const roleSelect = document.getElementById('role');
    const initialIdGroup = document.getElementById('initialIdGroup');
    if (!roleSelect || !initialIdGroup) return;

    if (roleSelect.value === 'staff') {
        initialIdGroup.style.display = 'block';
        const initialIdInput = document.getElementById('initial_id');
        if (initialIdInput) initialIdInput.required = true;
    } else {
        initialIdGroup.style.display = 'none';
        const initialIdInput = document.getElementById('initial_id');
        if (initialIdInput) initialIdInput.required = false;
    }
}

// Image Upload Trigger
function triggerImageUpload(inputId) {
    const input = document.getElementById(inputId);
    if (input) input.click();
}

// ========================================
// PAGE INITIALIZERS
// ========================================

function initHistoryPage() {
    const searchInput = document.getElementById('searchInput');
    const historyTableBody = document.getElementById('historyTableBody');
    if (!searchInput || !historyTableBody) return;

    let historyList = new SearchableList({
        container: historyTableBody,
        itemsSelector: '.history-row',
        searchInput: searchInput,
        filters: {
            fine: document.getElementById('fineFilter')
        },
        sortSelect: document.getElementById('sortFilter'),
        emptyStateElement: document.getElementById('noResultsMessage'),
        resultsCountElement: document.getElementById('resultsCount'),
        searchFields: ['title', 'author'],
        onUpdate: (visibleCount, visibleItems) => {
            // Update stats
            let totalFines = 0;
            let returnedCount = 0;

            visibleItems.forEach(row => {
                const fine = parseFloat(row.dataset.fine) || 0;
                totalFines += fine;
                if (row.dataset.returnDate) {
                    returnedCount++;
                }
            });

            const totalFinesElement = document.getElementById('totalFinesAmount');
            const returnedCountElement = document.getElementById('returnedCount');
            if (totalFinesElement) totalFinesElement.textContent = totalFines;
            if (returnedCountElement) returnedCountElement.textContent = returnedCount;
        }
    });
}

function initBooksPage() {
    const searchInput = document.getElementById('searchInput');
    const gridView = document.getElementById('gridView');
    if (!searchInput || !gridView) return;

    // Search and filter
    let bookList = new SearchableList({
        container: gridView,
        itemsSelector: '.book-card',
        searchInput: searchInput,
        filters: {
            genre: document.getElementById('genreFilter')
        },
        sortSelect: document.getElementById('sortFilter'),
        emptyStateElement: document.querySelector('#gridView .empty-state'),
        searchFields: ['title', 'author', 'genre']
    });

    // View toggle
    if (document.getElementById('gridViewBtn') && document.getElementById('listViewBtn')) {
        new ViewToggle({
            gridView: gridView,
            listView: document.getElementById('listView'),
            gridBtn: document.getElementById('gridViewBtn'),
            listBtn: document.getElementById('listViewBtn'),
            onSwitch: () => {
                // Update bookList items reference when view changes
                bookList.items = Array.from(document.querySelectorAll('.book-card'));
            }
        });
    }
}

function initMembersPage() {
    const searchInput = document.getElementById('searchInput');
    const gridView = document.getElementById('gridView');
    if (!searchInput || !gridView) return;

    // Search and filter
    let memberList = new SearchableList({
        container: gridView,
        itemsSelector: '.member-card',
        searchInput: searchInput,
        filters: {
            status: document.getElementById('statusFilter')
        },
        sortSelect: document.getElementById('sortFilter'),
        emptyStateElement: document.querySelector('#gridView .empty-state'),
        searchFields: ['first', 'last', 'id']
    });

    // View toggle
    if (document.getElementById('gridViewBtn') && document.getElementById('listViewBtn')) {
        new ViewToggle({
            gridView: gridView,
            listView: document.getElementById('listView'),
            gridBtn: document.getElementById('gridViewBtn'),
            listBtn: document.getElementById('listViewBtn'),
            onSwitch: () => {
                memberList.items = Array.from(document.querySelectorAll('.member-card'));
            }
        });
    }
}

function initManageBooksPage() {
    // Initialize delete book buttons
    document.querySelectorAll('[data-delete-book]').forEach(btn => {
        btn.addEventListener('click', function () {
            const bookId = this.dataset.deleteBook;
            const bookTitle = this.dataset.bookTitle || 'this book';
            deleteBook(bookId, bookTitle);
        });
    });
}

function initBorrowedBooksPage() {
    // Initialize return book buttons
    document.querySelectorAll('[data-return-book]').forEach(btn => {
        btn.addEventListener('click', function () {
            const bookId = this.dataset.returnBook;
            const bookTitle = this.dataset.bookTitle || 'this book';
            returnBook(bookId, bookTitle);
        });
    });
}

function initSignupPage() {
    const roleSelect = document.getElementById('role');
    if (roleSelect) {
        roleSelect.addEventListener('change', toggleInitialId);
        // Initialize on page load
        toggleInitialId();
    }
}

function initImageUploads() {
    // Image upload triggers
    document.querySelectorAll('[data-trigger-upload]').forEach(btn => {
        btn.addEventListener('click', function () {
            const inputId = this.dataset.triggerUpload;
            triggerImageUpload(inputId);
        });
    });
}

// ========================================
// SETTINGS PAGE FUNCTIONALITY
// ========================================

function initSettingsPage() {
    // Check if using tab-based navigation (staff) or sidebar navigation (member)
    const tabButtons = document.querySelectorAll('.staff-tab-btn');
    const navItems = document.querySelectorAll('.settings-nav-item');
    const tabContents = document.querySelectorAll('.staff-tab-content');
    const sections = document.querySelectorAll('.settings-section');

    // Tab-based navigation (Staff Settings)
    if (tabButtons.length > 0) {
        // Show first tab by default
        if (tabContents.length > 0) {
            tabContents[0].style.display = 'block';
        }

        tabButtons.forEach(btn => {
            btn.addEventListener('click', function () {
                const targetTab = this.dataset.tab;

                // Update active tab button
                tabButtons.forEach(tab => tab.classList.remove('active'));
                this.classList.add('active');

                // Show/hide tab contents
                tabContents.forEach(content => {
                    if (content.id === `${targetTab}-tab`) {
                        content.style.display = 'block';
                    } else {
                        content.style.display = 'none';
                    }
                });

                // Initialize Lucide icons for new tab
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }
            });
        });
    }

    // Sidebar-based navigation (Member Settings)
    if (navItems.length > 0 && sections.length > 0) {
        // Show first section by default
        sections[0].style.display = 'block';

        navItems.forEach(item => {
            item.addEventListener('click', function () {
                const targetSection = this.dataset.section;

                // Update active nav item
                navItems.forEach(nav => nav.classList.remove('active'));
                this.classList.add('active');

                // Show/hide sections
                sections.forEach(section => {
                    if (section.dataset.section === targetSection) {
                        section.style.display = 'block';
                    } else {
                        section.style.display = 'none';
                    }
                });

                // Initialize Lucide icons for new section
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }
            });
        });
    }

    // Edit Profile Toggle
    const editProfileBtn = document.getElementById('editProfileBtn');
    const saveProfileBtn = document.getElementById('saveProfileBtn');
    const cancelProfileBtn = document.getElementById('cancelProfileBtn');
    const profileForm = document.getElementById('profileForm');
    const profileInputs = profileForm ? profileForm.querySelectorAll('input[type="text"], input[type="email"], textarea') : [];

    // Store original values
    let originalValues = {};
    if (profileInputs.length > 0) {
        profileInputs.forEach(input => {
            if (input.id !== 'lib_id') {
                originalValues[input.id] = input.value;
            }
        });
    }

    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', function () {
            profileInputs.forEach(input => {
                if (input.id !== 'lib_id') {
                    input.disabled = false;
                    input.style.background = 'white';
                    input.style.borderColor = 'var(--border-light)';
                }
            });
            editProfileBtn.style.display = 'none';
            if (saveProfileBtn) saveProfileBtn.disabled = false;
            if (cancelProfileBtn) cancelProfileBtn.style.display = 'inline-flex';
        });
    }

    if (cancelProfileBtn && profileForm) {
        cancelProfileBtn.addEventListener('click', function () {
            // Restore original values
            profileInputs.forEach(input => {
                if (input.id !== 'lib_id' && originalValues[input.id] !== undefined) {
                    input.value = originalValues[input.id];
                    input.disabled = true;
                    input.style.background = 'var(--bg-body)';
                    input.style.borderColor = 'var(--border-light)';
                }
            });
            if (editProfileBtn) editProfileBtn.style.display = 'inline-flex';
            if (saveProfileBtn) saveProfileBtn.disabled = true;
            cancelProfileBtn.style.display = 'none';

            // Restore theme if preferences were changed but not saved
            const savedTheme = storage.get('saved-theme', 'light');
            const tempTheme = storage.get('temp-theme', null);
            if (tempTheme && tempTheme !== savedTheme) {
                // User changed theme but cancelled, restore to saved theme
                storage.remove('temp-theme');
                const themeToApply = savedTheme || 'light';
                if (themeToApply === 'dark') {
                    document.documentElement.setAttribute('data-theme', 'dark');
                } else {
                    document.documentElement.removeAttribute('data-theme');
                }
                // Update radio buttons
                const themeRadios = document.querySelectorAll('input[name="theme"]');
                const themeOptions = document.querySelectorAll('.theme-option');
                themeRadios.forEach(radio => {
                    if (radio.value === themeToApply) {
                        radio.checked = true;
                        const parentOption = radio.closest('.theme-option');
                        if (parentOption) {
                            themeOptions.forEach(opt => {
                                if (opt === parentOption) {
                                    opt.style.borderColor = 'var(--primary)';
                                    opt.style.background = 'rgba(99, 102, 241, 0.1)';
                                } else {
                                    opt.style.borderColor = 'var(--border-light)';
                                    opt.style.background = '';
                                }
                            });
                        }
                    }
                });
            }
        });
    }

    // Delete Account Confirmation
    const deleteAccountBtn = document.querySelector('[data-delete-account]');
    if (deleteAccountBtn) {
        deleteAccountBtn.addEventListener('click', function () {
            showConfirmDialog({
                title: 'Delete Account',
                message: 'Are you sure you want to permanently delete your account? This action cannot be undone and all your data will be lost.',
                type: 'danger',
                confirmText: 'Delete Account',
                cancelText: 'Cancel',
                onConfirm: () => {
                    // This would trigger a form submission or API call
                    toast.warning('Account deletion functionality needs backend implementation');
                }
            });
        });
    }

    // Request Data Download
    const requestDataBtn = document.querySelector('[data-request-data]');
    if (requestDataBtn) {
        requestDataBtn.addEventListener('click', function () {
            showConfirmDialog({
                title: 'Request Data Download',
                message: 'Your data will be prepared and sent to your email address. This may take a few minutes.',
                type: 'info',
                confirmText: 'Request',
                onConfirm: () => {
                    toast.info('Data download request submitted. You will receive an email when ready.');
                }
            });
        });
    }

    // Contact Admin/Staff
    const contactAdminBtn = document.querySelector('[data-contact-admin]');
    if (contactAdminBtn) {
        contactAdminBtn.addEventListener('click', function () {
            toast.info('Contact admin functionality needs backend implementation');
        });
    }

    const contactStaffBtn = document.querySelector('[data-contact-staff]');
    if (contactStaffBtn) {
        contactStaffBtn.addEventListener('click', function () {
            toast.info('Contact staff functionality needs backend implementation');
        });
    }

    // Report Issue
    const reportIssueBtn = document.querySelector('[data-report-issue]');
    if (reportIssueBtn) {
        reportIssueBtn.addEventListener('click', function () {
            // For sidebar navigation (member)
            const section = document.getElementById('support-section');
            if (section) {
                section.style.display = 'block';
                navItems.forEach(nav => nav.classList.remove('active'));
                const supportNav = document.querySelector('[data-section="support"]');
                if (supportNav) supportNav.classList.add('active');
            }
            // For tab navigation (staff)
            const supportTab = document.getElementById('support-tab');
            if (supportTab) {
                document.querySelectorAll('.staff-tab-content').forEach(content => {
                    content.style.display = 'none';
                });
                supportTab.style.display = 'block';
                tabButtons.forEach(tab => tab.classList.remove('active'));
                const supportTabBtn = document.querySelector('[data-tab="support"]');
                if (supportTabBtn) supportTabBtn.classList.add('active');
            }
        });
    }

    // Help & FAQ
    const helpFaqBtn = document.querySelector('[data-help-faq]');
    if (helpFaqBtn) {
        helpFaqBtn.addEventListener('click', function () {
            toast.info('FAQ page needs to be created');
        });
    }

    // View Activity
    const viewActivityBtn = document.querySelector('[data-view-activity]');
    if (viewActivityBtn) {
        viewActivityBtn.addEventListener('click', function () {
            toast.info('Login activity view needs backend implementation');
        });
    }

    // Manage Devices
    const manageDevicesBtn = document.querySelector('[data-manage-devices]');
    if (manageDevicesBtn) {
        manageDevicesBtn.addEventListener('click', function () {
            toast.info('Device management needs backend implementation');
        });
    }

    // Theme Selection with Immediate Application
    const themeOptions = document.querySelectorAll('.theme-option');
    const themeRadios = document.querySelectorAll('input[name="theme"]');

    // Function to apply theme
    const applyTheme = (theme) => {
        const html = document.documentElement;
        if (theme === 'dark') {
            html.setAttribute('data-theme', 'dark');
        } else {
            html.removeAttribute('data-theme');
        }
        // Store temporary theme in localStorage (will be cleared if not saved)
        storage.set('temp-theme', theme);
    };

    // Function to update theme option styling
    const updateThemeOptionStyling = (selectedOption) => {
        themeOptions.forEach(opt => {
            if (opt === selectedOption) {
                opt.style.borderColor = 'var(--primary)';
                opt.style.background = 'rgba(99, 102, 241, 0.1)';
            } else {
                opt.style.borderColor = 'var(--border-light)';
                opt.style.background = '';
            }
        });
    };

    // Handle theme option clicks
    themeOptions.forEach(option => {
        option.addEventListener('click', function () {
            const radio = this.querySelector('input[type="radio"]');
            if (radio) {
                radio.checked = true;
                const theme = radio.value;
                applyTheme(theme);
                updateThemeOptionStyling(this);
            }
        });
    });

    // Handle direct radio button changes
    themeRadios.forEach(radio => {
        radio.addEventListener('change', function () {
            if (this.checked) {
                const theme = this.value;
                applyTheme(theme);
                // Update styling for the parent option
                const parentOption = this.closest('.theme-option');
                if (parentOption) {
                    updateThemeOptionStyling(parentOption);
                }
            }
        });
    });

    // Handle form submission - save theme preference
    const preferencesForms = document.querySelectorAll('form[method="post"]');
    preferencesForms.forEach(form => {
        const formType = form.querySelector('input[name="form_type"]');
        if (formType && formType.value === 'preferences') {
            form.addEventListener('submit', function (e) {
                // Get selected theme
                const selectedTheme = form.querySelector('input[name="theme"]:checked');
                if (selectedTheme) {
                    const theme = selectedTheme.value;
                    // Save to localStorage as saved theme (backend will persist it)
                    storage.set('saved-theme', theme);
                    // Clear temporary theme since it's being saved
                    storage.remove('temp-theme');
                }
                // The backend will handle saving the theme preference to database
            });
        }
    });
}

// ========================================
// ENHANCED INITIALIZATION
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize theme on page load
    // Check for saved theme from backend (via data attribute) or localStorage
    const mainContent = document.querySelector('.main-content[data-saved-theme]');
    const body = document.body;
    const savedThemeFromBackend = (mainContent ? mainContent.dataset.savedTheme : null) ||
        (body.dataset.savedTheme || null);
    const savedTheme = storage.get('saved-theme', null);

    // Clear temp theme on page load (it's only for current session)
    // If user didn't save, temp theme is lost on reload
    storage.remove('temp-theme');

    // Priority: saved theme from backend > saved theme from localStorage > default (light)
    const initialTheme = savedThemeFromBackend || savedTheme || 'light';

    // Update localStorage saved theme if backend provided one
    if (savedThemeFromBackend) {
        storage.set('saved-theme', savedThemeFromBackend);
    }

    if (initialTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.removeAttribute('data-theme');
    }

    // Set radio button state if theme options exist
    const themeRadios = document.querySelectorAll('input[name="theme"]');
    themeRadios.forEach(radio => {
        if (radio.value === initialTheme) {
            radio.checked = true;
            // Update styling
            const parentOption = radio.closest('.theme-option');
            if (parentOption) {
                parentOption.style.borderColor = 'var(--primary)';
                parentOption.style.background = 'rgba(99, 102, 241, 0.1)';
            }
        }
    });

    // Initialize base functionality
    DashboardBase.init();

    // Initialize scroll animations
    observeElements();

    // Add animation classes to stat cards
    document.querySelectorAll('.stat-card').forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.add('fade-in');
    });

    // Add animation to feature cards
    document.querySelectorAll('.feature-card, .book-card, .member-card').forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.add('scale-in');
    });

    // Convert Django messages to toasts
    const djangoMessages = document.querySelectorAll('[data-django-message]');
    djangoMessages.forEach(msg => {
        const type = msg.dataset.messageType || 'info';
        const text = msg.textContent.trim();
        toast.show(text, type);
        msg.remove();
    });

    // Enhanced form submission
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', function (e) {
            const submitBtn = this.querySelector('button[type="submit"]');
            if (submitBtn && !submitBtn.disabled) {
                showLoading(submitBtn);
            }
        });
    });

    // Add ripple effect to buttons
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function (e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.5);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;

            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Add hover effects for table rows
    document.querySelectorAll('tbody tr').forEach(row => {
        row.addEventListener('mouseenter', function () {
            this.style.background = 'var(--bg-body)';
        });
        row.addEventListener('mouseleave', function () {
            this.style.background = '';
        });
    });

    // Add focus effects for search inputs
    document.querySelectorAll('.search-wrapper input').forEach(input => {
        input.addEventListener('focus', function () {
            this.style.borderColor = 'var(--primary)';
            this.style.boxShadow = '0 0 0 4px rgba(99, 102, 241, 0.1)';
        });
        input.addEventListener('blur', function () {
            this.style.borderColor = 'var(--border-light)';
            this.style.boxShadow = 'none';
        });
    });

    // Initialize page-specific functionality
    if (document.getElementById('historyTableBody')) {
        initHistoryPage();
    }
    if (document.getElementById('gridView') && document.querySelector('.book-card')) {
        initBooksPage();
    }
    if (document.getElementById('gridView') && document.querySelector('.member-card')) {
        initMembersPage();
    }
    if (document.querySelector('[data-delete-book]')) {
        initManageBooksPage();
    }
    if (document.querySelector('[data-return-book]')) {
        initBorrowedBooksPage();
    }
    if (document.getElementById('role')) {
        initSignupPage();
    }

    initImageUploads();

    // Initialize settings page
    if (document.querySelector('.settings-nav-item')) {
        initSettingsPage();
    }

    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
});

// ========================================
// EXPORT FOR GLOBAL USE
// ========================================

window.toast = toast;
window.showConfirmDialog = showConfirmDialog;
window.showLoading = showLoading;
window.hideLoading = hideLoading;
window.copyToClipboard = copyToClipboard;
window.smoothScrollTo = smoothScrollTo;
window.storage = storage;
window.deleteBook = deleteBook;
window.returnBook = returnBook;
window.toggleInitialId = toggleInitialId;
window.triggerImageUpload = triggerImageUpload;
