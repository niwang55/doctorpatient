# doctorpatient

## Summary
This application for an doctor/patient information system was built using React and Node. A people.json file was used as the database, and when new information needed to be written to it `fs` was used. User accounts were hard coded, and users are redirected to different pages based on if they are a doctor or a patient. Routes are protected, if an unauthorized user tries to go to any of the restricted paths they are redirected to the login page.

## Accounts for testing
1. Doctors
..1. Username: doctor1, Password: doctor1
..2. Username: doctor2, Password: doctor2
..3. Username: patient1, Password: patient1
..4. Username: patient2, Password: patient2
..5. Username: patient3, Password: patient3

## Libraries used:
1. Axios
..* Used for all requests to the server, chosen because of the promise based nature of the requests
2. React Router
..* Used for routing and simple organization of the different components
3. React Datetime
..* Used for date and time selection for making appointments
4. Dropzone
..* Used for uploading of files
5. Node fs
..* Used for reading and writing to the file system


## Motivation

A short description of the motivation behind the creation and maintenance of the project. This should explain **why** the project exists.

## Requirements/Installation
1. Webpack
2. Nodemon
