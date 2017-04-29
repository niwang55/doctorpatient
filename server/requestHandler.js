const fs = require('fs');

// for /api/login route
exports.loginHandler = (req, res) => {
  let peopleJSON = JSON.parse(fs.readFileSync(__dirname + '/people.json').toString());

  const username = req.body.username;
  const password = req.body.password;

  let targetUser = null;

  peopleJSON.forEach( user => {
    if (user.username === username) {
      targetUser = user;
    }
  });

  if (targetUser) {
    if (password === targetUser.password) {
      req.session.user = username;
      req.session.isDoctor = targetUser.isDoctor;
      
      res.send({
        authenticated: true,
        isDoctor: req.session.isDoctor
      });
    } else {
      res.send({
        authenticated: false,
        message: 'Wrong password'
      });
    }
  } else {
    res.send({
      authenticated: false,
      message: 'User does not exist'
    });
  }
};

// for /api/logout route
// Destroys the session when the user logs out
exports.logoutHandler = (req, res) => {
  req.session.destroy();
};

// for /api/authenticate route
// For react router to protect routes
exports.authenticateHandler = (req, res) => {
  if (req.session.user && req.session.isDoctor) {
    res.send({
      authenticated: true,
      isDoctor: true
    });
  } else if (req.session.user && !req.session.isDoctor) {
    res.send({
      authenticated: true,
      isDoctor: false
    });
  } else {
    res.send({
      authenticated: false,
      isDoctor: false
    });
  }
};

// for /api/patients route
exports.getPatients = (req, res) => {
  let peopleJSON = JSON.parse(fs.readFileSync(__dirname + '/people.json').toString());
  let patientsArray = [];

  peopleJSON.forEach(user => {
    if (!user.isDoctor) {
      let patientObject = {
        'username': user.username,
        'name': user.name,
      };

      patientsArray.push(patientObject);
    }
  });

  res.send(patientsArray);
};

// for /api/currentpatient route
exports.updateCurrentPatient = (req, res) => {
  req.session.currentPatient = req.body.username;

  res.end();
};

// for /api/patientdetails route
exports.getPatientDetails = (req, res) => {
  let peopleJSON = JSON.parse(fs.readFileSync(__dirname + '/people.json').toString());
  let patientObject;

  peopleJSON.forEach(user => {
    if (req.session.currentPatient === user.username) {
      patientObject = {
        'username': user.username,
        'name': user.name,
        'age': user.age,
        'email': user.email,
        'address': user.address,
        'phone': user.phone
      };
    }
  });

  res.send(patientObject);
};

// for /api/overview route
exports.getDetails = (req, res) => {
  let peopleJSON = JSON.parse(fs.readFileSync(__dirname + '/people.json').toString());
  let patientObject;

  peopleJSON.forEach(user => {
    if (req.session.user === user.username) {
      patientObject = {
        'username': user.username,
        'name': user.name,
        'age': user.age,
        'email': user.email,
        'address': user.address,
        'phone': user.phone,
        'appointments': user.appointments
      };
    }
  });

  res.send(patientObject);
};

// for /api/doctors route
exports.getDoctors = (req, res) => {
  let peopleJSON = JSON.parse(fs.readFileSync(__dirname + '/people.json').toString());
  let doctorsArray = [];

  peopleJSON.forEach(user => {
    if (user.isDoctor) {
      let doctorObject = {
        'username': user.username,
        'name': user.name,
      };

      doctorsArray.push(doctorObject);
    }
  });

  res.send(doctorsArray);
};

// for GET /api/doctorappointment route
exports.doctorGetAppointments = (req, res) => {
  let peopleJSON = JSON.parse(fs.readFileSync(__dirname + '/people.json').toString());
  let appointmentsArray = [];

  peopleJSON.forEach(person => {
    if (req.session.currentPatient === person.username) {
      person.appointments.forEach(appointment => {
        if (appointment.doctorUser === req.session.user) {
          appointmentsArray.push(appointment);
        }
      });
    }
  });

  res.send(appointmentsArray);
};

// for POST /api/doctorappointment route
exports.doctorMakeAppointment = (req, res) => {
  let peopleJSON = JSON.parse(fs.readFileSync(__dirname + '/people.json').toString());

  // Find the doctor's name
  let doctorName = '';
  peopleJSON.forEach(person => {
    if (person.username === req.session.user) {
      doctorName = person.name;
    }
  });

  // Get the index of the target patient
  let targetUserIndex = null;
  peopleJSON.forEach( (person, index) => {
    if (person.username === req.session.currentPatient) {
      targetUserIndex = index;
    }
  });

  // Create an unique id for each appointment
  const id = peopleJSON[targetUserIndex].appointments.length;

  // Create an appointment object to push to appointments array
  const appointmentObject = {
    appointmentId: id,
    time: req.body.time,
    doctorUser: req.session.user,
    doctorName: doctorName,
    approved: true,
    canceled: false,
    message: ''
  };

  peopleJSON[targetUserIndex].appointments.push(appointmentObject);

  fs.writeFile(__dirname + '/people.json', JSON.stringify(peopleJSON));

  res.end();
};

// for /api/approveappointment
exports.approveAppointment = (req, res) => {
  let peopleJSON = JSON.parse(fs.readFileSync(__dirname + '/people.json').toString());
  
  // find the target patient index
  let targetPatientIndex = null;
  peopleJSON.forEach( (person, index) => {
    if (person.username === req.session.currentPatient) {
      targetPatientIndex = index;
    }
  });

  // find the target appointment index
  let targetAppointmentIndex = null;
  peopleJSON[targetPatientIndex].appointments.forEach( (appointment, index) => {
    if (appointment.appointmentId === req.body.appointmentId) {
      targetAppointmentIndex = index;
    }
  });

  peopleJSON[targetPatientIndex].appointments[targetAppointmentIndex].approved = true;
  fs.writeFile(__dirname + '/people.json', JSON.stringify(peopleJSON));

  res.end();
};

// for /api/rejectappointment
exports.rejectAppointment = (req, res) => {
  let peopleJSON = JSON.parse(fs.readFileSync(__dirname + '/people.json').toString());
  
  // find the target patient index
  let targetPatientIndex = null;
  peopleJSON.forEach( (person, index) => {
    if (person.username === req.session.currentPatient) {
      targetPatientIndex = index;
    }
  });

  // find the target appointment index
  let targetAppointmentIndex = null;
  peopleJSON[targetPatientIndex].appointments.forEach( (appointment, index) => {
    if (appointment.appointmentId === req.body.appointmentId) {
      targetAppointmentIndex = index;
    }
  });

  peopleJSON[targetPatientIndex].appointments[targetAppointmentIndex].canceled = true;
  peopleJSON[targetPatientIndex].appointments[targetAppointmentIndex].message = req.body.message;

  fs.writeFile(__dirname + '/people.json', JSON.stringify(peopleJSON));

  res.end();
};

// for GET /api/patientappointment route
exports.patientGetAppointments = (req, res) => {
  let peopleJSON = JSON.parse(fs.readFileSync(__dirname + '/people.json').toString());

  peopleJSON.forEach(person => {
    if (person.username === req.session.user) {
      res.send(person.appointments);
    }
  });
};

// for POST /api/patientappointment route
exports.patientMakeAppointment = (req, res) => {
  let peopleJSON = JSON.parse(fs.readFileSync(__dirname + '/people.json').toString());

  // Find the doctor's name
  let doctorName = '';
  peopleJSON.forEach(person => {
    if (person.username === req.body.doctorUser) {
      doctorName = person.name;
    }
  });


  // Get the index of the currently logged in patient
  let targetUserIndex = null;
  peopleJSON.forEach( (person, index) => {
    if (person.username === req.session.user) {
      targetUserIndex = index;
    }
  });

  // Create an unique id for each appointment
  const id = peopleJSON[targetUserIndex].appointments.length;

  // Create an appointment object to push to appointments array
  const appointmentObject = {
    appointmentId: id,
    time: req.body.time,
    doctorUser: req.body.doctorUser,
    doctorName: doctorName,
    patientUser: req.session.user,
    approved: false,
    canceled: false,
    message: 'Patient canceled'
  };

  peopleJSON[targetUserIndex].appointments.push(appointmentObject);

  fs.writeFile(__dirname + '/people.json', JSON.stringify(peopleJSON));

  res.end();
};

// for /api/cancelappointment
exports.cancelAppointment = (req, res) => {
  let peopleJSON = JSON.parse(fs.readFileSync(__dirname + '/people.json').toString());
  
  // find the target patient index
  let targetPatientIndex = null;
  peopleJSON.forEach( (person, index) => {
    if (person.username === req.session.user) {
      targetPatientIndex = index;
    }
  });

  // find the target appointment index
  let targetAppointmentIndex = null;
  peopleJSON[targetPatientIndex].appointments.forEach( (appointment, index) => {
    if (appointment.appointmentId === req.body.appointmentId) {
      targetAppointmentIndex = index;
    }
  });

  peopleJSON[targetPatientIndex].appointments[targetAppointmentIndex].canceled = true;
  fs.writeFile(__dirname + '/people.json', JSON.stringify(peopleJSON));

  res.end();
};

// for GET /api/doctorfiles
exports.doctorGetFiles = (req, res) => {
  let peopleJSON = JSON.parse(fs.readFileSync(__dirname + '/people.json').toString());

  peopleJSON.forEach( (person, index) => {
    if (person.username === req.session.currentPatient) {
      res.send(person.attachments);
    }
  });
};

// for POST /api/doctorfiles
exports.doctorUploadFile = (req, res) => {
  let peopleJSON = JSON.parse(fs.readFileSync(__dirname + '/people.json').toString());

  // find the target patient index
  let targetPatientIndex = null;
  peopleJSON.forEach( (person, index) => {
    if (person.username === req.session.currentPatient) {
      targetPatientIndex = index;
    }
  });

  let fstream;
  let filePath;

  req.pipe(req.busboy);
  req.busboy.on('file', function (fieldname, file, filename) {
    filePath = `${__dirname}/files/${filename}`;

    let fileExists = false;
    peopleJSON[targetPatientIndex].attachments.forEach(attachment => {
      if (filename === attachment.filename) {
        fileExists = true;
      }
    });

    if (!fileExists) {
      peopleJSON[targetPatientIndex].attachments.push({
        filename: filename,
        path: filePath
      });
      fs.writeFile(__dirname + '/people.json', JSON.stringify(peopleJSON));

      fstream = fs.createWriteStream(filePath);
      file.pipe(fstream);
      fstream.on('close', function () {
        res.send({
          uploaded: true,
          message: 'Uploaded'
        });
      });
    } else {
      res.send({
        uploaded: false,
        message: 'File with same name already exists, upload failed'
      });
    }
  });
};

// for /api/doctordeletefile
exports.doctorDeleteFile = (req, res) => {
  let peopleJSON = JSON.parse(fs.readFileSync(__dirname + '/people.json').toString());

    // find the target patient index
  let targetPatientIndex = null;
  peopleJSON.forEach( (person, index) => {
    if (person.username === req.session.currentPatient) {
      targetPatientIndex = index;
    }
  });

  peopleJSON[targetPatientIndex].attachments.forEach( (attachment, index) => {
    if (attachment.filename === req.body.filename) {
      peopleJSON[targetPatientIndex].attachments.splice(index, 1);
    }
  });

  fs.writeFile(__dirname + '/people.json', JSON.stringify(peopleJSON));

  fs.unlink(req.body.path);

  res.end();
};

// for GET /api/patientfiles
exports.patientGetFiles = (req, res) => {
  let peopleJSON = JSON.parse(fs.readFileSync(__dirname + '/people.json').toString());

  peopleJSON.forEach( (person, index) => {
    if (person.username === req.session.user) {
      res.send(person.attachments);
    }
  });
};

// for POST /api/patientfiles
exports.patientUploadFile = (req, res) => {
  let peopleJSON = JSON.parse(fs.readFileSync(__dirname + '/people.json').toString());

  // find the target patient index
  let targetPatientIndex = null;
  peopleJSON.forEach( (person, index) => {
    if (person.username === req.session.user) {
      targetPatientIndex = index;
    }
  });

  let fstream;
  let filePath;

  req.pipe(req.busboy);
  req.busboy.on('file', function (fieldname, file, filename) {
    filePath = `${__dirname}/files/${filename}`;

    let fileExists = false;
    peopleJSON[targetPatientIndex].attachments.forEach(attachment => {
      if (filename === attachment.filename) {
        fileExists = true;
      }
    });

    if (!fileExists) {
      peopleJSON[targetPatientIndex].attachments.push({
        filename: filename,
        path: filePath
      });
      fs.writeFile(__dirname + '/people.json', JSON.stringify(peopleJSON));

      fstream = fs.createWriteStream(filePath);
      file.pipe(fstream);
      fstream.on('close', function () {
        res.send({
          uploaded: true,
          message: 'Uploaded'
        });
      });
    } else {
      res.send({
        uploaded: false,
        message: 'File with same name already exists, upload failed'
      });
    }
  });
};