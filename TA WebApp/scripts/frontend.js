

var Frontend = (function() {

    var studentProfileTemplateHTML;

    var instructorProfileTemplateHTML;

    var courseTemplateHTML;

    var courses;

    var currentTAApplicationTemplateHTML;
    var currentTAApplications;

    var allTAApplicationsTemplateHTML;
    var allTAApplications;

    var instructorTAApplicationTemplateHTML;
    var instructorTAApplications;

    var apiUrl = "http://127.0.0.1:5000/"

    var cancel = function(e) {
        $(e.target.parentElement).hide();
        $('.gui').show();
    };


    var cancelBigPage = function (e) {
        $(e.target.parentElement).hide();
       
        if (($('.user-type').val()) == "instructor") {
            goBackToInstructorPage();
        }
        else {
            goBackToStudentPage();
        }
    }

    var goBackToStudentPage = function (e) {
        $('.change-password-form').hide();
        $('.backgroundBig').show();
        $('.backgroundSmall').hide();

        $('.bannerStudent').show();
        $('.view-ta-positions').show();
        $('.student-display-current-applications').show();
        $('.display-profile-student').hide();
        $('.edit-student-profile').hide();
        $('.apply-ta-position').hide();
    }

    var goBackToInstructorPage = function (e) {
        $('.change-password-form').hide();
        $('.instructor-display-ta-applications').show();
        $('.view-courses').show();
        $('.backgroundBig').show();
        $('.backgroundSmall').hide();
        $('.bannerInstructor').show();
       
        $('.display-profile-instructor').hide();
        $('.edit-instructor-profile').hide();
        $('.instructor-add-course').hide();
        $('.change-password-form').hide();
    }

    var cancelStudentPage = function (e) {
        $(e.target.parentElement).hide();

        goBackToStudentPage();
    }

    var showInstructorCreate = function() {
        $('.gui').hide();
        $('.instructor-create').show();
    };
    var showAddCourse = function (e) {


        $('.backgroundBig').hide();
        $('.backgroundSmall').show();

        $('.display-profile-instructor').hide();
        $('.edit-instructor-profile').hide();

        $('.view-profile').hide();
        $('.instructor-add-course').show();
        $('.instructor-display-ta-applications').hide();
        $('.view-courses').hide();
    };

    var showStudentCreate = function() {
        $('.gui').hide();
        $('.student-create').show();
    };

    var showLogin = function() {
        $('.login-message').text('Log in...');
        $('.gui').hide();
        $('.login').show();
    };

    var showChangePassword = function(e) {
        $(e.target.parentElement).hide();
        $('.change-password-form').show();
    }

    var insertCourse = function(course) {
        var newElement = $(courseTemplateHTML);

        newElement.attr('id', course.id);
        newElement.find('.course-name').text(course.course_name);
        newElement.find('.course-title').text(course.title);
        newElement.find('.course-description').text(course.description);
        newElement.find('.instructor').text(course.instructor);

        courses.append(newElement);
    }

    var insertCurrentTAApplication = function(taApplication) {

        var newElement = $(currentTAApplicationTemplateHTML);

        newElement.attr('id', taApplication.id);
        newElement.find('.current-application-instructor-id').text(taApplication.faculty_id);
        newElement.find('.current-application-course-name').text(taApplication.course_name);
        newElement.find('.current-application-status').text(taApplication.application_status);

        currentTAApplications.append(newElement);
    }



    var showTAApplicationForm = function (e) {
        $(e.target.parentElement).hide();

        $('.backgroundBig').hide();
        $('.backgroundSmall').show();

       
        $('.apply-ta-position').show();
        $('.bannerStudent').show();

        $('.edit-student-profile').hide();
        $('.display-profile-student').hide();
        $('.view-ta-positions').hide();
        $('.student-display-current-applications').hide();
    }

    var insertTAPosition = function(course) {

        var newElement = $(allTAApplicationsTemplateHTML);

        
        newElement.attr('id', course.id);
        newElement.find('.student-ta-position-course-name').text(course.course_name);
        newElement.find('.student-ta-position-instructor').text(course.instructor);
        newElement.find('.student-ta-position-instructor-id').text(course.faculty_id);

        allTAApplications.append(newElement);
    }

    var insertInstructorTAApplication = function(taApplication) {

        var newElement = $(instructorTAApplicationTemplateHTML);

        newElement.attr('id', taApplication.id);
        newElement.find('.instructor-ta-application-student-id').text(taApplication.student_id);
        newElement.find('.instructor-ta-application-course-name').text(taApplication.course_name);
        newElement.find('.instructor-ta-application-grade-recieved').text(taApplication.student_grade);
        newElement.find('.instructor-ta-application-semester-taken').text(taApplication.student_semester_taken);
        newElement.find('.instructor-ta-application-prior-ta').text(taApplication.prior_ta);
        newElement.find('.instructor-ta-application-date').text(taApplication.application_date);

        instructorTAApplications.append(newElement);
    }


    var makeGetRequest = function(url, onSuccess, onFailure) {
        $.ajax({
            type: 'GET',
            url: apiUrl + url,
            dataType: "json",
            error: onFailure,
            crossDomain: true,
            credentials: 'same-origin',
            success: onSuccess,
            xhrFields: {
                withCredentials: true
            }
        });
    };

    var showProfile = function() {
        $('.backgroundBig').hide();
        $('.backgroundSmall').show();


        var showInstructor = function(data)
        {
            $('.instructor-add-course').hide();
            $('.edit-instructor-profile').hide();



            $('.display-profile-student').hide();
            $('.display-profile-instructor').show();

            $('.profile-name-instructor').text(data.instructor.last_name + ", " + data.instructor.first_name);
            $('.profile-email-instructor').text(data.instructor.email);
            $('.profile-phone-instructor').text(data.instructor.phone);
            $('.profile-faculty-id').text(data.instructor.faculty_id);
            $('.profile-office-instructor').text(data.instructor.office);
        };

        var showStudent = function(data)
        {
            $('.edit-student-profile').hide();
            $('.display-profile-instructor').hide();
            $('.apply-ta-position').hide();

            $('.display-profile-student').show();

            $('.profile-name-student').text(data.student.last_name + ", " + data.student.first_name);
            $('.profile-email-student').text(data.student.email);
            $('.profile-student-id').text(data.student.student_id);
            $('.profile-gpa').text(data.student.gpa);
            $('.profile-graduation-date').text(data.student.graduation_date);
            $('.profile-major').text(data.student.major);
        };
        var onSuccess = function(data)
        {
            console.log(data);
            if(data.status == -1)
            {
                $('.gui').hide();
                $('.login').show();
                $('.login-message').text('Please login first.');    
            }
            else if(data.type == "student")
            {
                showStudent(data);

                $('.view-ta-positions').hide();
                $('.student-display-current-applications').hide();


                $('.gui').hide();
                $('.view-profile').show();
            }
            else 
            {
                showInstructor(data);
                $('.instructor-display-ta-applications').hide();
                $('.view-courses').hide();

                
                $('.gui').hide();
                $('.view-profile').show();
            }
        };
        var onFailure = function()
        {
            console.log("GET Request failed");
        };
        makeGetRequest("api/profile", onSuccess, onFailure);
    };

    var editProfile = function (e) {
        $('.backgroundSmall').show();
        $('.backgroundBig').hide();
        var onSuccess = function(data) {

            var editStudentProfile = function(data) {
                $('.gui').hide();
                $('.view-ta-positions').hide();
                $('.student-display-current-applications').hide();
                $('.apply-ta-position').hide();
                $('.bannerStudent').show();
                $('.display-profile-student').hide();

                $(".edit-student-email").attr('placeholder', 'Current Email: ' + data.student.email);
                $(".edit-major").attr('placeholder', 'Current Major: ' + data.student.major);
                $(".edit-gpa").attr('placeholder', 'Current GPA: ' + data.student.gpa);
                $(".edit-graduation-date").attr('placeholder', 'Current Graduation Date: ' + data.student.graduation_date);

                $('.edit-student-profile').show();
            }
            var editInstructorProfile = function() {
                $('.gui').hide();
                $('.display-profile-instructor').hide();
                $('.instructor-add-course').hide();
                $('.backgroundBig').hide();
                $('.instructor-display-ta-applications').hide();
                $('.view-courses').hide();

                $(".edit-instructor-email").attr('placeholder', 'Current Email: ' + data.instructor.email);
                $(".edit-phone").attr('placeholder', 'Current Phone: ' + data.instructor.phone);
                $(".edit-office").attr('placeholder', 'Current Office: ' + data.instructor.office);

                $('.edit-instructor-profile').show();

               
            }

            if(data.type == "student")
                editStudentProfile(data);
            else if(data.type == "instructor")
                editInstructorProfile(data);
            else {
                $('.gui').hide();
                $('.login-message').text('Not logged in!');
                $('.login').show();
            }
        }
        var onFailure = function() {

        }
        makeGetRequest('api/profile', onSuccess, onFailure);
    }

    var displayCourses = function() {
        var onSuccess = function(data) {
            console.log(data);

            $('#courses').empty();

            for(i = 0; i < data.courses.length; i++) {
                insertCourse(data.courses[i]);
            }
            $('.gui').hide();
            $(".courses").show();
            $('.view-courses').show();
            
        }
        var onFailure = function() {

        }
        makeGetRequest('api/courses', onSuccess, onFailure);
    }

    var logout = function(e) {
        var onSuccess = function(data) {    
            console.log(data)
            $('.gui').show();
            $('.instructor-display-ta-applications').hide();
            $('.view-courses').hide();
            $('.bannerInstructor').hide();

            $('.backgroundBig').hide();
            $('.backgroundSmall').show();
            $('.bannerStudent').hide();
            $('.view-ta-positions').hide();
            $('.student-display-current-applications').hide();
        }
        var onFailure = function() {
            alert ("logout GET request failed")
        }

        makeGetRequest('api/logout', onSuccess, onFailure);
    }

    //shows list of applied courses and their status
    //student -> view profile -> view stastus of current applications
    var showCurrentTAApplications = function(e) {
        var onSuccess = function(data) {

            console.log(data);



            $('#current-applications').empty();

            if (e != undefined) {
                $(e.target.parentElement).hide();
            }

            for(i = 0; i < data.applications.length; i++) {
                insertCurrentTAApplication(data.applications[i]);
            }
            
            $('.gui').hide();
            $('.student-display-current-applications').show();
        }
        var onFailure = function() {
            
        }

        makeGetRequest('api/get-current-applications', onSuccess, onFailure);
    }

    //on student page. lists all available courses regardless of approval
    //student -> view profile -> available ta positions
    var showAllTAPositions = function(e) {
        var onSuccess = function(data) {
            console.log(data);
            $('#view-all-ta-positions').empty();

            if (e != undefined) {
                $(e.target.parentElement).hide();
            }

            for(i = 0; i < data.courses.length; i++) {
                insertTAPosition(data.courses[i]);
            }
            $('.display-profile-student').hide();
            $('.view-ta-positions').show();
        }
        var onFailure = function() {

        }
        makeGetRequest('api/get-all-positions', onSuccess, onFailure);
    }

    //this is where instructor can accept and reject
    var showInstructorCurrentApplications = function(e) {
        var onSuccess = function(data) {
            console.log(data);

            
            $('#instructor-applications').empty();

            if (e != undefined) {
                $(e.target.parentElement).hide();
            }
            
            $('.instructor-display-ta-applications').show();
            $('.backgroundBig').show();
            $('.backgroundSmall').hide();

            for(i = 0; i < data.applications.length; i++) {
                insertInstructorTAApplication(data.applications[i]);
            }

            
           
            console.log(document.getElementById('view-courses'));
        }
        var onFailure = function(data) {
            alert("instructor applications GET request failed");
        }
        makeGetRequest('api/get-instructor-applications', onSuccess, onFailure);
    }

    var makePostRequest = function(url, data, onSuccess, onFailure) {
        $.ajax({
            type: 'POST',
            url: apiUrl + url,
            data: JSON.stringify(data),
            contentType: "application/json",
            dataType: "json",
            success: onSuccess,
            crossDomain: true,
            credentials: 'same-origin',
            error: onFailure,
            xhrFields: {
                withCredentials: true
            }
        });
    };


    var createInstructor = function(e) {
        e.preventDefault();

        var instructor = {};

        instructor.facultyId = $('.instructor-id-input').val();
        instructor.firstName = $('.instructor-first-name-input').val();
        instructor.lastName = $('.instructor-last-name-input').val();
        instructor.email = $('.instructor-email-input').val();
        instructor.phone = $('.instructor-phone-input').val();
        instructor.office = $('.instructor-office-input').val();
        instructor.password = $('.instructor-password-input').val();

        if (instructor.facultyId.length != 10) {
            alert("Faculty ID must be 10 characters");
            return;
        }
        if (isNaN(parseFloat(instructor.facultyId)) == true) {
            alert("Faculty ID must be a number");
            return;
        }
        if (instructor.firstName.length < 1 || instructor.firstName.length > 32) {
            alert("First name must be greater than 0 characters and less than 32 characters");
            return;
        }
        if (instructor.lastName.length < 1 || instructor.lastName.length > 32) {
            alert("Last name must be greater than 0 characters and less than 32 characters");
            return;
        }
        if (/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(instructor.email) == false) {
            alert("Not a valid email (Please enter in form XXXX@XXXX.XXX)\n");
            return;
        }
        if(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(instructor.phone) == false) {
            alert("Not a valid phone number (Please enter in form XXX-XXX-XXXX)");
            return;
        }
        if (instructor.office.length < 1 || instructor.office.length > 32) {
            alert("Office must be greater than 0 characters and less than 32 characters");
            return;
        }
        if(instructor.password.length < 1 || instructor.password.length > 64) {
            alert("Password must be greater than 0 characters and less than 64 characters");
            return;
        }

        var onSuccess = function(data) {
            console.log(data);

            if(data.status === -1) {
                alert("Duplicate instructor profile!");
            }
            else {
                $(e.target.parentElement).hide();
                $('.gui').show();
            }
        };

        var onFailure = function(data) {
            console.log("POST request failed\n");
        };
        makePostRequest("api/instructor", instructor, onSuccess, onFailure);
    };

    var createStudent = function(e) {
        e.preventDefault();

        var student = {}; 

        student.studentId = $('.student-id-input').val();
        student.firstName = $('.student-first-name-input').val();
        student.lastName = $('.student-last-name-input').val();
        student.email = $('.student-email-input').val();
        student.major = $('.student-major-input').val();
        student.gpa = $('.student-gpa-input').val();
        student.graduationDate = $('.student-graduation-input').val();
        student.password = $('.student-password-input').val();


        if (student.studentId.length != 10) {
            alert("Student ID must 10 characters");
            return;
        }
        if (isNaN(parseFloat(student.studentId)) == true) {
            alert("Student ID must be a number");
            return;
        }
        if (student.firstName.length < 1 || student.firstName.length > 32) {
            alert("First name must be greater than 0 characters and less than 32 characters")
            return;
        }
        if (student.lastName.length < 1 || student.lastName.length > 32) {
            alert("Last name must be greater than 0 characters and less than 32 characters")
            return;
        }
        if (/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(student.email) == false) {
            alert("Not a valid email\n");
            return;
        }

        if (student.major.length < 1 || student.major.length > 64) {
            alert("Major must be greater than 0 characters and less than 64 characters");
            return;
        }
        if (student.gpa.length == 0) {
            alert("Must enter a GPA");
            return;
        }
        if (isNaN(parseFloat(student.gpa)) == true) {
            alert("GPA must be a number");
            return;
        }
        if (parseFloat(student.gpa) < 0.0){
            alert("GPA must be greater than 0.0");
            return;
        }
        if (parseFloat(student.gpa) > 4.0){
            alert("GPA must be less than 4.0");
            return;
        }
        if (student.graduationDate.length < 1 || student.graduationDate.length > 64) {
            alert("Graduation date must be greater than 0 characters and less than 64 characters");
            return;
        }
        if(student.password.length < 1 || student.password.length > 64) {
            alert("Password must be greater than 0 characters and less than 64 characters");
            return;
        }

        var onSuccess = function(data) {
            console.log(data);

            if(data.status === -1) {
                alert("Duplicate student profile!");
            }
            else {
                $(e.target.parentElement).hide();
                $('.gui').show();
            }
        };

        var onFailure = function(data) {
            console.log("POST request failed\n");
        };
        makePostRequest("api/student", student, onSuccess, onFailure);
    };

    var addCourse = function (e) {
        
        var course = {};

        course.courseName = $('.course-id-input').val();
        course.title = $('.course-name-input').val();
        course.description = $('.course-idk-input').val();

        if (course.courseName.length < 1 || course.courseName.length > 64) {
            alert("Course name must be greater than 0 characters and less than 64 characters");
            return;
        }
        if (course.title.length < 1 || course.title.length > 64) {
            alert("Course title must be greater than 0 characters and less than 64 characters");
            return;
        }
        if (course.courseName.length < 1 || course.courseName.length > 612) {
            alert("Course name must be greater than 0 characters and less than 612 characters");
            return;
        }

        var onSuccess = function (data) {
            
            if(data.status === -1) {
                alert("Duplicate course!");
            }
            else {
                $('.instructor-add-course').hide();
                showInstructorCurrentApplications();
                displayCourses();
            }
        }
        var onFailure = function() {
           console.log("POST request failed\n");
        }
        makePostRequest('api/addcourse', course, onSuccess, onFailure);
    }

    var login = function(e) {

        var data = {};

        data.username = $('.login-username').val();
        data.userType = $('.user-type').val();
        data.password = $('.login-password').val();

        if(data.username.length < 1) {
            alert("Enter a username");
            return;
        }

        if(data.userType == null) {
            alert("Select a user type");
            return;
        }

        if(data.password.length < 1) {
            alert("Enter a password");
            return;
        }

        var onSuccess = function (data) {
            $(e.target.parentElement).hide();

            if (($('.user-type').val()) == "student") {

                 //STUDENT:
                console.log("you are a student");

                $('.backgroundSmall').hide();
                $('.backgroundBig').show();

                $('.instructor-display-ta-applications').hide();
                $('.view-courses').hide();

                $('.bannerStudent').show();
                showCurrentTAApplications();
                showAllTAPositions();                       
            }
            else  {
                //INSTRUCTOR:
                console.log("you are an instructor");

                $('.backgroundSmall').hide();
                $('.backgroundBig').show();

                $('.view-ta-positions').hide();
                $('.student-display-current-applications').hide();

                $('.bannerInstructor').show();
                showInstructorCurrentApplications();  //reject/accept
                displayCourses(); //display all posted courses
                


            }
        
            
            
            $('.gui').show();
            //$(".view-courses").append($(".instructor-display-ta-applications").remove());
        };
        var onFailure = function() {
            console.log("Incorrect username or password!");
        };
        makePostRequest("api/login", data, onSuccess, onFailure);
    };

    var studentEditSubmit = function(e) {

        var newData = {};

        newData.email = $(".edit-student-email").val();
        newData.major = $(".edit-major").val();
        newData.gpa = $(".edit-gpa").val();
        newData.graduationDate = $(".edit-graduation-date").val();

        if(newData.email.length > 0) {
            if (/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(newData.email) == false) {
                alert("Not a valid email\n");
                return;
            }
        }

        if (isNaN(parseFloat(newData.gpa)) == true) {
            alert("GPA must be a number");
            return;
        }
        if (parseFloat(newData.gpa) < 0.0){
            alert("GPA must be greater than 0.0");
            return;
        }
        if (parseFloat(newData.gpa) > 4.0){
            alert("GPA must be less than 4.0");
            return;
        }
        
        var onSuccess = function(data) {
            console.log(data);

            if(data.status === -1) {
                alert("Duplicate student email!");
            }
            else {
                $('.edit-student-profile').hide();
                goBackToStudentPage();
            }      
        }
        var onFailure = function() {
            alert("POST Request failed");
        }

        makePostRequest("api/edit_student", newData, onSuccess, onFailure);
    }
    var instructorEditSubmit = function(e) {

        var newData = {};

        newData.email = $(".edit-instructor-email").val();
        newData.phone = $(".edit-phone").val();
        newData.office = $(".edit-office").val();
        
        if(newData.email.length > 0) {
            if (/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(newData.email) == false) {
                alert("Not a valid email (Please enter in form XXXX@XXXX.XXX)\n");
                return;
            }
        }
        if(newData.phone.length > 0) {
            
            if(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(newData.phone) == false) {
                alert("Not a valid phone number (Please enter in form XXX-XXX-XXXX)");
                return;
            }
        }
        if(newData.office.length > 0) {
            if (newData.office.length < 1 || newData.office.length > 32) {
                alert("Office must be greater than 0 characters and less than 32 characters");
                return;
            }
        }
        
        var onSuccess = function(data) {
            console.log(data);

            if(data.status === -1) {
                alert("Duplicate instructor email!");
            }
            else {
                goBackToInstructorPage();
            }
        }
        var onFailure = function() {
            alert("POST Request failed");
        }

        makePostRequest("api/edit_instructor", newData, onSuccess, onFailure);
    }

    var submitNewPassword = function(e) {

        var postData = {};
        postData.password = $('.old-password').val();
        postData.newPassword = $('.new-password').val();
        postData.confirmNewPassword = $('.confirm-new-password').val();

        if(postData.newPassword.length < 1 || postData.newPassword.length > 64) {
            alert("New password must be greater than 0 characters and less than 64 characters");
            return;
        }

        if(postData.confirmPassword.length < 1 || postData.confirmPassword.length > 64) {
            alert("Confirmed new password must be greater than 0 characters and less than 64 characters");
            return;
        }

        var onSuccess = function(data) {
            console.log(data)
            if (($('.user-type').val()) == "instructor") {
                goBackToInstructorPage();
                console.log("Instructor password successfully changed");
            }
            else {
                goBackToStudentPage();
                console.log("Student password successfully changed");
            }

        }
        var onFailure = function() {
            if(postData.newPassword != postData.confirmNewPassword)
                alert("New Passwords don't match!")
            else
                alert("Old password incorrect!")

        }
        makePostRequest('api/change_password', postData, onSuccess, onFailure);
    }

    var submitTAPosition = function(e) {

        var postData = {};
        postData.facultyId = $('.ta-application-facultyid-input').val();
        postData.courseName = $('.ta-application-coursename-input').val();
        postData.studentGrade = $('.ta-application-grade-input').val();
        
        postData.studentSemesterTaken = $('.ta-application-season-input').val() + " " + $('.ta-application-year-input').val();
        
        if (isNaN(parseFloat(postData.facultyId)) == true) {
            alert("Faculty ID must be a number");
            return;
        }
        if (postData.facultyId.length != 10) {
            alert("Faculty ID must be 10 characters");
            return;
        }
        if (postData.courseName.length < 1 || postData.courseName.length > 32) {
            alert("Course name must be greater than 0 characters and less than 32 characters");
            return;
        }
        if (postData.studentGrade <= 2) {
            alert("Student grade must be less than or equal to 2 characters");
            return;
        }
        if (postData.studentSemesterTaken < 1 || postData.studentSemesterTaken > 10) {
            alert("Semester taken must be greater than 0 characters or less than 10 characters");
            return;
        }


        if($('.ta-application-grade-input').val() === "true") {
            postData.priorTA = true;
        }
        else {
            postData.priorTA = false;
        }

        var onSuccess = function (data) {

            console.log(data);
            if(data.status === -1) {
                alert(data.message);
            } 
            else {
                goBackToStudentPage();
                showCurrentTAApplications();
                showAllTAPositions(); 
            }   
        }
        var onFailure = function() {
            alert("POST Request failed");
        }

        makePostRequest('api/submit-ta-application', postData, onSuccess, onFailure);
    }

    var deleteCurrentApplication = function(e) {
        var applicationId = $(e.target).parents('.current-student-application').attr('id');

        var onSuccess = function(data) {
            $(e.target.parentElement).remove();
        }
        var onFailure = function() {
            alert("unable to delete application");
        }

        makePostRequest("api/delete-ta-application/" + applicationId, null, onSuccess, onFailure);
    }

    var instructorApproveApplication = function(e) {
        var applicationId = $(e.target).parents('.ta-application-instructor').attr('id');
        
        console.log(e.target.parentElement);
        var onSuccess = function (data) {
            console.log("Accepted");
            showInstructorCurrentApplications();  //reject/accept
            displayCourses(); //display all posted courses
            $('.instructor-display-ta-applications').show();
            //$('.gui').show();
        }
        var onFailure = function() {
            alert("unable to approve application");
        }

        makePostRequest("api/approve-ta-application/" + applicationId, null, onSuccess, onFailure);
    }

    var instructorRejectApplication = function(e) {
        var applicationId = $(e.target).parents('.ta-application-instructor').attr('id');
        
        var onSuccess = function (data) {
            console.log("Rejected");
            showInstructorCurrentApplications();  //reject/accept
            displayCourses(); //display all posted courses
            //$('.instructor-display-ta-applications').hide();
            //$('.gui').show();
        }
        var onFailure = function() {
            alert("unable to reject application");
        }
        makePostRequest("api/reject-ta-application/" + applicationId, null, onSuccess, onFailure);
    }


    var start = function() {

        $('.courses').hide();

        $(document.getElementsByTagName("form")).hide();
        $(document.getElementsByClassName('gui')).show(); 
        $(document.getElementsByClassName('bannerInstructor')).hide();
        $(document.getElementsByClassName('bannerStudent')).hide();
        $(document.getElementsByClassName('.backgroundSmall')).show();
        $(document.getElementsByClassName('.backgroundBig')).hide();



        $('.instructor-create-cancel').click(cancel);
        $('.student-create-cancel').click(cancel);
        $('.login-cancel').click(cancel); 
        $('.profile-back-student').click(cancelBigPage);
        $('.profile-back-instructor').click(cancelBigPage);
        $('.add-course-cancel').click(cancelBigPage);
        $('.view-courses-back').click(cancel);
        $('.edit-instructor-back').click(cancelBigPage);
        $('.edit-student-back').click(cancelStudentPage);
        $('.instructor-new-password-cancel').click(cancelBigPage);
        $('.apply-ta-position-back').click(cancelBigPage);
        $('.student-view-ta-positions-back').click(cancel);
        $('.instructor-view-ta-positions-back').click(cancel);
        $('.student-view-ta-applications-back').click(cancel);
        




        $('.login-submit').click(login);

        $('.edit-instructor-submit').click(instructorEditSubmit);
        $('.edit-student-submit').click(studentEditSubmit);

        $('.add-course-button').click(showAddCourse)

        $('.instructor-create-gui-button').click(showInstructorCreate);
        $('.student-create-gui-button').click(showStudentCreate);
        $('.login-gui-button').click(showLogin);
        $('.view-profile-gui-button').click(showProfile);
        $('.add-course-gui-button').click(showAddCourse);
        $('.add-course-submit').click(addCourse);
        $('.view-courses-gui-button').click(displayCourses);
        $('.edit-profile').click(editProfile);
        $('.change-password').click(showChangePassword);
        $('.logout-gui-button').click(logout);
        $('.student-list-ta-positions-button').click(showAllTAPositions);
        $('.view-ta-positions-apply').click(showTAApplicationForm);
        $('.student-view-current-applications').click(showCurrentTAApplications);
        $('.instructor-list-ta-applications-button').click(showInstructorCurrentApplications);


        //$('.instructor-login')

        $('.instructor-create-submit').click(createInstructor);
        $('.student-create-submit').click(createStudent);
        $('.new-password-submit').click(submitNewPassword);
        $('.apply-ta-position-submit').click(submitTAPosition);

        $('.current-applications').on('click', '.current-application-delete-button', deleteCurrentApplication);

        $('.instructor-applications').on('click', '.approve-ta-application-button', instructorApproveApplication);
        $('.instructor-applications').on('click', '.decline-ta-application-button', instructorRejectApplication);

        courseTemplateHTML = $('.course')[0].outerHTML;
        courses = $(".courses");
        courses.html('');

        currentTAApplicationTemplateHTML = $('.current-student-application')[0].outerHTML;
        currentTAApplications = $('.current-applications');
        currentTAApplications.html('');

        allTAApplicationsTemplateHTML = $('.ta-position-student')[0].outerHTML;
        allTAApplications = $('.view-all-ta-positions');
        allTAApplications.html('');

        instructorTAApplicationTemplateHTML = $('.ta-application-instructor')[0].outerHTML;
        instructorTAApplications = $('.instructor-applications');
        instructorTAApplications.html('');

        console.log(currentTAApplicationTemplateHTML);
        console.log(instructorTAApplicationTemplateHTML);

     };


        
     return {
         start: start
     };
    
})();
