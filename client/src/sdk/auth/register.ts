import { UserRegistrationDetails, UserRegistrationDriver } from "@/api/auth/register";
import { apiClient } from "@/lib/api";
import useAspidaSWR from "@aspida/swr";

export async function RegisterUser(driver: UserRegistrationDriver, body: UserRegistrationDetails) {
    const { data, error } = useAspidaSWR(apiClient.auth.register.post({ body }), { query: { driver }});
    console.log(data)
    return [data, error]
}