(function () {

    let client_id = "eb1dc3596b014b8e921d8c6fd84a4eba";

    const encodeParams = params => {
        return Object.entries(params).map(kv => kv.map(encodeURIComponent).join("=")).join("&");
    }

    const decodeParams = param_string => {
        let res = param_string.split("&").reduce((p, kv) => {
            p[decodeURIComponent(kv.split("=")[0])] = decodeURIComponent(kv.split("=")[1]);
            return p;
        }, {});
        return res;
    }

    function make_api_request(endpoint, params, access_token) {
        return new Promise((resolve, reject) => {
            let url = endpoint + '?' + encodeParams(params);
            fetch(url, {
                headers: {
                    Authorization: "Bearer " + access_token,
                }
            }).then(response => response.json())
                .then(response => resolve(response))
                .catch(error => reject(error));
        });
    }

    function get_saved_tracks(access_token, songs) {
        return new Promise((resolve, reject) => {
            let params = {
                limit: 50,
                offset = 0,
            }

            let tracks_endpoint = "https://api.spotify.com/v1/me/tracks";

            make_api_request(tracks_endpoint, params, access_token)
                .then(response => {
                    songs = [...songs, ...response.items];
                    let total = response.total;
                    if (next) [
                        // do the thing
                    ]
                    while (count <= total) {
                        params.offset += 50;
                        make_api_request(tracks_endpoint, params, access_token)
                            .then(response => {
                                songs = [...songs, ...response.items];
                            });
                    }
                });
                
        });



    }



    function check_url_for_access_token() {
        let current_hash = window.location.hash.substr(1);
        if (current_hash) {
            params = decodeParams(current_hash);
            if (params.access_token) {
                return params.access_token;
            }
        }
        return undefined;
    }

    function do_spotify_auth() {

        let spotify_auth_url = "https://accounts.spotify.com/authorize";

        params = {
            client_id: client_id,
            response_type: "token",
            redirect_uri: "http://127.0.0.1:8000/",
            scope: "user-library-modify user-library-read",
            show_dialog: "true"
        }

        let get_url = spotify_auth_url + "?" + encodeParams(params);

        window.location.replace(get_url);
    }
    access_token = check_url_for_access_token();
    if (access_token) {
        get_saved_tracks(access_token);
    } else {
        do_spotify_auth();
    }

})();