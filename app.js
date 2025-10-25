// Global State
const state = {
    currentPage: 'home',
    courses: {
        'ICT-2101': { credit: 3, batch: '21B' },
        'ICT-2103': { credit: 3, batch: '21B' },
        'ICT-2105': { credit: 4, batch: '21B' },
        'ICT-2107': { credit: 2, batch: '21B' },
        'ICT-2109': { credit: 3, batch: '21B' },
        'ICT-2201': { credit: 3, batch: '22B' },
        'ICT-2203': { credit: 4, batch: '22B' },
        'ICT-2205': { credit: 2, batch: '22B' },
        'ICT-2207': { credit: 3, batch: '22B' },
        'ICT-2209': { credit: 3, batch: '22B' },
    },
    students: {
        'IT21001': { 
            regularCourses: ['ICT-2101', 'ICT-2103', 'ICT-2105', 'ICT-2107'], 
            backlogCourses: [] 
        },
        'IT21002': { 
            regularCourses: ['ICT-2101', 'ICT-2105', 'ICT-2109'], 
            backlogCourses: ['ICT-2103'] 
        },
        'IT21003': { 
            regularCourses: ['ICT-2103', 'ICT-2107', 'ICT-2109'], 
            backlogCourses: [] 
        },
        'IT21004': { 
            regularCourses: ['ICT-2101', 'ICT-2103', 'ICT-2107', 'ICT-2109'], 
            backlogCourses: [] 
        },
        'IT21005': { 
            regularCourses: ['ICT-2105', 'ICT-2109'], 
            backlogCourses: ['ICT-2101', 'ICT-2103'] 
        },
        'IT22001': { 
            regularCourses: ['ICT-2201', 'ICT-2203', 'ICT-2205', 'ICT-2207'], 
            backlogCourses: [] 
        },
        'IT22002': { 
            regularCourses: ['ICT-2201', 'ICT-2205', 'ICT-2209'], 
            backlogCourses: ['ICT-2203'] 
        },
        'IT22003': { 
            regularCourses: ['ICT-2203', 'ICT-2207', 'ICT-2209'], 
            backlogCourses: [] 
        },
        'IT22004': { 
            regularCourses: ['ICT-2201', 'ICT-2203', 'ICT-2207', 'ICT-2209'], 
            backlogCourses: [] 
        },
        'IT22005': { 
            regularCourses: ['ICT-2205', 'ICT-2209'], 
            backlogCourses: ['ICT-2201', 'ICT-2203'] 
        },
    },
    numDays: 5,
    numShifts: 2,
    scheduleGrid: {},
    dateHeaders: [],
    shiftHeaders: [],
    selectedCell: null,
    conflictModalData: null,
    headerText: '',
};

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    initializeNavigation();
    initializeCourseManager();
    initializeStudentManager();
    initializeGridSetup();
    initializeActions();
    initializeContactForm();
    renderPage();
    
    // Render default data
    renderCourseList();
    renderStudentList();
});

// Navigation
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const getStartedBtns = document.querySelectorAll('[data-page]');

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            const page = link.getAttribute('data-page');
            navigateTo(page);
        });
    });

    getStartedBtns.forEach(btn => {
        if (!btn.classList.contains('nav-link')) {
            btn.addEventListener('click', () => {
                const page = btn.getAttribute('data-page');
                navigateTo(page);
            });
        }
    });
}

function navigateTo(page) {
    state.currentPage = page;
    renderPage();
}

function renderPage() {
    // Update nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('data-page') === state.currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Show/hide pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(`${state.currentPage}-page`).classList.add('active');
}

// Course Manager
function initializeCourseManager() {
    const form = document.getElementById('course-form');
    const codeInput = document.getElementById('course-code');
    const creditInput = document.getElementById('course-credit');
    const batchInput = document.getElementById('course-batch');
    const searchInput = document.getElementById('course-search');

    // Auto-fill on course code change
    codeInput.addEventListener('input', (e) => {
        const code = e.target.value.toUpperCase();
        codeInput.value = code;
        
        if (state.courses[code]) {
            creditInput.value = state.courses[code].credit;
            batchInput.value = state.courses[code].batch;
        }
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const code = codeInput.value.trim().toUpperCase();
        const credit = parseInt(creditInput.value);
        const batch = batchInput.value.trim();

        if (code && credit && batch) {
            state.courses[code] = { credit, batch };
            form.reset();
            renderCourseList();
        }
    });

    searchInput.addEventListener('input', renderCourseList);
}

function renderCourseList() {
    const list = document.getElementById('course-list');
    const searchTerm = document.getElementById('course-search').value.toLowerCase();
    
    const filtered = Object.entries(state.courses).filter(([code, data]) =>
        code.toLowerCase().includes(searchTerm) ||
        data.batch.toLowerCase().includes(searchTerm)
    );

    list.innerHTML = '';
    filtered.forEach(([code, data]) => {
        const item = createCourseItem(code, data);
        list.appendChild(item);
    });
}

function createCourseItem(code, data) {
    const div = document.createElement('div');
    div.className = 'list-item';
    div.innerHTML = `
        <div class="list-item-content">
            <div class="list-item-title">${code}</div>
            <div class="list-item-subtitle">${data.batch} - ${data.credit} Credits</div>
        </div>
        <div class="list-item-actions">
            <button class="icon-btn edit" onclick="editCourse('${code}')">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
            </button>
            <button class="icon-btn delete" onclick="deleteCourse('${code}')">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
            </button>
        </div>
    `;
    return div;
}

function editCourse(code) {
    const data = state.courses[code];
    document.getElementById('course-code').value = code;
    document.getElementById('course-credit').value = data.credit;
    document.getElementById('course-batch').value = data.batch;
}

function deleteCourse(code) {
    if (confirm(`Delete course ${code}?`)) {
        delete state.courses[code];
        renderCourseList();
    }
}

// Student Manager
function initializeStudentManager() {
    const form = document.getElementById('student-form');
    const searchInput = document.getElementById('student-search');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = document.getElementById('student-id').value.trim().toUpperCase();
        const regular = document.getElementById('student-regular').value
            .split(',')
            .map(c => c.trim().toUpperCase())
            .filter(c => c);
        const backlog = document.getElementById('student-backlog').value
            .split(',')
            .map(c => c.trim().toUpperCase())
            .filter(c => c);

        if (id) {
            state.students[id] = { regularCourses: regular, backlogCourses: backlog };
            form.reset();
            renderStudentList();
        }
    });

    searchInput.addEventListener('input', renderStudentList);
}

function renderStudentList() {
    const list = document.getElementById('student-list');
    const searchTerm = document.getElementById('student-search').value.toLowerCase();
    
    const filtered = Object.entries(state.students).filter(([id]) =>
        id.toLowerCase().includes(searchTerm)
    );

    list.innerHTML = '';
    filtered.forEach(([id, data]) => {
        const item = createStudentItem(id, data);
        list.appendChild(item);
    });
}

function createStudentItem(id, data) {
    const div = document.createElement('div');
    div.className = 'list-item';
    div.innerHTML = `
        <div class="list-item-content">
            <div class="list-item-title">${id}</div>
            <div class="list-item-subtitle">
                Regular: ${data.regularCourses.length > 0 ? data.regularCourses.join(', ') : 'None'}<br>
                Backlog: ${data.backlogCourses.length > 0 ? data.backlogCourses.join(', ') : 'None'}
            </div>
        </div>
        <div class="list-item-actions">
            <button class="icon-btn edit" onclick="editStudent('${id}')">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
            </button>
            <button class="icon-btn delete" onclick="deleteStudent('${id}')">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
            </button>
        </div>
    `;
    return div;
}

function editStudent(id) {
    const data = state.students[id];
    document.getElementById('student-id').value = id;
    document.getElementById('student-regular').value = data.regularCourses.join(', ');
    document.getElementById('student-backlog').value = data.backlogCourses.join(', ');
}

function deleteStudent(id) {
    if (confirm(`Delete student ${id}?`)) {
        delete state.students[id];
        renderStudentList();
    }
}

// Date Helper Functions
function formatDateToDDMMYYYY(isoDate) {
    // Convert YYYY-MM-DD to DD/MM/YYYY
    const [year, month, day] = isoDate.split('-');
    return `${day}/${month}/${year}`;
}

function getDayOfWeek(isoDate) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const date = new Date(isoDate);
    return days[date.getDay()];
}

function formatDateToISO(ddmmyyyy) {
    // Convert DD/MM/YYYY to YYYY-MM-DD
    const [day, month, year] = ddmmyyyy.split('/');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

// Grid Setup
function initializeGridSetup() {
    const btn = document.getElementById('generate-grid-btn');
    btn.addEventListener('click', generateGrid);
    
    // Initialize PDF header text
    const headerTextEl = document.getElementById('pdf-header-text');
    if (headerTextEl) {
        headerTextEl.addEventListener('input', (e) => {
            state.headerText = e.target.value;
        });
    }
}

function addNewRow() {
    if (state.dateHeaders.length === 0) {
        alert('Please generate a grid first');
        return;
    }
    
    // Get the last date and add one more day
    const lastDate = state.dateHeaders[state.dateHeaders.length - 1];
    const nextDate = new Date(lastDate);
    nextDate.setDate(nextDate.getDate() + 1);
    const newDate = nextDate.toISOString().split('T')[0];
    
    state.dateHeaders.push(newDate);
    renderScheduleGrid();
}

function generateGrid() {
    state.numDays = parseInt(document.getElementById('num-days').value) || 5;
    state.numShifts = parseInt(document.getElementById('num-shifts').value) || 2;
    
    state.scheduleGrid = {};
    // Initialize with actual dates starting from today
    const today = new Date();
    state.dateHeaders = Array.from({ length: state.numDays }, (_, i) => {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        return date.toISOString().split('T')[0]; // YYYY-MM-DD format
    });
    state.shiftHeaders = Array.from({ length: state.numShifts }, (_, i) => `Shift ${i + 1} (Time)`);
    
    renderScheduleGrid();
}

// Schedule Grid
function renderScheduleGrid() {
    const container = document.getElementById('schedule-grid-container');
    
    if (state.dateHeaders.length === 0 || state.shiftHeaders.length === 0) {
        container.innerHTML = '';
        return;
    }

    const table = document.createElement('table');
    table.className = 'schedule-table';

    // Header row
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    
    const dateHeader = document.createElement('th');
    dateHeader.innerHTML = '<input type="text" value="Date" readonly>';
    headerRow.appendChild(dateHeader);
    
    const dayHeader = document.createElement('th');
    dayHeader.innerHTML = '<input type="text" value="Day" readonly>';
    headerRow.appendChild(dayHeader);

    state.shiftHeaders.forEach((header, index) => {
        const th = document.createElement('th');
        th.innerHTML = `<input type="text" value="${header}" onchange="updateShiftHeader(${index}, this.value)">`;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Body rows
    const tbody = document.createElement('tbody');
    state.dateHeaders.forEach((date, rowIndex) => {
        const row = document.createElement('tr');
        
        const dateCell = document.createElement('td');
        const formattedDate = formatDateToDDMMYYYY(date);
        dateCell.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: center; gap: 4px;">
                <strong style="font-size: 0.9em;">${formattedDate}</strong>
            </div>
        `;
        dateCell.style.background = '#374151';
        row.appendChild(dateCell);
        
        const dayCell = document.createElement('td');
        const dayOfWeek = getDayOfWeek(date);
        dayCell.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: center; gap: 4px;">
                <strong style="font-size: 0.9em;">${dayOfWeek}</strong>
            </div>
        `;
        dayCell.style.background = '#374151';
        row.appendChild(dayCell);

        state.shiftHeaders.forEach((_, colIndex) => {
            const cellId = `R${rowIndex}_C${colIndex}`;
            const cell = createScheduleCell(cellId, rowIndex, colIndex);
            row.appendChild(cell);
        });

        tbody.appendChild(row);
    });
    table.appendChild(tbody);

    container.innerHTML = '';
    container.appendChild(table);
    
    // Add the "Add Row" button at the bottom
    const addRowBtn = document.createElement('button');
    addRowBtn.id = 'add-row-btn-grid';
    addRowBtn.className = 'btn btn-success';
    addRowBtn.style.marginTop = '1rem';
    addRowBtn.innerHTML = `
        <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        Add Row
    `;
    addRowBtn.onclick = addNewRow;
    container.appendChild(addRowBtn);

    renderConflictSummary();
}

function createScheduleCell(cellId, rowIndex, colIndex) {
    const td = document.createElement('td');
    const cellData = state.scheduleGrid[cellId];

    if (cellData && cellData.courseCode) {
        td.className = 'has-course';
        const conflicts = checkConflicts();
        
        // Check for duplicate
        const duplicate = conflicts.duplicates.find(d => d.positions.includes(cellId));
        if (duplicate) {
            td.classList.add('duplicate');
        }
        
        // Check for gap conflict
        const gapConflict = conflicts.studentGaps.find(g => g.cellId === cellId);
        if (gapConflict && !cellData.warningIgnored) {
            td.classList.add('warning');
        }

        td.innerHTML = getCellDisplay(cellId);
    } else {
        td.className = 'empty';
        td.onclick = () => openCourseSelectModal(cellId);
    }

    return td;
}

function getCellDisplay(cellId) {
    const cell = state.scheduleGrid[cellId];
    if (!cell || !cell.courseCode) return '';

    const courseCode = cell.courseCode;
    let hasRegular = false;
    let hasBacklog = false;

    Object.values(state.students).forEach(student => {
        if (student.regularCourses.includes(courseCode)) hasRegular = true;
        if (student.backlogCourses.includes(courseCode)) hasBacklog = true;
    });

    let html = '<div class="cell-content">';
    
    if (hasRegular && hasBacklog) {
        html += `<div class="cell-course">${courseCode}</div>`;
        html += `<div class="cell-backlog">${courseCode} (BL)</div>`;
    } else if (hasBacklog) {
        html += `<div class="cell-course">${courseCode} (BL)</div>`;
    } else {
        html += `<div class="cell-course">${courseCode}</div>`;
    }

    html += `<button class="cell-remove" onclick="removeCellCourse('${cellId}', event)">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
    </button>`;
    html += '</div>';

    return html;
}

function updateDateHeader(index, value) {
    state.dateHeaders[index] = value;
}

function updateShiftHeader(index, value) {
    state.shiftHeaders[index] = value;
}

function removeCellCourse(cellId, event) {
    event.stopPropagation();
    delete state.scheduleGrid[cellId];
    renderScheduleGrid();
}

// Course Selection Modal
function openCourseSelectModal(cellId) {
    state.selectedCell = cellId;
    
    const modal = document.getElementById('course-select-modal');
    const list = document.getElementById('course-select-list');
    
    // Get unscheduled courses
    const scheduledCourses = new Set(
        Object.values(state.scheduleGrid).map(cell => cell?.courseCode).filter(Boolean)
    );
    const unscheduledCourses = Object.keys(state.courses).filter(
        code => !scheduledCourses.has(code)
    );

    list.innerHTML = '';
    unscheduledCourses.forEach(code => {
        const data = state.courses[code];
        const item = document.createElement('div');
        item.className = 'modal-list-item';
        item.innerHTML = `
            <div class="modal-list-item-title">${code}</div>
            <div class="modal-list-item-subtitle">${data.batch} - ${data.credit} Credits</div>
        `;
        item.onclick = () => selectCourse(code);
        list.appendChild(item);
    });

    modal.classList.add('active');
}

function selectCourse(courseCode) {
    if (!state.selectedCell) return;

    // Temporarily add the course
    const tempGrid = { ...state.scheduleGrid, [state.selectedCell]: { courseCode, warningIgnored: false } };
    
    // Check for conflicts
    const conflicts = checkConflictsForGrid(tempGrid);
    
    // Debug logging
    console.log('Checking conflicts for:', courseCode);
    console.log('Student gaps found:', conflicts.studentGaps);
    console.log('Duplicates found:', conflicts.duplicates);
    
    // Check if this specific cell has conflicts
    const cellConflicts = conflicts.studentGaps.filter(c => c.cellId === state.selectedCell);
    
    if (cellConflicts.length > 0) {
        // Show conflict modal
        state.conflictModalData = {
            cellId: state.selectedCell,
            courseCode,
            conflicts: cellConflicts,
        };
        closeCourseSelectModal();
        openConflictModal();
    } else {
        // No conflicts, add the course
        state.scheduleGrid[state.selectedCell] = { courseCode, warningIgnored: false };
        closeCourseSelectModal();
        renderScheduleGrid();
    }
}

function closeCourseSelectModal() {
    document.getElementById('course-select-modal').classList.remove('active');
    state.selectedCell = null;
}

document.getElementById('close-course-modal').addEventListener('click', closeCourseSelectModal);

// Conflict Modal
function openConflictModal() {
    if (!state.conflictModalData) return;

    const modal = document.getElementById('conflict-modal');
    const details = document.getElementById('conflict-details');

    details.innerHTML = '';
    state.conflictModalData.conflicts.forEach(conflict => {
        const div = document.createElement('div');
        div.className = 'conflict-detail-item';
        div.innerHTML = `
            <div class="conflict-detail-student">Student ${conflict.studentId}</div>
            <div class="conflict-detail-text">
                Has <strong>${conflict.examA}</strong> (${state.courses[conflict.examA]?.credit} credits) on 
                ${formatDateToDDMMYYYY(conflict.dateA)} and 
                <strong>${conflict.examB}</strong> (${state.courses[conflict.examB]?.credit} credits) on 
                ${formatDateToDDMMYYYY(conflict.dateB)}.
            </div>
            <div class="conflict-detail-error">
                Gap: ${conflict.gap} days, Required: ${conflict.requiredGap} days
            </div>
        `;
        details.appendChild(div);
    });

    modal.classList.add('active');
}

function closeConflictModal() {
    document.getElementById('conflict-modal').classList.remove('active');
    state.conflictModalData = null;
}

document.getElementById('remove-exam-btn').addEventListener('click', () => {
    closeConflictModal();
});

document.getElementById('ignore-warning-btn').addEventListener('click', () => {
    if (state.conflictModalData) {
        state.scheduleGrid[state.conflictModalData.cellId] = {
            courseCode: state.conflictModalData.courseCode,
            warningIgnored: true,
        };
        closeConflictModal();
        renderScheduleGrid();
    }
});

// Conflict Detection
function checkConflicts() {
    return checkConflictsForGrid(state.scheduleGrid);
}

function checkConflictsForGrid(grid) {
    const conflicts = { duplicates: [], studentGaps: [] };

    // Check for duplicate courses
    const coursePositions = {};
    Object.entries(grid).forEach(([cellId, cell]) => {
        if (cell && cell.courseCode) {
            if (!coursePositions[cell.courseCode]) {
                coursePositions[cell.courseCode] = [];
            }
            coursePositions[cell.courseCode].push(cellId);
        }
    });

    Object.entries(coursePositions).forEach(([code, positions]) => {
        if (positions.length > 1) {
            conflicts.duplicates.push({ courseCode: code, positions });
        }
    });

    // Check student gap conflicts
    console.log('Checking conflicts for students:', Object.keys(state.students));
    console.log('Available courses:', state.courses);
    console.log('Date headers:', state.dateHeaders);
    
    Object.entries(state.students).forEach(([studentId, student]) => {
        const allCourses = [...student.regularCourses, ...student.backlogCourses];
        const studentExams = [];
        
        console.log(`Student ${studentId} enrolled in:`, allCourses);

        Object.entries(grid).forEach(([cellId, cell]) => {
            console.log(`Checking cell ${cellId}:`, cell);
            if (cell && cell.courseCode && allCourses.includes(cell.courseCode)) {
                const [row, col] = cellId.split('_').map(s => parseInt(s.substring(1)));
                const examDate = state.dateHeaders[row];
                console.log(`  Found exam: ${cell.courseCode} on ${examDate} (row ${row})`);
                studentExams.push({ courseCode: cell.courseCode, day: row, date: examDate, cellId });
            }
        });

        console.log(`Student ${studentId} has ${studentExams.length} exams scheduled`);

        // Sort by date
        studentExams.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return dateA - dateB;
        });
        console.log('Student exams sorted by date:', studentExams);
        // Check gaps based on actual date differences
        for (let i = 0; i < studentExams.length - 1; i++) {
            for (let j = i + 1; j < studentExams.length; j++) {
                const examA = studentExams[i];
                const examB = studentExams[j];
                
                // Calculate actual day difference
                const dateA = new Date(examA.date);
                const dateB = new Date(examB.date);
                const gap = Math.floor((dateB - dateA) / (1000 * 60 * 60 * 24));
                
                const requiredGap = state.courses[examB.courseCode]?.credit || 0;
                console.log(`Student ${studentId} exam gap: ${gap} days, Required: ${requiredGap} days`);
                console.log(`  Checking gap: ${examA.courseCode}(${examA.date}) -> ${examB.courseCode}(${examB.date})`);
                console.log(`    Gap: ${gap} days, Required: ${requiredGap} days`);

                if (gap < requiredGap) {
                    console.log(`    ⚠️ CONFLICT DETECTED!`);
                    conflicts.studentGaps.push({
                        studentId,
                        examA: examA.courseCode,
                        examB: examB.courseCode,
                        dateA: examA.date,
                        dateB: examB.date,
                        dayA: examA.day,
                        dayB: examB.day,
                        gap,
                        requiredGap,
                        cellId: examB.cellId,
                    });
                }
            }
        }
    });

    return conflicts;
}

function renderConflictSummary() {
    const container = document.getElementById('conflict-summary');
    const conflicts = checkConflicts();

    container.innerHTML = '';
    
    if (conflicts.duplicates.length > 0) {
        container.className = 'conflict-summary';
        conflicts.duplicates.forEach(dup => {
            const div = document.createElement('div');
            div.className = 'conflict-item';
            div.innerHTML = `
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                    <line x1="12" y1="9" x2="12" y2="13"></line>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
                <span>Error: <strong>${dup.courseCode}</strong> is scheduled in multiple slots</span>
            `;
            container.appendChild(div);
        });
    }
}

// Actions
function initializeActions() {
    document.getElementById('auto-schedule-btn').addEventListener('click', autoSchedule);
    document.getElementById('export-pdf-btn').addEventListener('click', exportPDF);
    document.getElementById('export-doc-btn').addEventListener('click', exportDOC);
    document.getElementById('save-state-btn').addEventListener('click', saveState);
    document.getElementById('load-state-btn').addEventListener('click', () => {
        document.getElementById('load-file-input').click();
    });
    document.getElementById('load-file-input').addEventListener('change', loadState);
}

function autoSchedule() {
    if (Object.keys(state.courses).length === 0) {
        alert('Please add courses first');
        return;
    }
    if (state.dateHeaders.length === 0 || state.shiftHeaders.length === 0) {
        alert('Please generate a grid first');
        return;
    }

    // Clear existing grid
    state.scheduleGrid = {};

    // Get all courses
    const courseCodes = Object.keys(state.courses);

    // Calculate student conflicts for each course
    const courseConflicts = {};
    courseCodes.forEach(code => {
        let count = 0;
        Object.values(state.students).forEach(student => {
            if (student.regularCourses.includes(code) || student.backlogCourses.includes(code)) {
                count++;
            }
        });
        courseConflicts[code] = count;
    });

    // Sort courses by conflict count (descending)
    const sortedCourses = courseCodes.sort((a, b) => courseConflicts[b] - courseConflicts[a]);

    // Try to place each course
    for (const courseCode of sortedCourses) {
        let placed = false;
        let currentNumDays = state.dateHeaders.length;

        // Try to place in existing grid
        for (let day = 0; day < currentNumDays && !placed; day++) {
            for (let shift = 0; shift < state.numShifts && !placed; shift++) {
                const cellId = `R${day}_C${shift}`;

                // Skip if cell is occupied
                if (state.scheduleGrid[cellId]) continue;

                // Check if this placement causes conflicts
                const tempGrid = { ...state.scheduleGrid, [cellId]: { courseCode, warningIgnored: false } };
                const conflicts = checkConflictsForGrid(tempGrid);

                // Check for any conflicts (duplicates or student gaps)
                if (!conflicts.duplicates.length && !conflicts.studentGaps.length) {
                    state.scheduleGrid[cellId] = { courseCode, warningIgnored: false };
                    placed = true;
                }
            }
        }

        // If not placed, add new rows until we can place it
        while (!placed) {
            // Add a new day
            const lastDate = state.dateHeaders[state.dateHeaders.length - 1];
            const nextDate = new Date(lastDate);
            nextDate.setDate(nextDate.getDate() + 1);
            const newDate = nextDate.toISOString().split('T')[0];
            state.dateHeaders.push(newDate);
            currentNumDays = state.dateHeaders.length;
            const newDay = currentNumDays - 1;

            // Try to place in the new row
            for (let shift = 0; shift < state.numShifts && !placed; shift++) {
                const cellId = `R${newDay}_C${shift}`;

                // Check if this placement causes conflicts
                const tempGrid = { ...state.scheduleGrid, [cellId]: { courseCode, warningIgnored: false } };
                const conflicts = checkConflictsForGrid(tempGrid);

                // Check for any conflicts (duplicates or student gaps)
                if (!conflicts.duplicates.length && !conflicts.studentGaps.length) {
                    state.scheduleGrid[cellId] = { courseCode, warningIgnored: false };
                    placed = true;
                }
            }
        }
    }

    renderScheduleGrid();
    alert(`Auto-schedule complete! All ${courseCodes.length} courses placed successfully.`);
}

function exportPDF() {
    if (state.dateHeaders.length === 0 || state.shiftHeaders.length === 0) {
        alert('Please generate a grid first');
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('landscape');

    // Get header text from textarea
    const headerText = document.getElementById('pdf-header-text')?.value || '';
    const headerLines = headerText.split('\n').filter(line => line.trim());
    
    let currentY = 20;
    
    // Add header lines if present
    if (headerLines.length > 0) {
        headerLines.forEach((line, index) => {
            if (index === 0) {
                // First line - bigger font
                doc.setFontSize(18);
                doc.setFont(undefined, 'bold');
            } else {
                // Rest - regular font
                doc.setFontSize(12);
                doc.setFont(undefined, 'normal');
            }
            // Center align text
            const pageWidth = doc.internal.pageSize.getWidth();
            const textWidth = doc.getTextWidth(line);
            const x = (pageWidth - textWidth) / 2;
            doc.text(line, x, currentY);
            currentY += (index === 0 ? 10 : 7);
        });
        currentY += 5; // Extra spacing after header
    } else {
        // Default title if no custom header
        doc.setFontSize(18);
        doc.setFont(undefined, 'bold');
        const pageWidth = doc.internal.pageSize.getWidth();
        const textWidth = doc.getTextWidth('Exam Schedule');
        const x = (pageWidth - textWidth) / 2;
        doc.text('Exam Schedule', x, currentY);
        currentY += 10;
    }

    // Prepare table data
    const headers = ['Date', 'Day', ...state.shiftHeaders];
    const rows = state.dateHeaders.map((date, rowIndex) => {
        const row = [formatDateToDDMMYYYY(date), getDayOfWeek(date)];  // Format date as DD/MM/YYYY and add day
        let hasAnyCourse = false;  // Track if row has any courses
        
        state.shiftHeaders.forEach((_, colIndex) => {
            const cellId = `R${rowIndex}_C${colIndex}`;
            const cell = state.scheduleGrid[cellId];
            if (cell && cell.courseCode) {
                hasAnyCourse = true;  // Mark that this row has a course
                const courseCode = cell.courseCode;
                let hasRegular = false;
                let hasBacklog = false;

                Object.values(state.students).forEach(student => {
                    if (student.regularCourses.includes(courseCode)) hasRegular = true;
                    if (student.backlogCourses.includes(courseCode)) hasBacklog = true;
                });

                if (hasRegular && hasBacklog) {
                    row.push(`${courseCode}\n${courseCode} (BL)`);
                } else if (hasBacklog) {
                    row.push(`${courseCode} (BL)`);
                } else {
                    row.push(courseCode);
                }
            } else {
                row.push('');
            }
        });
        return { row, hasAnyCourse };  // Return both row and flag
    }).filter(item => item.hasAnyCourse)  // Filter out rows with no courses
      .map(item => item.row);  // Extract just the row data

    // Generate table with plain styling
    doc.autoTable({
        head: [headers],
        body: rows,
        startY: currentY,
        theme: 'grid',
        styles: {
            fontSize: 10,
            cellPadding: 5,
            fillColor: [255, 255, 255], // White background
            textColor: [0, 0, 0], // Black text
            lineColor: [0, 0, 0], // Black borders
            lineWidth: 0.1,
        },
        headStyles: {
            fillColor: [255, 255, 255], // White background for header
            textColor: [0, 0, 0], // Black text for header
            fontStyle: 'bold',
            lineColor: [0, 0, 0],
            lineWidth: 0.1,
        },
        alternateRowStyles: {
            fillColor: [255, 255, 255], // White background for all rows
        },
    });

    doc.save('exam-schedule.pdf');
}

async function exportDOC() {
    if (state.dateHeaders.length === 0 || state.shiftHeaders.length === 0) {
        alert('Please generate a grid first');
        return;
    }

    try {
        const { Document, Paragraph, Table, TableRow, TableCell, WidthType, AlignmentType, TextRun, HeadingLevel, BorderStyle } = docx;

        // Get header text from textarea
        const headerText = document.getElementById('pdf-header-text')?.value || '';
        const headerLines = headerText.split('\n').filter(line => line.trim());

        // Create paragraphs for header
        const children = [];
        
        if (headerLines.length > 0) {
            headerLines.forEach((line, index) => {
                if (index === 0) {
                    // First line - heading
                    children.push(
                        new Paragraph({
                            text: line,
                            heading: HeadingLevel.HEADING_1,
                            alignment: AlignmentType.CENTER,
                            spacing: { after: 200 }
                        })
                    );
                } else {
                    // Rest - normal centered text
                    children.push(
                        new Paragraph({
                            text: line,
                            alignment: AlignmentType.CENTER,
                            spacing: { after: 100 }
                        })
                    );
                }
            });
        } else {
            // Default title
            children.push(
                new Paragraph({
                    text: 'Exam Schedule',
                    heading: HeadingLevel.HEADING_1,
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 400 }
                })
            );
        }

        // Add spacing before table
        children.push(new Paragraph({ text: '', spacing: { after: 200 } }));

        // Prepare table data
        const headers = ['Date', 'Day', ...state.shiftHeaders];
        const rows = state.dateHeaders.map((date, rowIndex) => {
            const row = [formatDateToDDMMYYYY(date), getDayOfWeek(date)];
            let hasAnyCourse = false;
            
            state.shiftHeaders.forEach((_, colIndex) => {
                const cellId = `R${rowIndex}_C${colIndex}`;
                const cell = state.scheduleGrid[cellId];
                if (cell && cell.courseCode) {
                    hasAnyCourse = true;
                    const courseCode = cell.courseCode;
                    let hasRegular = false;
                    let hasBacklog = false;

                    Object.values(state.students).forEach(student => {
                        if (student.regularCourses.includes(courseCode)) hasRegular = true;
                        if (student.backlogCourses.includes(courseCode)) hasBacklog = true;
                    });

                    if (hasRegular && hasBacklog) {
                        row.push(`${courseCode}\n${courseCode} (BL)`);
                    } else if (hasBacklog) {
                        row.push(`${courseCode} (BL)`);
                    } else {
                        row.push(courseCode);
                    }
                } else {
                    row.push('');
                }
            });
            return { row, hasAnyCourse };
        }).filter(item => item.hasAnyCourse)
          .map(item => item.row);

        // Create table rows
        const tableRows = [
            // Header row
            new TableRow({
                children: headers.map(header => 
                    new TableCell({
                        children: [new Paragraph({
                            text: header,
                            bold: true,
                            alignment: AlignmentType.CENTER
                        })],
                        width: { size: 100 / headers.length, type: WidthType.PERCENTAGE }
                    })
                )
            }),
            // Data rows
            ...rows.map(row => 
                new TableRow({
                    children: row.map((cell, idx) => 
                        new TableCell({
                            children: [new Paragraph({
                                text: cell,
                                alignment: AlignmentType.CENTER
                            })],
                            width: { size: 100 / headers.length, type: WidthType.PERCENTAGE }
                        })
                    )
                })
            )
        ];

        // Create table
        const table = new Table({
            rows: tableRows,
            width: { size: 100, type: WidthType.PERCENTAGE }
        });

        children.push(table);

        // Create document
        const doc = new Document({
            sections: [{
                children: children
            }]
        });

        // Generate and download
        const blob = await docx.Packer.toBlob(doc);
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'exam-schedule.docx';
        a.click();
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Error exporting DOC:', error);
        alert('Error exporting to DOC format. Please check console for details.');
    }
}

function saveState() {
    const dataToSave = {
        courses: state.courses,
        students: state.students,
        numDays: state.numDays,
        numShifts: state.numShifts,
        scheduleGrid: state.scheduleGrid,
        dateHeaders: state.dateHeaders,
        shiftHeaders: state.shiftHeaders,
        headerText: state.headerText,
    };

    const blob = new Blob([JSON.stringify(dataToSave, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'schedule-data.json';
    a.click();
    URL.revokeObjectURL(url);
}

function loadState(e) {
    const file = e.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target.result);
                state.courses = data.courses || {};
                state.students = data.students || {};
                state.numDays = data.numDays || 5;
                state.numShifts = data.numShifts || 2;
                state.scheduleGrid = data.scheduleGrid || {};
                state.dateHeaders = data.dateHeaders || [];
                state.shiftHeaders = data.shiftHeaders || [];
                state.headerText = data.headerText || '';
                
                // Update header text field
                const headerTextEl = document.getElementById('pdf-header-text');
                if (headerTextEl) {
                    headerTextEl.value = state.headerText;
                }

                document.getElementById('num-days').value = state.numDays;
                document.getElementById('num-shifts').value = state.numShifts;

                renderCourseList();
                renderStudentList();
                renderScheduleGrid();

                alert('State loaded successfully!');
            } catch (error) {
                alert('Error loading file: Invalid JSON');
            }
        };
        reader.readAsText(file);
    }
    e.target.value = '';
}

// Contact Form
function initializeContactForm() {
    const form = document.getElementById('contact-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = {
            name: document.getElementById('contact-name').value,
            email: document.getElementById('contact-email').value,
            subject: document.getElementById('contact-subject').value,
            message: document.getElementById('contact-message').value,
        };
        console.log('Contact Form Submitted:', formData);
        alert('Message sent! (Console logged)');
        form.reset();
    });
}
