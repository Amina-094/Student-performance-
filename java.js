
// =========================================
// STUDENT PERFORMANCE MANAGEMENT SYSTEM
// JAVASCRIPT
// =========================================

let students = JSON.parse(localStorage.getItem("students")) || [];

// Subject names
const subjects = [
    "programming",
    "mathematics",
    "english",
    "database",
    "networks",
    "webTechnology"
];

// Save records in Local Storage
function saveData() {
    localStorage.setItem("students", JSON.stringify(students));
}

// Calculate Grade
function calculateGrade(percentage) {

    if (percentage >= 80) {
        return "A";
    }
    else if (percentage >= 70) {
        return "B";
    }
    else if (percentage >= 60) {
        return "C";
    }
    else if (percentage >= 50) {
        return "D";
    }
    else {
        return "F";
    }
}

// Calculate Status
function calculateStatus(marks) {

    // Each subject must have at least 40 marks
    for (let mark of marks) {
        if (mark < 40) {
            return "Fail";
        }
    }

    return "Pass";
}

// Add Student
document.getElementById("studentForm").addEventListener("submit", function(e) {

    e.preventDefault();

    let name = document.getElementById("studentName").value.trim();
    let regNo = document.getElementById("regNo").value.trim();

    // Check duplicate registration number
    if (students.some(s => s.regNo.toLowerCase() === regNo.toLowerCase())) {
        alert("Registration number already exists!");
        return;
    }

    let marks = subjects.map(id =>
        Number(document.getElementById(id).value)
    );

    // Validate marks
    if (marks.some(mark => !Number.isInteger(mark) || mark < 0 || mark > 100)) {
        alert("Please enter valid marks between 0 and 100.");
        return;
    }

    let total = marks.reduce((sum, mark) => sum + mark, 0);

    let percentage = (total / 600) * 100;

    let grade = calculateGrade(percentage);

    let status = calculateStatus(marks);

    let student = {
        name: name,
        regNo: regNo,
        marks: marks,
        total: total,
        percentage: percentage,
        grade: grade,
        status: status
    };

    students.push(student);

    saveData();

    displayStudents();

    updateDashboard();

    this.reset();

    alert("Student record added successfully!");

});


// Display Students
function displayStudents() {

    let table = document.getElementById("studentTable");

    table.innerHTML = "";

    let search = document.getElementById("searchInput").value.toLowerCase();

    let filter = document.getElementById("statusFilter").value;

    let sort = document.getElementById("sortSelect").value;

    let filteredStudents = students.filter(student => {

        let matchSearch =
            student.name.toLowerCase().includes(search) ||
            student.regNo.toLowerCase().includes(search);

        let matchStatus =
            filter === "all" || student.status === filter;

        return matchSearch && matchStatus;
    });

    // Sorting
    if (sort === "high") {
        filteredStudents.sort((a, b) => b.percentage - a.percentage);
    }
    else if (sort === "low") {
        filteredStudents.sort((a, b) => a.percentage - b.percentage);
    }
    else if (sort === "name") {
        filteredStudents.sort((a, b) => a.name.localeCompare(b.name));
    }

    if (filteredStudents.length === 0) {

        table.innerHTML = `
            <tr class="empty-row">
                <td colspan="13">
                    <div class="empty-state">
                        <span class="empty-icon">♧</span>
                        <strong>No Student Records Found</strong>
                        <p>Add a student to display records here.</p>
                    </div>
                </td>
            </tr>
        `;

    }

    filteredStudents.forEach((student) => {

        let gradeClass = "grade-" + student.grade;

        let statusClass = student.status === "Pass" ? "pass" : "fail";

        let row = document.createElement("tr");

        // Safe text output
        const nameCell = document.createElement("td");
        nameCell.className = "student-name-cell";

        const avatar = document.createElement("span");
        avatar.className = "student-avatar";
        avatar.textContent = student.name.charAt(0).toUpperCase();

        nameCell.append(avatar, document.createTextNode(student.name));

        const values = [
            student.regNo,
            ...student.marks,
            student.total,
            student.percentage.toFixed(2) + "%"
        ];

        row.appendChild(nameCell);

        values.forEach(value => {
            let cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);
        });

        let gradeCell = document.createElement("td");
        let gradeBadge = document.createElement("span");
        gradeBadge.className = "grade " + gradeClass;
        gradeBadge.textContent = student.grade;
        gradeCell.appendChild(gradeBadge);
        row.appendChild(gradeCell);

        let statusCell = document.createElement("td");
        let statusBadge = document.createElement("span");
        statusBadge.className = "status-badge " + statusClass;
        statusBadge.textContent = student.status;
        statusCell.appendChild(statusBadge);
        row.appendChild(statusCell);

        let actionCell = document.createElement("td");
        let deleteButton = document.createElement("button");

        deleteButton.className = "delete-btn";
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", function() {
            deleteStudent(student.regNo);
        });

        actionCell.appendChild(deleteButton);
        row.appendChild(actionCell);

        table.appendChild(row);

    });

    document.getElementById("recordCount").textContent =
        filteredStudents.length + " RECORDS";

    document.getElementById("tableInfo").textContent =
        "Showing " + filteredStudents.length + " students";
}


// Delete Student
function deleteStudent(regNo) {

    if (confirm("Are you sure you want to delete this student?")) {

        students = students.filter(student => student.regNo !== regNo);

        saveData();

        displayStudents();

        updateDashboard();
    }
}


// Clear All Records
document.getElementById("clearAllBtn").addEventListener("click", function() {

    if (students.length === 0) {
        alert("No records to clear.");
        return;
    }

    if (confirm("Are you sure you want to delete all student records?")) {

        students = [];

        saveData();

        displayStudents();

        updateDashboard();
    }

});


// Dashboard Statistics
function updateDashboard() {

    let totalStudents = students.length;

    document.getElementById("totalStudents").textContent = totalStudents;

    if (totalStudents === 0) {

        document.getElementById("classAverage").textContent = "0.00%";
        document.getElementById("topStudent").textContent = "None";
        document.getElementById("topPercentage").textContent = "Highest percentage";
        document.getElementById("passRate").textContent = "0%";

        return;
    }

    let totalPercentage = students.reduce(
        (sum, student) => sum + student.percentage, 0
    );

    let average = totalPercentage / totalStudents;

    document.getElementById("classAverage").textContent =
        average.toFixed(2) + "%";

    let topStudent = students.reduce((top, current) =>
        current.percentage > top.percentage ? current : top
    );

    document.getElementById("topStudent").textContent = topStudent.name;

    document.getElementById("topPercentage").textContent =
        topStudent.percentage.toFixed(2) + "%";

    let passedStudents = students.filter(
        student => student.status === "Pass"
    ).length;

    let passRate = (passedStudents / totalStudents) * 100;

    document.getElementById("passRate").textContent =
        passRate.toFixed(2) + "%";
}


// Search
document.getElementById("searchInput").addEventListener("input", displayStudents);


// Sort
document.getElementById("sortSelect").addEventListener("change", displayStudents);


// Filter
document.getElementById("statusFilter").addEventListener("change", displayStudents);


// Dark and Light Mode
document.getElementById("themeBtn").addEventListener("click", function() {

    document.body.classList.toggle("dark-theme");

    let darkMode = document.body.classList.contains("dark-theme");

    document.getElementById("themeIcon").textContent =
        darkMode ? "☀" : "☾";

    document.getElementById("themeText").textContent =
        darkMode ? "Light Mode" : "Dark Mode";

    localStorage.setItem("darkMode", darkMode);

});


// Restore Theme
if (localStorage.getItem("darkMode") === "true") {

    document.body.classList.add("dark-theme");

    document.getElementById("themeIcon").textContent = "☀";

    document.getElementById("themeText").textContent = "Light Mode";
}


// Export CSV
document.getElementById("exportBtn").addEventListener("click", function() {

    if (students.length === 0) {
        alert("No records available to export.");
        return;
    }

    let headings = [
        "Student Name",
        "Registration Number",
        "Programming",
        "Mathematics",
        "English",
        "Database Systems",
        "Computer Networks",
        "Web Technology"
    ];

    let csv = [headings, ...students.map(student => [
        student.name,
        student.regNo,
        ...student.marks
    ])];

    let content = csv.map(row =>
        row.map(value => '"' + String(value).replace(/"/g, '""') + '"').join(",")
    ).join("\r\n");

    let blob = new Blob([content], { type: "text/csv;charset=utf-8;" });

    let link = document.createElement("a");

    link.href = URL.createObjectURL(blob);
    link.download = "Student_Records.csv";

    link.click();

    URL.revokeObjectURL(link.href);

});


// Import CSV
document.getElementById("importBtn").addEventListener("click", function() {
    document.getElementById("importFile").click();
});

document.getElementById("importFile").addEventListener("change", function(e) {

    let file = e.target.files[0];

    if (!file) return;

    let reader = new FileReader();

    reader.onload = function(event) {

        let lines = event.target.result.split(/\r?\n/).filter(line => line.trim() !== "");

        let imported = 0;

        // Skip CSV heading
        for (let i = 1; i < lines.length; i++) {

            let columns = parseCSVLine(lines[i]);

            if (columns.length !== 8) continue;

            let name = columns[0].trim();
            let regNo = columns[1].trim();

            let marks = columns.slice(2).map(Number);

            if (
                !name ||
                !regNo ||
                marks.some(mark => !Number.isInteger(mark) || mark < 0 || mark > 100) ||
                students.some(s => s.regNo.toLowerCase() === regNo.toLowerCase())
            ) {
                continue;
            }

            let total = marks.reduce((sum, mark) => sum + mark, 0);
            let percentage = (total / 600) * 100;

            students.push({
                name: name,
                regNo: regNo,
                marks: marks,
                total: total,
                percentage: percentage,
                grade: calculateGrade(percentage),
                status: calculateStatus(marks)
            });

            imported++;
        }

        saveData();
        displayStudents();
        updateDashboard();

        alert(imported + " student records imported successfully.");

        e.target.value = "";
    };

    reader.readAsText(file);

});


// CSV Line Parser
function parseCSVLine(line) {

    let result = [];
    let value = "";
    let insideQuotes = false;

    for (let i = 0; i < line.length; i++) {

        let char = line[i];

        if (char === '"' && line[i + 1] === '"' && insideQuotes) {
            value += '"';
            i++;
        }
        else if (char === '"') {
            insideQuotes = !insideQuotes;
        }
        else if (char === "," && !insideQuotes) {
            result.push(value);
            value = "";
        }
        else {
            value += char;
        }
    }

    result.push(value);

    return result;
}


// Initial Display
displayStudents();
updateDashboard();
