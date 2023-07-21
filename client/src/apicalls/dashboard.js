import { axiosInstance } from "."

export const GetallBloodGroupsInInventory = () => {
    return axiosInstance('get', '/api/dashboard/blood-groups-data');

}