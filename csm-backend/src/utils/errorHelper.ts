
export class ErrorHandling {
    getErrorMsg(error: any): string {
      if (error.name === 'ValidationError') {
        return this.handleValidationError(error);
      } else if (error.name === 'CastError') {
        return 'Invalid ID format';
      } else if (error.code === 11000 && error.keyPattern?.userEmail) {
        return 'Email address already exists';
      }else if(error.code === 2){
        return "User with This Name or Email does not Exists"
      } 
      else {
        return error.message;
      }
    }
  
    private handleValidationError(error: any): string {
      let errorMessage = '';
      const errors = Object.values(error.errors);
      errors.forEach((err: any) => {
        errorMessage += err.message + ', ';
      });
      return errorMessage.slice(0, -2);
    }
  }