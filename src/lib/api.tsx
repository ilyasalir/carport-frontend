import axios, { AxiosResponse } from "axios";

const url = process.env.NEXT_PUBLIC_API_URL;
const url2 = process.env.NEXT_PUBLIC_API_URL2;

export const postBotWithJson = async (
  api: string,
  json: any
): Promise<AxiosResponse<any, any>> => {
  return await axios.post(url2 + api, json, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const postWithJson = async (
  api: string,
  json: any
): Promise<AxiosResponse<any, any>> => {
  return await axios.post(url + api, json, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const postWithCredentialsJson = async (
  api: string,
  json: any,
  token: string
): Promise<AxiosResponse<any, any>> => {
  return await axios.post(url + api, json, {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token, //Add this line
    },
  });
};

export const postWithMixedData = async (
  api: string,
  formData: FormData,
  token: string
): Promise<AxiosResponse<any, any>> => {
  return await axios.post(url + api, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: "Bearer " + token,
    },
  });
};

export const postWithForm = async (
  api: string,
  form: any,
  token: string
): Promise<AxiosResponse<any, any>> => {
  return await axios.post(url + api, form, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: "Bearer " + token, //Add this line
    },
  });
};

export const postWithFormOnly = async (
  api: string,
  form: any
): Promise<AxiosResponse<any, any>> => {
  return await axios.post(url + api, form, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const PostWithCredentials = async (
  apiParams: string,
  token: string
): Promise<AxiosResponse<any, any>> => {
  return await axios.post(
    url + apiParams,
    {},
    {
      headers: {
        Authorization: "Bearer " + token, //Add this line
      },
    }
  );
};

export const getWithCredentials = async (
  apiParams: string,
  token: string
): Promise<AxiosResponse<any, any>> => {
  return await axios.get(url + apiParams, {
    headers: {
      Authorization: "Bearer " + token, //Add this line
    },
  });
};

export const get = async (
  apiParams: string
): Promise<AxiosResponse<any, any>> => {
  return await axios.get(url + apiParams);
};

export const deleteWithCredentials = async (
  api: string,
  token: string
): Promise<AxiosResponse<any, any>> => {
  return await axios.delete(url + api, {
    headers: {
      Authorization: "Bearer " + token, //Add this line
    },
  });
};

export const updateWithJson = async (
  api: string,
  json: any,
  token: string
): Promise<AxiosResponse<any, any>> => {
  return await axios.put(url + api, json, {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token, //Add this line
    },
  });
};

export const updateCar = async (
  api: string,
  form: any,
  token: string
): Promise<AxiosResponse<any, any>> => {
  return await axios.put(url + api, form, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: "Bearer " + token, //Add this line
    },
  });
};

export const deleteUser = async (
  api: string,
  token: string
): Promise<AxiosResponse<any, any>> => {
  return await axios.delete(url + api, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
};