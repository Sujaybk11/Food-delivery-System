# Security Guidelines

## Environment Variables

**CRITICAL**: Never commit `.env` files to version control!

### Required Environment Variables

1. **Backend (.env)**
   - `MONGO_URL` - MongoDB connection string
   - `JWT_SECRET` - Secret key for JWT tokens (use strong random string)
   - `SALT` - Salt rounds for password hashing
   - `PORT` - Server port number

2. **Frontend (.env)**
   - `VITE_API_URL` - Backend API URL

3. **Admin (.env)**
   - `VITE_API_URL` - Backend API URL

### Security Best Practices

1. **JWT Secret**: Use a strong, random string (minimum 32 characters)
2. **Database**: Use MongoDB Atlas or secure local instance
3. **Passwords**: All passwords are hashed with bcrypt
4. **File Uploads**: Images are validated and stored securely
5. **Admin Access**: Protected with role-based authentication

### Before Deployment

1. Change all default passwords
2. Use environment-specific configuration
3. Enable HTTPS in production
4. Set up proper CORS policies
5. Use secure MongoDB connection strings

### Sensitive Files (Already in .gitignore)

- `.env` files
- `node_modules/`
- `uploads/` (contains user uploaded images)
- Build directories
- Log files

## Reporting Security Issues

If you discover a security vulnerability, please email: security@fooddelivery.com