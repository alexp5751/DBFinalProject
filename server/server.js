var express = require('express');
var bodyparser = require('body-parser');
var db = require('./db');

var app = express();
app.use(bodyparser.urlencoded({
    extended: true
}));
app.use(bodyparser.json());
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

// Retrieve all users
app.get('/users', function(req, res) {
    db.safe_query('SELECT * FROM User', function(err, result) {
        if (err) {
            res.status(400).send();
        } else {
            res.send(result);
        }
    });
});

// Retrieve a user based on a username
app.get('/user/:username', function(req, res) {
    db.safe_query('SELECT * FROM User WHERE Username = ?', [req.params.username], function(err, result) {
        if (err) {
            res.status(400).send();
        } else {
            res.send(result);
        }
    });
});

// Retrieve a user based on their email
app.get('/user/email/:email', function(req, res) {
    db.safe_query('SELECT * FROM User WHERE GTEmail = ?', [req.params.email], function(err, result) {
        if (err) {
            res.status(400).send();
        } else {
            res.send(result);
        }
    });
});

// Post login credentails, return success: true if valid, 401 error if not
app.post('/user/login', function(req, res) {
    db.safe_query('SELECT * FROM User WHERE Username = ? AND Password = ?', [req.body.Username, req.body.Password], function(err, result) {
        if (err) {
            res.status(400).send();
        } else if (result.length === 0) {
            res.status(401).send({
                success: false
            });
        } else {
            res.send({
                success: true
            });
        }
    });
});

// Update a user's information with valid post information, 400 if not valid
app.post('/user/edit', function(req, res) {
    db.safe_query('UPDATE User SET ? WHERE Username = ?', [req.body, req.body.Username], function(err, result) {
        if (err) {
            res.status(400).send();
        } else {
            res.send({
                success: true
            });
        }
    });
});

// Create a new user with valid post information, 409 if duplicate, 400 if not valid
app.post('/user/create', function(req, res) {
    db.safe_query('INSERT INTO User SET ?', req.body, function(err, result) {
        if (err && err.errno == 1062) {
            res.status(409).send(err);
        } else if (err) {
            res.status(400).send(err);
        } else {
            res.send({
                success: true
            });
        }
    });
});

// Get all projects
app.get('/projects', function(req, res) {
    db.safe_query('SELECT * FROM Project', function(err, result) {
        if (err) {
            res.status(400).send(err);
        } else {
            res.send(result);
        }
    });
});

// Get specific project by project name
app.get('/project/:name', function(req, res) {
    db.safe_query('SELECT * FROM Project WHERE ProjectName = ?', [req.params.name], function(err, result) {
        if (err) {
            res.status(400).send(err);
        } else {
            res.send(result);
        }
    });
});


// Get all courses
app.get('/courses', function(req, res) {
    db.safe_query('SELECT * FROM Course', function(err, result) {
        if (err) {
            res.status(400).send(err);
        } else {
            res.send(result);
        }
    });
});

// Get specific course with CourseName
app.get('/course/:name', function(req, res) {
    db.safe_query('SELECT * FROM Course WHERE CourseName = ?', [req.params.name], function(err, result) {
        if (err) {
            res.status(400).send(err);
        } else {
            res.send(result);
        }
    });
});

// Get specific course by it's CourseNumber
app.get('/course/number/:number', function(req, res) {
    db.safe_query('SELECT * FROM Course WHERE CourseNumber = ?', [req.params.number], function(err, result) {
        if (err) {
            res.status(400).send(err);
        } else {
            res.send(result);
        }
    });
});

// Create a new project with valid post information, 409 if duplicate, 400 if not valid
app.post('/project/create', function(req, res) {
    db.safe_query('INSERT INTO Project SET ?', req.body, function(err, result) {
        if (err && err.errno == 1062) {
            res.status(409).send(err);
        } else if (err) {
            res.status(400).send(err);
        } else {
            res.send({
                success: true
            });
        }
    });
});

// Create a new course with valid post information, 409 if duplicate, 400 if not valid
app.post('/course/create', function(req, res) {
    db.safe_query('INSERT INTO Course SET ?', req.body, function(err, result) {
        if (err && err.errno == 1062) {
            res.status(409).send(err);
        } else if (err) {
            res.status(400).send(err);
        } else {
            res.send({
                success: true
            });
        }
    });
});

// Get all projects and courses as a list of tuples with their name (ProjectName or CourseName as Name) and new field "Type"
app.get('/projects/courses', function(req, res) {
    var designation = req.query.designation || '%';
    var major = req.query.major || '%';
    var year = req.query.year || '%';
    db.safe_query("SELECT Name, Type FROM (" +
        " SELECT CourseName AS Name, 'Course' AS  'Type' FROM Course" +
        " UNION SELECT ProjectName AS Name,  'Project' AS  'Type' FROM Project) AS t" +
        " ORDER BY Name",
        function(err, result) {
            if (err) {
                res.status(400).send(err);
            } else {
                res.send(result);
            }
        });
});

// Get all designations ordered by name for convenience
app.get('/designations', function(req, res) {
    db.safe_query('SELECT * FROM Designation ORDER BY Name', function(err, result) {
        if (err) {
            res.status(400).send(err);
        } else {
            res.send(result);
        }
    });
});

// Get all majors ordered by name for convenience
app.get('/majors', function(req, res) {
    db.safe_query('SELECT * FROM Major ORDER BY MajorName', function(err, result) {
        if (err) {
            res.status(400).send(err);
        } else {
            res.send(result);
        }
    });
});

// Get all categories ordered by name for convenience
app.get('/categories', function(req, res) {
    db.safe_query('SELECT * FROM Category ORDER BY CategoryName', function(err, result) {
        if (err) {
            res.status(400).send(err);
        } else {
            res.send(result);
        }
    });
});

// Get a department based on a specific major name
app.get('/department/:majorName', function(req, res) {
    db.safe_query('SELECT DeptName FROM Major WHERE MajorName = ?', [req.params.majorName], function(err, result) {
        if (err) {
            res.status(400).send(err);
        } else {
            res.send(result);
        }
    });
});

// Get a specific course's categories
app.get('/course/categories/:courseNumber', function(req, res) {
    db.safe_query('SELECT CategoryName FROM CourseCategory WHERE CourseNumber = ?', [req.params.courseNumber], function(err, result) {
        if (err) {
            res.status(400).send(err);
        } else {
            res.send(result);
        }
    });
});

// Get a specific Project's categories
app.get('/project/categories/:projectName', function(req, res) {
    db.safe_query('SELECT CategoryName FROM ProjectCategory WHERE ProjectName = ?', [req.params.projectName], function(err, result) {
        if (err) {
            res.status(400).send(err);
        } else {
            res.send(result);
        }
    });
});

// Get a specific project's requirements
app.get('/project/requirements/:projectName', function(req, res) {
    db.safe_query('SELECT Requirement FROM Requirement WHERE ProjectName = ?', [req.params.projectName], function(err, result) {
        if (err) {
            res.status(400).send(err);
        } else {
            res.send(result);
        }
    });
});

// Create an application with valid post information, 409 if duplicate, 400 if invalid
app.post('/application/create', function(req, res) {
    db.safe_query('INSERT INTO Application SET ?', req.body, function(err, result) {
        if (err && err.errno == 1062) {
            res.status(409).send(err);
        } else if (err) {
            res.status(400).send(err);
        } else {
            res.send({
                success: true
            });
        }
    });
});

// Get all applications for a specific Username
app.get('/application/:username', function(req, res) {
    db.safe_query('SELECT * FROM Application WHERE Username = ?', [req.params.username], function(err, result) {
        if (err) {
            res.status(400).send(err);
        } else {
            res.send(result);
        }
    });
});

// Get a single application with Username and ProjectName
app.get('/application/:username/:projectName', function(req, res) {
    db.safe_query('SELECT * FROM Application WHERE Username = ? AND ProjectName = ?', [req.params.username, req.params.projectName], function(err, result) {
        if (err) {
            res.status(400).send(err);
        } else {
            res.send(result);
        }
    });
});

var server = app.listen(8000, function() {
    console.log('Server listening on port ' + server.address().port);
});
