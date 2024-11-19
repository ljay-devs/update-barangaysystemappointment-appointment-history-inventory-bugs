// Import required modules
const express = require("express"),
      app = express(),
      moment = require('moment'),
      mysql = require("mysql"),
      cors = require('cors'),
      PORT = process.env.PORT || 6969;



const logger = (req, res, next) => {
    console.log(`${req.protocol}://${req.get('host')}${req.originalUrl} : ${moment().format('YYYY-MM-DD HH:mm:ss')}`);
    next();
}

app.use(logger);
app.use(cors());
app.use(express.json()) // Middleware to parse JSON body

// Connection to MySQL
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "dbbaranggay",
})

// Initialization of connection in database
connection.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err)
    } else {
        console.log('Connected to MySQL')
    }
})

// Endpoint to handle login
app.post('/api/login', (req, res) => {
    let { username, password } = req.body;
    username = username.toUpperCase();

    const query = `
        SELECT userid, SUBSTRING(userid, 1, 3) AS userType 
        FROM tblemployee 
        WHERE BINARY userid = ? AND password = ?
    `;

    connection.query(query, [username, password], (err, results) => {
        if (err) {
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        } else if (results.length > 0) {
            res.json({
                success: true,
                message: 'LogIn Success',
                userType: results[0].userType
            });
        } else {
            res.json({ success: false, message: 'Invalid username or password' });
        }
    });
});


// this is for the dashboard that when you click the log out is you will go in log-in page
app.post('/api/logout', (req, res) => { 
    // Clear any session or authentication tokens here if applicable 
    res.json({ success: true, 
        message: 'Logged out successfully' 
    })
})


// this is for the get the name of the admin or stakeholder
//to fetch admin name for a specific user
// Updated endpoint to fetch admin name for a specific user
app.get('/api/GET/admin/:userid', (req, res) => {
    const { userid } = req.params;
    const query = `
        SELECT CONCAT(fname, ' ', mname, ' ', lname) AS fullname 
        FROM tblemployee 
        WHERE userid = ?`;
    
    connection.query(query, [userid], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send({ success: false, message: 'Error retrieving admin name' });
            return;
        }
        if (results.length > 0) {
            res.json({ fullname: results[0].fullname });
        } else {
            res.status(404).json({ success: false, message: 'User not found' });
        }
    });
});


//this is for the appointment-list
app.get('/api/GET/appointment-barangay', (req, res) => {
    connection.query('SELECT * FROM tblresicert', (err, rows) => {
        if (err) {
            console.error('Error fetching barangay appointments:', err);
            return res.status(500).json({ success: false, message: 'Failed to fetch appointments' });
        }
        res.json(rows);
    });
});


app.get('/api/GET/appointment-health', (req, res) => {
    connection.query('SELECT * FROM tblresihealth', (err, rows) => {
        if (err) {
            console.error('Error fetching barangay health appointments:', err);
            return res.status(500).json({ success: false, message: 'Failed to fetch appointments' });
        }
        res.json(rows);
    });
});

//this is for the appointment that accept the admin
app.post('/api/POST/accept-barangay', (req, res) => {
    const { CertiID } = req.body;
    const dateAccept = moment().format('YYYY-MM-DD HH:mm:ss');

    connection.query(`
        INSERT INTO tblcerthistory (CertiID, fname, lname, street, date, time, certificates, purpose, DateAccept)
        SELECT CertiID, fname, lname, street, date, time, certificates, purpose, ? FROM tblresicert WHERE CertiID = ?
    `, [dateAccept, CertiID], (err) => {
        if (err) {
            console.error('Error accepting barangay appointment:', err);
            return res.status(500).json({ success: false, message: 'Failed to accept appointment' });
        }

        connection.query('DELETE FROM tblresicert WHERE CertiID = ?', [CertiID], (err) => {
            if (err) {
                console.error('Error deleting appointment after acceptance:', err);
                return res.status(500).json({ success: false, message: 'Failed to delete appointment' });
            }
            res.json({ success: true, message: 'Appointment accepted and moved to history.' });
        });
    });
});


app.post('/api/POST/accept-health', (req, res) => {
    const { CertiID } = req.body;
    const dateAccept = moment().format('YYYY-MM-DD HH:mm:ss');

    connection.query(`
        INSERT INTO tblhealththistory (CertiID, fname, lname, street, date, time, certificates, purpose, DateAccept)
        SELECT CertiID, fname, lname, street, date, time, certificates, purpose, ? FROM tblresihealth WHERE CertiID = ?
    `, [dateAccept, CertiID], (err) => {
        if (err) {
            console.error('Error accepting barangay appointment:', err);
            return res.status(500).json({ success: false, message: 'Failed to accept appointment' });
        }

        connection.query('DELETE FROM tblresihealth WHERE CertiID = ?', [CertiID], (err) => {
            if (err) {
                console.error('Error deleting appointment after acceptance:', err);
                return res.status(500).json({ success: false, message: 'Failed to delete appointment' });
            }
            res.json({ success: true, message: 'Appointment accepted and moved to history.' });
        });
    });
});


//this is if the admin is decline the appointment the appointment data will deleted
app.delete('/api/DELETE/decline-barangay', (req, res) => {
    const { CertiID } = req.body;
    connection.query('DELETE FROM tblresicert WHERE CertiID = ?', [CertiID], (err) => {
        if (err) {
            console.error('Error declining appointment:', err);
            return res.status(500).json({ success: false, message: 'Failed to decline appointment' });
        }
        res.json({ success: true, message: 'Appointment declined and deleted.' });
    });
});

app.delete('/api/DELETE/decline-health', (req, res) => {
    const { CertiID } = req.body;
    connection.query('DELETE FROM tblresihealth WHERE CertiID = ?', [CertiID], (err) => {
        if (err) {
            console.error('Error declining appointment:', err);
            return res.status(500).json({ success: false, message: 'Failed to decline appointment' });
        }
        res.json({ success: true, message: 'Appointment declined and deleted.' });
    });
});






//this is for the certificates appointment that inserted in the database
app.post('/api/POST/Certificates', async (req, res) => {
    const { fname, lname, street, date, time, certificates, purpose } = req.body
  
    if (!fname || !lname || !street || !date || !time || !certificates || !purpose) {
      return res.status(400).json({ message: 'All fields are required' })
    }
  
    try {
      const query = `
        INSERT INTO tblresicert (fname, lname, street, date, time, certificates, purpose) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `
      connection.query(query, [fname, lname, street, date, time, certificates, purpose], (err) => {
        if (err) {
          console.error('Error inserting Certificates appointment:', err)
          return res.status(500).json({ message: 'Internal server error' })
        }
        res.json({ message: 'Successfully Inserted' })

  })
      } catch (error) {
      //console.error('Error inserting certificate appointment:', error)
     // res.status(500).json({ message: 'Internal server error' })
     console.log('error to insert')
     }
})
  
  //this is for the Health Center in the appointment.html that inserted in the database using node js
  // Health Center POST endpoint
  app.post('/api/POST/HealthCenter', (req, res) => {
    const { fname, lname, age, street, date, time, purpose } = req.body
  
    // Check if any field is empty
    if (!fname || !lname || !age || !street || !date || !time || !purpose) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    try {
        const query = `
        INSERT INTO tblresihealth (fname, lname, age, street, date, time, purpose) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `
      connection.query(query, [fname, lname, age, street, date, time, purpose], (err) => {
          if (err) {
              console.error('Error inserting health center appointment:', err)
              return res.status(500).json({ message: 'Internal server error' })
            } 
        res.json({ message: 'Successfully Inserted' })
       
      })
    } catch (error) {
        console.log(error)
    }

 
})
  


//this is for the list of the appointment in certification
app.get('/api/GET/appointment-list', (req, res) => {
    connection.query(`SELECT * FROM tblresicert`, (err, rows) => {
        if (err) {
            console.error('Error fetching appointments', err)
            res.status(500).json({ success: false, message: 'Failed to fetch appointments' })
        } else {
            res.json(rows) // Return all rows
        }
    })
})

// Example: Inventory endpoint











// checking if the server is running
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})
