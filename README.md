# doctorpatient

## Summary
This application for an doctor/patient information system was built using React and Node. A people.json file was used as the database, and when new information needed to be written to it `fs` was used. User accounts were hard coded, and users are redirected to different pages based on if they are a doctor or a patient. Routes are protected, if an unauthorized user tries to go to any of the restricted paths they are redirected to the login page.

## Choices
### Database
Instead of a traditional database such as mySQL, a JSON file was used along with the `fs` package to read and write to it. The JSON file was an array of 'User' objects, with their name, login information, and details for the keys. This was used so data could be stored on the local file system and because of the small scale of the application.

### Authentication
User accounts are hard coded, and when a user logs in, the password is checked against the username, and then the server checks a field in the user's object and sees if a user is a doctor or not. The onEnter hooks feature of React Router was used to redirect people if they were not authenticated. If a user was a patient and tried to access a route that was only for doctors, they would also be redirected.

### Appointments
Both doctors and patients have the ability to make appointments, and a calendar library was used for users to pick a date. When a patient makes an appointment, they choose the doctor they want to make the appointment with, and they must enter a date and a purpose for their appointment. If those fields are not filled out, the application alerts them.

### Attachments
`fs` was used for uploading of files. When a user uploads a file, it is saved to the server/files folder, and a user can choose to download the file.

### Routes
All client side routes are managed with React Router, and all server side routes are prefaced with `/api/`.

### Rendering
The application follows a pattern of posting information to the JSON database, then doing another get request and then calling `setState` to rerender the updated elements.

### Styling
Flexbox and SASS were used for styling, for ease of positioning and more intuitive CSS syntax.

## Accounts for testing
1. Username: doctor1, Password: doctor1
2. Username: doctor2, Password: doctor2
3. Username: patient1, Password: patient1
4. Username: patient2, Password: patient2
5. Username: patient3, Password: patient3

## Libraries used:
1. Axios
    * Used for all requests to the server, chosen because of the promise based nature of the requests
2. React Router
    * Used for routing and simple organization of the different components
3. React Datetime
    * Used for date and time selection for making appointments
4. React Dropzone
    * Used for uploading of files
5. Node fs
    * Used for reading and writing to the file system

## Requirements/Installation
1. Webpack
2. Nodemon

To run the app:
  In the terminal:
  1. npm install
  2. webpack
  3. npm start
  Then go to localhost:3000 in the browser
