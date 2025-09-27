# Manforia International School - Morning Reading Tracker

A comprehensive web application designed to help track and manage morning reading activities for students at Manforia International School.

## Features

### 🏫 School Information
- **School**: Manforia International School
- **Reading Time**: 7:00 AM Daily
- **Classes**: Basic 1 to Basic 9 (including subdivisions like Basic 6A, Basic 6B)
- **Color Scheme**: White and Wine (School Colors)

### 👨‍💼 Admin Features
- **Teacher Management**: Create and manage teacher accounts
- **Class Assignment**: Assign teachers to specific classes with flexible naming (e.g., Basic 1, Basic 6A, Basic 6B)
- **Report Monitoring**: View all daily and weekly reports from teachers
- **Professional PDF Export**: Export reports with school logo, signatures, and professional formatting
- **Dashboard Overview**: Comprehensive view of all school reading activities

### 👩‍🏫 Teacher Features
- **Profile Dashboard**: View assigned class and current week information
- **Daily Reports**: Submit daily reading reports including:
  - Date of reading session
  - Materials used for morning reading
  - New words students learned
  - Teacher comments and observations
- **Weekly Summaries**: Submit weekly summary reports including:
  - Active readers identification
  - Students needing additional support
  - Common challenges faced
  - Strategies for the following week
- **Report History**: View and export personal report history
- **PDF Export**: Export personal reports to PDF

### 🔐 Security Features
- Secure login system
- Role-based access control (Admin/Teacher)
- Session management
- Password encryption

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm (Node Package Manager)

### Setup Instructions

1. **Clone or Download** the project files to your local machine

2. **Install Dependencies**
   ```bash
   cd MRT
   npm install
   ```

3. **Start the Application**
   ```bash
   npm start
   ```
   
   For development with auto-restart:
   ```bash
   npm run dev
   ```

4. **Access the Application**
   - Open your web browser
   - Navigate to: `http://localhost:3000`

## Default Login Credentials

### Administrator Account
- **Username**: `admin`
- **Password**: `admin123`

*Note: The admin should change this password after first login and create teacher accounts.*

## Usage Guide

### For Administrators
1. **Login** with admin credentials
2. **Add Teachers**:
   - Go to "Manage Teachers" tab
   - Click "Add New Teacher"
   - Fill in teacher details and assign a class
   - **Class Naming**: Use flexible naming like "Basic 1", "Basic 6A", "Basic 6B" (e.g., "Grade 1 Section A", "Primary 3 Blue Class")
    └── teacher.js        # Teacher functionality
```

## Customization

### Class Naming Convention
The application supports flexible class naming to accommodate divided classes:
- **Standard Classes**: Basic 1, Basic 2, Basic 3, etc.
- **Divided Classes**: Basic 6A, Basic 6B, Basic 7A, Basic 7B, etc.
- **Custom Naming**: Any naming convention can be used (e.g., "Grade 1 Section A")

**Examples of Valid Class Names:**
- Basic 1
- Basic 6A
- Basic 6B  
- Grade 2 Section A
- Primary 3 Blue Class

### PDF Export Features
The application generates professional PDF reports with:
- **School Logo**: Manforia International School branding
- **Professional Headers**: School name, program title, and document information
- **Signature Sections**: Designated areas for admin, teacher, and supervisor signatures
- **Wine Color Theme**: Consistent with school colors throughout
- **Page Numbering**: Professional footer with page numbers and generation details
- **Certification Text**: Official statements for document authenticity

### Color Scheme
The application uses Manforia International School's official colors:
- **Primary Wine**: #8B1538
- **Secondary Wine**: #A61E4D
- **Light Wine**: #C2185B
- **Gold Accent**: #FFD700
- **White Primary**: #FFFFFF

## Support

For technical support or questions about the Morning Reading Tracker:
1. Contact the school administrator
2. Check the application logs for error messages
3. Ensure all dependencies are properly installed

## Data Backup

The application uses SQLite database (`reading_tracker.db`). Regular backups of this file are recommended to preserve all reading reports and user data.

---

**Developed for Manforia International School**  
*Enhancing education through technology*
