import apiService from "./axiosService";

export const isTokenValid = async () => {
  try {
    const response = await apiService({
      method: "GET",
      url: "api/v1/verify-token",
    });
    return true;
  } catch (error) {
    console.error("Error validating token:", error);
    return false;
  }
};
