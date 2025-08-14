const createRequest = (options = {}) => {
    const xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    let requestData = new FormData();
    let url = options.url;

    if (options.method === 'GET' && options.data) {
        const queryParams = new URLSearchParams();
        for (const key in options.data) {
            queryParams.append(key, options.data[key]);
        }
        url += '?' + queryParams.toString();
    }
    else if (options.data) {
        for (const key in options.data) {
            requestData.append(key, options.data[key]);
        }
    }
    xhr.open(options.method, url);

    xhr.onload = function () {
        if (xhr.status === 200 && xhr.status < 300) {
            options.callback(null, xhr.response);
        } else {
            options.callback(new Error('Request failed with status ${xhr.status}'), null)
        }
    };
    xhr.onerror = function () {
        options.callback(new Error('Network error'), null);
    };
    try {
        xhr.send(requestData);
    } catch (err) {
        options.callback(err, null);
    }
};
