import { Axios, AxiosRequestConfig } from "axios";
import getInstance from "./axio";
import { ApiResponse, AxiosErrorType, MovieResponse } from "../types";


const getRequest = async <T>(
    url: string,
    config?: AxiosRequestConfig,
): Promise<ApiResponse<T>> => {
    const axiosInstance = getInstance();

    try {
        const response = await axiosInstance.get<T>(url, config);
        return {
            data: response.data,
            error: undefined,
        };
    }
    catch (err) {
        
            const error = err as AxiosErrorType;
            const status = error.response?.status;
            const details = error.response?.data;
           
            return {    
                data: undefined as unknown as T,
                error: {
                    message: `Failed to fetch data from ${url}`,
                    status,
                    details,
                    name: "",
                }
            }
        
    }
}

export const getMovie = async (
    endpoint: string,
): Promise<ApiResponse<MovieResponse>> => {
    const config: AxiosRequestConfig = {
        params: {
            api_key: process.env.NEXT_PUBLIC_TMDB_API_KEY,
            sort_by: "popularity.desc",
            page: 1,
        }
    }
    return await getRequest<MovieResponse>(endpoint, config);
}


// (Optional) POST request example -> could be your "setMovies"
export const setMovies = async (
  endpoint: string,
  payload: any
): Promise<ApiResponse<any>> => {
  const axiosInstance = getInstance();

  try {
    const response = await axiosInstance.post(endpoint, payload, {
      params: {
        api_key: process.env.NEXT_PUBLIC_TMDB_API_KEY,
      },
    });
    return { data: response.data, error: undefined };
  } catch (err) {
    const error = err as AxiosErrorType;
    return {
      data: undefined,
      error: {
        message: `Failed to send data to ${endpoint}`,
        status: error.response?.status,
        details: error.response?.data,
        name: error.name || "AxiosError",
      },
    };
  }
};