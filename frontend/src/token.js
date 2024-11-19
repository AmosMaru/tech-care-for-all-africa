export const ACCESS_TOKEN = 'access';
export const REFRESH_TOKEN = 'refresh';
export const GOOGLE_ACCESS_TOKEN = 'google_access_token';


export const config = {
    BACKEND_URL: import.meta.env.VITE_BACKEND_URL,
}

console.log("Config: ", config);
// Check all available env variables
console.log("All env variables:", import.meta.env);