const db = (function () {

    var db;

    const initdb = () => {

        return new Promise((resolve, reject) => {
            let openRequest = indexedDB.open('spotify-duplicates.db', 1);

            openRequest.onupgradeneeded = event => {
                db = event.target.result;
                if (!db.objectStoreNames.contains('songs')) {
                    let storeOS = db.createObjectStore('songs', { keyPath: 'track.id', autoIncrement: true });
                }
            };
            openRequest.onsuccess = event => {
                db = event.target.result;
                resolve(db);
            }
            openRequest.onerror = event => {
                reject();
            }
        });
    }

    const getAllItems = () => {
        return new Promise((resolve, reject) => {
            let transaction = db.transaction(['songs'], 'readonly');
            let store = transaction.objectStore('songs');
            let request = store.getAll();
            request.onsuccess = event => {
                resolve(request.result);
            }
            request.onerror = event => {
                reject(event);
            }
        });
    }

    const addItem = (item) => {
        return new Promise((resolve, reject) => {
            if (db) {
                let transaction = db.transaction(['songs'], 'readwrite');
                let store = transaction.objectStore('songs');
                let request = store.put(item);
                request.onerror = event => {
                    reject(event);
                }
                request.onsuccess = event => {
                    resolve(event);
                }
            }
            else {
                reject();
            }
        });
    }

    return {
        initdb: initdb,
        addItem: addItem,
        getAllItems: getAllItems,
    }

})();