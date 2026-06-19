import { apiDelete, apiGet, apiPost, apiPut, getAccessToken } from "../api/client";

function token() {
  return getAccessToken();
}

export async function getStrategies() {
  return apiGet("/api/strategies/", token());
}

export async function getStrategy(id) {
  return apiGet(`/api/strategies/${id}/`, token());
}

export async function createStrategy(data) {
  return apiPost("/api/strategies/", data, token());
}

export async function updateStrategy(id, data) {
  return apiPut(`/api/strategies/${id}/`, data, token());
}

export async function deleteStrategy(id) {
  return apiDelete(`/api/strategies/${id}/`, token());
}

export async function cloneStrategy(id) {
  return apiPost(`/api/strategies/${id}/clone/`, {}, token());
}

export async function toggleStrategy(id) {
  return apiPost(`/api/strategies/${id}/toggle/`, {}, token());
}

export const INSTRUMENT_TYPES = [
  { value: "equity", label: "Equity" },
  { value: "futures", label: "Futures" },
  { value: "options", label: "Options" },
];

export const CONDITION_TYPES = [
  { value: "ema_cross", label: "EMA Cross" },
  { value: "sma_cross", label: "SMA Cross" },
  { value: "rsi", label: "RSI" },
  { value: "macd", label: "MACD" },
  { value: "bollinger", label: "Bollinger Bands" },
  { value: "supertrend", label: "SuperTrend" },
  { value: "price_action", label: "Price Action" },
];
