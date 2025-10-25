# Exam Routine Generator - Vanilla JavaScript Version

A modern, feature-rich exam scheduling application built with pure HTML, CSS, and JavaScript.

## Features

- **Multi-Page Navigation**: Home, App, and Contact pages
- **Course Management**: Add, edit, and delete courses with credit hours and batch information
- **Student Management**: Track regular and backlog courses for each student
- **Dynamic Schedule Grid**: Create custom exam schedules with flexible days and shifts
- **Real-time Conflict Detection**:
  - Duplicate course detection (hard error)
  - Student gap conflicts based on credit hours (warning)
- **Auto-Schedule Algorithm**: Intelligent automatic scheduling with conflict avoidance
- **PDF Export**: Professional PDF generation of the final schedule
- **Save/Load State**: Persist and restore your work as JSON files
- **Dark Mode UI**: Beautiful, modern interface with custom CSS

## Technology Stack

- **HTML5**: Semantic markup
- **CSS3**: Custom styling with modern features
- **Vanilla JavaScript**: No frameworks or libraries (except jsPDF for PDF generation)
- **jsPDF**: PDF generation library (loaded via CDN)

## Installation

No installation required! Simply open `index.html` in a modern web browser.

### Option 1: Direct File Opening
1. Navigate to the `vanilla-version` folder
2. Double-click `index.html`
3. The application will open in your default browser

### Option 2: Local Server (Recommended)
For the best experience, use a local web server:

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (http-server)
npx http-server -p 8000

# Using PHP
php -S localhost:8000
```

Then open `http://localhost:8000` in your browser.

## Usage

### 1. Add Courses
- Navigate to the "App" page
- In the Course Management panel, add courses with:
  - Course Code (e.g., ICT-2101)
  - Credit Points (e.g., 3)
  - Batch Name (e.g., 21B)

### 2. Add Students
- In the Student Management panel, add students with:
  - Student ID (e.g., B21013)
  - Regular Courses (comma-separated)
  - Backlog Courses (comma-separated)

### 3. Create Schedule Grid
- Set the number of days and shifts
- Click "Generate Grid"
- Edit date and shift headers as needed

### 4. Schedule Exams
- Click on empty cells to select a course
- The system will check for conflicts:
  - **Red border**: Course is duplicated (must fix)
  - **Yellow border**: Student gap conflict (can ignore)
- Or use "Auto-Schedule" for automatic placement

### 5. Export
- Click "Export PDF" to download the schedule
- Use "Save State" to backup your work
- Use "Load State" to restore a previous session

## Conflict Detection Rules

### Duplicate Courses (Hard Error)
- A course cannot appear in multiple time slots
- Must be resolved before finalizing

### Student Gap Conflicts (Warning)
- For any two exams (A and B) taken by the same student:
- If Exam B is after Exam A, the gap in days must be >= credit points of Exam B
- Example: If a 3-credit course is on Day 1, the next exam for that student must be on Day 4 or later

## File Structure

```
vanilla-version/
├── index.html          # Main HTML file with all pages
├── styles.css          # All styling
├── app.js              # All JavaScript logic
└── README.md           # This file
```

## Browser Compatibility

- Chrome/Edge: ✅ Fully supported
- Firefox: ✅ Fully supported
- Safari: ✅ Fully supported
- Opera: ✅ Fully supported

Requires a modern browser with ES6+ support.

## Features Breakdown

### State Management
All application state is managed in a global `state` object with the following properties:
- `currentPage`: Current active page
- `courses`: Object map of all courses
- `students`: Object map of all students
- `scheduleGrid`: 2D grid representation
- `dateHeaders`: Array of date labels
- `shiftHeaders`: Array of shift labels

### Auto-Schedule Algorithm
The auto-schedule feature uses a greedy algorithm:
1. Calculates conflict scores for each course (how many students take it)
2. Sorts courses by conflict score (descending)
3. Places each course in the first available slot that doesn't create duplicate conflicts
4. Automatically ignores gap warnings for auto-scheduled courses

### PDF Export
Uses jsPDF and jsPDF-AutoTable to generate professional PDFs with:
- Custom headers (dates and shift times)
- Proper formatting for regular and backlog courses
- Grid layout matching the on-screen display

## License

MIT
