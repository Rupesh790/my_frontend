import { apiGet, apiPost, getAccessToken } from "../api/client";

function token() {
  return getAccessToken();
}

export async function getOnboardingStatus() {
  return apiGet("/api/onboarding/status/", token());
}

export async function getBrokers() {
  return apiGet("/api/brokers/", token());
}

export async function selectBroker(brokerCode) {
  return apiPost("/api/brokers/select/", { broker_code: brokerCode }, token());
}

export async function getCurrentBroker() {
  return apiGet("/api/brokers/current/", token());
}

export async function changeBroker(brokerCode) {
  return apiPost("/api/brokers/change/", { broker_code: brokerCode }, token());
}

export async function getBrokerStatus() {
  return apiGet("/api/brokers/status/", token());
}

export async function getZerodhaLoginUrl() {
  return apiGet("/api/brokers/zerodha/login-url/", token());
}

export async function zerodhaCallback(requestToken) {
  return apiPost("/api/brokers/zerodha/callback/", { request_token: requestToken }, token());
}

export async function zerodhaDisconnect() {
  return apiPost("/api/brokers/zerodha/disconnect/", {}, token());
}
