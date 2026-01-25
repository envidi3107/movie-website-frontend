import React, { useState } from 'react';
import { IoIosAddCircleOutline } from 'react-icons/io';
import Image from './Image/Image';
import { useNotification } from '../context/NotificationContext';
import { FaRegCirclePlay } from 'react-icons/fa6';
import { IoPlaySkipForwardSharp, IoPlaySkipBackSharp } from 'react-icons/io5';
import Tooltip from './Tooltip';
import LoadingAnimation from './LoadingAnimation/SpinAnimation/SpinAnimation';
import { createPortal } from 'react-dom';

import axiosClient from '../libs/axiosClient';

export default function Playlist({ systemFilm, tmdbFilm }) {
    const [addPlaylist, setAddPlaylist] = useState(false);
    const [loading, setLoading] = useState(false);
    const { showNotification } = useNotification();
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentPlaylist, setCurrentPlaylist] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    console.log('currentPlaylist:', currentPlaylist);
    const handleCreationPlaylist = (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.target);
        axiosClient
            .post(
                `/playlist/create-playlist?playlistName=${formData.get('playlistName')}`
            )
            .then((data) => {
                console.log(data);
            })
            .catch((err) => showNotification('error', err.message))
            .finally(() => {
                setLoading(false);
                setAddPlaylist(false);
            });
    };

    const handlePlayPlaylist = (films) => {
        if (!films || films.length === 0) return;
        setCurrentPlaylist(films);
        setCurrentIndex(0);
        setIsPlaying(true);
    };

    const handleNext = () => {
        if (currentIndex < currentPlaylist.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const handleEnded = () => {
        if (currentIndex < currentPlaylist.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            setIsPlaying(false);
        }
    };
    console.log('systemFilm:', systemFilm);
    let playingModal = null;
    if (
        typeof window !== 'undefined' &&
        typeof document !== 'undefined' &&
        document.body
    ) {
        playingModal =
            isPlaying &&
            createPortal(
                <div className="fixed inset-0 z-[1000] bg-black bg-opacity-90 flex flex-col items-center justify-center px-4">
                    <button
                        onClick={() => setIsPlaying(false)}
                        className="absolute top-4 right-4 text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
                    >
                        Close
                    </button>
                    <h2 className="text-white text-lg mb-2">
                        {currentPlaylist[currentIndex]?.title ||
                            'Unknown Title'}
                    </h2>

                    {currentPlaylist[currentIndex].isUseSrc ? (
                        <iframe
                            src={currentPlaylist[currentIndex]?.videoPath}
                            width="100%"
                            height="400px"
                            allow="autoplay"
                            allowfullscreen
                            title="HLS Video Player"
                            className="bg-slate-700"
                        ></iframe>
                    ) : (
                        <video
                            key={currentPlaylist[currentIndex]?.videoPath}
                            src={currentPlaylist[currentIndex]?.videoPath}
                            controls
                            autoPlay
                            className="w-full max-w-4xl max-h-[350px] rounded"
                            onEnded={handleEnded}
                        />
                    )}
                    <div className="flex gap-4 mt-4">
                        <button
                            onClick={handlePrevious}
                            disabled={currentIndex === 0}
                            className="p-[10px] text-white rounded disabled:opacity-50"
                        >
                            <IoPlaySkipBackSharp
                                style={{
                                    width: '35px',
                                    height: '35px',
                                }}
                            />
                        </button>
                        <button
                            onClick={handleNext}
                            disabled={
                                currentIndex === currentPlaylist.length - 1
                            }
                            className="p-[10px] text-white rounded disabled:opacity-50"
                        >
                            <IoPlaySkipForwardSharp
                                style={{
                                    width: '35px',
                                    height: '35px',
                                }}
                            />
                        </button>
                    </div>
                </div>,
                document.body
            );
    }

    return (
        <div className="w-full h-full relative rounded-[10px] flex flex-col gap-y-[12px] overflow-hidden">
            {/* Add Playlist Button */}
            <div className="flex justify-end items-center px-[20px] pt-[10px] ">
                <div
                    className="hover:scale-[1.04] transition-scale duration-200 ease-in-out flex justify-center items-center gap-x-[3px] cursor-pointer"
                    onClick={() => setAddPlaylist(!addPlaylist)}
                >
                    <IoIosAddCircleOutline style={{ fontSize: '30px' }} />
                    <span className="text-[80%]">Add Playlist</span>
                </div>
            </div>

            {/* Add Playlist Form */}
            {addPlaylist && (
                <div className="w-full h-screen border-[1px] border-solid border-white rounded-[8px] flex justify-center items-center z-[1000] fixed top-[50px] right-0 bottom-0 left-0">
                    <div
                        className="overlay bg-black/70 absolute top-0 right-0 left-0 bottom-0 rounded-[8px] cursor-pointer"
                        onClick={() => setAddPlaylist(!addPlaylist)}
                    ></div>
                    <form className="z-[2]" onSubmit={handleCreationPlaylist}>
                        <input
                            type="text"
                            name="playlistName"
                            placeholder="Enter playlist name"
                            className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-medium transition justify-center items-center"
                        >
                            {loading ? <LoadingAnimation /> : 'Create Playlist'}
                        </button>
                    </form>
                </div>
            )}

            {/* System Film Playlists */}
            <div className="w-full flex flex-col justify-between items-center px-[20px]">
                <h1 className="text-[120%] font-bold pb-[5px] bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                    Hot movies and Free
                </h1>
                <div className="w-full flex flex-col">
                    {systemFilm &&
                        systemFilm.map((playlist, idx) => (
                            <div key={idx} className="w-full">
                                <div className="flex justify-start items-center gap-x-[15px]">
                                    <h1 className="text-[120%] font-bold py-[10px]">
                                        {playlist.playlistName}
                                    </h1>
                                    <Tooltip text="Play film!" position="top">
                                        <div
                                            className="cursor-pointer"
                                            onClick={() =>
                                                handlePlayPlaylist(
                                                    playlist.systemFilms
                                                )
                                            }
                                        >
                                            <FaRegCirclePlay
                                                style={{
                                                    width: '25px',
                                                    height: '25px',
                                                }}
                                            />
                                        </div>
                                    </Tooltip>
                                </div>
                                <div className="w-full flex flex-wrap gap-[7px]">
                                    {playlist.systemFilms.map((film) => (
                                        <div
                                            key={film.systemFilmId}
                                            className="min-w-[calc(100%/3-7px)] h-[180px] animate-skeleton rounded-[8px]"
                                        >
                                            <Image
                                                id={film.systemFilmId}
                                                src={film.posterPath}
                                                title={film.title}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                </div>
            </div>

            {/* TMDB Film Playlists */}
            <div className="w-full flex flex-col justify-between items-center px-[20px]">
                <h1 className="text-[120%] font-bold py-[10px] bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                    Theatrical movies
                </h1>
                <div className="w-full flex flex-col">
                    {tmdbFilm &&
                        tmdbFilm.map((playlist, idx) => (
                            <div key={idx} className="w-full">
                                <div className="flex justify-start items-center gap-x-[15px]">
                                    <h1 className="text-[120%] font-bold py-[10px]">
                                        {playlist.playlistName}
                                    </h1>
                                </div>
                                <div className="w-full flex flex-wrap gap-[7px]">
                                    {playlist.tmdbFilms.map((film) => (
                                        <div
                                            key={film.id}
                                            className="min-w-[calc(100%/3-7px)] h-[180px] animate-skeleton rounded-[8px]"
                                        >
                                            <Image
                                                id={film.tmdbId}
                                                belongTo="TMDB_FILM"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                </div>
            </div>

            {playingModal}
        </div>
    );
}
