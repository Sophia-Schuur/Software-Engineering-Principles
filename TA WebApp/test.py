import requests
import simplejson as json

def test_duplicate_instructor():
	url = 'http://127.0.0.1:5000/api/instructor'
	payload = {'facultyId': '1234567890', 
			   'firstName': 'John', 
			   'lastName': 'Smith', 
			   'email': 'john@smith.com',
			   'phone': '123-456-7890',
			   'office': 'this office',
			   'password': 'mypassword'
			   }
	headers = {'content-type': 'application/json', 'type': 'POST'}
	response = requests.post(url, data=json.dumps(payload), headers=headers)
	response_json = response.json()

	if(response_json['status'] == -1):
		print("duplicate test failed: profile exists at first call")

	response = requests.post(url, data=json.dumps(payload), headers=headers)
	response_json = response.json()

	if(response_json['status'] == -1):
		print("duplicate test success, second call failed")
	else:
		print("duplicate test failed, duplicate entry accepted")

def test_duplicate_student():
	url = 'http://127.0.0.1:5000/api/student'
	payload = {'studentId': '1234567890', 
			   'firstName': 'John', 
			   'lastName': 'Smith', 
			   'email': 'john@smith.com',
			   'major': 'Cpts',
			   'gpa': '4.0',
			   'graduationDate': 'Spring 2018',
			   'password': 'mypassword'
			   }
	headers = {'content-type': 'application/json', 'type': 'POST'}
	response = requests.post(url, data=json.dumps(payload), headers=headers)
	response_json = response.json()

	if(response_json['status'] == -1):
		print("duplicate test failed: profile exists at first call")

	response = requests.post(url, data=json.dumps(payload), headers=headers)
	response_json = response.json()

	if(response_json['status'] == -1):
		print("duplicate test success, second call failed")
	else:
		print("duplicate test failed, duplicate entry accepted")

def test_login():
	url = 'http://127.0.0.1:5000/api/login'
	payload = {'userType': 'student', 
			   'username': 'john@smith.com',
			   'password': 'mypassword'
			   }
	headers = {'content-type': 'application/json', 'type': 'POST'}

	response = requests.post(url, data=json.dumps(payload), headers=headers)
	if(response.ok):
		print('login test success')
	else:
		print('login test failed')

def test_delete_application():
	url = 'http://127.0.0.1:5000/api/delete-ta-application/1'
	headers = {'content-type': 'application/json', 'type': 'POST'}
	response = requests.post(url, None, headers=headers)

	if(response.ok):
		print('delete application test success')
	else:
		print('delete application test failed')