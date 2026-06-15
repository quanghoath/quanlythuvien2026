import axiosApi from "./api_helper";
export const SachService = {
  GetList: async () => {
    return await axiosApi()
      .get("api/sach")
      .then((res) => res.data);
  },
  GetByID: async (id) => {
    return await axiosApi()
      .get(`api/sach/${id}`)
      .then((res) => res.data);
  },
  Add: async (payload) => {
    return await axiosApi()
      .post("api/sach", payload)
      .then((res) => res.data);
  },
  Update: async (payload) => {
    return await axiosApi()
      .put(`api/sach/${payload.Id}`, payload)
      .then((res) => res.data);
  },
};