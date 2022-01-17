const apiAddress = 'https://online.wealthparadigm.org/api';

async function post(data) {
    var raw = JSON.stringify(data);
    var requestOptions = {
        method: 'POST',
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: raw,
        redirect: 'follow'
    };
    return fetch(`${apiAddress}/projects`, requestOptions)
        .then(response => response.json())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
}

async function get() {
    // var raw = JSON.stringify(data);
    var requestOptions = {
        method: 'GET',
    };

    const res = await fetch(`${apiAddress}/projects`, requestOptions)
    return await res.json()
}

async function del(id) {
    // var raw = JSON.stringify(data);
    var requestOptions = {
        method: 'DELETE',
    };
    return fetch(`${apiAddress}/projects/${id}`, requestOptions)
        .then(response => response.json())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
}

async function getActivity() {
    // var raw = JSON.stringify(data);
    var requestOptions = {
        method: 'GET',
    };

    const res = await fetch(`${apiAddress}/activity`, requestOptions)
    return await res.json()
}

export { post, get, del, getActivity }