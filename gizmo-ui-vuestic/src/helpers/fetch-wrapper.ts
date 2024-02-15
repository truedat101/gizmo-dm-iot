// @ts-expect-error TS(2307): Cannot find module '@/stores' or its corresponding... Remove this comment to see the full error message
// import { useAuthStore } from '@/stores';
import useAuthStore from '../stores';
export const fetchWrapper = {
    get: request('GET'),
    post: request('POST'),
    put: request('PUT'),
    delete: request('DELETE')
};

function request(method: any) {
    return (url: any, body: any) => {
        const requestOptions = {
            method,
            headers: authHeader(url)
        };
        if (body) {
            // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
            requestOptions.headers['Content-Type'] = 'application/json';
            // @ts-expect-error TS(2339): Property 'body' does not exist on type '{ method: ... Remove this comment to see the full error message
            requestOptions.body = JSON.stringify(body);
        }
        // @ts-expect-error TS(2345): Argument of type '{ method: any; headers: { Author... Remove this comment to see the full error message
        return fetch(url, requestOptions).then(handleResponse);
    };
}

// helper functions

function authHeader(url: any) {
    // return auth header with jwt if user is logged in and request is to the api url
    const { user } = useAuthStore();
    const isLoggedIn = !!user?.token;
    // @ts-expect-error TS(1343): The 'import.meta' meta-property is only allowed wh... Remove this comment to see the full error message
    const isApiUrl = url.startsWith(import.meta.env.VITE_API_URL);
    if (isLoggedIn && isApiUrl) {
        return { Authorization: `Bearer ${user.token}` };
    } else {
        return {};
    }
}

function handleResponse(response: any) {
    return response.text().then((text: any) => {
        const data = text && JSON.parse(text);
        
        if (!response.ok) {
            const { user, logout } = useAuthStore();
            if ([401, 403].includes(response.status) && user) {
                // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
                logout();
            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }

        return data;
    });
}    
