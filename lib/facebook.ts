import fetch from "node-fetch";

export async function postToFacebook(pageId: string, message: string, accessToken: string): Promise<string> {
  const url = `https://graph.facebook.com/v15.0/${pageId}/feed`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
      access_token: accessToken,
    }),
  });
  const data = await response.json();
  if (response.ok && data.id) {
    return data.id;
  } else {
    throw new Error(`Facebook API error: ${JSON.stringify(data)}`);
  }
}
