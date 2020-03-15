// Simple resolver of API url
// Points to the backend address depending on the url

const apiUrlResolver = () => {
    switch (window.location.hostname) {
      case "localhost":
        return "http://localhost:4000";
      case "127.0.0.1":
        return "http://127.0.0.1:4000";
      default:
        return "http://localhost:4000";
    }
  };  
  
  export const AppConfig = {
    apiUrl: apiUrlResolver(),
  };
  
  export const __DEV__ =
    window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";