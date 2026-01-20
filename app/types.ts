
export const DEFAULT_RPC_URL = "https://gaw-3456.cicy.de5.net/rpc?token=30d5d11864651e2cf7dae4f6b1dc821ab20ac24a7d58a2d999a3639cc2165e38";

export interface RpcResponse<T> {
  ok: boolean;
  result?: T;
  error?: string;
}

export interface WindowBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface WindowInfo {
  id: number;
  wcId: number;
  url: string; 
  bounds?: WindowBounds;
}

export type WindowMap = Record<string, Record<string, { id: number; wcId: number; bounds?: WindowBounds }>>;

export interface NetworkLog {
    id: string;
    url: string;
    method: string;
    statusCode?: number;
    timestamp: number;
    requestHeaders?: Record<string, string>;
    responseHeaders?: Record<string, string>;
    win_id?: number; 
    resourceType?: string;
}
