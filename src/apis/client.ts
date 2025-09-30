import axios from "axios";
import type { ApiResponse, ApiError } from "../types/apis";

const proxy = import.meta.env.VITE_USE_PROXY === "true";

const apiClient = axios.create({
  baseURL: proxy ? "/api" : import.meta.env.VITE_API_BASE_URL,
  timeout: import.meta.env.VITE_API_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

const tokenManager = {
  get: (): string | null => {
    try {
      return localStorage.getItem("accessToken");
    } catch {
      return null;
    }
  },
  set: (token: string): void => {
    try {
      localStorage.setItem("accessToken", token);
    } catch {
      console.warn("토큰 저장에 실패했습니다.");
    }
  },
  remove: (): void => {
    try {
      localStorage.removeItem("accessToken");
    } catch {
      console.warn("토큰 제거에 실패했습니다.");
    }
  },
};

// 요청 인터셉터
apiClient.interceptors.request.use(
  (config) => {
    const token = tokenManager.get();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 요청 ID 추가 (디버깅용) - headers 사용
    if (config.headers) {
      config.headers["X-Request-ID"] = crypto.randomUUID();
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터
apiClient.interceptors.response.use(
  (response) => {
    // 응답 데이터 검증
    if (
      response.data &&
      typeof response.data === "object" &&
      response.status &&
      response.status === 200
    ) {
      return response;
    }

    // 예상치 못한 응답 형태 처리
    console.warn("예상치 못한 응답 형태:", response.data);
    return response;
  },
  (error) => {
    const apiError: ApiError = {
      message: "알 수 없는 오류가 발생했습니다.",
      status: error.response?.status,
    };

    if (error.response?.status === 401) {
      tokenManager.remove();
      // 현재 페이지가 로그인 페이지가 아닌 경우에만 리다이렉트
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
      apiError.message = "인증이 필요합니다.";
    } else if (error.response?.data?.message) {
      apiError.message = error.response.data.message;
    } else if (error.message) {
      apiError.message = error.message;
    }

    return Promise.reject(apiError);
  }
);

// API 래퍼 함수
export const api = {
  get: async <T>(
    url: string,
    params?: Record<string, unknown>,
    config?: any
  ): Promise<T> => {
    const response = await apiClient.get<ApiResponse<T>>(url, {
      params,
      ...config,
    });
    return response.data.data;
  },

  post: async <T>(url: string, data?: unknown, config?: any): Promise<T> => {
    const response = await apiClient.post<ApiResponse<T>>(url, data, config);
    return response.data.data;
  },

  put: async <T>(url: string, data?: unknown, config?: any): Promise<T> => {
    const response = await apiClient.put<ApiResponse<T>>(url, data, config);
    return response.data.data;
  },

  patch: async <T>(url: string, data?: unknown, config?: any): Promise<T> => {
    const response = await apiClient.patch<ApiResponse<T>>(url, data, config);
    return response.data.data;
  },

  delete: async <T = void>(url: string, config?: any): Promise<T> => {
    const response = await apiClient.delete<ApiResponse<T>>(url, config);
    return response.data.data;
  },
};
