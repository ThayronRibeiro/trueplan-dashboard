export interface ApiError {
  status: number;
  message: string;
}

export const isApiError = (error: any): error is ApiError => {
  return (
    (error as ApiError).status !== undefined &&
    (error as ApiError).message !== undefined
  );
};
