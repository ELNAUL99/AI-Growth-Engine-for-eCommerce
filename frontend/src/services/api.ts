import axios from 'axios';
import { ProductInput, GeneratedContent, WorkflowRun, DashboardMetrics, ABBTestResult, PerformanceData } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Products
export const getProducts = () => api.get<{ success: boolean; data: ProductInput[] }>('/products');
export const getProduct = (id: string) => api.get<{ success: boolean; data: ProductInput }>(`/products/${id}`);
export const createProduct = (data: Omit<ProductInput, 'id' | 'createdAt'>) => 
  api.post<{ success: boolean; data: ProductInput; message: string }>('/products', data);

// Content
export const getContent = (params?: { productId?: string; type?: string; status?: string }) => 
  api.get<{ success: boolean; data: GeneratedContent[] }>('/content', { params });
export const getContentById = (id: string) => api.get<{ success: boolean; data: GeneratedContent }>(`/content/${id}`);
export const publishContent = (id: string) => api.post<{ success: boolean; data: GeneratedContent }>(`/content/${id}/publish`);
export const archiveContent = (id: string) => api.post<{ success: boolean; data: GeneratedContent }>(`/content/${id}/archive`);

// Workflows
export const getWorkflows = () => api.get<{ success: boolean; data: WorkflowRun[] }>('/workflows');
export const getWorkflow = (id: string) => api.get<{ success: boolean; data: WorkflowRun }>(`/workflows/${id}`);

// Analytics
export const getMetrics = () => api.get<{ success: boolean; data: DashboardMetrics }>('/analytics/metrics');
export const getABTests = () => api.get<{ success: boolean; data: ABBTestResult[] }>('/analytics/ab-tests');
export const getPerformance = () => api.get<{ success: boolean; data: PerformanceData[] }>('/analytics/performance');
