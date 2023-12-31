// Lessons
let courses = loadCoursesFromFile() || [];

// Function to add lessons
function addCourse() {
    // I assigned the information entered in the input fields to the variable
    let courseName = document.getElementById("courseName").value;

    let gradingScale = document.getElementById("gradingScale").value;

    
    if (courseName && isValidScale(gradingScale)) {
        // I check whether the same course has been added before using the isCourseExist function
        if (!isCourseExist(courseName)) {
            // Create new course object
            let newCourse = {
                name: courseName,
                scale: gradingScale
            };

            // I add the courses to the courses array I created initially
            courses.push(newCourse);

            // I save the lessons to the file
            saveCoursesToFile();

            // When I add the course, I reset the places
            document.getElementById("courseName").value = "";

            document.getElementById("gradingScale").value = "";

            alert("Course added successfully!");
        } else {
            alert("This lesson already exists!");
        }
    } else {
        alert("Please enter a valid grading scale (10 or 7 only).");
    }
}




// I print the courses to json 
function saveCoursesToFile() {
    let jsonString = JSON.stringify(courses);

    // saving localStorage
    localStorage.setItem("courses", jsonString);
}






// I'm pulling from json
function loadCoursesFromFile() {
    let storedCourses = localStorage.getItem("courses");


    return JSON.parse(storedCourses);
}





// I wrote to return to the main page
function goToHomePage() {
    window.location.href = "index.html";
}




// Function to show courses
function displayCourses() {
    let courseList = document.getElementById("courseList");

    // If courseList is not found, I terminate the process
    if (!courseList) {

        console.error("courseList elementi bulunamadı.");

        return;
    }



    
    courseList.innerHTML = "";

    // Printing lessons to the screen section
    for (let i = 0; i < courses.length; i++) {

        let listItem = document.createElement("li");

        listItem.textContent = courses[i].name + " - scale : " + courses[i].scale;

        // I wrote the delete and update buttons to add them to each lesson
        let deleteButton = document.createElement("button");

        deleteButton.textContent = "Delete";

        deleteButton.classList.add("delete-button"); // to use css

        deleteButton.onclick = (function (index) {

            return function () {

                deleteCourse(index);
            };
        })(i);

        let updateButton = document.createElement("button");

        updateButton.textContent = "Update";

        updateButton.classList.add("update-button"); // to use css

        updateButton.onclick = (function (index) {

            return function () {

                updateCourse(index);

            };
        })(i);

        listItem.appendChild(deleteButton);

        listItem.appendChild(updateButton);

        courseList.appendChild(listItem);
    }
}




// Delete lesson function
function deleteCourse(index) {

    let confirmDelete = confirm("Bu dersi silmek istediğinize emin misiniz?");

    if (confirmDelete) {

        courses.splice(index, 1);

        saveCoursesToFile();

        displayCourses();

    }
}





// Course update function
function updateCourse(index) {

    let newCourseName = prompt("Enter the new course name:", courses[index].name);

    let newGradingScale = prompt("Enter the new grading scale:", courses[index].scale);

    if (newCourseName !== null && newGradingScale !== null) {

        courses[index].name = newCourseName;

        courses[index].scale = newGradingScale;

        saveCoursesToFile();

        displayCourses();

    }
}




// Function to determine whether the given course has been added before or not
function isCourseExist(courseName) {

    for (let i = 0; i < courses.length; i++) {

        if (courses[i].name === courseName) {

            return true;

        }
    }

    return false;
}




// Function to check if the grade scale is valid
function isValidScale(scale) {

    // Only 10 or 7 will be accepted (There was a photo like this in the PDF, so I did it this way, sir)
    return scale === "10" || scale === "7";

}


displayCourses();
