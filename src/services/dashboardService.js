import { apiGet, getAccessToken } from "../api/client";

function token() {
  return getAccessToken();
}

export async function getDashboardOverview() {
  return apiGet("/api/dashboard/overview/", token());
}

export async function getDashboardCharts() {
  return apiGet("/api/dashboard/charts/", token());
}

export async function getStrategyPerformance() {
  return apiGet("/api/dashboard/strategy-performance/", token());
}

export async function getTrades() {
  return apiGet("/api/trades/", token());
}
