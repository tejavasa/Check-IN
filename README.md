# Check-IN Portal

An Angular-based attendance check-in portal with multiple authentication methods.

## Features

- **Multiple Check-in Methods**
  - QR Code scanning (with camera integration)
  - RFID card reading
  - Manual student ID entry

- **Multi-step Flow**
  - User login
  - Level selection (Beginner/Explore)
  - Check-in method selection
  - Class selection
  - Success confirmation

- **Demo Mode**
  - Mock data for testing without backend
  - Easy switching to production API

## Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- Angular CLI (v17)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Surya07091997/Check-IN.git
   cd Check-IN
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm start
   ```

4. Open your browser to `http://localhost:4200`

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   └── checkin-portal/       # Main check-in component
│   ├── models/
│   │   └── attendance.models.ts  # Data models
│   ├── services/
│   │   └── attendance.service.ts # API service with mock data
│   ├── app.component.*
│   └── app.module.ts
├── assets/                        # Static assets
├── styles.scss                    # Global styles
└── index.html
```

## Configuration

### Switching to Production API

Edit `src/app/services/attendance.service.ts`:

1. Update the `apiUrl` with your backend URL
2. Uncomment the production API calls
3. Comment out the mock data returns

## Development

```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test
```

## Technologies

- Angular 17
- TypeScript
- RxJS
- SCSS
- HTML5 Camera API

## License

MIT
