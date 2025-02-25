// logService.js
import axios from 'axios';

// Utility for logging user actions
// gather data that can be gathered in frontend then send to backend server for logging
const logUserAction = async (action, accessedEndpoint, additionalInfo = {}) => {
  const log = {
    timestamp: new Date().toISOString(),
    action: action,
    accessed_endpoint: accessedEndpoint,
    user_agent: navigator.userAgent,
    additional_info: additionalInfo,
  };

  // Send log to server
  try {
    // await axios.post('/api/logs', log);
    console.log('User action logged:', log);
  } catch (error) {
    console.error('Error logging user action:', error);
  }
};

export default logUserAction;
