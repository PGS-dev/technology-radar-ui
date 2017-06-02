
class DataService {
    static URL = 'https://pgslnx232.pgs-soft.com:8090/api/radars';

    getSnapshots(spreadsheetId) {
        const url = `${DataService.URL}/${spreadsheetId}/snapshots`;
        return fetch(url).then(response => response.json())
            .catch(m => console.log(m))
    }

    getBlips(spreadsheetId, snapshotId) {
        const url = `${DataService.URL}/${spreadsheetId}/snapshots/${snapshotId}`;
        return fetch(url)
            .then(response => response.json())
            .catch(m => console.log(m))
    }

    getBlip(spreadsheetId, blipId) {
        const url = `${DataService.URL}/${spreadsheetId}/blips/${blipId}`;
        return fetch(url)
            .then(response => response.json())
            .catch(m => console.log(m))
    }
}

const dataService = new DataService();

export {
    dataService,
}
