# HR Employee Uploader

A Node.js + Express API boilerplate with MVC architecture for HR file uploads and employee management.

## Project Structure

```
hr-drive-uploader/
├── Controllers/          # Controller logic
│   └── EmployeeController.js
├── Middleware/           # Custom middlewares
│   └── AuthMiddleware.js
├── Routes/              # API route definitions
│   └── EmployeeRoutes.js
├── Model/               # Sequelize models
│   └── model.js
├── Utils/               # Utility files
│   ├── All_Models.js    # Model registration
│   ├── All_Routes.js    # Route registration
│   └── dbConnection.js  # Database connection
├── app.js               # Main entry point
├── package.json
└── .env                 # Environment variables
```

## Setup

1. Install dependencies:
```bash
pnpm install
```

2. Configure environment variables in `.env`:
```
PORT=3000
NODE_ENV=development
DB_STORAGE=./database.sqlite
```

3. Start the server:
```bash
pnpm start
```

For development with auto-reload:
```bash
pnpm dev
```

## API Endpoints

### Health Check
- `GET /health` - Server health check

### Employees
- `GET /employees` - Get all employees
- `GET /employees/:id` - Get employee by ID
- `POST /employees` - Create new employee
- `POST /employees/upload` - Upload file for employee (multipart/form-data with 'file' field)

## Technologies

- **Express.js** - Web framework
- **Sequelize** - ORM for database operations
- **SQLite** - Database (for demo)
- **express-fileupload** - File upload handling
- **dotenv** - Environment configuration

## Notes

- Database models are automatically synchronized on startup
- All routes are registered through `Utils/All_Routes.js`
- All models are registered through `Utils/All_Models.js`

