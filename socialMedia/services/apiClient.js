const axios = require('axios');

const API_BASE_URL = 'http://20.244.56.144/evaluation-service';
const AUTH_HEADER = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQzODMxMjE2LCJpYXQiOjE3NDM4MzA5MTYsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6ImJhYWM0NzA4LWEwNGYtNDg5Ni04ZDkwLWNjZDgzM2VjYTM4OCIsInN1YiI6Ijk5MjIxMDMyMzlAbWFpbC5qaWl0LmFjLmluIn0sImVtYWlsIjoiOTkyMjEwMzIzOUBtYWlsLmppaXQuYWMuaW4iLCJuYW1lIjoibWVocmFtam90IHNvZWkiLCJyb2xsTm8iOiI5OTIyMTAzMjM5IiwiYWNjZXNzQ29kZSI6IlNyTVFxUiIsImNsaWVudElEIjoiYmFhYzQ3MDgtYTA0Zi00ODk2LThkOTAtY2NkODMzZWNhMzg4IiwiY2xpZW50U2VjcmV0IjoicUNySmN3QnptYUtiY1J2ZyJ9.ELOWNtpUB_sNJu5yWU4fPkrbUq5-1Me5RgfSXlazjPU';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        Authorization: AUTH_HEADER,
    },
    timeout: 10000
});

const fetchAllUsers = async () => {
    try {
        const response = await apiClient.get('/users');
        return response.data.users;
    } catch (err) {
        console.error('Something went wrong while getting users:', err);
        return [];
    }
};

const getUserPostsById = async (userId) => {
    if (!userId) {
        console.warn('No userId provided to getUserPostsById');
        return [];
    }

    try {
        const res = await apiClient.get(`/users/${userId}/posts`);
        return res.data.posts || [];
    } catch (err) {
        console.error(`Failed to fetch posts for user ${userId}:`, err);
        return [];
    }
};

const fetchCommentsForPost = async (postId) => {
    try {
        const result = await apiClient.get(`/posts/${postId}/comments`);
        return result.data.comments;
    } catch (e) {
        console.error(`Couldn't get comments for post ${postId}`, e);
        return [];
    }
};

module.exports = {
    fetchAllUsers,
    getUserPostsById,
    fetchCommentsForPost
};
