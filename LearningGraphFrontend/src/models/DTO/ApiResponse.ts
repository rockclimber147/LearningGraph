export interface ApiResponse {
    success: boolean;
    message: string;
}

export interface ApiResponseWithContent<T> extends ApiResponse {
    content: T | null;
}