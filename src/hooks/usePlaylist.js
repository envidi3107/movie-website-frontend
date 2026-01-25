import { useState, useCallback } from 'react';
import useRequest from '@/hooks/useRequest';
import { useNotification } from '@/contexts/NotificationContext';

export default function usePlaylist() {
    const [playlists, setPlaylists] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const { get, post, remove } = useRequest();
    const { showNotification } = useNotification();

    const getUserPlaylists = useCallback(async () => {
        setIsLoading(true);
        const res = await get('/playlist/get-user-playlist');
        if (res?.results) {
            setPlaylists(res.results);
            setIsLoading(false);
            return res.results;
        }
        setIsLoading(false);
        return [];
    }, [get]);

    const createPlaylist = async (playlistName) => {
        const res = await post('/playlist/create-playlist', null, {
            params: { playlistName },
        });
        if (res) {
            showNotification('Playlist created successfully', 'success');
            getUserPlaylists();
            return true;
        }
        return false;
    };

    const deletePlaylist = async (playlistId) => {
        const res = await remove(`/users/playlists/${playlistId}`);
        if (res) {
            showNotification('Playlist deleted', 'success');
            setPlaylists((prev) =>
                prev.filter((p) => p.playlistId !== playlistId)
            );
            return true;
        }
        return false;
    };

    const addFilmToPlaylist = async (playlistId, filmId) => {
        const res = await post('/users/add-film-to-user-playlist', {
            playlistId,
            filmId,
        });
        if (res) {
            showNotification('Added to playlist', 'success');
            return true;
        }
        return false;
    };

    return {
        playlists,
        isLoading,
        getUserPlaylists,
        createPlaylist,
        deletePlaylist,
        addFilmToPlaylist,
    };
}
