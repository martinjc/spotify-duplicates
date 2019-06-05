const api = (function () {

    const encodeParams = params => {
        return Object.entries(params).map(kv => kv.map(encodeURIComponent).join("=")).join("&");
    };

    const decodeParams = param_string => {
        let res = param_string.split("&").reduce((p, kv) => {
            p[decodeURIComponent(kv.split("=")[0])] = decodeURIComponent(kv.split("=")[1]);
            return p;
        }, {});
        return res;
    };

    const make_api_request = (endpoint, params, access_token) => {
        return new Promise((resolve, reject) => {
            let url = endpoint + '?' + api.encodeParams(params);
            fetch(url, {
                headers: {
                    Authorization: "Bearer " + access_token,
                }
            }).then(response => response.json())
                .then(response => resolve(response))
                .catch(error => reject(error));
        });
    }

    return {
        encodeParams: encodeParams,
        decodeParams: decodeParams,
        make_api_request: make_api_request
    };

})();