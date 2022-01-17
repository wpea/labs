
// var myHeaders = new Headers();
// myHeaders.append("Accept", "application/json");

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
    return fetch("http://127.0.0.1:8000/api/projects", requestOptions)
        .then(response => response.json())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
}

// async function get(setProjects) {
//     // var raw = JSON.stringify(data);
//     var requestOptions = {
//         method: 'GET',
//     };
//     return fetch("http://127.0.0.1:8000/api/projects", requestOptions)
//         .then(response => response.json())
//         .then(result => setProjects(result))
//         .catch(error => console.log('error', error));
// }

async function get() {
    // var raw = JSON.stringify(data);
    var requestOptions = {
        method: 'GET',
    };

    const res = await fetch("http://127.0.0.1:8000/api/projects", requestOptions)
    return await res.json()
}

async function del(id) {
    // var raw = JSON.stringify(data);
    var requestOptions = {
        method: 'DELETE',
    };
    return fetch(`http://127.0.0.1:8000/api/projects/${id}`, requestOptions)
        .then(response => response.json())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
}

async function getActivity() {
    // var raw = JSON.stringify(data);
    var requestOptions = {
        method: 'GET',
    };

    const res = await fetch("http://127.0.0.1:8000/api/activity", requestOptions)
    return await res.json()
}



export { post, get, del, getActivity }