# Health Facility Web Application

A feature-rich, offline-capable web application designed for health facility management, enabling efficient patient and caregiver data handling across facilities with role-based permissions. The app is built with a focus on usability, performance, and offline reliability.

---

## Tech Stack

- **Frontend**: React, Tailwind CSS
- **Backend**: Node.js
- **Authentication & User Management**: AWS Amplify
- **Offline Experience**: Service Workers for seamless offline support

---

## Features

### Multi-Language Support
- The application supports **English** and **Spanish**, making it accessible to a broader user base.

### Facility Management
- **Facilities**: Each facility (e.g., Dallas, California) has dedicated caregivers and patients associated with them.
- **Admins** can manage caregivers within their specific facility.

### User Roles

1. **Admin**
   - **Create Caregivers**: Admins can add new caregivers to their facility.
   - **Manage Caregivers**: View existing caregivers and manage permissions within their facility.
   - **Auto-Generated Passwords**: New caregivers are provided passwords in the format `<name>@Caregiver1234`.

2. **Caregiver**
   - **Patient Management**: Caregivers can view and edit patient profiles, add new patients, and update medical history.
   - **Audio Recording and Syncing**: Audio recordings of patient observations are automatically uploaded to a GitHub repository. Full offline support ensures data is saved locally if connectivity is lost, syncing to GitHub when the connection is restored.

---

## Screenshots

| **Feature**                | **Screenshot**                           |
|----------------------------|------------------------------------------|
| Login Screen        | <img width="1440" alt="image" src="https://github.com/user-attachments/assets/0da48e15-3d9a-4369-b3f8-47c0e69c5c0b">       |
| Admin Dashboard   | <img width="1440" alt="image" src="https://github.com/user-attachments/assets/af25833b-52c2-4214-9f29-a1f7e10f12c3">|
| Add Caregiver Form           | <img width="1440" alt="image" src="https://github.com/user-attachments/assets/2487940e-8137-49e5-93ac-d3a08c6d6979"> |
| Caregiver Dashboard   |   <img width="1440" alt="image" src="https://github.com/user-attachments/assets/af629dd4-88e9-47d9-94d8-09a32859f5ce">|
| Patient Form           | <img width="1440" alt="image" src="https://github.com/user-attachments/assets/9b54f3b9-26bf-48ba-afe8-423165a0330c">|
| Multi-Language Support | <img width="209" alt="image" src="https://github.com/user-attachments/assets/ec5569aa-5416-4de2-9ade-b0d14162e14c">|

## Working Demo

Online Experience: https://drive.google.com/file/d/1mSD7NSGXPcfXvTpjFFPqKnA5F4V6DRGC/view?usp=drive_link

Offline SUpport: https://drive.google.com/file/d/1U_GYAzW0ht1xyOQjU3HLnrOVVsTxPotw/view?usp=drive_link

---

## Getting Started

### Prerequisites

Ensure you have the following installed on your machine:

- **Node.js**: ^14.0.0
- **npm**: ^6.0.0

### Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/health-facility-web-app.git
   cd health-facility-web-app
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**:
   - Create a `.env` file in the root directory.
   - Add the following variables:
     ```env
     VITE_GITHUB_TOKEN=your_github_token
     ```

### Running the Application

To start the application locally:

```bash
npm run dev
```

Visit `http://localhost:5173` in your browser to access the application.

---

## Usage

1. **Admin Login**:
   - Upon login, admins can add and view caregivers for their respective facility.
   - Caregiver passwords are auto-generated to streamline the onboarding process.

2. **Caregiver Dashboard**:
   - Allows caregivers to manage patient information, including personal details, medical history, and audio recordings.
   - **Recording Sync**: Any recorded data is automatically uploaded to GitHub, and data is stored locally if the connection is lost, with seamless syncing upon reconnection.

3. **Multi-Language Toggle**:
   - Users can switch between English and Spanish via a language selector in the app header.

---

## Offline Support

The app offers a full offline experience powered by Service Workers. When a network connection is unavailable:
- **Patient Data**: All patient data, including new entries and audio recordings, is stored locally.
- **Automatic Sync**: Once the connection is restored, stored data is automatically synced to GitHub and the central database, ensuring all data is up-to-date.

---

## Folder Structure

```plaintext
health-facility-web-app/
├── src/
│   ├── components/          # Reusable UI components
│   ├── contexts/            # Context providers (e.g., Localization, User)
│   ├── roures/               # Main pages for routing
│   ├── services/            # API service functions
│   ├── indexedDB.js         # IndexedDB setup and functions
│   ├── service-worker.js    # Service worker for offline support
│   └── App.jsx              # Root component
├── public/                  # Static assets and public files
├── .env                     # Environment variables
└── vite.config.js           # Vite configuration file
```
