import { FinalizeUserRegistration } from "@/api/auth/challenge/finalize";
import { InitChallengeRequest } from "@/api/auth/challenge/request";
import { VerifyChallengeRequest } from "@/api/auth/challenge/verify";
import { apiClient } from "@/lib/api";
import type { VerifyRegistrationResponse } from "@/types";

export async function initRegistration(
  body: InitChallengeRequest
) {
  return apiClient.auth.challenge.request.$post({ body });
}

export async function verifyRegistration(body: VerifyChallengeRequest): Promise<VerifyRegistrationResponse> {
  return apiClient.auth.challenge.verify.$post({ body });
}

export async function finalizeRegistration(body: FinalizeUserRegistration) {
  return apiClient.auth.challenge.finalize.$post({ body });
}

