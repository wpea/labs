const apiAddress = "https://online.wealthparadigm.org/api";

//POST RequestOptions for all queries
var postRequestOptions = (raw) => {
  return {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: raw,
    redirect: "follow",
  };
};

//POST TO SERVER
async function post(data) {
  var raw = JSON.stringify(data);
  return fetch(`${apiAddress}/projects`, postRequestOptions(raw))
    .then((response) => response.json())
    .then((result) => console.log(result))
    .catch((error) => console.log("error", error));
}

async function postMilestone(data) {
  var raw = JSON.stringify(data);
  return fetch(`${apiAddress}/milestone`, postRequestOptions(raw))
    .then((response) => response.json())
    .then((result) => console.log(result))
    .catch((error) => console.log("error", error));
}

async function postTask(data) {
  var raw = JSON.stringify(data);
  return fetch(`${apiAddress}/task`, postRequestOptions(raw))
    .then((response) => response.json())
    .then((result) => console.log(result))
    .catch((error) => console.log("error", error));
}

//GET FROM SERVER
async function get() {
  // var raw = JSON.stringify(data);
  var requestOptions = {
    method: "GET",
  };
  const res = await fetch(`${apiAddress}/projects`, requestOptions);
  return await res.json();
}

async function getMilestones() {
  var requestOptions = {
    method: "GET",
  };
  const res = await fetch(`${apiAddress}/milestone`, requestOptions);
  return await res.json();
}

async function getActivity() {
  var requestOptions = {
    method: "GET",
  };

  const res = await fetch(`${apiAddress}/activity`, requestOptions);
  return await res.json();
}

async function getTasks() {
  var requestOptions = {
    method: "GET",
  };
  const res = await fetch(`${apiAddress}/task`, requestOptions);
  return await res.json();
}

/**
 *
 * FIND ONE FROM SERVER
 *
 */
async function findMilestone(id) {
  // var raw = JSON.stringify(data);
  var requestOptions = {
    method: "GET",
  };
  const res = await fetch(`${apiAddress}/milestone/${id}`, requestOptions);
  return await res.json();
}

/**
 *
 * @param {int} id
 * @returns {response object}
 *
 */
//DEL FROM SERVER
async function del(id) {
  // var raw = JSON.stringify(data);
  var requestOptions = {
    method: "DELETE",
  };
  return fetch(`${apiAddress}/projects/${id}`, requestOptions)
    .then((response) => response.json())
    .then((result) => console.log(result))
    .catch((error) => console.log("error", error));
}

export {
  post,
  postMilestone,
  get,
  getMilestones,
  getTasks,
  del,
  getActivity,
  findMilestone,
  postTask,
};
