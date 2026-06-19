import { apiGet, getAccessToken } from "../api/client";

function token() {
  return getAccessToken();
}

export async function getDashboardOverview() {
  return apiGet("/trading/api/dashboard/overview/", token());
}

export async function getDashboardCharts() {
  return apiGet("/trading/api/dashboard/charts/", token());
}

export async function getStrategyPerformance() {
  return apiGet("/trading/api/dashboard/strategy-performance/", token());
}

export async function getTrades() {
  return apiGet("/trading/api/trades/", token());
}
