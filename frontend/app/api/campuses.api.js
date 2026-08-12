import axiosClient from "./axiosClient";

/* GET all campuses */
export const getCampuses = () =>
  axiosClient.get("/campuses");

/* GET campus by ID */
export const getCampusById = (id) =>
  axiosClient.get(`/campuses/${id}`);

/* CREATE campus */
export const createCampus = (data) =>
  axiosClient.post("/campuses", data);

/* UPDATE campus */
export const updateCampus = (id, data) =>
  axiosClient.put(`/campuses/${id}`, data);

/* DELETE campus */
export const deleteCampus = (id) =>
  axiosClient.delete(`/campuses/${id}`);
