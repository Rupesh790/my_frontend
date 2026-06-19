import { apiGet, apiPost, getAccessToken } from "../api/client";

function token() {
  return getAccessToken();
}

export async function getOnboardingStatus() {
  return apiGet("/trading/api/onboarding/status/", token());
}

export async function getBrokers() {
  return apiGet("/trading/api/brokers/", token());
}

export async function selectBroker(brokerCode) {
  return apiPost("/trading/api/brokers/select/", { broker_code: brokerCode }, token());
}

export async function getCurrentBroker() {
  return apiGet("/trading/api/brokers/current/", token());
}

export async function changeBroker(brokerCode) {
  return apiPost("/trading/api/brokers/change/", { broker_code: brokerCode }, token());
}

export async function getBrokerStatus() {
  return apiGet("/trading/api/brokers/status/", token());
}

export async function getZerodhaLoginUrl() {
  return apiGet("/trading/api/brokers/zerodha/login-url/", token());
}

export async function zerodhaCallback(requestToken) {
  return apiPost("/trading/api/brokers/zerodha/callback/", { request_token: requestToken }, token());
}

export async function zerodhaDisconnect() {
  return apiPost("/trading/api/brokers/zerodha/disconnect/", {}, token());
}
