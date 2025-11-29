# 📚 Library Management System

<div align="center">

![Python](https://img.shields.io/badge/Python-3.12+-blue.svg)
![Django](https://img.shields.io/badge/Django-5.2+-green.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)
![Status](https://img.shields.io/badge/Status-Active-success.svg)

*A modern, full-featured library management system built with Django*

[Features](#-features) • [Installation](#-installation) • [Usage](#-usage) • [Documentation](#-project-structure)

</div>

---

## 🌟 Overview

The **Library Management System** is a comprehensive web application designed to streamline library operations. Built with Django, it provides separate interfaces for staff members and library members, enabling efficient book management, borrowing operations, and user administration with role-based access control.

### 🎯 Key Highlights

- 🔐 **Role-Based Access Control** - Distinct dashboards for Staff (Librarian, Assistant Librarian, Admin) and Members
- 📖 **Complete Book Management** - Add, edit, delete, and track books with detailed metadata
- 🔄 **Borrowing System** - Seamless book borrowing and return workflow with due date tracking
- 💰 **Automated Fine Calculation** - Automatic fine calculation for overdue books
- 👥 **User Management** - Comprehensive user registration and profile management
- 🎨 **Modern UI** - Clean, responsive interface with role-specific navigation

---

## ✨ Features

### 📋 For Staff Members

- **Dashboard Overview**
  - View total books, available books, borrowed books, and members count
  - Quick statistics and insights at a glance
  
- **Book Management**
  - ➕ Add new books with complete details (Title, Author, ISBN, Genre, Price, Pages, etc.)
  - ✏️ Edit existing book information
  - 🗑️ Delete books from the library catalog
  - 📊 View and manage all books with real-time status updates
  
- **User Administration**
  - Manage staff and member accounts
  - Role-based permission enforcement (Admin, Librarian, Assistant Librarian)
  - Restricted delete/edit permissions based on roles

### 📚 For Members

- **Browse Available Books**
  - View all available books for borrowing
  - Search by title, author, genre, or ISBN
  - See detailed book information including cover images
  
- **Borrowing Operations**
  - 📥 Borrow books with automatic due date assignment
  - 📤 Return books with fine calculation for overdue items
  - 📖 View personal borrowing history and current borrowed books
  
- **Account Management**
  - Track membership expiry dates
  - View borrowing statistics
  - Manage personal profile information

### 🔧 System Features

- **Authentication & Authorization**
  - Secure user login and registration
  - Session management
  - Role-based access restriction
  
- **Data Models**
  - Staff (Employee ID, Role, Hire Date)
  - Member (Member ID, Join Date, Expiry Date)
  - Book (ISBN, Genre, Status, Published Date)
  - BorrowRecord (Borrow/Return/Due dates, Fine tracking)

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **Django 5.2+** | Backend framework |
| **Python 3.12+** | Programming language |
| **SQLite** | Database |
| **Pillow** | Image processing for book covers |
| **HTML/CSS** | Frontend templating |
| **Bootstrap** | UI components (if applicable) |

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
   cd Sample
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
   - Navigate to User Management
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
New Project/
├── Sample/                      # Main Django project directory
│   ├── Sample/                  # Project configuration
│   │   ├── __init__.py
│   │   ├── settings.py         # Django settings
│   │   ├── urls.py             # Main URL configuration
│   │   ├── wsgi.py             # WSGI configuration
│   │   └── asgi.py             # ASGI configuration
│   │
│   ├── sampleapp/              # Main application
│   │   ├── migrations/         # Database migrations
│   │   ├── templates/          # HTML templates
│   │   │   ├── index.html           # Landing page
│   │   │   ├── login.html           # Login page
│   │   │   ├── signup.html          # Registration page
│   │   │   ├── staff_base.html      # Staff base template
│   │   │   ├── member_base.html     # Member base template
│   │   │   ├── staff_dashboard.html # Staff dashboard
│   │   │   ├── manage_books.html    # Book management
│   │   │   ├── add_book.html        # Add book form
│   │   │   ├── edit_book.html       # Edit book form
│   │   │   ├── available_books.html # Browse books
│   │   │   ├── borrowed_books.html  # Borrowed books view
│   │   │   └── homepage.html        # Member homepage
│   │   │
│   │   ├── models.py           # Database models
│   │   ├── views.py            # View functions
│   │   ├── urls.py             # App URL routing
│   │   ├── admin.py            # Admin configuration
│   │   └── apps.py             # App configuration
│   │
│   ├── media/                  # Uploaded files (book covers)
│   ├── db.sqlite3              # SQLite database
│   └── manage.py               # Django management script
│
├── requirements.txt            # Python dependencies
└── README.md                   # This file
```

---

## 🗄️ Database Models

### CommonInfo (Abstract Base)
- `user` - OneToOne relationship with Django User
- `date_of_birth` - Date field
- `gender` - Choice field (Male/Female)
- `get_age()` - Method to calculate age

### Staff (extends CommonInfo)
- `employee_id` - Unique staff identifier (STF-)
- `hire_date` - Auto-generated hire date
- `role` - Choice field (Librarian, Assistant Librarian, Library Admin)

### Member (extends CommonInfo)
- `member_id` - Unique member identifier (MBR-)
- `join_date` - Auto-generated join date
- `expiry_date` - Membership expiry (1 year from join date)

### Book
- `Title` - Book title
- `Author` - Author name
- `ISBN` - Unique ISBN number
- `Price` - Book price
- `Published_date` - Publication date
- `Image` - Book cover image
- `Pages` - Number of pages
- `Status` - Available/Unavailable
- `Genre` - Book genre (Fiction, Non-Fiction, Biography, etc.)
- `Added_on` / `Updated_on` - Timestamps

### BorrowRecord
- `book` - ForeignKey to Book
- `borrower` - ForeignKey to Member
- `borrow_date` - Date when book was borrowed
- `due_date` - Expected return date
- `return_date` - Actual return date
- `is_returned` - Boolean status
- `fine` - Fine amount for overdue books

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
- Automatic due date calculation (14 days from borrow)
- Book status updates on borrow/return
- Fine calculation for overdue returns
- Borrowing history tracking

### 4. Dashboard Analytics
- Total books count
- Available books count
- Borrowed books count
- Total members count
- Recent borrowing activities

---

## 🔒 Security Features

- ✅ CSRF protection enabled
- ✅ Password validation
- ✅ Session security
- ✅ Role-based access control
- ✅ User authentication required for protected views
- ⚠️ **Important**: Change `SECRET_KEY` in production
- ⚠️ **Important**: Set `DEBUG = False` in production
- ⚠️ **Important**: Configure `ALLOWED_HOSTS` for deployment

---

## 🚧 Future Enhancements

- [ ] Advanced search and filtering for books
- [ ] Email notifications for due dates
- [ ] Book reservation system
- [ ] Multi-library support
- [ ] Export reports (PDF/Excel)
- [ ] REST API for mobile integration
- [ ] Book recommendations based on reading history
- [ ] QR code generation for books
- [ ] Integration with external book APIs
- [ ] Advanced analytics and reporting dashboard

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

## 🙏 Acknowledgments

- Django Documentation
- Python Community
- Open Source Contributors

---

<div align="center">

**Made with ❤️ using Django**

⭐ Star this repository if you find it helpful!

</div>
