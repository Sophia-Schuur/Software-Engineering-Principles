from flask import Flask, jsonify, request, session, make_response, render_template, redirect, url_for
from flask_session import Session
from flask_cors import CORS, cross_origin
from werkzeug.security import generate_password_hash, check_password_hash
import flask_sqlalchemy as sqlalchemy
from sqlalchemy import or_
import datetime

app = Flask(__name__)
app.secret_key = 'test'
app.config['SECRET_KEY'] = b'_5#y2L"F4Q8z\n\xec]/'
app.config['SESSION_TYPE'] = 'redis'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///sqlalchemy-demo.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['CORS_HEADERS'] = 'Content-Type'
db = sqlalchemy.SQLAlchemy(app)

cors = CORS(app)

class Student(db.Model):
	id = db.Column(db.Integer, nullable=False, primary_key=True)
	studentId = db.Column(db.Integer, nullable=False)
	firstName = db.Column(db.String(128), nullable=False)
	lastName = db.Column(db.String(128), nullable=False)
	email = db.Column(db.String(128), nullable=False)
	major = db.Column(db.String(128), nullable=False)
	gpa = db.Column(db.String(4), nullable=False)
	graduationDate = db.Column(db.String(128), nullable=False)
	passwordHash = db.Column(db.String(255), nullable=False)


class Instructor(db.Model):
	id = db.Column(db.Integer, nullable=False, primary_key=True)
	facultyId = db.Column(db.Integer, nullable=False)
	firstName = db.Column(db.String(128), nullable=False)
	lastName = db.Column(db.String(128), nullable=False)
	email = db.Column(db.String(128), nullable=False)
	phone = db.Column(db.String(128), nullable=False)
	office = db.Column(db.String(128), nullable=False)
	passwordHash = db.Column(db.String(255), nullable=False)

class Course(db.Model):
	id = db.Column(db.Integer, nullable=False, primary_key=True)
	courseName = db.Column(db.String(64), nullable=False)
	title = db.Column(db.String(64), nullable=False)
	description = db.Column(db.String(4096), nullable=False)
	instructor = db.Column(db.String(128), nullable=False)
	facultyId = db.Column(db.Integer, nullable=False)
	hasTA = db.Column(db.Boolean, default=False, nullable=False)

class TAApplication(db.Model):
	id = db.Column(db.Integer, nullable=False, primary_key=True)
	studentId = db.Column(db.Integer, nullable=False)
	facultyId = db.Column(db.Integer, nullable=False)
	courseName = db.Column(db.String(64), nullable=False)
	studentGrade = db.Column(db.String(2), nullable=False)
	studentSemesterTaken = db.Column(db.String(128), nullable=False)
	applicationDate = db.Column(db.DateTime, default=datetime.datetime.utcnow)
	priorTA = db.Column(db.Boolean, nullable=False)
	applicationStatus = db.Column(db.String(128), nullable=False, default="Under review")


@app.route('/api/student', methods=['POST'])
def createStudent():
	payload = request.get_json()

	student = Student()

	student.studentId = payload['studentId']
	student.firstName = payload['firstName']
	student.lastName = payload['lastName']
	student.email = payload['email']
	student.major = payload['major']
	student.gpa = payload['gpa']
	student.graduationDate = payload['graduationDate']

	duplicate = Student.query.filter_by(email=student.email).first()

	if duplicate is not None:
		return jsonify({"status": -1, "message": "duplicate student"}), 200

	duplicate = Student.query.filter_by(studentId=student.studentId).first()

	if duplicate is not None:
		return jsonify({"status": -1, "message": "duplicate student"}), 200


	student.passwordHash = generate_password_hash(payload['password'])
	
	db.session.add(student)
	db.session.commit()

	db.session.refresh(student)

	return jsonify({"status": 1, "student": row_to_obj_student(student)}), 200


@app.route('/api/instructor', methods=['POST'])
def createInstructor():

	payload = request.get_json()

	instructor = Instructor()

	instructor.facultyId = payload['facultyId']
	instructor.firstName = payload['firstName']
	instructor.lastName = payload['lastName']
	instructor.email = payload['email']
	instructor.phone = payload['phone']
	instructor.office = payload['office']

	instructor.passwordHash = generate_password_hash(payload['password'])

	duplicate = Instructor.query.filter_by(email=instructor.email).first()

	if duplicate is not None:
		return jsonify({"status": -1, "message": "duplicate instructor"}), 200

	duplicate = Instructor.query.filter_by(facultyId=instructor.facultyId).first()

	if duplicate is not None:
		return jsonify({"status": -1, "message": "duplicate instructor"}), 200



	db.session.add(instructor);
	db.session.commit();

	db.session.refresh(instructor);

	return jsonify({"status": 1, "instructor": row_to_obj_instructor(instructor)}), 200


@app.route('/api/addcourse', methods=['POST'])
def addCourse():
	payload = request.get_json()

	if(session['userType'] != 'instructor'):
		return jsonify({"status": -1}), 401

	course = Course()

	course.courseName = payload['courseName']
	course.title = payload['title']
	course.description = payload['description']
	course.facultyId = Instructor.query.filter_by(id=session['userId']).first().facultyId
	course.instructor = Instructor.query.filter_by(id=session['userId']).first().lastName
	course.instructor += " ," + Instructor.query.filter_by(id=session['userId']).first().firstName

	duplicate = Course.query.filter_by(courseName=course.courseName).filter_by(facultyId=course.facultyId).first();

	if duplicate is not None:
		return jsonify({"status": -1, "message": "duplicate course"}), 200

	db.session.add(course)
	db.session.commit()

	db.session.refresh(course)

	return jsonify({"status": 1, "courses: ": row_to_obj_course(course)}), 200

@app.route('/api/courses', methods=['GET'])
def getCourses():

	query = Course.query.all()

	result = []
	for row in query:
		result.append(
			row_to_obj_course(row)
            )


	return jsonify({"status": 1, "courses": result})

@app.route('/api/logout', methods=['GET'])
def logout():
	session.pop('userId')
	session.pop('userType')
	return jsonify({"status": 1}), 200




@app.after_request
def after_request(response):
	header = response.headers
	header['Access-Control-Allow-Credentials'] = 'true'
	return response

@app.route('/api/login', methods=['GET', 'POST'])
def login():

	payload = request.get_json()

	if(payload['userType'] == 'student'):
		user = Student.query.filter_by(email=payload['username']).first()
	else:
		user = Instructor.query.filter_by(email=payload['username']).first()
	
	if user is None:
		return jsonify({"status": -1}), 401

	if not check_password_hash(user.passwordHash, payload['password']):
		return jsonify({"status": -2}), 401



	session['userId'] = user.id
	session['userType'] = payload['userType']

	return jsonify(1)

@app.route('/api/profile', methods=['GET'])
def getSessionProfile():

	if 'userType' not in session and 'userId' not in session:
		return jsonify({"status": -1}), 200

	if(session['userType'] == 'student'):
		user = Student.query.filter_by(id=session['userId']).first()
		return jsonify({"status": 1, "type": "student", "student": row_to_obj_student(user)}), 200
	else:
		user = Instructor.query.filter_by(id=session['userId']).first()
		return jsonify({"status": 1, "type": "instructor", "instructor": row_to_obj_instructor(user)}), 200

@app.route('/api/get-current-applications', methods=['GET'])
def getCurrentApplications():

	user = Student.query.filter_by(id=session['userId']).first()

	query = TAApplication.query.filter_by(studentId=user.studentId).all();


	result = [];
	for row in query:
		result.append(row_to_obj_ta_application(row))

	return jsonify({"status": 1, "applications": result})

@app.route('/api/get-all-positions', methods=['GET'])
def getAllPositions():

	query = Course.query.filter_by(hasTA=False).all();

	result = [];
	for row in query:
		result.append(row_to_obj_course(row))

	return jsonify({"status": 1, "courses": result})

@app.route('/api/get-instructor-applications', methods=['GET'])
def getInstructorApplications():

	user = Instructor.query.filter_by(id=session['userId']).first()
	query = TAApplication.query.filter_by(facultyId=user.facultyId).all();

	result = [];
	for row in query:
		if row.applicationStatus == "Under review":
		    result.append(row_to_obj_ta_application(row))

	return jsonify({"status": 1, "applications": result})


@app.route('/api/submit-ta-application', methods=['POST'])
def addTAApplication():
	payload = request.get_json()
	user = Student.query.filter_by(id=session['userId']).first()

	taApplication = TAApplication()

	taApplication.studentId = user.studentId
	taApplication.facultyId = payload['facultyId']
	taApplication.courseName = payload['courseName']
	taApplication.studentGrade = payload['studentGrade']
	taApplication.studentSemesterTaken = payload['studentSemesterTaken']
	taApplication.priorTA = payload['priorTA']

	duplicate = TAApplication.query.filter_by(studentId=taApplication.studentId).filter_by(facultyId=taApplication.facultyId).filter_by(courseName=taApplication.courseName).first()

	verify = Course.query.filter_by(facultyId=taApplication.facultyId).filter_by(courseName=taApplication.courseName).first()

	userTAApplication = TAApplication.query.filter_by(studentId=taApplication.studentId).filter_by(applicationStatus="assigned").first()

	if userTAApplication is not None:
		return jsonify({"status": -1, "message": "student already has assigned position"})

	if verify is None:
		return jsonify({"status":-1, "message": "class does not exist"})
	elif verify.hasTA is True:
		return jsonify({"status":-1, "message": "class already has TA"})

	if duplicate is not None:
		return jsonify({"status": -1, "message": "duplicate ta application"}), 200

	db.session.add(taApplication)

	db.session.commit();

	db.session.refresh(taApplication);

	return jsonify({"status": 1, "application": row_to_obj_ta_application(taApplication)}), 200

@app.route('/api/delete-ta-application/<int:id>', methods=['POST'])
def deleteTAApplication(id):
	row = TAApplication.query.filter_by(id=id).first()
	db.session.delete(row)
	db.session.commit()
	return jsonify({"status": 1, "application": row_to_obj_ta_application(row)}), 200

@app.route('/api/approve-ta-application/<int:id>', methods=['POST'])
def approveTAApplication(id):

	row = TAApplication.query.filter_by(id=id).first()

	course = Course.query.filter_by(facultyId=row.facultyId).filter_by(courseName=row.courseName).first()
	remainingApplications = TAApplication.query.filter_by(studentId=row.studentId).all()

	course.hasTA = True;
	row.applicationStatus = "assigned"; 

	db.session.commit()

	db.session.refresh(row);
	return jsonify({"status": 1, "application": row_to_obj_ta_application(row)}), 200

@app.route('/api/reject-ta-application/<int:id>', methods=['POST'])
def rejectTAApplication(id):

	row = TAApplication.query.filter_by(id=id).first()
	
	row.applicationStatus = "dismissed"; 

	db.session.commit()

	db.session.refresh(row);
	return jsonify({"status": 1, "application": row_to_obj_ta_application(row)}), 200

@app.route('/api/change_password', methods=['POST'])
def changePassword():

	payload = request.get_json()

	if(session['userType'] == 'student'):
		user = Student.query.filter_by(id=session['userId']).first()
	else:
		user = Instructor.query.filter_by(id=session['userId']).first()

	if not check_password_hash(user.passwordHash, payload['password']):
		return jsonify({"status": -1, "reason": "incorrect_password"}), 401

	if not payload['newPassword'] == payload['confirmNewPassword']:
		return jsonify({"status": -1, "reason": "passwords_not_match"}), 404

	user.passwordHash = generate_password_hash(payload['newPassword'])

	db.session.commit();
	return jsonify({"status": 1}), 200




@app.route('/api/edit_student', methods=['POST'])
def editStudent():
	row = Student.query.filter_by(id=session['userId']).first()
	payload = request.get_json();

	duplicate = Student.query.filter_by(email=payload['email']).first()

	if duplicate is not None:
		return jsonify({"status": -1, "message": "duplicate student email"}), 200

	if(payload['email'] != ""):
		row.email = payload['email']
	if(payload['major'] != ""):
		row.major = payload['major']
	if(payload['gpa'] != ""):
		row.gpa = payload['gpa']
	if(payload['graduationDate'] != ""):
		row.graduationDate = payload['graduationDate']

	db.session.commit()

	return jsonify({"status": 1, "student": row_to_obj_student(row)})

@app.route('/api/edit_instructor', methods=['POST'])
def editInstructor():
	row = Instructor.query.filter_by(id=session['userId']).first()
	payload = request.get_json();

	duplicate = Instructor.query.filter_by(email=payload['email']).first()

	if duplicate is not None:
		return jsonify({"status": -1, "message": "duplicate instructor email"}), 200

	if(payload['email'] != ""):
		row.email = payload['email']
	if(payload['office'] != ""):
		row.office = payload['office']
	if(payload['phone'] != ""):
		row.phone = payload['phone']

	db.session.commit();

	return jsonify({"status": 1, "instructor": row_to_obj_instructor(row)});

def row_to_obj_course(row):
	row = {
			"id": row.id,
			"course_name": row.courseName,
			"faculty_id": row.facultyId,
			"title": row.title,
			"description": row.description,
			"instructor": row.instructor
		}

	return row


def row_to_obj_student(row):
    row = {
            "id": row.id,
            "first_name": row.firstName,
            "last_name": row.lastName,
            "email": row.email,
            "major": row.major,
            "gpa": row.gpa,
            "graduation_date": row.graduationDate,
            "student_id": row.studentId,
            "password_hash": row.passwordHash
        }

    return row

def row_to_obj_ta_application(row):
	row = {
		"id": row.id,
		"student_id": row.studentId,
		"faculty_id": row.facultyId,
		"course_name": row.courseName,
		"student_grade": row.studentGrade,
		"student_semester_taken": row.studentSemesterTaken,
		"application_date": row.applicationDate,
		"prior_ta": row.priorTA,
		"application_status": row.applicationStatus,
	}

	return row

def row_to_obj_instructor(row):
    row = {
            "id": row.id,
            "first_name": row.firstName,
            "faculty_id": row.facultyId,
            "last_name": row.lastName,
            "email": row.email,
            "phone": row.phone,
            "office": row.office,
            "password_hash": row.passwordHash
        }

    return row

def main():
	db.create_all()
	app.run()     

if __name__ == '__main__':
    main()
