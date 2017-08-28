from flask import Flask, url_for, jsonify, json, request
from flask_cors import CORS
import mysql.connector.errors as errors
from db import Database
from pprint import pprint
app = Flask(__name__)
CORS(app)

db = Database()

@app.route('/users', methods = ['GET'])
def get_users():
    result = db.query("SELECT * FROM User")
    resp = jsonify(result)
    resp.status_code = 200
    return resp

@app.route('/user/<username>', methods = ['GET'])
def get_user_by_username(username):
    sql = "SELECT * FROM User WHERE Username = '{0}'".format(username)
    pprint(sql)
    result = db.query(sql)
    resp = jsonify(result)
    resp.status_code = 200
    return resp

@app.route('/user/email/<email>', methods = ['GET'])
def get_user_by_email(email):
    sql = "SELECT * FROM User WHERE GTEmail = '{0}'".format(email)
    result = db.query(sql)
    resp = jsonify(result)
    resp.status_code = 200
    return resp

@app.route('/user/login', methods = ['POST'])
def login():
    data = request.json
    sql = "SELECT * FROM User WHERE Username = %(Username)s AND Password = %(Password)s"
    result = db.query(sql, data)
    if len(result) > 0:
        resp = jsonify(result)
        resp.status_code = 200
    else:
        resp = jsonify({'error': 'Username or password incorrect.'})
        resp.status_code = 401
    return resp

@app.route('/projects', methods = ['GET'])
def get_projects():
    sql = "SELECT * FROM Project"
    result = db.query(sql)
    resp = jsonify(result)
    resp.status_code = 200
    return resp

@app.route('/projects/applicants', methods = ['GET'])
def get_projects_by_num_applicants():
    sql = """
        SELECT p.ProjectName, COUNT(*) AS 'Applicants' FROM Project AS p
        INNER JOIN Application AS a ON p.ProjectName = a.ProjectName
        GROUP BY p.ProjectName
        ORDER BY COUNT(*) DESC
        LIMIT 10
    """
    result = db.query(sql)
    resp = jsonify(result)
    resp.status_code = 200
    return resp

@app.route('/project/<project_name>', methods = ['GET'])
def get_project_by_name(project_name):
    sql = "SELECT * FROM Project WHERE ProjectName = '{0}'".format(project_name)
    result = db.query(sql, project_name)
    resp = jsonify(result)
    resp.status_code = 200
    return resp

@app.route('/courses', methods = ['GET'])
def get_courses():
    sql = "SELECT * FROM Course"
    result = db.query(sql)
    resp = jsonify(result)
    resp.status_code = 200
    return resp

@app.route('/course/<course_name>', methods = ['GET'])
def get_course_by_name(course_name):
    sql = "SELECT * FROM Course WHERE CourseName = '{0}'".format(course_name)
    result = db.query(sql, (course_name))
    resp = jsonify(result)
    resp.status_code = 200
    return resp

@app.route('/course/number/<course_number>', methods = ['GET'])
def get_course_by_number(course_number):
    sql = "SELECT * FROM Course WHERE CourseNumber = '{0}'".format(course_number)
    result = db.query(sql, (course_number))
    resp = jsonify(result)
    resp.status_code = 200
    return resp

@app.route('/projects/courses', methods = ['POST'])
def get_projects_and_courses():
    data = request.json
    title = data['title'] if 'title' in data else None
    major = data['major'] if 'major' in data else None
    year = data['year'] if 'year' in data else None
    designation = data['designation'] if 'designation' in data else None
    return_projects = data['projects_only'] if 'projects_only' in data else True
    return_courses = data['courses_only'] if 'courses_only' in data else True
    categories = list(set(data['categories'])) if 'categories' in data else []
    categories = ["'" + x + "'" for x in categories]
    if len(categories) == 0:
        categories = "''"
        no_categories = 'TRUE'
    else:
        categories = ','.join(categories)
        no_categories = 'FALSE'
    pprint(categories)
    if not return_projects and not return_courses:
        return_projects = True
        return_courses = True
    sql = """
        SET @Title = %s;
        SET @Major = %s;
        SET @Year = %s;
        SET @Designation = %s;
        SET @ReturnProjects = %s;
        SET @ReturnCourses = %s;
        SELECT DISTINCT t1.ProjectName AS 'Name', 'Project' AS 'Type' FROM (
            SELECT ProjectName FROM Requirement
            WHERE MajorRequirement = @Major OR @Major is NULL OR MajorRequirement IS NULL
            UNION SELECT ProjectName From Requirement
            WHERE DepartmentRequirement IN (
                SELECT DeptName FROM Major
                WHERE MajorName = @Major
            )) AS t1
        INNER JOIN (
            SELECT ProjectName FROM Requirement
            WHERE YearRequirement = @Year OR @Year IS NULL OR YearRequirement IS NULL) AS t2
        ON t1.ProjectName = t2.ProjectName
        INNER JOIN (
            SELECT ProjectName FROM Project
            WHERE ProjectName LIKE CONCAT('%', @Title, '%') OR @Title IS NULL) AS t3
        ON t1.ProjectName = t3.ProjectName
        INNER JOIN (
            SELECT ProjectName FROM ProjectCategory
            WHERE CategoryName IN ({0})
            OR {1} = TRUE) AS t4
        ON t1.ProjectName = t4.ProjectName
        INNER JOIN (
            SELECT ProjectName FROM Project
            WHERE Designation = @Designation OR @Designation IS NULL) AS t5
        ON t1.ProjectName = t5.ProjectName
        WHERE @ReturnProjects = TRUE
        UNION SELECT DISTINCT c1.CourseName AS 'Name', 'Course' AS 'Type' FROM (
            SELECT CourseName FROM Course
            WHERE CourseName LIKE CONCAT('%', @Title, '%') OR @Title IS NULL) AS c1
        INNER JOIN (
            SELECT CourseName FROM Course
            WHERE Designation = @Designation OR @Designation IS NULL) AS c2
        ON c1.CourseName = c2.CourseName
        INNER JOIN (
            SELECT CourseName FROM CourseCategory
            INNER JOIN Course ON Course.CourseNumber = CourseCategory.CourseNumber
            WHERE CategoryName IN ({0})
            OR {1} = TRUE) AS c3
        ON c1.CourseName = c3.CourseName
        WHERE @ReturnCourses = TRUE
        ORDER BY Name
    """.format(categories, no_categories)
    pprint(sql)
    result = db.query(sql, (title, major, year, designation, return_projects, return_courses), multi=True)
    resp = jsonify(result)
    resp.headers.add('Access-Control-Allow-Origin', '*')
    resp.headers.add('Access-Control-Allow-Methods', '*')
    resp.status_code = 200
    return resp

@app.route('/designations', methods = ['GET'])
def get_designations():
    sql = "SELECT * FROM Designation ORDER BY Name"
    result = db.query(sql)
    resp = jsonify(result)
    resp.status_code = 200
    return resp

@app.route('/majors', methods = ['GET'])
def get_majors():
    sql = "SELECT * FROM Major ORDER BY MajorName"
    result = db.query(sql)
    resp = jsonify(result)
    resp.status_code = 200
    return resp

@app.route('/categories', methods = ['GET'])
def get_categories():
    sql = "SELECT * FROM Category ORDER BY CategoryName"
    result = db.query(sql)
    resp = jsonify(result)
    resp.status_code = 200
    return resp

@app.route('/department/<major_name>', methods=['GET'])
def get_department_by_major(major_name):
    sql = "SELECT DeptName FROM Major WHERE MajorName = '{0}'".format(major_name)
    result = db.query(sql)
    resp = jsonify(result)
    resp.status_code = 200
    return resp

@app.route('/departments', methods=['GET'])
def get_departments():
    sql = "SELECT DeptName FROM Department ORDER BY DeptName"
    result = db.query(sql)
    resp = jsonify(result)
    resp.status_code = 200
    return resp

@app.route('/course/categories/<course_number>', methods = ['GET'])
def get_course_categories_by_course_number(course_number):
    sql = "SELECT CategoryName FROM CourseCategory WHERE CourseNumber = '{0}'".format(course_number)
    result = db.query(sql)
    resp = jsonify(result)
    resp.status_code = 200
    return resp

@app.route('/project/categories/<project_name>', methods = ['GET'])
def get_project_categories_by_project_name(project_name):
    sql = "SELECT CategoryName FROM ProjectCategory WHERE ProjectName = '{0}'".format(project_name)
    result = db.query(sql)
    resp = jsonify(result)
    resp.status_code = 200
    return resp

@app.route('/project/requirements/<project_name>', methods = ['GET'])
def get_requirements_by_project_name(project_name):
    sql = """
        SELECT MajorRequirement AS 'Requirement' FROM Requirement WHERE ProjectName = %s
        UNION
        SELECT YearRequirement AS 'Requirement' FROM Requirement WHERE ProjectName = %s
        UNION
        SELECT DepartmentRequirement AS 'Requirement' FROM Requirement WHERE ProjectName = %s
    """
    result = db.query(sql, (project_name, project_name, project_name))
    resp = jsonify(result)
    resp.status_code = 200
    return resp

@app.route('/application/<username>', methods = ['GET'])
def get_applications_by_username(username):
    sql = "SELECT * FROM Application WHERE Username = '{0}'".format(username)
    result = db.query(sql)
    resp = jsonify(result)
    resp.status_code = 200
    return resp

@app.route('/application/<username>/<project_name>', methods = ['POST'])
def update_application_status(username, project_name):
    data = request.json
    sql = "UPDATE Application SET Status = %s WHERE Username = %s AND ProjectName = %s"
    result = db.query(sql, (data['Status'], username, project_name))
    sql = "SELECT * FROM Application WHERE Username = %s AND ProjectName = %s"
    result = db.query(sql, (username, project_name))
    resp = jsonify(result)
    resp.status_code = 200
    return resp

@app.route('/application/<username>/<project_name>', methods = ['GET'])
def get_applications_by_username_and_project_name(username, project_name):
    sql = "SELECT * FROM Application WHERE Username = %s AND ProjectName = %s"
    result = db.query(sql, (username, project_name))
    resp = jsonify(result)
    resp.status_code = 200
    return resp

@app.route('/applications', methods = ['GET'])
def get_applications():
    sql = "SELECT * FROM Application INNER JOIN User ON Application.Username = User.Username ORDER BY ProjectName"
    result = db.query(sql)
    resp = jsonify(result)
    resp.status_code = 200
    return resp

@app.route('/user/<username>/edit', methods = ['POST'])
def edit_user(username):
    data = request.json
    if 'Year' not in data:
        data['Year'] = None
    if 'Major' not in data:
        data['Major'] = None
    sql = "UPDATE User SET Major=%s, Year=%s WHERE Username=%s"
    result = db.query(sql, (data['Major'], data['Year'], username))
    if len(result) > 0:
        resp = jsonify({'success': True})
        resp.status_code = 200
    else:
        resp = jsonify({'success': False})
        resp.status_code = 401
    return resp

@app.route('/application/create', methods = ['POST'])
def apply_for_project():
    data = request.json
    sql = """
        SET @username = %(Username)s;
        SET @projectname = %(ProjectName)s;

        SELECT u.Major, u.Year, m.DeptName INTO @Major, @Year, @Department FROM User AS u
        INNER JOIN Major AS m ON u.Major = m.MajorName
        WHERE u.Username = @username;

        SELECT p.MajorRequirement, p.YearRequirement, p.DepartmentRequirement INTO @rMajor, @rYear, @rDepartment FROM Requirement AS p
        WHERE p.ProjectName = @projectname;

        SELECT ((@rMajor IS NULL AND @rDepartment IS NULL) OR (@Major = @rMajor OR @Department = @rDepartment))
        AND (@rYear IS NULL OR @rYear = @Year) AS 'AbleToApply'
    """
    result = db.query(sql, data, multi=True)
    if result[0]['AbleToApply'] == 0:
        resp = jsonify({'error': 'User does not meet the project requirements.'})
        resp.status_code = 401
        return resp

    sql = "INSERT INTO Application (Username, ProjectName, Date, Status) VALUES (%(Username)s, %(ProjectName)s, %(Date)s, %(Status)s)"
    result = db.query(sql, data)
    resp = jsonify(result)
    resp.status_code = 200
    return resp

@app.route('/applications/report', methods = ['GET'])
def get_application_report():
    sql = """
        SELECT t1.ProjectName, t1.Applicants, t1.AcceptanceRate, t2.TopMajors FROM (
            SELECT a.ProjectName, COUNT(*) AS 'Applicants', ROUND(COUNT(CASE WHEN a.Status='Accepted' THEN 1 END) / COUNT(*) * 100) AS 'AcceptanceRate' FROM Application as a
            GROUP BY a.ProjectName) AS t1
        INNER JOIN (
            SELECT a.ProjectName, GROUP_CONCAT(
                DISTINCT u.Major
                ORDER BY u.Major ASC
                SEPARATOR '\n') AS 'TopMajors'
            FROM Application as a
            INNER JOIN User as u ON a.Username = u.Username
            WHERE a.ProjectName IN (SELECT ProjectName FROM Project)
            GROUP BY a.ProjectName) AS t2
        ON t1.ProjectName = t2.ProjectName
        ORDER BY t1.AcceptanceRate DESC
    """
    result = db.query(sql, multi=True)
    resp = jsonify(result)
    resp.status_code = 200
    return resp

@app.route('/applications/total', methods= ['GET'])
def get_total_applicants():
    sql = """
        SELECT COUNT(*) AS 'Applications', COUNT(CASE WHEN Status='Accepted' THEN 1 END) AS 'Accepted' FROM Application
    """
    result = db.query(sql, multi=True)
    resp = jsonify(result)
    resp.status_code = 200
    return resp

@app.route('/project/create', methods = ['POST'])
def create_project():
    data = request.json
    categories = []
    if 'categories' in data:
        categories = data['categories'].values()
        del data['categories']
    else:
        resp = jsonify({'error': 'Not all required fields filled out.'})
        resp.status_code = 400
        return resp
    sql = """INSERT INTO Project (ProjectName, EstNumStudents, AdvisorName, AdvisorEmail, Description, Designation)
             VALUES (%(ProjectName)s, %(EstNumStudents)s, %(AdvisorName)s, %(AdvisorEmail)s, %(Description)s, %(Designation)s);"""
    for category in list(set(categories)):
        sql += "INSERT INTO ProjectCategory (ProjectName, CategoryName) VALUES (%(ProjectName)s, '{0}');".format(category)

    requirement_data = ['Major', 'Year', 'Department']
    for req in requirement_data:
        if req not in data:
            data[req] = None
    sql += "INSERT INTO Requirement (ProjectName, MajorRequirement, YearRequirement, DepartmentRequirement) VALUES (%(ProjectName)s, %(Major)s, %(Year)s, %(Department)s);"
    try:
        result = db.query(sql, data, multi="True")
    except errors.ProgrammingError as e:
        pprint(e)
        resp = jsonify({'error': 'Not all required fields filled out.'})
        resp.status_code = 400
        return resp
    except errors.IntegrityError as e:
        pprint(e)
        resp = jsonify({'error': 'ProjectName already in database.'})
        resp.status_code = 409
        return resp
    resp = jsonify(result)
    resp.status_code = 200
    return resp

@app.route('/course/create', methods = ['POST'])
def create_course():
    data = request.json
    categories = []
    if 'categories' in data:
        categories = data['categories'].values()
        del data['categories']
    else:
        resp = jsonify({'error': 'Not all required fields filled out.'})
        resp.status_code = 400
        return resp
    sql = """INSERT INTO Course (CourseNumber, CourseName, EstNumStudents, Instructor, Designation)
             VALUES (%(CourseNumber)s, %(CourseName)s, %(EstNumStudents)s, %(Instructor)s, %(Designation)s);"""

    for category in list(set(categories)):
        sql += "INSERT INTO CourseCategory (CourseNumber, CategoryName) VALUES (%(CourseNumber)s, '{0}');".format(category)

    try:
        result = db.query(sql, data, multi="True")
    except errors.ProgrammingError as e:
        pprint(e)
        resp = jsonify({'error': 'Not all required fields filled out.'})
        resp.status_code = 400
        return resp
    except errors.IntegrityError as e:
        pprint(e)
        resp = jsonify({'error': 'CourseName already in database.'})
        resp.status_code = 409
        return resp
    resp = jsonify(result)
    resp.status_code = 200
    return resp

@app.route('/user/create', methods = ['POST'])
def create_user():
    data = request.json
    sql = "INSERT INTO User (Username, Password, GTEmail, UserType) VALUES (%(Username)s, %(Password)s, %(GTEmail)s, %(UserType)s)"
    try:
        result = db.query(sql, data)
    except errors.ProgrammingError as e:
        pprint(e)
        resp = jsonify({'error': 'Not all required fields filled out.'})
        resp.status_code = 400
        return resp
    except errors.IntegrityError as e:
        pprint(e)
        resp = jsonify({'error': 'Username already in database.'})
        resp.status_code = 409
        return resp
    if len(result) > 0:
        resp = jsonify({'success': True})
        resp.status_code = 200
    else:
        resp = jsonify({'success': False})
        resp.status_code = 401
    return resp

if __name__ == '__main__':
    app.run(port=8000, debug=True, threaded=True)
