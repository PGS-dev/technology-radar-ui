
class DataService {
    static URL = 'https://pgslnx232.pgs-soft.com:8090/api/radars';

    getSnapshots(spreadsheetId) {
        const url = `${DataService.URL}/${spreadsheetId}/snapshots`;
        return fetch(url).then(response => response.json())
            .catch(m => console.log(m))
    }

    getBlips(spreadsheetId, snapshot) {
        const url = `${DataService.URL}/${spreadsheetId}/snapshots/${snapshot}`;
        return fetch(url)
            .then(response => response.json())
            .catch(m => console.log(m))
    }
}

const dataService = new DataService();

export {
    dataService,
}
