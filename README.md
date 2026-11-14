# MERN Auth

A basic authentication app built with MongoDB, Express, React, and Node.js. The backend provides registration, login, profile, refresh-token, and logout endpoints. The React frontend provides registration/login forms and displays the authenticated user's profile.

## Project structure

- `backend/` — Express API, MongoDB models, and authentication routes
- `frontend/` — React + TypeScript app built with Vite

## Run locally

### Backend

1. In `backend/`, create a `.env` file with your own MongoDB connection string and secrets:

   ```env
   PORT=8000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_access_token_secret
   REFRESH_SECRET=your_refresh_token_secret
   ```

2. Install dependencies and start the API:

   ```sh
   cd backend
   npm install
   npm run dev
   ```

The API starts on port `8000` and connects to MongoDB before listening.

### Frontend

In another terminal:

```sh
cd frontend
npm install
npm run dev
```

Open the Vite URL shown in the terminal (typically `http://localhost:5173`). The frontend currently calls the API at `http://localhost:8000/api/auth`; the backend CORS configuration allows that local frontend origin.

## Authentication flow

1. **Register** sends a name, email, and password to `POST /api/auth/register`. The backend hashes the password before saving the user.
2. **Login** sends an email and password to `POST /api/auth/login`. When credentials are valid, the backend sets HTTP-only access and refresh token cookies.
3. **Profile** calls `GET /api/auth/profile`. The access-token middleware verifies the access cookie before returning the user's profile.
4. **Refresh** calls `POST /api/auth/refresh` to rotate a valid refresh token and issue new cookies.
5. **Logout** calls `POST /api/auth/logout`, revokes the refresh token, and clears the cookies.

The frontend requests the profile when the app loads, so an existing session can be restored after a page reload.

## API endpoints

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/api/auth/register` | Create an account |
| `POST` | `/api/auth/login` | Authenticate and set token cookies |
| `GET` | `/api/auth/profile` | Return the authenticated user's profile |
| `POST` | `/api/auth/refresh` | Rotate authentication tokens |
| `POST` | `/api/auth/logout` | Revoke refresh token and clear cookies |

Keep `.env` credentials private. For deployment, use strong, distinct secrets, HTTPS, and environment-specific CORS and cookie settings.