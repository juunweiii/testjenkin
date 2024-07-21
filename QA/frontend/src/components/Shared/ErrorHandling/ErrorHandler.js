const GENERIC_ERROR_MESSAGE = 'An unexpected error occurred. Please try again later.';

const generateErrorMessage = (action) => `Failed to ${action}. Please try again later.`;

export const handleApiError = (error, action, showAlert) => {
  let userMessage = generateErrorMessage(action) || GENERIC_ERROR_MESSAGE;
  let variant = 'danger';

  if (process.env.NODE_ENV !== 'production') {
    if (error.response) {
      console.error(`Error ${action}:`, error.response.data);
    } else if (error.request) {
      console.error(`No response received during ${action}:`, error.request);
    } else {
      console.error(`Error setting up request for ${action}:`, error.message);
    }
  }

  if (action === 'create topic' && error.response.status === 422) {
    userMessage = 'Topic already exists';
    variant = 'warning';  // Set variant to 'warning' for specific 422 error
  }

  showAlert(userMessage, variant);
};
