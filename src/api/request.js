export async function fetchJson(url, fetchRequest = fetch) {
  let response
  try {
    response = await fetchRequest(url)
  } catch (error) {
    if (error instanceof TypeError) throw new Error('Network not available', { cause: error })
    throw error
  }
  if (!response.ok) throw new Error(`Request failed (HTTP ${response.status})`)

  try {
    return await response.json()
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error('Endpoint returned a non-JSON response', { cause: error })
    }
    throw error
  }
}
