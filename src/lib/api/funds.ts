import api from "@/lib/api";
import { SendFundsPayload } from "./types";

export const sendFunds = async (projectId: string, data: SendFundsPayload) => {
  try {
    const response = await api.post(`/api/funds/send-funds/${projectId}`, data);
    return response.data;
  } catch (error) {
    console.error("Error sending funds:", error);
    throw error;
  }
};

export const takeFunds = async (projectId: string, data: SendFundsPayload) => {
  try {
    const response = await api.post(`/api/funds/take-funds/${projectId}`, data);
    return response.data;
  } catch (error) {
    console.error("Error sending funds:", error);
    throw error;
  }
};
