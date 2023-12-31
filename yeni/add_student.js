// Lessons
let courses = loadCoursesFromFile() || [];

// Students
let students = loadStudentsFromFile() || [];


// We write the courses to JSON here
function saveCoursesToFile() {

    let jsonString = JSON.stringify(courses);

    // we save localStorage
    localStorage.setItem("courses", jsonString);
}





// Here we load the courses from json
function loadCoursesFromFile() {

    let storedCourses = localStorage.getItem("courses");

    return JSON.parse(storedCourses);
}





// I wrote it to access course information
function getCourses() {

    return loadCoursesFromFile();

}



// We write students to json
function saveStudentsToFile() {

    let jsonString = JSON.stringify(students);

    // we save localStorage 
    localStorage.setItem("students", jsonString);
}




// Here we load students from json. The same operations we do in classes
function loadStudentsFromFile() {

    let storedStudents = localStorage.getItem("students");

    return JSON.parse(storedStudents);
}




// I wrote to return to the main page 
function goToHomePage() {

    window.location.href = "index.html";

}



function loadCourses() {

    let courseSelect = document.getElementById("courseSelect");

    // If courseSelect is not found, terminate the process
    if (!courseSelect) {

        console.error("courseSelect elementi bulunamadı.");

        return;
    }

    //Fill the dropdown using the lessons we saved previously
    for (let i = 0; i < courses.length; i++) {

        let option = document.createElement("option");

        option.value = courses[i].name;

        option.text = courses[i].name + " - scale : " + courses[i].scale;

        courseSelect.appendChild(option);
    }
}




loadCourses();



function addStudent() {

    //For getting the values written in the form
    let selectedCourse = document.getElementById("courseSelect").value;
    let studentId = document.getElementById("studentId").value;
    let firstName = document.getElementById("firstName").value;
    let lastName = document.getElementById("lastName").value;
    let midtermGrade = parseFloat(document.getElementById("midtermGrade").value);
    let finalGrade = parseFloat(document.getElementById("finalGrade").value);

    // Check: Are the grades in the valid range?
    if (studentId && firstName && lastName && midtermGrade && finalGrade && midtermGrade >= 0 && midtermGrade <= 100 && finalGrade >= 0 && finalGrade <= 100) {
        if (!isStudentExist(studentId, selectedCourse)) {
            // I create a new student object
            let newStudent = {
                courseId: selectedCourse,
                studentId: studentId,
                firstName: firstName,
                lastName: lastName,
                midtermGrade: midtermGrade,
                finalGrade: finalGrade
            };

            students.push(newStudent);
            saveStudentsToFile();

            // I add students to the file
            addStudentToStudents(newStudent);

            // After adding the student, I reset the information
            document.getElementById("studentId").value = "";
            document.getElementById("firstName").value = "";
            document.getElementById("lastName").value = "";
            document.getElementById("midtermGrade").value = "";
            document.getElementById("finalGrade").value = "";

            alert("Student added successfully!");

            displayStudents();
        } else {
            alert("This student is already added!");
        }
    } else {
        alert("Please fill in all information with valid grades ! (0-100)");
    }
}




//Is the student in the course or not?
function isStudentExist(studentId, courseId) {

    for (let i = 0; i < students.length; i++) {

        if (students[i].studentId === studentId && students[i].courseId === courseId) {

            return true;

        }
    }

    return false;
}



// I add the given student to the student list
function addStudentToStudents(newStudent) {
    // First, we get the student list of the relevant course
    let courseStudents = students[newStudent.courseId];

    // If there is no student list for the relevant course, we create a new list
    if (!courseStudents) {
        courseStudents = [];
    }

    // I add the new student to the list
    courseStudents.push(newStudent);

    // We insert the updated student list back into the object
    students[newStudent.courseId] = courseStudents;

    // We save the latest students to the file
    saveStudentsToFile();
}

function displayStudents() {

    let studentList = document.getElementById("studentList");

    // If studentList is not found, terminate the process
    if (!studentList) {

        console.error("studentList elementi bulunamadı.");

        return;
    }

    // Clear current content
    studentList.innerHTML = "";

    // Print students to the screen
    for (let i = 0; i < students.length; i++) {

        let listItem = document.createElement("li");
        
        listItem.textContent = students[i].studentId + " " + students[i].firstName + " " + students[i].lastName +
            ": " + students[i].courseId + " : Midterm Grade : " + students[i].midtermGrade + " , Final Grade : " +
            students[i].finalGrade + " Letter Grade : " + calculateLetterGrade(students[i].courseId, students[i].midtermGrade, students[i].finalGrade);

        // Delete button
        let deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.classList.add("delete-button"); // css de kullanabilmek için
        deleteButton.onclick = (function (studentId) {
            return function () {
                deleteStudent(studentId);
            };
        })(students[i].studentId);

        // Update button
        let updateButton = document.createElement("button");
        updateButton.textContent = "Update";
        updateButton.classList.add("update-button"); // css de kullanabilmek için
        updateButton.onclick = (function (studentId) {
            return function () {
                updateStudent(studentId);
            };
        })(students[i].studentId);

        // Add buttons to listItem
        listItem.appendChild(deleteButton);
        listItem.appendChild(updateButton);

        // add listItem to studentList
        studentList.appendChild(listItem);
    }
}






// Delete Student function
function deleteStudent(studentId) {

    let deleteSt = confirm("Are you sure you want to delete this student?");

    if (deleteSt) {

        for (let i = 0; i < students.length; i++) {

            if (students[i].studentId === studentId) {

                students.splice(i, 1); // We delete the student here

                saveStudentsToFile(); // Saving to file

                displayStudents(); // We list it again in its final form

                break;
            }
        }
    }
}






//Update Student function
function updateStudent(studentId) {
    for (let i = 0; i < students.length; i++) {
        if (students[i].studentId === studentId) {
            // I get the new values in the form
            let updatedFirstName = prompt("Enter the new name:", students[i].firstName);
            let updatedLastName = prompt("Enter new surname:", students[i].lastName);
            let updatedMidtermGrade = prompt("Enter the new midterm grade:", students[i].midtermGrade);
            let updatedFinalGrade = prompt("Enter the new final grade:", students[i].finalGrade);

            // I update the new values (if the user does not enter an empty value)
            if (updatedFirstName !== null) {
                students[i].firstName = updatedFirstName;
            }
            if (updatedLastName !== null) {
                students[i].lastName = updatedLastName;
            }
            if (updatedMidtermGrade !== null) {
                students[i].midtermGrade = parseFloat(updatedMidtermGrade);
            }
            if (updatedFinalGrade !== null) {
                students[i].finalGrade = parseFloat(updatedFinalGrade);
            }

            saveStudentsToFile(); //Save to file
            displayStudents(); //Relist
            break;
        }
    }
}


function avarageGrades(midtermGrade,finalGrade){
    a = (midtermGrade*0.4) + (finalGrade*0.6)
    return a
}

function calculateLetterGrade(courseId, midtermGrade, finalGrade) { 
    let scale = getScaleForCourse(courseId);
    let averageGrade = avarageGrades(midtermGrade, finalGrade); 

    if (scale == 7) {
        if (averageGrade >= 90) {
            return 'A';
        } else if (averageGrade >= 80) {
            return 'B';
        } else if (averageGrade >= 70) {
            return 'C';
        } else if (averageGrade >= 60) {
            return 'D';
        } else {
            return 'F';
        }
    } else if (scale == 10) {
        if (averageGrade >= 93) {
            return 'A';
        } else if (averageGrade >= 85) {
            return 'B';
        } else if (averageGrade >= 77) {
            return 'C';
        } else if (averageGrade >= 70) {
            return 'D';
        } else {
            return 'F';
        }
    }
}
function getScaleForCourse(courseId) {
    // Get the scale of the lesson
    for (let i = 0; i < courses.length; i++) {
        if (courses[i].name === courseId) {
            return courses[i].scale;
        }
    }
    return null; // Return null if course not found
}



// Search by student name and surname
function searchStudents() {
    let searchName = document.getElementById("searchName").value.toLowerCase();

    // If an empty value is entered, give a warning
    if (searchName === "") {

        alert("Please enter a student name.");

        return;
    }

    // We match according to the student's name and surname
    let matchingStudents = students.filter(function (student) {

        let fullName = (student.firstName + " " + student.lastName).toLowerCase();

        return fullName.includes(searchName);

    });

    // We print the search results to the screen 
    displaySearchResults(matchingStudents);
}





// Function to print search results on the screen
function displaySearchResults(results) {

    let searchResults = document.getElementById("searchResults");

    // If searchResults is not found, terminate the process
    if (!searchResults) {

        console.error("searchResults elementi bulunamadı.");

        return;

    }

    // Clear current content
    searchResults.innerHTML = "";

    // I create a li element for each result and fill it in
    results.forEach(function (student) {
        let listItem = document.createElement("li");
        listItem.textContent = "ID: " + student.studentId +
            ", Name: " + student.firstName +
            ", Surname: " + student.lastName +
            ", Course: " + student.courseId +
            ", Letter Grade: " + calculateLetterGrade(student.courseId, student.midtermGrade, student.finalGrade);


        // I add the created li element to searchResults
        searchResults.appendChild(listItem);
    });
}



// We call the previously recorded lessons here
let previousCourses = getCourses();

// For course selection, we fill the dropdown with the courses we have previously recorded.
function fillCourseSelect() {
    
    let courseSelect = document.getElementById("courseSelect");

    if (courseSelect.options.length == 0) {
        for (let i = 0; i < courses.length; i++) {
            let option = document.createElement("option");
            option.value = courses[i].name;
            option.text = courses[i].name;
            courseSelect.appendChild(option);
        }
    }
}




// Function to show successful students when the course is selected
function checkSuccess() {
    let courseSelect = document.getElementById("courseSelect");
    let selectedCourse = courseSelect.options[courseSelect.selectedIndex].value.toLowerCase();
    showResults(selectedCourse, true);
}


// Function to show unsuccessful students when the course is selected
function checkFailure() {
    let courseSelect = document.getElementById("courseSelect");
    let selectedCourse = courseSelect.options[courseSelect.selectedIndex].value.toLowerCase();
    showResults(selectedCourse, false);
}




function showResults(courseInput, isSuccess) {

    let resultList = document.getElementById("resultList");

    // We empty the current content so that successes and failures do not appear at the same time
    if (!resultList) {
        console.error("resultList elementi bulunamadı.");
        return;
    }

    resultList.innerHTML = "";

    // We will use this to filter students who have or do not have a certain letter grade
    let filteredStudents = students.filter(function (student) {
        let letterGrade = calculateLetterGrade(student.courseId, student.midtermGrade, student.finalGrade);
        return student.courseId && student.courseId.toLowerCase() === courseInput &&
            (isSuccess ? letterGrade !== 'F' : letterGrade === 'F');
    });

    // Determine message based on success or failure
    let message = isSuccess ? 'Successful Students' : 'Failing Students';

    // Create an element for each student and fill it in
    filteredStudents.forEach(function (student) {
        let listItem = document.createElement("li");
        listItem.textContent = "ID: " + student.studentId +
            ", Name: " + student.firstName +
            ", Surname: " + student.lastName +
            ", Letter Grade: " + calculateLetterGrade(student.courseId, student.midtermGrade, student.finalGrade);

        // I add the created li element to the resultList
        resultList.appendChild(listItem);
    });

    // I show the results by adding the message
    let messageItem = document.createElement("li");
    messageItem.textContent = message;
    resultList.prepend(messageItem);
}


// Necessary actions when the page loads
window.onload = function () {
    fillCourseSelect();
    loadStudentsFromFile(); // update the students array
    displayStudents();
};



displayStudents();