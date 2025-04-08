import axios, { AxiosError, AxiosResponse } from 'axios';
import { getErrorMessage } from '../errors/errors-map';

export interface ApiResult<T> {
  data: T | null;
  error: string | null;
}

function hasErrorProperty(data: any): data is { TIMESTAMP: string,ERROR: string | number } {
  return typeof data === 'object' && data !== null && 'ERROR' in data && (typeof data.ERROR === 'string');
}

export async function handleApiCall<T>(apiCallback: () => Promise<AxiosResponse<T>>): Promise<ApiResult<T>> {
  try {
    const response = await apiCallback();
    return {
      data: response.data,
      error: null,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        let errorMessage: string;
        if (hasErrorProperty(axiosError.response.data)){
          errorMessage = getErrorMessage(axiosError.response.data.ERROR.toString());
        } else {
          errorMessage = "Sucedio un error";
        }
        return {
          data: null,
          error: errorMessage,
        };
      } 
    } 
    return {
        data: null,
        error: 'Sucedio un error',
    };
  }
}
