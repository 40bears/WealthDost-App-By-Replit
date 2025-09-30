import type { InitRegisterUser, UserRegistrationDriver } from "@/api/auth/register";
import type { FinalizeUserRegistration } from "@/api/auth/register/finalize";
import type { VerifyUserRegistration } from "@/api/auth/register/verify";
import { apiClient } from "@/lib/api";

export async function initRegistration(
  driver: UserRegistrationDriver,
  body: InitRegisterUser
) {
  return apiClient.auth.register.$post({ query: { driver }, body });
}

export async function verifyRegistration(body: VerifyUserRegistration) {
  return apiClient.auth.register.verify.$post({ body });
}

export async function finalizeRegistration(body: FinalizeUserRegistration) {
  return apiClient.auth.register.finalize.$post({ body });
}

export type {
  FinalizeUserRegistration, InitRegisterUser,
  UserRegistrationDriver,
  VerifyUserRegistration
};

