import { apiClient } from "@/lib/api";
import throttle from "lodash/throttle";

export async function checkUsername(username: string) {
  const res = await apiClient.auth.username.check.$post({ body: { username } });
  if (typeof (res as any)?.available === "boolean") return res as any;
  return { available: true } as { available: boolean };
}

let latestUsername = "";
let waiting: Array<{ resolve: (v: { available: boolean }) => void; reject: (e: any) => void }> = [];

const throttledCheck = throttle(async () => {
  try {
    const result = await checkUsername(latestUsername);
    waiting.splice(0).forEach(({ resolve }) => resolve(result));
  } catch (err) {
    waiting.splice(0).forEach(({ reject }) => reject(err));
  }
}, 600, { leading: false, trailing: true });

export function checkUsernameThrottled(username: string, wait = 600) {
  latestUsername = (username || "").trim().toLowerCase();
  // Adjust throttle wait dynamically if caller passes a different wait
  if ((throttledCheck as any).wait && typeof (throttledCheck as any).wait === "function") {
    try { (throttledCheck as any).wait(wait); } catch {}
  }
  return new Promise<{ available: boolean }>((resolve, reject) => {
    waiting.push({ resolve, reject });
    throttledCheck();
  });
}
