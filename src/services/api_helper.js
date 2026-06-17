import axios from "axios";
export const API_URL = () => {
  // const hostname = window.location.hostname;
  // if (
  //   hostname === "localhost" ||
  //   hostname === "127.0.0.1"
  // ) {
  //   // return "https://api-bms-dev.beesky.vn";
  //   return "http://api-bms.beesky.vn";
  // }
  // const parts = hostname.split(".");
  // // vd: taseco.beesky.vn => ["taseco","beesky","vn"]
  // let subdomain = null;
  // if (parts.length > 2) {
  //   subdomain = parts.slice(0, parts.length - 2).join(".");
  // }
  // // ---- map subdomain -> api ----
  // switch (subdomain) {
  //   case "imcs":
  //     return "https://api-bms2.beesky.vn";
  //   default:
  //     return "https://api-bms.beesky.vn";
  // }
  return "http://123.31.12.172:6001/";
};
const axiosApi = (headers) => {
  return axios.create({
    baseURL: API_URL(),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      ...headers,
    },
  });
};
export default axiosApi;
