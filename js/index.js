(function () {

    let client_id = "eb1dc3596b014b8e921d8c6fd84a4eba";
    let MAX_TRACKS = 50;

    db.initdb()
        .then(() => {
            access_token = check_url_for_access_token();
            if (access_token) {
                db.getAllItems()
                    .then(songs => {
                        console.log(songs.length);
                        console.log(songs);
                        songs.sort((a, b) => {
                            if (a.track.name.toUpperCase() < b.track.name.toUpperCase()) {
                                return -1;
                            } else if (a.track.name.toUpperCase() > b.track.name.toUpperCase()) {
                                return 1;
                            } else {
                                return 0;
                            }
                        });
                        console.log(songs);
                        songs.forEach(a => {
                            songs.forEach(b => {
                                if (!(a === b)) {
                                    if ((a.track.name === b.track.name) && (a.track.artists[0].name === b.track.artists[0].name)) {
                                        console.log(a.track, b.track);
                                    }
                                }
                            })
                        })
                    });
                // get_saved_tracks(access_token, { limit: MAX_TRACKS, offset: 0 }, [])
                //     .then(songs => {
                //         console.log(songs);
                //     });
            } else {
                do_spotify_auth();
            }
        })

    function get_saved_tracks(access_token, params, songs) {

        let tracks_endpoint = "https://api.spotify.com/v1/me/tracks";

        return api.make_api_request(tracks_endpoint, params, access_token)
            .then(response => {
                if (!songs) {
                    songs = [];
                }
                response.items.forEach(t => {
                    db.additem(t)
                });
                songs = songs.concat(response.items);
                if (songs.length < response.total) {
                    params.offset += MAX_TRACKS;
                    return get_saved_tracks(access_token, params, songs);
                }
                return songs;
            });
    }

    function check_url_for_access_token() {
        let current_hash = window.location.hash.substr(1);
        if (current_hash) {
            params = api.decodeParams(current_hash);
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

        let get_url = spotify_auth_url + "?" + api.encodeParams(params);

        window.location.replace(get_url);
    }

})();