import Properties from '../../properties'

class DataService {
    getSnapshots(spreadsheetId) {
        const url = `${Properties.BACKEND_URL}/${spreadsheetId}/snapshots`;
        return fetch(url).then(response => response.json())
            .catch(m => console.log(m))
    }

    getBlips(spreadsheetId, snapshotId) {
        const url = `${Properties.BACKEND_URL}/${spreadsheetId}/snapshots/${snapshotId}`;
        return fetch(url)
            .then(response => response.json())
            .catch(m => console.log(m))
    }

    getRadars() {
        return fetch(`${process.env.PUBLIC_URL}/radars.json`)
        .then(response => response.json())
        .catch(m => console.log(m))
    }

    getBlip(spreadsheetId, blipId) {
        const url = `${Properties.BACKEND_URL}/${spreadsheetId}/blips/${blipId}`;
        return fetch(url)
            .then(response => response.json())
            .catch(m => console.log(m))
    }
}

const dataService = new DataService();

export {
    dataService,
}
