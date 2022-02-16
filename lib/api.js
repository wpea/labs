const apiAddress = "https://online.wealthparadigm.org/api";

/**
 * Request options.
 */

/**
 * @param {object} raw Request data to JSON.stringify.
 * @param {string} verb GET, PUT, POST, DELETE
 * @returns Request object for api.
 */
var requestOptions = (raw, verb) => {
  return {
    method: verb,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(raw),
    redirect: "follow",
  };
};

var getRequestOptions = {
  method: "GET",
};

var delRequestOptions = {
  method: "DELETE",
};

/**
 * POST methods.
 */

/**
 * @param {object} data Request data to JSON.stringify.
 * @returns Server response.
 */
async function post(data) {
  return fetch(`${apiAddress}/projects`, requestOptions(data, "POST"))
    .then((response) => response.json())
    .then((result) => console.log(result))
    .catch((error) => console.log("error", error));
}

/**
 * @param {object} data Request data to JSON.stringify.
 * @returns Server response.
 */
async function postMilestone(data) {
  return fetch(`${apiAddress}/milestone`, requestOptions(data, "POST"))
    .then((response) => response.json())
    .then((result) => console.log(result))
    .catch((error) => console.log("error", error));
}

/**
 * @param {object} data Request data to JSON.stringify.
 * @returns Server response.
 */
async function postTask(data) {
  return fetch(`${apiAddress}/task`, requestOptions(data, "POST"))
    .then((response) => response.json())
    .then((result) => console.log(result))
    .catch((error) => console.log("error", error));
}

/**
 * @param {string} endpoint API endpoint
 * @param {int} id Object id
 * @param {object} data Request object
 * @returns Server response
 */
async function update(endpoint, id, data) {
  return fetch(`${apiAddress}/${endpoint}/${id}`, requestOptions(data, "PUT"))
    .then((response) => response.json())
    .then((result) => console.log(result))
    .catch((error) => console.log("error", error));
}

/**
 * @param {string} endpoint API endpoint
 * @param {int} id Object id
 * @returns Server response
 */
async function del(endpoint, id) {
  return fetch(`${apiAddress}/${endpoint}/${id}`, delRequestOptions)
    .then((response) => response.json())
    .then((result) => console.log(result))
    .catch((error) => console.log("error", error));
}

/**
 * HTTP Get Methods.
 */

async function get() {
  const res = await fetch(`${apiAddress}/projects`, getRequestOptions);
  return await res.json();
}

async function getMilestones() {
  const res = await fetch(`${apiAddress}/milestone`, getRequestOptions);
  return await res.json();
}

async function getActivity() {
  const res = await fetch(`${apiAddress}/activity`, getRequestOptions);
  return await res.json();
}

async function getTasks() {
  const res = await fetch(`${apiAddress}/task`, getRequestOptions);
  return await res.json();
}

/**
 * Get one item from the server.
 */
async function findMilestone(id) {
  const res = await fetch(`${apiAddress}/milestone/${id}`, getRequestOptions);
  return await res.json();
}

/**
 * @param {int} id
 * @returns {response object}
 */
// async function del(id) {
//   return fetch(`${apiAddress}/projects/${id}`, delRequestOptions)
//     .then((response) => response.json())
//     .then((result) => console.log(result))
//     .catch((error) => console.log("error", error));
// }

export {
  post,
  postMilestone,
  get,
  getMilestones,
  getTasks,
  del,
  update,
  getActivity,
  findMilestone,
  postTask,
};
