const apiAddress = process.env.NEXT_PUBLIC_HOSTNAME;

/**
 * Request options.
 */

/**
 * @param {object} raw Request data to JSON.stringify.
 * @param {string} verb GET, PUT, POST, DELETE
 * @returns Request object for api.
 */
var requestOptions = (raw, verb, token) => {
  return {
    method: verb,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(raw),
    redirect: "follow",
  };
};

// var getRequestOptions = {
//   method: "GET",
// };

const getRequestOption = (token) => {
  return {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
};

// var delRequestOptions = {
//   method: "DELETE",

// };

const delRequestOptions = (token) => {
  return {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
};

/**
 * POST methods.
 */

/**
 * @param {object} data Request data to JSON.stringify.
 * @returns Server response.
 */
async function post(data, token) {
  return fetch(`${apiAddress}/projects`, requestOptions(data, "POST", token))
    .then((response) => response.json())
    .then((result) => console.log(result))
    .catch((error) => console.log("error", error));
}

/**
 * @param {object} data Request data to JSON.stringify.
 * @returns Server response.
 */
async function postMilestone(data, token) {
  return fetch(`${apiAddress}/milestone`, requestOptions(data, "POST", token))
    .then((response) => response.json())
    .then((result) => console.log(result))
    .catch((error) => console.log("error", error));
}

/**
 * @param {object} data Request data to JSON.stringify.
 * @returns Server response.
 */
async function postTask(data, token) {
  return fetch(`${apiAddress}/task`, requestOptions(data, "POST", token))
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
async function update(endpoint, id, data, token) {
  return fetch(
    `${apiAddress}/${endpoint}/${id}`,
    requestOptions(data, "PUT", token)
  )
    .then((response) => response.json())
    .then((result) => console.log(result))
    .catch((error) => console.log("error", error));
}

/**
 * @param {string} endpoint API endpoint
 * @param {int} id Object id
 * @returns Server response
 */
async function del(endpoint, id, token) {
  return fetch(`${apiAddress}/${endpoint}/${id}`, delRequestOptions(token))
    .then((response) => response.json())
    .then((result) => console.log(result))
    .catch((error) => console.log("error", error));
}

/**
 * HTTP Get Methods.
 */

async function get(token) {
  const res = await fetch(`${apiAddress}/projects`, getRequestOption(token));
  return await res.json();
}

async function getMilestones(token) {
  const res = await fetch(`${apiAddress}/milestone`, getRequestOption(token));
  return await res.json();
}

async function getActivity(token) {
  const res = await fetch(`${apiAddress}/activity`, getRequestOption(token));
  return await res.json();
}

async function getTasks(token) {
  const res = await fetch(`${apiAddress}/task`, getRequestOption(token));
  return await res.json();
}

/**
 * Get one item from the server.
 */
async function findMilestone(id, token) {
  const res = await fetch(
    `${apiAddress}/milestone/${id}`,
    getRequestOption(token)
  );
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
  requestOptions,
};
