export const postVideo = async (data) => {
    const url = 'http://13.127.161.46:8080/';
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        body: data
    });
    return response.json();
}

export const postRetryVideo = async (data) => {
    const url = 'http://13.127.161.46:8080/retry';
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        body: data
    });
    return response.json();
}