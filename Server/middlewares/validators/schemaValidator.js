const SchemaChecker = {
      name: {
        notEmpty: true,
        isLength: {
          errorMessage: 'Name is required',
          options: { min: 2, max: 50 }
        }
      },
      email: {
        isEmail: {
          errorMessage: 'Invalid email format'
        },
        normalizeEmail: true
      },
      password: {
        notEmpty: true,
        isLength: {
          errorMessage: 'Password is required and must be at least 8 characters long',
          options: { min: 8 }
        }
      } 
  }
  
  module.exports = SchemaChecker;