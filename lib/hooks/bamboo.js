import { apiAddress, b_header } from "../api";
import axios from 'axios';

async function getClientToken() {
  // call auth  
//   const res = axios.get(`${apiAddress}/client/token`, {
//     headers: {
//         Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`
//     }
//   });

localStorage.setItem(
  "x-client-token",
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ikx6aTZoUVRwc2gtS21BNjdzbXdCWiJ9.eyJodHRwczovL2V4YW1wbGUuY29tL2NsYWltIjoiYmFyIiwiaXNzIjoiaHR0cHM6Ly9pbnZlc3RiYW1ib28uYXV0aDAuY29tLyIsInN1YiI6ImJlVkdQZjFNRjVXOGRSSXpkbUgyTXR2VXY5OGhvRjNBQGNsaWVudHMiLCJhdWQiOiJodHRwczovL3Bvd2VyZWQtYnktYmFtYm9vLXNhbmRib3guaW52ZXN0YmFtYm9vLmNvbS8iLCJpYXQiOjE2NTk0NDY2MzcsImV4cCI6MTY1OTUzMzAzNywiYXpwIjoiYmVWR1BmMU1GNVc4ZFJJemRtSDJNdHZVdjk4aG9GM0EiLCJzY29wZSI6InJlYWQ6YmFtYm9vX2RhdGEgZXh0cmEiLCJndHkiOiJjbGllbnQtY3JlZGVudGlhbHMifQ.LViQ7rMmWfEg6LZ_6Z-h9WtJual64S0r0XQ4GS2o_isHbbOWiKR76kfSy58mMZT5UwFKGdKhWds1i9OBlTgJS1UAvDJc31fNuR47mA7CIo7hfnauaDw4yx4zRkwskti24_9C_TekCZGUPjPy42CzshSUzJWvVSlvjoG-n1YVygm3D1yi4LqUzXQb7_Zwhw8Ooct8n-tCExDCi0lJctVPF6Wp3iPIIaZEVVQBDWeL_gWkVzObAttznMFK7etTG2hvgQZfUSeCig7-zz6MpONy_JAOcH3hDDi6eb9Soc7-82AyNR3O78wDzp0ZTMSPNeZfhOxDkOdR5OPiVYnC8MdwdQ"
);

//   console.log(res);
}

export { getClientToken };
