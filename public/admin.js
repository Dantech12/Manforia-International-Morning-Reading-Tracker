// Admin Dashboard JavaScript
let teachers = [];
let dailyReports = [];
let weeklyReports = [];

// Initialize the admin dashboard
document.addEventListener('DOMContentLoaded', function() {
    loadTeachers();
    loadDailyReports();
    loadWeeklyReports();
    
    // Set admin name (you can get this from session if needed)
    document.getElementById('adminName').textContent = 'Administrator';
    document.getElementById('sidebarAdminName').textContent = 'Administrator';
    
    // Add event listener for add teacher form
    document.getElementById('addTeacherForm').addEventListener('submit', handleAddTeacher);
    
    // Initialize mobile navigation
    initializeMobileNavigation();
});

// Initialize mobile navigation
function initializeMobileNavigation() {
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const mobileSidebar = document.getElementById('mobileSidebar');
    const mobileOverlay = document.getElementById('mobileOverlay');
    const sidebarClose = document.getElementById('sidebarClose');
    
    // Open sidebar
    hamburgerBtn.addEventListener('click', function() {
        hamburgerBtn.classList.add('active');
        mobileSidebar.classList.add('active');
        mobileOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    
    // Close sidebar
    function closeSidebar() {
        hamburgerBtn.classList.remove('active');
        mobileSidebar.classList.remove('active');
        mobileOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    sidebarClose.addEventListener('click', closeSidebar);
    mobileOverlay.addEventListener('click', closeSidebar);
    
    // Close sidebar on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileSidebar.classList.contains('active')) {
            closeSidebar();
        }
    });
}

// Tab management
function showTab(tabName) {
    // Hide all tab contents
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(tab => tab.classList.remove('active'));
    
    // Remove active class from all tab buttons
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => btn.classList.remove('active'));
    
    // Show selected tab content
    document.getElementById(tabName + '-tab').classList.add('active');
    
    // Add active class to clicked button
    event.target.classList.add('active');
}

// Mobile tab management
function showTabMobile(tabName) {
    // Hide all tab contents
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(tab => tab.classList.remove('active'));
    
    // Remove active class from all sidebar tab buttons
    const sidebarButtons = document.querySelectorAll('.sidebar-nav .tab-btn');
    sidebarButtons.forEach(btn => btn.classList.remove('active'));
    
    // Show selected tab content
    document.getElementById(tabName + '-tab').classList.add('active');
    
    // Add active class to clicked button
    event.target.classList.add('active');
    
    // Close mobile sidebar
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const mobileSidebar = document.getElementById('mobileSidebar');
    const mobileOverlay = document.getElementById('mobileOverlay');
    
    hamburgerBtn.classList.remove('active');
    mobileSidebar.classList.remove('active');
    mobileOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

// Load teachers data
async function loadTeachers() {
    try {
        const response = await fetch('/api/admin/teachers');
        teachers = await response.json();
        displayTeachers();
    } catch (error) {
        console.error('Error loading teachers:', error);
    }
}

// Display teachers in table
function displayTeachers() {
    const tbody = document.querySelector('#teachersTable tbody');
    tbody.innerHTML = '';
    
    teachers.forEach(teacher => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${teacher.full_name}</td>
            <td>${teacher.username}</td>
            <td>${teacher.assigned_class}</td>
            <td>${new Date(teacher.created_at).toLocaleDateString()}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-edit" onclick="editTeacher(${teacher.id})">Edit</button>
                    <button class="btn-delete" onclick="deleteTeacher(${teacher.id})">Delete</button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Load daily reports
async function loadDailyReports() {
    try {
        const response = await fetch('/api/admin/reports/daily');
        dailyReports = await response.json();
        displayDailyReports();
    } catch (error) {
        console.error('Error loading daily reports:', error);
    }
}

// Display daily reports in table
function displayDailyReports() {
    const tbody = document.querySelector('#dailyReportsTable tbody');
    tbody.innerHTML = '';
    
    dailyReports.forEach((report, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${new Date(report.report_date).toLocaleDateString()}</td>
            <td>${report.teacher_name}</td>
            <td>${report.class_name}</td>
            <td>${truncateText(report.materials_used, 40)}</td>
            <td>${truncateText(report.new_words || 'N/A', 30)}</td>
            <td>${truncateText(report.comments || 'N/A', 40)}</td>
            <td>Week ${report.week_number}</td>
            <td>
                <button class="btn-view-report" onclick="viewDailyReport(${index})">View</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Load weekly reports
async function loadWeeklyReports() {
    try {
        const response = await fetch('/api/admin/reports/weekly');
        weeklyReports = await response.json();
        displayWeeklyReports();
    } catch (error) {
        console.error('Error loading weekly reports:', error);
    }
}

// Display weekly reports in table
function displayWeeklyReports() {
    const tbody = document.querySelector('#weeklyReportsTable tbody');
    tbody.innerHTML = '';
    
    weeklyReports.forEach((report, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${new Date(report.submitted_at).toLocaleDateString()}</td>
            <td>${report.teacher_name}</td>
            <td>${report.class_name}</td>
            <td>Week ${report.week_number}</td>
            <td>${truncateText(report.active_readers, 35)}</td>
            <td>${truncateText(report.students_needing_support, 35)}</td>
            <td>${truncateText(report.common_challenges, 35)}</td>
            <td>${truncateText(report.strategies_next_week, 35)}</td>
            <td>
                <button class="btn-view-report" onclick="viewWeeklyReport(${index})">View</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Utility function to truncate text
function truncateText(text, maxLength) {
    if (!text) return 'N/A';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

// View daily report in modal
function viewDailyReport(index) {
    const report = dailyReports[index];
    
    // Set modal title and icon
    document.getElementById('reportIcon').textContent = '📋';
    document.getElementById('reportTitle').textContent = 'Daily Reading Report';
    
    // Create info grid
    const infoGrid = document.getElementById('reportInfoGrid');
    infoGrid.innerHTML = `
        <div class="report-info-card">
            <h4>Date</h4>
            <p>${new Date(report.report_date).toLocaleDateString()}</p>
        </div>
        <div class="report-info-card">
            <h4>Teacher</h4>
            <p>${report.teacher_name}</p>
        </div>
        <div class="report-info-card">
            <h4>Class</h4>
            <p>${report.class_name}</p>
        </div>
        <div class="report-info-card">
            <h4>Week</h4>
            <p>Week ${report.week_number} - ${report.month_year}</p>
        </div>
    `;
    
    // Create content sections
    const contentSections = document.getElementById('reportContentSections');
    contentSections.innerHTML = `
        <div class="report-content-section">
            <div class="report-section-title">
                📚 Materials Used
            </div>
            <div class="report-section-content">
                ${report.materials_used || '<div class="empty">No materials specified</div>'}
            </div>
        </div>
        
        ${report.new_words ? `
        <div class="report-content-section">
            <div class="report-section-title">
                📝 New Words Learned
            </div>
            <div class="report-section-content">
                ${report.new_words}
            </div>
        </div>
        ` : ''}
        
        ${report.comments ? `
        <div class="report-content-section">
            <div class="report-section-title">
                💭 Teacher Comments
            </div>
            <div class="report-section-content">
                ${report.comments}
            </div>
        </div>
        ` : ''}
    `;
    
    // Set footer info
    document.getElementById('reportDateInfo').textContent = 
        `Submitted on ${new Date(report.created_at).toLocaleDateString()} at ${new Date(report.created_at).toLocaleTimeString()}`;
    
    // Show modal
    document.getElementById('reportModal').style.display = 'block';
}

// View weekly report in modal
function viewWeeklyReport(index) {
    const report = weeklyReports[index];
    
    // Set modal title and icon
    document.getElementById('reportIcon').textContent = '📊';
    document.getElementById('reportTitle').textContent = 'Weekly Summary Report';
    
    // Create info grid
    const infoGrid = document.getElementById('reportInfoGrid');
    infoGrid.innerHTML = `
        <div class="report-info-card">
            <h4>Submitted Date</h4>
            <p>${new Date(report.submitted_at).toLocaleDateString()}</p>
        </div>
        <div class="report-info-card">
            <h4>Teacher</h4>
            <p>${report.teacher_name}</p>
        </div>
        <div class="report-info-card">
            <h4>Class</h4>
            <p>${report.class_name}</p>
        </div>
        <div class="report-info-card">
            <h4>Week</h4>
            <p>Week ${report.week_number} - ${report.month_year}</p>
        </div>
    `;
    
    // Create content sections
    const contentSections = document.getElementById('reportContentSections');
    contentSections.innerHTML = `
        <div class="report-content-section">
            <div class="report-section-title">
                🌟 Active Readers
            </div>
            <div class="report-section-content">
                ${report.active_readers || '<div class="empty">No information provided</div>'}
            </div>
        </div>
        
        <div class="report-content-section">
            <div class="report-section-title">
                🆘 Students Needing Support
            </div>
            <div class="report-section-content">
                ${report.students_needing_support || '<div class="empty">No information provided</div>'}
            </div>
        </div>
        
        <div class="report-content-section">
            <div class="report-section-title">
                ⚠️ Common Challenges
            </div>
            <div class="report-section-content">
                ${report.common_challenges || '<div class="empty">No challenges reported</div>'}
            </div>
        </div>
        
        <div class="report-content-section">
            <div class="report-section-title">
                🎯 Strategies for Next Week
            </div>
            <div class="report-section-content">
                ${report.strategies_next_week || '<div class="empty">No strategies specified</div>'}
            </div>
        </div>
    `;
    
    // Set footer info
    document.getElementById('reportDateInfo').textContent = 
        `Submitted on ${new Date(report.submitted_at).toLocaleDateString()} at ${new Date(report.submitted_at).toLocaleTimeString()}`;
    
    // Show modal
    document.getElementById('reportModal').style.display = 'block';
}

// Close report modal
function closeReportModal() {
    document.getElementById('reportModal').style.display = 'none';
}

// Edit teacher function
function editTeacher(teacherId) {
    const teacher = teachers.find(t => t.id === teacherId);
    if (!teacher) return;
    
    // Populate edit form with current data
    document.getElementById('teacherFullName').value = teacher.full_name;
    document.getElementById('teacherUsername').value = teacher.username;
    document.getElementById('assignedClass').value = teacher.assigned_class;
    document.getElementById('teacherPassword').value = ''; // Don't show current password
    
    // Change modal title and button text
    document.querySelector('#addTeacherModal .modal-header h3').textContent = 'Edit Teacher';
    document.querySelector('#addTeacherModal button[type="submit"]').textContent = 'Update Teacher';
    
    // Store teacher ID for update
    document.getElementById('addTeacherForm').dataset.teacherId = teacherId;
    
    showAddTeacherModal();
}

// Delete teacher function
function deleteTeacher(teacherId) {
    const teacher = teachers.find(t => t.id === teacherId);
    if (!teacher) return;
    
    // Show confirmation modal
    document.getElementById('deleteTeacherName').textContent = teacher.full_name;
    document.getElementById('deleteTeacherClass').textContent = teacher.assigned_class;
    document.getElementById('confirmationModal').style.display = 'block';
    
    // Store teacher ID for confirmation
    window.pendingDeleteTeacherId = teacherId;
}

// Close confirmation modal
function closeConfirmationModal() {
    document.getElementById('confirmationModal').style.display = 'none';
    window.pendingDeleteTeacherId = null;
}

// Confirm teacher deletion
async function confirmDeleteTeacher() {
    const teacherId = window.pendingDeleteTeacherId;
    if (!teacherId) return;
    
    try {
        const response = await fetch(`/api/admin/teachers/${teacherId}`, {
            method: 'DELETE'
        });
        
        const result = await response.json();
        
        if (result.success) {
            closeConfirmationModal();
            showSuccessMessage('Teacher deleted successfully!');
            loadTeachers(); // Reload teachers list
        } else {
            alert('Error deleting teacher: ' + result.error);
        }
    } catch (error) {
        console.error('Error deleting teacher:', error);
        alert('Network error. Please try again.');
    }
}

// Modal management
function showAddTeacherModal() {
    document.getElementById('addTeacherModal').style.display = 'block';
}

function closeAddTeacherModal() {
    document.getElementById('addTeacherModal').style.display = 'none';
    document.getElementById('addTeacherForm').reset();
    
    // Reset modal to add mode
    document.querySelector('#addTeacherModal .modal-header h3').textContent = 'Add New Teacher';
    document.querySelector('#addTeacherModal button[type="submit"]').textContent = 'Add Teacher';
    delete document.getElementById('addTeacherForm').dataset.teacherId;
}

// Handle add/edit teacher form submission
async function handleAddTeacher(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const teacherId = e.target.dataset.teacherId;
    const isEdit = !!teacherId;
    
    const teacherData = {
        username: formData.get('username'),
        fullName: formData.get('fullName'),
        assignedClass: formData.get('assignedClass')
    };
    
    // Only include password if it's provided (for edits, password is optional)
    const password = formData.get('password');
    if (password) {
        teacherData.password = password;
    }
    
    try {
        const url = isEdit ? `/api/admin/teachers/${teacherId}` : '/api/admin/teachers';
        const method = isEdit ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(teacherData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            closeAddTeacherModal();
            loadTeachers(); // Reload teachers list
            showSuccessMessage(isEdit ? 'Teacher updated successfully!' : 'Teacher added successfully!');
        } else {
            alert(`Error ${isEdit ? 'updating' : 'adding'} teacher: ` + result.error);
        }
    } catch (error) {
        console.error(`Error ${isEdit ? 'updating' : 'adding'} teacher:`, error);
        alert('Network error. Please try again.');
    }
}

// Show success message
function showSuccessMessage(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    
    const container = document.querySelector('.container');
    container.insertBefore(successDiv, container.firstChild);
    
    setTimeout(() => {
        successDiv.remove();
    }, 3000);
}

// PDF Export Functions
function exportDailyReportsPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Add school logo
    const logoImg = new Image();
    logoImg.onload = function() {
        // Add logo
        doc.addImage(logoImg, 'PNG', 15, 10, 30, 20);
        
        // Add header with school info
        doc.setFontSize(18);
        doc.setTextColor(139, 21, 56); // Wine color
        doc.text('MANFORIA INTERNATIONAL SCHOOL', 50, 20);
        doc.setFontSize(14);
        doc.text('Morning Reading Program', 50, 27);
        
        // Add document title
        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);
        doc.text('DAILY READING REPORTS', 20, 45);
        
        // Add generation info
        doc.setFontSize(10);
        doc.text('Generated on: ' + new Date().toLocaleDateString(), 20, 52);
        doc.text('Generated by: Administrator', 20, 57);
        doc.text('Total Reports: ' + dailyReports.length, 20, 62);
        
        // Add line separator
        doc.setLineWidth(0.5);
        doc.setDrawColor(139, 21, 56);
        doc.line(20, 67, 190, 67);
        
        // Create professional detailed report format
        let currentY = 75;
        
        dailyReports.forEach((report, index) => {
            // Check if we need a new page
            if (currentY > 250) {
                doc.addPage();
                currentY = 20;
            }
            
            // Report header
            doc.setFontSize(11);
            doc.setTextColor(139, 21, 56);
            doc.text(`DAILY REPORT #${index + 1}`, 20, currentY);
            
            // Basic info in a compact table
            const basicInfo = [
                ['Date', new Date(report.report_date).toLocaleDateString()],
                ['Teacher', report.teacher_name],
                ['Class', report.class_name],
                ['Week', `Week ${report.week_number} - ${report.month_year}`]
            ];
            
            doc.autoTable({
                body: basicInfo,
                startY: currentY + 5,
                theme: 'plain',
                styles: { 
                    fontSize: 9,
                    cellPadding: 2
                },
                columnStyles: {
                    0: { fontStyle: 'bold', fillColor: [248, 249, 250], cellWidth: 30 },
                    1: { cellWidth: 60 }
                }
            });
            
            currentY = doc.lastAutoTable.finalY + 10;
            
            // Materials Used Section
            doc.setFontSize(10);
            doc.setTextColor(139, 21, 56);
            doc.text('Materials Used:', 20, currentY);
            doc.setFontSize(9);
            doc.setTextColor(0, 0, 0);
            const materialsLines = doc.splitTextToSize(report.materials_used || 'N/A', 170);
            doc.text(materialsLines, 20, currentY + 7);
            currentY += 7 + (materialsLines.length * 4) + 5;
            
            // New Words Section
            if (report.new_words && report.new_words.trim() !== '') {
                doc.setFontSize(10);
                doc.setTextColor(139, 21, 56);
                doc.text('New Words Learned:', 20, currentY);
                doc.setFontSize(9);
                doc.setTextColor(0, 0, 0);
                const wordsLines = doc.splitTextToSize(report.new_words, 170);
                doc.text(wordsLines, 20, currentY + 7);
                currentY += 7 + (wordsLines.length * 4) + 5;
            }
            
            // Comments Section
            if (report.comments && report.comments.trim() !== '') {
                doc.setFontSize(10);
                doc.setTextColor(139, 21, 56);
                doc.text('Teacher Comments:', 20, currentY);
                doc.setFontSize(9);
                doc.setTextColor(0, 0, 0);
                const commentsLines = doc.splitTextToSize(report.comments, 170);
                doc.text(commentsLines, 20, currentY + 7);
                currentY += 7 + (commentsLines.length * 4) + 5;
            }
            
            // Add separator line
            doc.setLineWidth(0.3);
            doc.setDrawColor(200, 200, 200);
            doc.line(20, currentY, 190, currentY);
            currentY += 15;
        });
        
        // Add signature section
        if (currentY > 250) {
            doc.addPage();
            addSignatureSection(doc, 20);
        } else {
            addSignatureSection(doc, currentY + 10);
        }
        
        // Add footer
        addPDFFooter(doc);
        
        doc.save('manforia-daily-reading-reports.pdf');
    };
    logoImg.src = 'cropped-cropped-icon2.png';
}

function exportWeeklyReportsPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Add school logo
    const logoImg = new Image();
    logoImg.onload = function() {
        // Add logo
        doc.addImage(logoImg, 'PNG', 15, 10, 30, 20);
        
        // Add header with school info
        doc.setFontSize(18);
        doc.setTextColor(139, 21, 56); // Wine color
        doc.text('MANFORIA INTERNATIONAL SCHOOL', 50, 20);
        doc.setFontSize(14);
        doc.text('Morning Reading Program', 50, 27);
        
        // Add document title
        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);
        doc.text('WEEKLY SUMMARY REPORTS', 20, 45);
        
        // Add generation info
        doc.setFontSize(10);
        doc.text('Generated on: ' + new Date().toLocaleDateString(), 20, 52);
        doc.text('Generated by: Administrator', 20, 57);
        doc.text('Total Reports: ' + weeklyReports.length, 20, 62);
        
        // Add line separator
        doc.setLineWidth(0.5);
        doc.setDrawColor(139, 21, 56);
        doc.line(20, 67, 190, 67);
        
        // Create professional detailed weekly report format
        let currentY = 75;
        
        weeklyReports.forEach((report, index) => {
            // Check if we need a new page
            if (currentY > 230) {
                doc.addPage();
                currentY = 20;
            }
            
            // Report header
            doc.setFontSize(12);
            doc.setTextColor(139, 21, 56);
            doc.text(`WEEKLY SUMMARY REPORT #${index + 1}`, 20, currentY);
            
            // Basic info in a compact table
            const basicInfo = [
                ['Submitted Date', new Date(report.submitted_at).toLocaleDateString()],
                ['Teacher', report.teacher_name],
                ['Class', report.class_name],
                ['Week', `Week ${report.week_number} - ${report.month_year}`]
            ];
            
            doc.autoTable({
                body: basicInfo,
                startY: currentY + 5,
                theme: 'plain',
                styles: { 
                    fontSize: 9,
                    cellPadding: 2
                },
                columnStyles: {
                    0: { fontStyle: 'bold', fillColor: [248, 249, 250], cellWidth: 35 },
                    1: { cellWidth: 65 }
                }
            });
            
            currentY = doc.lastAutoTable.finalY + 12;
            
            // Active Readers Section
            doc.setFontSize(10);
            doc.setTextColor(139, 21, 56);
            doc.text('Active Readers:', 20, currentY);
            doc.setFontSize(9);
            doc.setTextColor(0, 0, 0);
            const activeLines = doc.splitTextToSize(report.active_readers || 'N/A', 170);
            doc.text(activeLines, 20, currentY + 7);
            currentY += 7 + (activeLines.length * 4) + 8;
            
            // Students Needing Support Section
            doc.setFontSize(10);
            doc.setTextColor(139, 21, 56);
            doc.text('Students Needing Support:', 20, currentY);
            doc.setFontSize(9);
            doc.setTextColor(0, 0, 0);
            const supportLines = doc.splitTextToSize(report.students_needing_support || 'N/A', 170);
            doc.text(supportLines, 20, currentY + 7);
            currentY += 7 + (supportLines.length * 4) + 8;
            
            // Common Challenges Section
            doc.setFontSize(10);
            doc.setTextColor(139, 21, 56);
            doc.text('Common Challenges Faced:', 20, currentY);
            doc.setFontSize(9);
            doc.setTextColor(0, 0, 0);
            const challengesLines = doc.splitTextToSize(report.common_challenges || 'N/A', 170);
            doc.text(challengesLines, 20, currentY + 7);
            currentY += 7 + (challengesLines.length * 4) + 8;
            
            // Strategies Section
            doc.setFontSize(10);
            doc.setTextColor(139, 21, 56);
            doc.text('Strategies for Following Week:', 20, currentY);
            doc.setFontSize(9);
            doc.setTextColor(0, 0, 0);
            const strategiesLines = doc.splitTextToSize(report.strategies_next_week || 'N/A', 170);
            doc.text(strategiesLines, 20, currentY + 7);
            currentY += 7 + (strategiesLines.length * 4) + 10;
            
            // Add separator line
            doc.setLineWidth(0.5);
            doc.setDrawColor(139, 21, 56);
            doc.line(20, currentY, 190, currentY);
            currentY += 20;
        });
        
        // Add signature section
        if (currentY > 250) {
            doc.addPage();
            addSignatureSection(doc, 20);
        } else {
            addSignatureSection(doc, currentY + 10);
        }
        
        // Add footer
        addPDFFooter(doc);
        
        doc.save('manforia-weekly-summary-reports.pdf');
    };
    logoImg.src = 'cropped-cropped-icon2.png';
}

// Helper function to add signature section
function addSignatureSection(doc, startY) {
    // Add signature section title
    doc.setFontSize(12);
    doc.setTextColor(139, 21, 56);
    doc.text('AUTHORIZATION & SIGNATURES', 20, startY);
    
    // Add line separator
    doc.setLineWidth(0.3);
    doc.setDrawColor(139, 21, 56);
    doc.line(20, startY + 3, 190, startY + 3);
    
    // Add signature boxes
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    
    // Administrator signature
    doc.text('Reviewed and Approved by:', 20, startY + 15);
    doc.text('Administrator Signature:', 20, startY + 25);
    doc.line(20, startY + 35, 90, startY + 35); // Signature line
    doc.text('Date: _______________', 20, startY + 45);
    
    // Principal/Head signature
    doc.text('Acknowledged by:', 110, startY + 15);
    doc.text('Principal/Head Signature:', 110, startY + 25);
    doc.line(110, startY + 35, 180, startY + 35); // Signature line
    doc.text('Date: _______________', 110, startY + 45);
    
    // Add note
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text('Note: This document contains confidential student information. Handle with care.', 20, startY + 60);
}

// Helper function to add PDF footer
function addPDFFooter(doc) {
    const pageCount = doc.internal.getNumberOfPages();
    
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        
        // Add footer line
        doc.setLineWidth(0.3);
        doc.setDrawColor(139, 21, 56);
        doc.line(20, 280, 190, 280);
        
        // Add footer text
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text('Manforia International School - Morning Reading Tracker', 20, 285);
        doc.text(`Page ${i} of ${pageCount}`, 160, 285);
        doc.text('Generated on: ' + new Date().toLocaleDateString() + ' at ' + new Date().toLocaleTimeString(), 20, 290);
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    const addTeacherModal = document.getElementById('addTeacherModal');
    const confirmationModal = document.getElementById('confirmationModal');
    const reportModal = document.getElementById('reportModal');
    
    if (event.target === addTeacherModal) {
        closeAddTeacherModal();
    }
    
    if (event.target === confirmationModal) {
        closeConfirmationModal();
    }
    
    if (event.target === reportModal) {
        closeReportModal();
    }
}
