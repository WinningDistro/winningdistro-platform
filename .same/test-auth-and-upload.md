# WinningDistro Platform - Authentication & Music Upload Testing

## 🔐 Authentication System Testing

### User Registration Flow
The platform provides a complete user registration system with the following features:

#### Registration Form Fields:
- Email (with validation)
- Password (minimum 8 characters)
- First Name
- Last Name
- Artist Name
- Phone (optional)
- Country
- Date of Birth (optional)

#### Backend Validation:
- Email format validation (regex pattern)
- Password strength requirements
- Duplicate email checking
- Data sanitization

#### Registration Process:
1. User fills out registration form at `/join`
2. Form validation occurs client-side with Zod schema
3. Data sent to `/api/auth/register` endpoint
4. Backend validates and hashes password with bcryptjs
5. User record created in SQLite database
6. JWT token generated and returned
7. User automatically logged in and redirected to dashboard

### Login Flow
The login system includes:

#### Login Form Features:
- Email/password authentication
- Show/hide password toggle
- Form validation with real-time feedback
- Loading states during authentication
- Error handling with toast notifications

#### Authentication Process:
1. User enters credentials at `/login`
2. Client-side validation with Zod schema
3. Credentials sent to `/api/auth/login`
4. Backend verifies password against hashed version
5. JWT token generated if successful
6. Token stored in localStorage
7. User data cached locally
8. Redirect to dashboard on success

### Authentication Context
The `AuthContext` provides:
- User state management
- Loading states
- Authentication status
- Login/logout functions
- Error handling
- Session restoration from localStorage

## 🎵 Music Upload System Testing

### Upload Component Features
The `MusicUpload` component provides a comprehensive upload experience:

#### File Upload:
- Drag & drop interface using react-dropzone
- File type validation (audio files only)
- Multiple file support
- Progress tracking
- File preview with metadata

#### Upload Form Fields:
- Track Title (required)
- Artist Name (required)
- Album (optional)
- Genre (required)
- Release Type (single/EP/album)
- Release Date (required)
- Description (optional)
- Tags (optional)
- Explicit content flag
- Primary artist flag

#### Metadata Extraction:
- Automatic metadata extraction from uploaded files
- Support for common audio formats
- Duration detection
- File size validation

### Upload Process:
1. User selects/drops audio files
2. Files validated for type and size
3. Metadata automatically extracted
4. User fills in required information
5. Form validation with Zod schema
6. Files uploaded with progress tracking
7. Metadata sent to `/api/music/upload`
8. Database records created
9. Success notification and dashboard update

## 🧪 Test Scenarios

### Authentication Tests:

#### Successful Registration:
```json
{
  "email": "testartist@example.com",
  "password": "SecurePass123",
  "firstName": "Test",
  "lastName": "Artist",
  "artistName": "Test Artist",
  "country": "US"
}
```

#### Successful Login:
```json
{
  "email": "testartist@example.com",
  "password": "SecurePass123"
}
```

#### Error Cases:
- Invalid email format
- Password too short
- Missing required fields
- Duplicate email registration
- Wrong password on login

### Music Upload Tests:

#### Successful Upload Metadata:
```json
{
  "title": "Test Track",
  "artist": "Test Artist",
  "album": "Test Album",
  "genre": "Hip Hop",
  "releaseType": "single",
  "releaseDate": "2025-01-01",
  "description": "A test track for demonstration",
  "tags": "test, demo, hip-hop"
}
```

#### File Types Supported:
- MP3
- WAV
- FLAC
- M4A
- AAC

## 🔍 Testing Instructions

### Manual Testing Steps:

1. **Test Registration:**
   - Navigate to `/join`
   - Fill out registration form
   - Submit and verify success
   - Check database for new user record

2. **Test Login:**
   - Navigate to `/login`
   - Enter test credentials
   - Verify successful authentication
   - Check dashboard access

3. **Test Music Upload:**
   - Login to dashboard
   - Navigate to upload section
   - Drag/drop audio file
   - Fill in metadata form
   - Submit upload
   - Verify file processing

4. **Test Authentication Persistence:**
   - Login successfully
   - Refresh browser
   - Verify user remains logged in
   - Test logout functionality

### API Endpoints for Testing:

#### Authentication:
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

#### Music Upload:
- `POST /api/music/upload` - Upload music file
- `GET /api/music/tracks` - Get user tracks
- `PUT /api/music/tracks/:id` - Update track
- `DELETE /api/music/tracks/:id` - Delete track

## ✅ Expected Results

### Successful Authentication:
- JWT token received and stored
- User data cached in localStorage
- Redirect to dashboard
- Navigation updated with user info
- Logout option available

### Successful Upload:
- File progress tracking works
- Metadata extracted automatically
- Form validation prevents invalid submissions
- Upload completes successfully
- New track appears in dashboard
- Database record created with proper relationships

## 🚨 Error Handling

The system handles various error scenarios:
- Network connectivity issues
- Invalid file formats
- Server validation errors
- Authentication failures
- Upload interruptions
- Database connection issues

All errors are displayed to users via toast notifications with helpful messages.
