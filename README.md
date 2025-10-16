Event Management Platform (React + Django REST Framework)
A complete full-stack `Event Management System` built using `React (frontend)` and `Django REST Framework (backend)` with `JWT authentication`, `CSV upload`, and `email notifications using Resend for ticket management`.

Authentication
- User Registration and Login using email and password `JWT (access + refresh tokens)`
- Automatic "token refresh" handled via "Axios interceptor"
- `PrivateRoutes` in React protect user-only pages (events, reports)
- Session state persisted using `Zustand` and `localStorage`

 Event Management
- Create, Update, Delete events
- View all upcoming events (auto-filter past ones)
- Register for events
- View registered attendees for each event(only who created the event)
- Upload event details using `CSV files` (with validation)

CSV Upload
- Upload `.csv` file from frontend
- Headers are strictly validated on backend (`title, description, image, date, location, price, capacity`)
- CSV parsed using React built-in `papaparse` library
- Each valid row automatically creates an Event record in DB
- If any header or field is missing this is not included

Ticket management
- Users can register using `email, phone, and name` 
- Upon registration, a confirmation email with registration ID is sent *(currently configured to send only to `kr119994@gmail.com` for testing)*  
- Future integration planned with `Resend` for full email support 

Tech stack
-Django REST framework(backend)
-React(frontend)
-Zustand(state management)
-Rechart(Graph)
-SQlite(python default)
-Resend(Mail service)
-Papaparse(CSV handling)
-TailwindCSS(styling)

# 1 Create virtual environment
python -m venv venv   
source venv/bin/activate  # mac/linux
venv\Scripts\activate     # windows

# 2️ Install dependencies
pip install -r requirements.txt

# 3 move to backend
 cd backend

# 3 Migrate database
python manage.py migrate

# 4️ Run development server
python manage.py runserver

# 5 move to the frontend
cd frontend
 
# 6 install frontend depedency
npm install

# 7 run frontend server
npm run dev