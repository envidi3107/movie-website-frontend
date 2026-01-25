import useRequest from '@/hooks/useRequest';

export default function useFilmService() {
    const { get } = useRequest();

    const searchFilms = async (params) => {
        return get('/films/search', { params });
    };

    return {
        searchFilms,
    };
}
