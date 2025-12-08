# 📚 Library Management System

<div align="center">

![Python](https://img.shields.io/badge/Python-3.12+-blue.svg)
![Django](https://img.shields.io/badge/Django-5.2.8-green.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)
![Status](https://img.shields.io/badge/Status-Active-success.svg)

*A modern, full-featured library management system built with Django*

[Features](#-features) • [Installation](#-installation) • [Usage](#-usage) • [Project Structure](#-project-structure)

</div>

---

## 🌟 Overview

The **Library Management System** is a comprehensive web application designed to streamline library operations. Built with Django, it provides separate interfaces for staff members and library members, enabling efficient book management, borrowing operations, and user administration with role-based access control.

### 🎯 Key Highlights

- 🔐 **Role-Based Access Control** - Distinct dashboards for Staff (Librarian, Assistant Librarian, Admin) and Members
- 📖 **Complete Book Management** - Add, edit, delete, and track books with detailed metadata
- 🔄 **Borrowing System** - Seamless book borrowing and return workflow with 14-day loan period
- 💰 **Automated Fine Calculation** - Automatic fine calculation (10 PKR per overdue day)
- 👥 **User Management** - Comprehensive user registration and profile management with activity tracking
- 🎨 **Modern UI** - Clean, responsive interface with Lucide icons, animations, and toast notifications
- 📊 **Real-time Status Tracking** - User activity monitoring (Online/Away/Offline/Inactive)

---

## ✨ Features

### 📋 For Staff Members

- **Dashboard Overview**
  - View total books, available books, active loans, and overdue books count
  - Total members count
  - Quick statistics and insights at a glance
  
- **Book Management**
  - ➕ Add new books with complete details (Title, Author, ISBN, Genre, Price, Pages, Cover Image, etc.)
  - ✏️ Edit existing book information
  - 🗑️ Delete books from the library catalog (role-based permissions)
  - 📊 View and manage all books with real-time status updates
  
- **Member Administration**
  - View all members with activity status
  - Edit member information
  - Block/unblock member accounts
  - Track member borrowing counts
  - View member activity (Online/Away/Offline/Inactive)
  
- **User Administration**
  - Manage staff and member accounts
  - Role-based permission enforcement (Admin, Librarian, Assistant Librarian)
  - Restricted delete/edit permissions based on roles

### 📚 For Members

- **Browse Available Books**
  - View all available books for borrowing
  - See detailed book information including cover images
  - Filter by genre (Fiction, Non-Fiction, Biography, Self-Help, Children, Young Adult, Mystery, Romance, Thriller, History)
  
- **Borrowing Operations**
  - 📥 Borrow books with automatic due date assignment (14 days)
  - 📤 Return books with automatic fine calculation for overdue items (10 PKR per day)
  - 📖 View currently borrowed books with due dates
  - 📚 View complete borrowing history
  - ⚠️ Track overdue books and fines
  
- **Account Management**
  - Track membership expiry dates (1-year membership)
  - View borrowing statistics (borrowed, returned, total fines)
  - Manage personal profile information
  - Change password functionality

### 🔧 System Features

- **Authentication & Authorization**
  - Secure user login and registration
  - Session-based authentication
  - Role-based access restriction
  - Staff signup with OTP verification
  - Password reset functionality
  
- **Activity Tracking**
  - Real-time user status monitoring (Online/Away/Offline/Inactive)
  - Last activity timestamp tracking
  - Login time recording
  - Custom middleware for activity updates
  
- **UI/UX Enhancements**
  - Modern Lucide icons throughout the interface
  - Smooth animations and transitions
  - Toast notification system (success, error, warning, info)
  - Loading states and skeleton loaders
  - Empty states with helpful messaging
  - Responsive design for all devices
  
- **Data Models**
  - Staff (Employee ID, Role, Hire Date, Activity Tracking, Block Status)
  - Member (Member ID, Join Date, Expiry Date, Borrow Count, Activity Tracking)
  - Book (ISBN, Genre, Status, Published Date, Cover Image)
  - BorrowRecord (Borrow/Return/Due dates, Fine tracking, Overdue status)

---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|------------|--------|---------|
| **Django** | 5.2.8 | Backend framework |
| **Python** | 3.12+ | Programming language |
| **SQLite** | - | Database |
| **Pillow** | 12.0.0 | Image processing for book covers |
| **HTML/CSS/JavaScript** | - | Frontend templating and interactivity |
| **Lucide Icons** | - | Modern icon library |

---

## 📥 Installation

### Prerequisites

- Python 3.12 or higher
- pip (Python package manager)
- Virtual environment (recommended)

### Step-by-Step Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "New Project"
   ```

2. **Create and activate virtual environment**
   
   **Windows:**
   ```bash
   python -m venv venv
   venv\Scripts\activate
   ```
   
   **macOS/Linux:**
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Navigate to project directory**
   ```bash
   cd library_system
   ```

5. **Run database migrations**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

6. **Create superuser (Admin account)**
   ```bash
   python manage.py createsuperuser
   ```
   Follow the prompts to set up your admin credentials.

7. **Run the development server**
   ```bash
   python manage.py runserver
   ```

8. **Access the application**
   - Open your browser and navigate to: `http://127.0.0.1:8000/`
   - Admin panel: `http://127.0.0.1:8000/admin/`

---

## 🚀 Usage

### First-Time Setup

1. **Login as Admin**
   - Use the superuser credentials created during installation
   
2. **Create Staff Accounts**
   - Go to the signup page
   - Select "Staff" role
   - Enter OTP: `1314` (for development - should be changed in production)
   - Add staff members with roles (Admin, Librarian, Assistant Librarian)
   
3. **Add Books to Library**
   - Go to "Manage Books"
   - Click "Add New Book"
   - Fill in book details and upload cover image
   
4. **Register Members**
   - Create member accounts through the signup page
   - Members automatically get a 1-year membership

### Daily Operations

#### Staff Workflow
1. Login to staff dashboard
2. View statistics and system overview
3. Manage books (add/edit/delete as needed)
4. Monitor borrowing activities

#### Member Workflow
1. Login to member account
2. Browse available books
3. Borrow books by clicking "Borrow Now"
4. View "My Books" to see borrowed books
5. Return books when finished

### User Roles & Permissions

| Role | Add Books | Edit Books | Delete Books | Manage Users |
|------|-----------|------------|--------------|--------------|
| **Library Admin** | ✅ | ✅ | ✅ (except other admins) | ✅ |
| **Librarian** | ✅ | ✅ | ❌ | Limited |
| **Assistant Librarian** | ✅ | ✅ (own entries) | ❌ | ❌ |
| **Member** | ❌ | ❌ | ❌ | ❌ |

---

## 📂 Project Structure

```
library_system/
├── library_system/                 # Main Django project directory
│   ├── library_system/             # Project configuration
│   │   ├── __init__.py
│   │   ├── settings.py             # Django settings & configuration
│   │   ├── urls.py                 # Main URL configuration
│   │   ├── wsgi.py                 # WSGI configuration
│   │   └── asgi.py                 # ASGI configuration
│   │
│   ├── library_management/         # Main application
│   │   ├── migrations/             # Database migrations (19 migrations)
│   │   ├── templates/              # HTML templates (18 templates)
│   │   │   ├── index.html          # Landing page
│   │   │   ├── login.html          # Login page
│   │   │   ├── signup.html         # Registration page
│   │   │   ├── password_reset.html # Password reset
│   │   │   ├── staff_base.html     # Staff base template
│   │   │   ├── member_base.html    # Member base template
│   │   │   ├── staff_dashboard.html# Staff dashboard
│   │   │   ├── homepage.html       # Member homepage
│   │   │   ├── manage_books.html   # Book management
│   │   │   ├── add_book.html       # Add book form
│   │   │   ├── edit_book.html      # Edit book form
│   │   │   ├── available_books.html# Browse books
│   │   │   ├── borrowed_books.html # Borrowed books view
│   │   │   ├── member_history.html # Borrowing history
│   │   │   ├── members_fines.html  # Fines view
│   │   │   ├── manage_members.html # Member management
│   │   │   └── edit_member.html    # Edit member form
│   │   │
│   │   ├── static/                 # Static files (CSS/JS)
│   │   │   └── library_management/
│   │   │       ├── enhanced_ui.css # Enhanced UI styles
│   │   │       └── enhanced_ui.js  # Interactive features
│   │   │
│   │   ├── models.py               # Database models (5 models)
│   │   ├── views.py                # View functions (20 views)
│   │   ├── urls.py                 # App URL routing
│   │   ├── admin.py                # Admin configuration
│   │   ├── middleware.py           # Activity tracking middleware
│   │   └── apps.py                 # App configuration
│   │
│   ├── media/                      # Uploaded files (book covers)
│   │   └── images/                 # Book cover images
│   ├── db.sqlite3                  # SQLite database
│   └── manage.py                   # Django management script
│
├── requirements.txt                # Python dependencies
└── README.md                       # This file
```

---

## 🗄️ Database Models

### CommonInfo (Abstract Base Class)
- `user` - OneToOne relationship with Django User
- `date_of_birth` - Date field
- `gender` - Choice field (Male/Female)
- `get_age()` - Method to calculate age from date of birth

### Staff (extends CommonInfo)
- `employee_id` - Unique staff identifier (default: 'STF-')
- `hire_date` - Auto-generated hire date
- `role` - Choice field (Librarian, Assistant Librarian, Library Admin)
- `is_blocked` - Boolean for account blocking
- `login_time` - DateTime of last login
- `last_activity` - DateTime of last activity
- `status` (property) - Dynamic status: Online/Away/Offline/Inactive/Blocked

### Member (extends CommonInfo)
- `member_id` - Unique member identifier (default: 'MBR-')
- `join_date` - Auto-generated join date
- `expiry_date` - Membership expiry (1 year from join date, auto-calculated)
- `login_time` - Time of last login
- `is_blocked` - Boolean for account blocking
- `last_activity` - DateTime of last activity
- `borrow_count` - Integer for tracking active borrows
- `status` (property) - Dynamic status: Online/Away/Offline/Inactive/Blocked

### Book
- `Title` - CharField (max 50)
- `Author` - CharField (max 50)
- `ISBN` - CharField (max 50, unique)
- `Price` - Integer
- `Published_date` - Date (default: today)
- `Image` - ImageField (uploaded to 'images/')
- `Pages` - Integer
- `Status` - Choice field (available/unavailable)
- `Genre` - Choice field (10 genres: Fiction, Non-Fiction, Biography, Self-Help, Children, Young Adult, Mystery, Romance, Thriller, History)
- `Added_on` - DateTime (auto-created)
- `Updated_on` - DateTime (auto-updated)

### BorrowRecord
- `book` - ForeignKey to Book (CASCADE delete)
- `borrower` - ForeignKey to Member (CASCADE delete)
- `borrow_date` - Date when book was borrowed
- `return_date` - Date when book was returned (nullable)
- `due_date` - Expected return date (14 days from borrow date)
- `is_returned` - Boolean status
- `is_overdue` - Boolean for overdue tracking
- `fine` - Integer (default: 0, calculated as 10 PKR per overdue day)

---

## 🎯 Key Functionalities

### 1. User Authentication
- Custom login/logout system
- Session-based authentication
- Role-based redirects after login

### 2. Book Management
- CRUD operations for books
- Image upload for book covers
- Status tracking (Available/Unavailable)
- Genre categorization

### 3. Borrowing System
- Automatic due date calculation (14 days from borrow date)
- Book status updates on borrow/return (Available ↔ Unavailable)
- Fine calculation for overdue returns (10 PKR per overdue day)
- Overdue detection and tracking
- Borrowing history tracking with complete records

### 4. Dashboard Analytics
- **Staff Dashboard:**
  - Total books count
  - Total members count
  - Active loans count
  - Overdue books count
  
- **Member Dashboard:**
  - Currently borrowed books count
  - Returned books count
  - Total fines amount
  - Recent books display

### 5. Activity Tracking
- Real-time user status monitoring via middleware
- Last activity timestamp updates on each request
- Login time recording
- Status calculation (Online/Away/Offline/Inactive)

---

## 🔒 Security Features

### Current Security Measures
- ✅ CSRF protection enabled
- ✅ Password validation (Django validators)
- ✅ Session security
- ✅ Role-based access control
- ✅ User authentication required for protected views
- ✅ Activity tracking middleware

### ⚠️ Security Warnings (Before Production)

**CRITICAL:**
- ⚠️ **Change `SECRET_KEY`** - Currently hardcoded in `settings.py`. Use environment variables.
- ⚠️ **Change Staff OTP** - Currently hardcoded as '1314' in `views.py`. Use environment variables.
- ⚠️ **Set `DEBUG = False`** - Currently enabled. Disable in production.
- ⚠️ **Configure `ALLOWED_HOSTS`** - Add your domain for deployment.

**Recommended:**
- Use environment variables for sensitive data
- Implement rate limiting for authentication
- Add HTTPS enforcement
- Review and enhance input validation

---

## 🚧 Future Enhancements

### High Priority
- [ ] Fix security vulnerabilities (move secrets to environment variables)
- [ ] Add membership expiry check before borrowing
- [ ] Implement borrow limits per member
- [ ] Add daily cron job to update overdue status
- [ ] Add input validation and sanitization

### Medium Priority
- [ ] Advanced search and filtering for books
- [ ] Email notifications for due dates and overdue reminders
- [ ] Book reservation system
- [ ] Export reports (PDF/Excel)
- [ ] Add pagination for book lists
- [ ] Implement rate limiting

### Low Priority
- [ ] REST API for mobile integration
- [ ] Book recommendations based on reading history
- [ ] QR code generation for books
- [ ] Integration with external book APIs
- [ ] Advanced analytics and reporting dashboard
- [ ] Multi-library support
- [ ] Dark mode toggle
- [ ] Unit tests and test coverage

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👨‍💻 Developer

**Mohammad Muzamil**  
Internship Project - Django Development

---

## 📞 Support

For issues, questions, or suggestions:
- Create an issue in the repository
- Contact the development team

---

## 📈 Project Statistics

- **Total Views:** 20 view functions
- **Database Models:** 5 (including abstract base)
- **Templates:** 18 HTML templates
- **Migrations:** 19 database migrations
- **URL Patterns:** 15+ routes
- **Middleware:** 1 (activity tracking)
- **Static Files:** Enhanced UI CSS/JS

---

## 🙏 Acknowledgments

- Django Documentation
- Python Community
- Open Source Contributors
- Lucide Icons

---

<div align="center">

**Made with ❤️ using Django**

⭐ Star this repository if you find it helpful!

</div>
