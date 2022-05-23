import axios from 'axios';

function commonHeaders() {
    return {
        'Content-Type': 'application/json',
        Accept: 'application/json'
    }
}

function authHeaders(accessToken) {
    if(accessToken) {
        return {
            Authorization: `Bearer ${accessToken}`
        }
    } else {
        return {};
    }
}

function handleResponse(...rest) {
    const [
        resolve,
        reject,
        method,
        url,
        error,
        response,
        responseBody,
        requestBody,
        headers,
    ] = rest;

    /* Add logic for error handling here and reject
        your promise. Can add logger here to keep track of all
        API calls successes and failures
     */

    resolve(responseBody);
}

const GetAxiosClient = (function () {
    let instance;

    function createInstance() {
        const axiosClient = axios.create({
            // Add timeout for axios request here
            timeout: 'DEFAULT_TIMEOUT'
        });
        return axiosClient;
    }

    return {
        getInstance: () => {
            if (!instance) {
                instance = createInstance()
            }
            return instance;
        }
    };
})();

const httpWrapper = (config, cbfn) => {
    const {
        url,
        method,
        /* BaseUrl will be prepended to url */
        baseUrl,
        headers,
        /* params are the url query parameters */
        params,
        /* data is the request body */
        data,
        timeout
    } = config;

    const axiosClient = GetAxiosClient.getInstance();
    axiosClient({
        url,
        method,
        baseUrl,
        headers,
        params,
        data,
        timeout,
        responseType: 'json',
    }).then((response) => {
        const {
            status,
            data: responseData,
            headers: responseHeaders
        } = response;
        cbfn(undefined, {
            statusCode: status,
        }, responseData, responseHeaders);
    }).catch((error) => {
        /* Add error handler here */
    });
};

function httpGet(url, accessToken, queryParams, extraHeaders = {}) {
    return new Promise((resolve, reject) => {
        const headers = Object.assign(commonHeaders(), authHeaders(accessToken), extraHeaders);
        httpWrapper({
            url,
            method: 'GET',
            params: queryParams
        }, (error, response, body) => {
            handleResponse(resolve, reject, 'GET', url, error, response, body, { queryParams }, headers);
        })
    })
}

function httpPost(url, accessToken, data, extraHeaders = {}, skipRetry = false) {
    return new Promise((resolve, reject) => {
        const headers = Object.assign(commonHeaders(), authHeaders(accessToken), extraHeaders);
        httpWrapper({
            url,
            method: 'POST',
            headers,
            retryTimes: skipRetry && 1,
            data
        }, (error, response, body) => {
            handleResponse(resolve, reject, 'POST', url, error, response, body, data, headers);
        });
    });
}

function httpPut(url, accessToken, data, extraHeaders = {}) {
    return new Promise((resolve, reject) => {
        const headers = Object.assign(commonHeaders(), authHeaders(accessToken), extraHeaders);
        httpWrapper({
            url,
            method: 'PUT',
            headers,
            data
        }, (error, response, body) => {
            handleResponse(resolve, reject, 'PUT', url, error, response, body, data, headers);
        });
    });
}

module.exports = {
    GetAxiosClient,
    httpGet,
    httpPost,
    httpPut
};
