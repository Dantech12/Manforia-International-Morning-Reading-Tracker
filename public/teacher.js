// Teacher Dashboard JavaScript
let teacherProfile = {};
let myDailyReports = [];
let myWeeklyReports = [];

// Initialize the teacher dashboard
document.addEventListener('DOMContentLoaded', function() {
    loadTeacherProfile();
    loadMyReports();
    
    // Set today's date as default for daily report
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('reportDate').value = today;
    
    // Add event listeners for forms
    document.getElementById('dailyReportForm').addEventListener('submit', handleDailyReportSubmission);
    document.getElementById('weeklyReportForm').addEventListener('submit', handleWeeklyReportSubmission);
    document.getElementById('changePasswordForm').addEventListener('submit', handlePasswordChange);
    
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
    
    // Load reports when switching to my-reports tab
    if (tabName === 'my-reports') {
        loadMyReports();
    }
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
    
    // Load reports when switching to my-reports tab
    if (tabName === 'my-reports') {
        loadMyReports();
    }
    
    // Close mobile sidebar
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const mobileSidebar = document.getElementById('mobileSidebar');
    const mobileOverlay = document.getElementById('mobileOverlay');
    
    hamburgerBtn.classList.remove('active');
    mobileSidebar.classList.remove('active');
    mobileOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

// Load teacher profile information
async function loadTeacherProfile() {
    try {
        const response = await fetch('/api/teacher/profile');
        teacherProfile = await response.json();
        displayTeacherProfile();
    } catch (error) {
        console.error('Error loading teacher profile:', error);
    }
}

// Display teacher profile information
function displayTeacherProfile() {
    document.getElementById('teacherName').textContent = teacherProfile.fullName;
    document.getElementById('profileName').textContent = teacherProfile.fullName;
    document.getElementById('profileClass').textContent = teacherProfile.assignedClass;
    document.getElementById('currentWeek').textContent = `Week ${teacherProfile.currentWeek}`;
    document.getElementById('currentMonth').textContent = teacherProfile.monthYear;
    
    // Update sidebar info
    document.getElementById('sidebarTeacherName').textContent = teacherProfile.fullName;
    document.getElementById('sidebarTeacherClass').textContent = teacherProfile.assignedClass;
}

// Handle daily report form submission
async function handleDailyReportSubmission(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const reportData = {
        reportDate: formData.get('reportDate'),
        materialsUsed: formData.get('materialsUsed'),
        newWords: formData.get('newWords'),
        comments: formData.get('comments')
    };
    
    try {
        const response = await fetch('/api/teacher/daily-report', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(reportData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showSuccessMessage('Daily report submitted successfully!');
            document.getElementById('dailyReportForm').reset();
            // Set today's date again
            const today = new Date().toISOString().split('T')[0];
            document.getElementById('reportDate').value = today;
            loadMyReports(); // Refresh reports
        } else {
            alert('Error submitting report: ' + result.error);
        }
    } catch (error) {
        console.error('Error submitting daily report:', error);
        alert('Network error. Please try again.');
    }
}

// Handle weekly report form submission
async function handleWeeklyReportSubmission(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const reportData = {
        activeReaders: formData.get('activeReaders'),
        studentsNeedingSupport: formData.get('studentsNeedingSupport'),
        commonChallenges: formData.get('commonChallenges'),
        strategiesNextWeek: formData.get('strategiesNextWeek')
    };
    
    try {
        const response = await fetch('/api/teacher/weekly-report', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(reportData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showSuccessMessage('Weekly summary submitted successfully!');
            document.getElementById('weeklyReportForm').reset();
            loadMyReports(); // Refresh reports
        } else {
            alert('Error submitting weekly summary: ' + result.error);
        }
    } catch (error) {
        console.error('Error submitting weekly report:', error);
        alert('Network error. Please try again.');
    }
}

// Handle password change form submission
async function handlePasswordChange(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const currentPassword = formData.get('currentPassword');
    const newPassword = formData.get('newPassword');
    const confirmPassword = formData.get('confirmPassword');
    
    // Validate passwords match
    if (newPassword !== confirmPassword) {
        alert('New passwords do not match. Please try again.');
        return;
    }
    
    // Validate password length
    if (newPassword.length < 6) {
        alert('New password must be at least 6 characters long.');
        return;
    }
    
    try {
        const response = await fetch('/api/teacher/change-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                currentPassword: currentPassword,
                newPassword: newPassword
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            showSuccessMessage('Password changed successfully!');
            document.getElementById('changePasswordForm').reset();
        } else {
            alert('Error changing password: ' + result.error);
        }
    } catch (error) {
        console.error('Error changing password:', error);
        alert('Network error. Please try again.');
    }
}

// Load teacher's reports
async function loadMyReports() {
    try {
        // Load daily reports
        const dailyResponse = await fetch('/api/teacher/daily-reports');
        myDailyReports = await dailyResponse.json();
        displayMyDailyReports();
        
        // Load weekly reports
        const weeklyResponse = await fetch('/api/teacher/weekly-reports');
        myWeeklyReports = await weeklyResponse.json();
        displayMyWeeklyReports();
    } catch (error) {
        console.error('Error loading reports:', error);
    }
}

// Display teacher's daily reports
function displayMyDailyReports() {
    const tbody = document.querySelector('#myDailyReportsTable tbody');
    tbody.innerHTML = '';
    
    myDailyReports.forEach((report, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${new Date(report.report_date).toLocaleDateString()}</td>
            <td>${truncateText(report.materials_used, 40)}</td>
            <td>${truncateText(report.new_words || 'N/A', 30)}</td>
            <td>${truncateText(report.comments || 'N/A', 40)}</td>
            <td>Week ${report.week_number}</td>
            <td>
                <button class="btn-view-report" onclick="viewMyDailyReport(${index})">View</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Display teacher's weekly reports
function displayMyWeeklyReports() {
    const tbody = document.querySelector('#myWeeklyReportsTable tbody');
    tbody.innerHTML = '';
    
    myWeeklyReports.forEach((report, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${new Date(report.submitted_at).toLocaleDateString()}</td>
            <td>Week ${report.week_number}</td>
            <td>${truncateText(report.active_readers, 35)}</td>
            <td>${truncateText(report.students_needing_support, 35)}</td>
            <td>${truncateText(report.common_challenges, 35)}</td>
            <td>${truncateText(report.strategies_next_week, 35)}</td>
            <td>
                <button class="btn-view-report" onclick="viewMyWeeklyReport(${index})">View</button>
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

// View my daily report in modal
function viewMyDailyReport(index) {
    const report = myDailyReports[index];
    
    // Set modal title and icon
    document.getElementById('reportIcon').innerHTML = '<i class="fas fa-clipboard-list"></i>';
    document.getElementById('reportTitle').textContent = 'My Daily Reading Report';
    
    // Create info grid
    const infoGrid = document.getElementById('reportInfoGrid');
    infoGrid.innerHTML = `
        <div class="report-info-card">
            <h4>Date</h4>
            <p>${new Date(report.report_date).toLocaleDateString()}</p>
        </div>
        <div class="report-info-card">
            <h4>Teacher</h4>
            <p>${teacherProfile.fullName}</p>
        </div>
        <div class="report-info-card">
            <h4>Class</h4>
            <p>${teacherProfile.assignedClass}</p>
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
                <i class="fas fa-book"></i> Materials Used
            </div>
            <div class="report-section-content">
                ${report.materials_used || '<div class="empty">No materials specified</div>'}
            </div>
        </div>
        
        ${report.new_words ? `
        <div class="report-content-section">
            <div class="report-section-title">
                <i class="fas fa-pencil-alt"></i> New Words Learned
            </div>
            <div class="report-section-content">
                ${report.new_words}
            </div>
        </div>
        ` : ''}
        
        ${report.comments ? `
        <div class="report-content-section">
            <div class="report-section-title">
                <i class="fas fa-comment"></i> Teacher Comments
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

// View my weekly report in modal
function viewMyWeeklyReport(index) {
    const report = myWeeklyReports[index];
    
    // Set modal title and icon
    document.getElementById('reportIcon').innerHTML = '<i class="fas fa-chart-bar"></i>';
    document.getElementById('reportTitle').textContent = 'My Weekly Summary Report';
    
    // Create info grid
    const infoGrid = document.getElementById('reportInfoGrid');
    infoGrid.innerHTML = `
        <div class="report-info-card">
            <h4>Submitted Date</h4>
            <p>${new Date(report.submitted_at).toLocaleDateString()}</p>
        </div>
        <div class="report-info-card">
            <h4>Teacher</h4>
            <p>${teacherProfile.fullName}</p>
        </div>
        <div class="report-info-card">
            <h4>Class</h4>
            <p>${teacherProfile.assignedClass}</p>
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
                <i class="fas fa-star"></i> Active Readers
            </div>
            <div class="report-section-content">
                ${report.active_readers || '<div class="empty">No information provided</div>'}
            </div>
        </div>
        
        <div class="report-content-section">
            <div class="report-section-title">
                <i class="fas fa-hands-helping"></i> Students Needing Support
            </div>
            <div class="report-section-content">
                ${report.students_needing_support || '<div class="empty">No information provided</div>'}
            </div>
        </div>
        
        <div class="report-content-section">
            <div class="report-section-title">
                <i class="fas fa-exclamation-triangle"></i> Common Challenges
            </div>
            <div class="report-section-content">
                ${report.common_challenges || '<div class="empty">No challenges reported</div>'}
            </div>
        </div>
        
        <div class="report-content-section">
            <div class="report-section-title">
                <i class="fas fa-bullseye"></i> Strategies for Next Week
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

// PDF Export Functions for Teacher
function exportMyDailyReportsPDF() {
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
        
        // Add teacher info
        doc.setFontSize(10);
        doc.text(`Teacher: ${teacherProfile.fullName}`, 20, 52);
        doc.text(`Class: ${teacherProfile.assignedClass}`, 20, 57);
        doc.text('Generated on: ' + new Date().toLocaleDateString(), 20, 62);
        doc.text('Total Reports: ' + myDailyReports.length, 20, 67);
        
        // Add line separator
        doc.setLineWidth(0.5);
        doc.setDrawColor(139, 21, 56);
        doc.line(20, 72, 190, 72);
        
        // Create professional detailed report format
        let currentY = 80;
        
        myDailyReports.forEach((report, index) => {
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
                    0: { fontStyle: 'bold', fillColor: [248, 249, 250], cellWidth: 25 },
                    1: { cellWidth: 65 }
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
            addTeacherSignatureSection(doc, 20, teacherProfile.fullName, teacherProfile.assignedClass);
        } else {
            addTeacherSignatureSection(doc, currentY + 10, teacherProfile.fullName, teacherProfile.assignedClass);
        }
        
        // Add footer
        addPDFFooter(doc);
        
        doc.save(`${teacherProfile.fullName.replace(/\s+/g, '-')}-daily-reports.pdf`);
    };
    logoImg.src = 'cropped-cropped-icon2.png';
}

function exportMyWeeklyReportsPDF() {
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
        
        // Add teacher info
        doc.setFontSize(10);
        doc.text(`Teacher: ${teacherProfile.fullName}`, 20, 52);
        doc.text(`Class: ${teacherProfile.assignedClass}`, 20, 57);
        doc.text('Generated on: ' + new Date().toLocaleDateString(), 20, 62);
        doc.text('Total Reports: ' + myWeeklyReports.length, 20, 67);
        
        // Add line separator
        doc.setLineWidth(0.5);
        doc.setDrawColor(139, 21, 56);
        doc.line(20, 72, 190, 72);
        
        // Create professional detailed weekly report format
        let currentY = 80;
        
        myWeeklyReports.forEach((report, index) => {
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
            addTeacherSignatureSection(doc, 20, teacherProfile.fullName, teacherProfile.assignedClass);
        } else {
            addTeacherSignatureSection(doc, currentY + 10, teacherProfile.fullName, teacherProfile.assignedClass);
        }
        
        // Add footer
        addPDFFooter(doc);
        
        doc.save(`${teacherProfile.fullName.replace(/\s+/g, '-')}-weekly-reports.pdf`);
    };
    logoImg.src = 'cropped-cropped-icon2.png';
}

// Helper function to add teacher signature section
function addTeacherSignatureSection(doc, startY, teacherName, className) {
    // Add signature section title
    doc.setFontSize(12);
    doc.setTextColor(139, 21, 56);
    doc.text('TEACHER CERTIFICATION & SIGNATURES', 20, startY);
    
    // Add line separator
    doc.setLineWidth(0.3);
    doc.setDrawColor(139, 21, 56);
    doc.line(20, startY + 3, 190, startY + 3);
    
    // Add certification text
    doc.setFontSize(9);
    doc.setTextColor(0, 0, 0);
    doc.text('I hereby certify that the information contained in this report is accurate and complete', 20, startY + 15);
    doc.text('to the best of my knowledge and represents the actual morning reading activities conducted.', 20, startY + 22);
    
    // Add signature boxes
    doc.setFontSize(10);
    
    // Teacher signature
    doc.text('Teacher Signature:', 20, startY + 35);
    doc.line(20, startY + 45, 90, startY + 45); // Signature line
    doc.text(`${teacherName}`, 20, startY + 52);
    doc.text(`Class: ${className}`, 20, startY + 59);
    doc.text('Date: _______________', 20, startY + 66);
    
    // Supervisor signature
    doc.text('Reviewed by Supervisor:', 110, startY + 35);
    doc.line(110, startY + 45, 180, startY + 45); // Signature line
    doc.text('Name: ___________________', 110, startY + 52);
    doc.text('Position: ________________', 110, startY + 59);
    doc.text('Date: _______________', 110, startY + 66);
    
    // Add note
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text('Note: This report should be submitted to the administration within 24 hours of completion.', 20, startY + 80);
}

// Helper function to add PDF footer (reused from admin)
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
