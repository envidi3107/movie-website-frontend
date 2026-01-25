import axiosClient from '@/libs/axios';

export const searchFilms = async (params) => {
    return axiosClient.get('/films/search', { params });
};
