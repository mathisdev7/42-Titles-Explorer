"use server"

async function fetchAccessToken() {
  const clientId = process.env.CLIENT_ID
  const clientSecret = process.env.CLIENT_SECRET

  const response = await fetch("https://api.intra.42.fr/oauth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret,
    }),
  })

  if (!response.ok) {
    throw new Error("Failed to fetch access token")
  }

  const data = await response.json()
  return data.access_token
}

export async function redirectToRandomUser(titleId: number) {
  try {
    const accessToken = await fetchAccessToken()

    const response = await fetch(
      `https://api.intra.42.fr/v2/titles/${titleId}/titles_users`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    )

    if (!response.ok) {
      throw new Error("Failed to fetch data")
    }

    const data = await response.json()
    if (data.length > 0) {
      const randomUser = data[Math.floor(Math.random() * data.length)]
      const user = await fetch(
        `https://api.intra.42.fr/v2/users/${randomUser.user_id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      )
      const userData = await user.json()
      return `https://profile.intra.42.fr/users/${userData.login}`
    }
    return null
  } catch (error) {
    console.error("Error fetching title users:", error)
  }
}
