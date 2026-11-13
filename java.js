
// =============================================
// STUDENT PERFORMANCE MANAGEMENT SYSTEM
// JAVASCRIPT
// =============================================


// 1. LOAD SAVED STUDENT RECORDS

function loadStudents() {

    try {
        let savedData = localStorage.getItem("students");

        if (!savedData) {
            return [];
        }

        let data = JSON.parse(savedData);

        if (!Array.isArray(data)) {
            return [];
        }

        return data.filter(student =>
            student &&
            typeof student.name === "string" &&
            typeof student.regNo === "string" &&
            Array.isArray(student.marks) &&
            student.marks.length === 6 &&
            student.marks.every(mark =>
                Number.isInteger(mark) && mark >= 0 && mark <= 100
            )
        );

    }
    catch (error) {
        console.error("Unable to load student records:", error);
        return [];
    }

}


let students = loadStudents();


// 2. GET MARKS FROM FORM

function getMarks() {

    return [
        Number(document.getElementById("programming").value),
        Number(document.getElementById("mathematics").value),
        Number(document.getElementById("english").value),
        Number(document.getElementById("database").value),
        Number(document.getElementById("networks").value),
        Number(document.getElementById("webTechnology").value)
    ];

}


// 3. VALIDATE FORM

function validateForm() {

    let name = document.getElementById("studentName").value.trim();

    let regNo = document.getElementById("regNo").value.trim();

    let marks = getMarks();

    if (name === "" || regNo === "") {

        alert("Please enter all student information!");

        return false;

    }


    // Check every subject mark

    for (let mark of marks) {

        if (!Number.isInteger(mark) || mark < 0 || mark > 100) {

            alert("Marks must be whole numbers between 0 and 100!");

            return false;

        }

    }


    // Check duplicate registration number

    let duplicate = students.some(student =>

        student.regNo.toLowerCase() === regNo.toLowerCase()

    );


    if (duplicate) {

        alert("This registration number already exists!");

        return false;

    }


    return true;

}


// 4. CALCULATE TOTAL MARKS

function calculateTotal(marks) {

    let total = 0;

    for (let mark of marks) {

        total += mark;

    }

    return total;

}


// 5. CALCULATE PERCENTAGE

function calculatePercentage(total) {

    return (total / 600) * 100;

}


// 6. CALCULATE GRADE

function calculateGrade(percentage) {

    if (percentage >= 90) {

        return "A";

    }
    else if (percentage >= 80) {

        return "B";

    }
    else if (percentage >= 70) {

        return "C";

    }
    else if (percentage >= 60) {

        return "D";

    }
    else {

        return "F";

    }

}


// 7. CHECK PASS OR FAIL

function checkStatus(marks) {

    for (let mark of marks) {

        if (mark < 40) {

            return "Fail";

        }

    }

    return "Pass";

}


// 8. ADD STUDENT

function addStudent() {

    if (!validateForm()) {

        return;

    }


    let name = document.getElementById("studentName").value.trim();

    let regNo = document.getElementById("regNo").value.trim();

    let marks = getMarks();


    let total = calculateTotal(marks);

    let percentage = calculatePercentage(total);

    let grade = calculateGrade(percentage);

    let status = checkStatus(marks);


    // Create student object

    let student = {

        name: name,

        regNo: regNo,

        marks: marks,

        total: total,

        percentage: percentage,

        grade: grade,

        status: status

    };


    // Add student to array

    students.push(student);


    saveStudents();

    displayStudents();

    updateDashboard();


    // Clear form

    document.getElementById("studentForm").reset();


    alert("Student record added successfully!");

}


// 9. SAVE STUDENTS IN LOCAL STORAGE

function saveStudents() {

    try {

        localStorage.setItem("students", JSON.stringify(students));

    }
    catch (error) {

        alert("Unable to save records. Browser storage may be full.");

        console.error(error);

    }

}


// 10. CREATE TABLE CELL

function createCell(value, className = "") {

    let cell = document.createElement("td");

    cell.textContent = value;

    if (className !== "") {

        cell.className = className;

    }

    return cell;

}


// 11. DISPLAY STUDENTS

function displayStudents() {

    let table = document.getElementById("studentTable");


    // Get search value

    let search = document.getElementById("searchInput")
        .value.toLowerCase().trim();


    // Get sorting option

    let sortValue = document.getElementById("sortSelect").value;


    // Get status filter

    let statusValue = document.getElementById("statusFilter").value;


    // Copy original array

    let filteredStudents = [...students];


    // SEARCH BY NAME OR REGISTRATION NUMBER

    filteredStudents = filteredStudents.filter(student =>

        student.name.toLowerCase().includes(search) ||

        student.regNo.toLowerCase().includes(search)

    );


    // FILTER BY PASS OR FAIL

    if (statusValue !== "all") {

        filteredStudents = filteredStudents.filter(student =>

            student.status === statusValue

        );

    }


    // SORT STUDENTS

    if (sortValue === "high") {

        filteredStudents.sort((a, b) =>

            b.percentage - a.percentage

        );

    }
    else if (sortValue === "low") {

        filteredStudents.sort((a, b) =>

            a.percentage - b.percentage

        );

    }
    else if (sortValue === "name") {

        filteredStudents.sort((a, b) =>

            a.name.localeCompare(b.name)

        );

    }


    // CLEAR PREVIOUS TABLE

    table.innerHTML = "";


    // EMPTY TABLE MESSAGE

    if (filteredStudents.length === 0) {

        let row = document.createElement("tr");

        row.className = "empty-row";

        let cell = document.createElement("td");

        cell.colSpan = 13;


        let empty = document.createElement("div");

        empty.className = "empty-state";


        let icon = document.createElement("div");

        icon.className = "empty-icon";

        icon.textContent = "▤";


        let heading = document.createElement("strong");

        heading.textContent = students.length === 0
            ? "No Student Records Yet"
            : "No Matching Records Found";


        let message = document.createElement("p");

        message.textContent = students.length === 0
            ? "Add your first student using the registration form above."
            : "Try changing your search or filter settings.";


        empty.appendChild(icon);

        empty.appendChild(heading);

        empty.appendChild(message);

        cell.appendChild(empty);

        row.appendChild(cell);

        table.appendChild(row);

    }


    // DISPLAY EACH STUDENT

    filteredStudents.forEach(student => {

        let row = document.createElement("tr");


        // STUDENT NAME AND AVATAR

        let nameCell = document.createElement("td");

        nameCell.className = "student-name-cell";


        let avatar = document.createElement("span");

        avatar.className = "student-avatar";

        avatar.textContent = student.name.charAt(0).toUpperCase();


        nameCell.appendChild(avatar);

        nameCell.appendChild(
            document.createTextNode(student.name)
        );

        row.appendChild(nameCell);


        // REGISTRATION NUMBER

        row.appendChild(
            createCell(student.regNo)
        );


        // SUBJECT MARKS

        student.marks.forEach(mark => {

            row.appendChild(
                createCell(mark)
            );

        });


        // TOTAL MARKS

        row.appendChild(
            createCell(student.total + " / 600")
        );


        // PERCENTAGE

        row.appendChild(
            createCell(student.percentage.toFixed(2) + "%")
        );


        // GRADE

        let gradeCell = createCell(
            student.grade,
            "grade grade-" + student.grade
        );

        row.appendChild(gradeCell);


        // PASS OR FAIL

        let statusCell = createCell(
            student.status,
            "status-badge " + student.status.toLowerCase()
        );

        row.appendChild(statusCell);


        // DELETE BUTTON

        let actionCell = document.createElement("td");

        let deleteBtn = document.createElement("button");

        deleteBtn.textContent = "Delete";

        deleteBtn.className = "delete-btn";

        deleteBtn.type = "button";


        deleteBtn.addEventListener("click", function() {

            deleteStudent(student.regNo);

        });


        actionCell.appendChild(deleteBtn);

        row.appendChild(actionCell);


        // ADD ROW TO TABLE

        table.appendChild(row);

    });


    // UPDATE TABLE INFORMATION

    document.getElementById("recordCount").textContent =

        filteredStudents.length + " RECORDS";


    document.getElementById("tableInfo").textContent =

        "Showing " + filteredStudents.length +
        " of " + students.length + " students";

}


// 12. DELETE INDIVIDUAL STUDENT

function deleteStudent(regNo) {

    let confirmation = confirm(
        "Are you sure you want to delete this student record?"
    );


    if (confirmation) {

        students = students.filter(student =>

            student.regNo !== regNo

        );


        saveStudents();

        displayStudents();

        updateDashboard();


    }

}


// 13. CALCULATE CLASS AVERAGE

function calculateClassAverage() {

    if (students.length === 0) {

        return 0;

    }


    let total = 0;


    for (let student of students) {

        total += student.percentage;

    }


    return total / students.length;

}


// 14. CALCULATE PASS RATE

function calculatePassRate() {

    if (students.length === 0) {

        return 0;

    }


    let passed = 0;


    for (let student of students) {

        if (student.status === "Pass") {

            passed++;

        }

    }


    return (passed / students.length) * 100;

}


// 15. UPDATE DASHBOARD

function updateDashboard() {


    // TOTAL STUDENTS

    document.getElementById("totalStudents").textContent =

        students.length;


    // CLASS AVERAGE

    document.getElementById("classAverage").textContent =

        calculateClassAverage().toFixed(2) + "%";


    // PASS RATE

    document.getElementById("passRate").textContent =

        calculatePassRate().toFixed(1) + "%";


    // TOP STUDENT

    let topStudent = document.getElementById("topStudent");

    let topPercentage = document.getElementById("topPercentage");


    if (students.length === 0) {

        topStudent.textContent = "None";

        topPercentage.textContent = "Highest percentage";

    }
    else {

        let highest = students.reduce((a, b) =>

            a.percentage >= b.percentage ? a : b

        );


        topStudent.textContent = highest.name;

        topPercentage.textContent =

            highest.percentage.toFixed(2) + "% achieved";

    }

}


// 16. CLEAR ALL STUDENT RECORDS

function clearAllStudents() {

    if (students.length === 0) {

        alert("There are no student records to delete!");

        return;

    }


    let confirmation = confirm(

        "Are you sure you want to delete ALL student records?"

    );


    if (confirmation) {

        students = [];


        saveStudents();

        displayStudents();

        updateDashboard();


        alert("All student records have been deleted!");

    }

}


// 17. EXPORT STUDENT RECORDS TO CSV

function exportCSV() {

    if (students.length === 0) {

        alert("No student records available for export!");

        return;

    }


    // CSV HEADINGS

    let headings = [

        "Student Name",
        "Registration Number",
        "Programming",
        "Mathematics",
        "English",
        "Database",
        "Computer Networks",
        "Web Technology",
        "Total",
        "Percentage",
        "Grade",
        "Status"

    ];


    let csvRows = [];

    csvRows.push(headings);


    // ADD STUDENT DATA

    students.forEach(student => {

        let row = [

            student.name,

            student.regNo,

            ...student.marks,

            student.total,

            student.percentage.toFixed(2) + "%",

            student.grade,

            student.status

        ];


        csvRows.push(row);

    });


    // CONVERT DATA INTO CSV FORMAT

    let csvContent = csvRows.map(row =>

        row.map(value =>

            '"' + String(value).replace(/"/g, '""') + '"'

        ).join(",")

    ).join("\n");


    // CREATE DOWNLOAD FILE

    let blob = new Blob(

        ["\uFEFF" + csvContent],

        { type: "text/csv;charset=utf-8;" }

    );


    let url = URL.createObjectURL(blob);

    let link = document.createElement("a");


    link.href = url;

    link.download = "Student_Performance_Records.csv";


    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);


    URL.revokeObjectURL(url);

}


// 18. SWITCH DARK AND LIGHT THEME

function changeTheme() {

    document.body.classList.toggle("dark-theme");


    let isDark = document.body.classList.contains("dark-theme");


    let themeText = document.getElementById("themeText");

    let themeIcon = document.getElementById("themeIcon");


    if (isDark) {

        themeText.textContent = "Light Mode";

        themeIcon.textContent = "☀";

        localStorage.setItem("selectedTheme", "dark");

    }
    else {

        themeText.textContent = "Dark Mode";

        themeIcon.textContent = "☾";

        localStorage.setItem("selectedTheme", "light");

    }

}


// 19. LOAD SAVED THEME

function loadTheme() {

    let savedTheme = localStorage.getItem("selectedTheme");


    if (savedTheme === "dark") {

        document.body.classList.add("dark-theme");

        document.getElementById("themeText").textContent = "Light Mode";

        document.getElementById("themeIcon").textContent = "☀";

    }
    else {

        document.body.classList.remove("dark-theme");

        document.getElementById("themeText").textContent = "Dark Mode";

        document.getElementById("themeIcon").textContent = "☾";

    }

}


// =============================================
// 20. EVENT LISTENERS
// =============================================


// STUDENT FORM SUBMISSION

document.getElementById("studentForm")
.addEventListener("submit", function(event) {

    event.preventDefault();

    addStudent();

});


// SEARCH STUDENTS

document.getElementById("searchInput")
.addEventListener("input", function() {

    displayStudents();

});


// SORT STUDENTS

document.getElementById("sortSelect")
.addEventListener("change", function() {

    displayStudents();

});


// FILTER STUDENTS

document.getElementById("statusFilter")
.addEventListener("change", function() {

    displayStudents();

});


// CLEAR ALL BUTTON

document.getElementById("clearAllBtn")
.addEventListener("click", function() {

    clearAllStudents();

});


// EXPORT BUTTON

document.getElementById("exportBtn")
.addEventListener("click", function() {

    exportCSV();

});


// THEME BUTTON

document.getElementById("themeBtn")
.addEventListener("click", function() {

    changeTheme();

});


// =============================================
// 21. INITIALIZE APPLICATION
// =============================================

loadTheme();

displayStudents();

updateDashboard();
