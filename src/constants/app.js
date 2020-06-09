// Simple resolver of API url
// Points to the backend address depending on the url

const apiUrlResolver = () => {
  switch (window.location.hostname) {
    case 'localhost':
      return 'http://localhost:4000';
    case '192.168.0.111':
      return 'https://01b0eb1c1bea.ngrok.io/';
    default:
      return 'https://01b0eb1c1bea.ngrok.io/';
  }
};

export const AppConfig = {
  apiUrl: apiUrlResolver(),
};

export const __DEV__ =
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1';
