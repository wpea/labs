const config = (method, url, auth, data) => {
  return {
    method: method,
    url: url,
    headers: {
      "x-subject-type": "standard",
      authorization: `Bearer ${auth}`,
      "x-client-token": localStorage.getItem("x-client-token"),
      authority: "bamboo-backend.appunite.net",
      accept: "application/json, text/plain, */*",
      "content-type": "application/json;charset=UTF-8",
    },
    data: data,
  };
};

export { config };
