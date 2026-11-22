
import { createAuthClient } from "better-auth/react"
import { jwtClient } from "better-auth/client/plugins"

import { API_URL } from "./constants"

export const authClient = createAuthClient({
  baseURL: API_URL,
  fetchOptions: {
    credentials: "include"
  },
  plugins: [jwtClient()]
})

export async function getJwtToken() {
  const result = await authClient.token()

  if (result.error || !result.data?.token) {
    throw new Error(
      result.error?.message ||
        "Unable to get a secure access token. Please sign in again."
    )
  }

  return result.data.token
}
