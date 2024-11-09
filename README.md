## User Stories

### Authentication

1. **Login**: As a user (Admin or Caregiver), I want to log in with my credentials to access my respective dashboard.
2. **Logout**: As a user, I want to securely log out of the application.

---

### Admin Role

1. **Manage Caregivers**
    - **View Caregivers**: As an Admin, I want to see a list of all caregivers associated with the clinical trial.
    - **Add Caregiver**: As an Admin, I want to add a new caregiver to the trial by filling out a form with their **name, specialty, contact email, and photo**.
2. **Manage Participants (Patients)**
    - **View Participants**: As an Admin, I want to view a list of all participants (patients) associated with the clinical trial.
    - **Add Participant**: As an Admin, I want to add a new participant to the trial with **basic information (first name, last name)**, assign them to a caregiver, and track their trial phase.
3. **View and Track Clinical Data**
    - As an Admin, I want to access each participant’s profile to see their details and recorded session data for oversight and compliance.

---

### Caregiver Role

1. **View Assigned Participants**
    - As a Caregiver, I want to see a list of all my assigned participants, showing only basic details like **first and last name**.
2. **Record Session Audio**
    - **Start and Stop Recording**: As a Caregiver, I want to record audio observations for each participant’s session with simple **Start and Stop buttons**.
    - **Offline Mode**: If offline, I want to continue recording and have the data sync automatically once online.
    - **Upload to GitHub**: After stopping the recording, the file should automatically upload to GitHub, and the link should be saved in the participant's record.
3. **View Participant Profile**
    - As a Caregiver, I want to view each participant’s profile, including their basic details and access to previous session recordings.