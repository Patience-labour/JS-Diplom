const createRequest = (options = {}) => {
    if (!options.url || !options.method) {
        console.error('URL and method are required');
        return;
    }

    const xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.withCredentials = true;

    let url = options.url;
    let requestData = null;

    if (options.method === 'GET' && options.data) {
        const params = new URLSearchParams();
        for (const key in options.data) {
            if (options.data.hasOwnProperty(key)) {
                params.append(key, options.data[key]);
            }
        }
        url += '?' + params.toString();
    } 
    else if (options.data) {
        requestData = new FormData();
        for (const key in options.data) {
            if (options.data.hasOwnProperty(key)) {
                requestData.append(key, options.data[key]);
            }
        }
    }

    xhr.addEventListener('load', () => {
        if (typeof options.callback === 'function') {
            if (xhr.status >= 200 && xhr.status < 300) {
                options.callback(null, xhr.response);
            } else {
                options.callback(new Error(`Request failed with status ${xhr.status}`), null);
            }
        }
    });

    xhr.addEventListener('error', () => {
        if (typeof options.callback === 'function') {
            options.callback(new Error('Network error'), null);
        }
    });

    xhr.addEventListener('timeout', () => {
        if (typeof options.callback === 'function') {
            options.callback(new Error('Request timeout'), null);
        }
    });

    try {
        xhr.open(options.method, url);
        xhr.send(requestData);
    } catch (error) {
        if (typeof options.callback === 'function') {
            options.callback(error, null);
        }
    }
};