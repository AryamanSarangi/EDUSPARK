🎓 EduSpark LMS

EduSpark is a full-stack Learning Management System (LMS) built using the MERN stack that enables instructors to create courses and students to enroll, learn, and track their progress.

This project demonstrates a real-world e-learning platform with secure authentication, media uploads, and course completion tracking.

🚀 Live Features
👩‍🏫 Instructor

Create & manage courses

Upload lecture videos & course thumbnails

Edit course curriculum

Delete lectures

View enrolled students

👨‍🎓 Student

Browse available courses

Simulated payment & purchase flow

Watch lecture videos

Track course progress

Resume playback

Download certificate after completion (if implemented)

Course reviews & ratings (optional)

🔐 Security & Authentication

JWT-based authentication

Role-based access (Instructor / Student)

Password hashing using bcrypt

Protected API routes

📂 Media Handling

Upload videos & images using Multer

Local media storage

Lecture streaming support

📊 Learning & Progress Tracking

Track lecture completion

Course progress monitoring

Resume learning functionality

🏗️ System Architecture

EduSpark follows a three-tier architecture:

🖥️ Frontend

React.js (Vite)

Tailwind CSS

Context API for state management

⚙️ Backend

Node.js

Express.js

RESTful APIs

JWT middleware

Multer for file uploads

🗄️ Database

MongoDB with Mongoose

💾 Media Storage

Local storage (/uploads directory)

🔄 Workflow

1️⃣ User registers & logs in.
2️⃣ Instructor creates courses & uploads lectures.
3️⃣ Student browses available courses.
4️⃣ Student purchases/enrolls in a course.
5️⃣ Student watches lectures & progress is tracked.
6️⃣ Certificate generated after completion.

🛠️ Tech Stack

Frontend

React.js

Vite

Tailwind CSS

Backend

Node.js

Express.js

Database

MongoDB + Mongoose

Authentication

JWT

bcrypt

File Upload

Multer

PDF Generation

PDFKit (for certificates)

📦 Installation & Setup
1️⃣ Clone Repository
git clone https://github.com/AryamanSarangi/EDUSPARK.git
cd eduspark
2️⃣ Backend Setup
cd server
npm install

Create .env file inside server:

PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key

Start backend:

npm run dev
3️⃣ Frontend Setup
cd client
npm install
npm run dev

Frontend runs on:

http://localhost:5173

Backend runs on:

http://localhost:5000
📁 Project Structure
eduspark/
│
├── client/          # React frontend
├── server/
│   ├── controllers
│   ├── routes
│   ├── models
│   ├── middleware
│   ├── uploads/     # stored media
│   └── server.js

🔐 Security Measures

JWT authentication

Role-based authorization

Password encryption

Protected routes

🎯 Future Enhancements

Payment gateway integration

AI course recommendations

Live classes (WebRTC)

Mobile app version

Cloud deployment

Multilingual support

🧠 Learning Outcomes

This project demonstrates:

✔ Full-stack development
✔ REST API design
✔ Authentication & security
✔ Media handling & streaming
✔ Real-world LMS workflow

👨‍💻 Authors

Aryaman Sarangi
📧 sarangiaryaman@gmail.com


📜 License

This project is for educational and academic purposes.
