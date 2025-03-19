class MediaUploadClient {
  async fetch(endpoint, options) {
    const { method = "GET", body, headers = {} } = options;

    const defaultHeaders = {
      "Content-Type": "application/json",
      credentials: "include",
      ...headers,
    };

    const response = await fetch(`/api${endpoint}`, {
      method,
      headers: defaultHeaders,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return response.json;
  }

  async uploadVideo(video) {
    return this.fetch("/api/v1/media/upload-video", {
      method: "POST",
      body: video,
    });
  }
}

export default new MediaUploadClient();
