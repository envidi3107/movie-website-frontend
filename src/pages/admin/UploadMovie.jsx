import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useRequest from '@/hooks/useRequest';
import { useNotification } from '@/contexts/NotificationContext';

export default function UploadMovie() {
    const navigate = useNavigate();
    const { post } = useRequest();
    const { showNotification } = useNotification();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        adult: false,
        overview: '',
        releaseDate: '',
        genres: '',
        type: 'MOVIE',
        posterUrl: '',
        backdropUrl: '',
        videoUrl: '',
        duration: '', // Added duration for movies
    });
    const [files, setFiles] = useState({
        posterFile: null,
        backdropFile: null,
        videoFile: null,
    });
    const [previews, setPreviews] = useState({
        poster: null,
        backdrop: null,
    });
    const [uploadMode, setUploadMode] = useState({
        poster: 'file',
        backdrop: 'file',
        video: 'file',
    });
    const [episodes, setEpisodes] = useState([]);
    const [showEpisodeForm, setShowEpisodeForm] = useState(false);
    const [currentEpisode, setCurrentEpisode] = useState({
        title: '',
        description: '',
        videoFile: null,
        videoUrl: '',
        duration: '',
        uploadMode: 'file',
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleTypeChange = (newType) => {
        setFormData((prev) => ({ ...prev, type: newType }));
    };

    const handleFileChange = (e, fileType) => {
        const file = e.target.files[0];
        if (!file) return;

        setFiles((prev) => ({ ...prev, [`${fileType}File`]: file }));

        // Create preview for image files
        if (fileType !== 'video' && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviews((prev) => ({ ...prev, [fileType]: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleEpisodeChange = (field, value) => {
        setCurrentEpisode((prev) => ({ ...prev, [field]: value }));
    };

    const handleEpisodeFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCurrentEpisode((prev) => ({ ...prev, videoFile: file }));
        }
    };

    const addEpisode = () => {
        if (
            !currentEpisode.title ||
            (!currentEpisode.videoFile && !currentEpisode.videoUrl)
        ) {
            showNotification('Please provide episode title and video', 'error');
            return;
        }

        setEpisodes((prev) => [...prev, { ...currentEpisode }]);
        setCurrentEpisode({
            title: '',
            videoFile: null,
            videoUrl: '',
            duration: '',
            uploadMode: 'file',
        });
        setShowEpisodeForm(false);
        showNotification('Episode added successfully', 'success');
    };

    const removeEpisode = (index) => {
        setEpisodes((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formDataToSend = new FormData();

            // Append text fields
            Object.keys(formData).forEach((key) => {
                formDataToSend.append(key, formData[key]);
            });

            // Append files
            if (files.posterFile)
                formDataToSend.append('posterFile', files.posterFile);
            if (files.backdropFile)
                formDataToSend.append('backdropFile', files.backdropFile);

            // For MOVIE type, append video file
            if (formData.type === 'MOVIE') {
                if (files.videoFile)
                    formDataToSend.append('videoFile', files.videoFile);
                if (formData.duration)
                    formDataToSend.append('duration', formData.duration);
            }

            const response = await post('/admin/upload/film', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response) {
                showNotification(
                    response.message || 'Movie uploaded successfully!',
                    'success'
                );
                navigate('/admin/movies');
            }
        } catch (error) {
            showNotification(error.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-white text-3xl font-black">Upload Movie</h1>
                <p className="text-white/60 mt-2">
                    Add a new movie to the platform
                </p>
            </div>

            {/* Type Toggle Header */}
            <div className="flex gap-4 mb-8">
                <button
                    onClick={() => handleTypeChange('MOVIE')}
                    className={`flex-1 py-4 text-center rounded-2xl font-bold text-lg transition-all ${
                        formData.type === 'MOVIE'
                            ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105'
                            : 'bg-[#1a0b2e] border border-white/10 text-white/40 hover:text-white hover:border-white/20'
                    }`}
                >
                    Phim Lẻ (Movie)
                </button>
                <button
                    onClick={() => handleTypeChange('SERIES')}
                    className={`flex-1 py-4 text-center rounded-2xl font-bold text-lg transition-all ${
                        formData.type === 'SERIES'
                            ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105'
                            : 'bg-[#1a0b2e] border border-white/10 text-white/40 hover:text-white hover:border-white/20'
                    }`}
                >
                    Phim Bộ (Series)
                </button>
            </div>

            <form onSubmit={handleSubmit} className="max-w-4xl">
                <div className="bg-[#1a0b2e] border border-white/10 rounded-2xl p-8 space-y-6">
                    {/* Title */}
                    <div>
                        <label className="text-white text-sm font-medium mb-2 block">
                            Title *
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-primary transition-colors"
                            placeholder="Enter movie title"
                            required
                        />
                    </div>

                    {/* Overview */}
                    <div>
                        <label className="text-white text-sm font-medium mb-2 block">
                            Overview *
                        </label>
                        <textarea
                            name="overview"
                            value={formData.overview}
                            onChange={handleChange}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-primary transition-colors min-h-32 resize-none"
                            placeholder="Enter movie overview"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Release Date */}
                        <div>
                            <label className="text-white text-sm font-medium mb-2 block">
                                Release Date *
                            </label>
                            <input
                                type="date"
                                name="releaseDate"
                                value={formData.releaseDate}
                                onChange={handleChange}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                                required
                            />
                        </div>

                        {/* Duration - Only for MOVIE type */}
                        {formData.type === 'MOVIE' && (
                            <div>
                                <label className="text-white text-sm font-medium mb-2 block">
                                    Duration
                                </label>
                                <input
                                    type="text"
                                    name="duration"
                                    value={formData.duration}
                                    onChange={handleChange}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-primary transition-colors"
                                    placeholder="e.g. 1h 45m"
                                />
                            </div>
                        )}
                    </div>

                    {/* Genres */}
                    <div>
                        <label className="text-white text-sm font-medium mb-2 block">
                            Genres (comma-separated) *
                        </label>
                        <input
                            type="text"
                            name="genres"
                            value={formData.genres}
                            onChange={handleChange}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-primary transition-colors"
                            placeholder="Action, Comedy, Drama"
                            required
                        />
                    </div>

                    {/* Adult Content */}
                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            name="adult"
                            checked={formData.adult}
                            onChange={handleChange}
                            className="w-5 h-5 rounded border-white/20 bg-white/5 text-primary focus:ring-primary focus:ring-offset-0"
                        />
                        <label className="text-white text-sm font-medium">
                            Adult Content (18+)
                        </label>
                    </div>

                    {/* Poster Upload */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="text-white text-sm font-medium">
                                Poster Image
                            </label>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setUploadMode((prev) => ({
                                            ...prev,
                                            poster: 'file',
                                        }))
                                    }
                                    className={`px-3 py-1 text-xs rounded-lg transition-colors ${uploadMode.poster === 'file' ? 'bg-primary text-white' : 'bg-white/10 text-white/60'}`}
                                >
                                    File
                                </button>
                                <button
                                    type="button"
                                    onClick={() =>
                                        setUploadMode((prev) => ({
                                            ...prev,
                                            poster: 'url',
                                        }))
                                    }
                                    className={`px-3 py-1 text-xs rounded-lg transition-colors ${uploadMode.poster === 'url' ? 'bg-primary text-white' : 'bg-white/10 text-white/60'}`}
                                >
                                    URL
                                </button>
                            </div>
                        </div>
                        {uploadMode.poster === 'file' ? (
                            <>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) =>
                                        handleFileChange(e, 'poster')
                                    }
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary file:text-white file:cursor-pointer hover:file:bg-primary/90"
                                />
                                {previews.poster && (
                                    <img
                                        src={previews.poster}
                                        alt="Poster preview"
                                        className="mt-4 h-48 rounded-xl object-cover"
                                    />
                                )}
                            </>
                        ) : (
                            <input
                                type="text"
                                name="posterUrl"
                                value={formData.posterUrl}
                                onChange={handleChange}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-primary transition-colors"
                                placeholder="Enter poster URL"
                            />
                        )}
                    </div>

                    {/* Backdrop Upload */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="text-white text-sm font-medium">
                                Backdrop Image
                            </label>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setUploadMode((prev) => ({
                                            ...prev,
                                            backdrop: 'file',
                                        }))
                                    }
                                    className={`px-3 py-1 text-xs rounded-lg transition-colors ${uploadMode.backdrop === 'file' ? 'bg-primary text-white' : 'bg-white/10 text-white/60'}`}
                                >
                                    File
                                </button>
                                <button
                                    type="button"
                                    onClick={() =>
                                        setUploadMode((prev) => ({
                                            ...prev,
                                            backdrop: 'url',
                                        }))
                                    }
                                    className={`px-3 py-1 text-xs rounded-lg transition-colors ${uploadMode.backdrop === 'url' ? 'bg-primary text-white' : 'bg-white/10 text-white/60'}`}
                                >
                                    URL
                                </button>
                            </div>
                        </div>
                        {uploadMode.backdrop === 'file' ? (
                            <>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) =>
                                        handleFileChange(e, 'backdrop')
                                    }
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary file:text-white file:cursor-pointer hover:file:bg-primary/90"
                                />
                                {previews.backdrop && (
                                    <img
                                        src={previews.backdrop}
                                        alt="Backdrop preview"
                                        className="mt-4 h-32 w-full rounded-xl object-cover"
                                    />
                                )}
                            </>
                        ) : (
                            <input
                                type="text"
                                name="backdropUrl"
                                value={formData.backdropUrl}
                                onChange={handleChange}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-primary transition-colors"
                                placeholder="Enter backdrop URL"
                            />
                        )}
                    </div>

                    {/* Video Upload - Only for MOVIE type */}
                    {formData.type === 'MOVIE' && (
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-white text-sm font-medium">
                                    Video File
                                </label>
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setUploadMode((prev) => ({
                                                ...prev,
                                                video: 'file',
                                            }))
                                        }
                                        className={`px-3 py-1 text-xs rounded-lg transition-colors ${uploadMode.video === 'file' ? 'bg-primary text-white' : 'bg-white/10 text-white/60'}`}
                                    >
                                        File
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setUploadMode((prev) => ({
                                                ...prev,
                                                video: 'url',
                                            }))
                                        }
                                        className={`px-3 py-1 text-xs rounded-lg transition-colors ${uploadMode.video === 'url' ? 'bg-primary text-white' : 'bg-white/10 text-white/60'}`}
                                    >
                                        URL
                                    </button>
                                </div>
                            </div>
                            {uploadMode.video === 'file' ? (
                                <input
                                    type="file"
                                    accept="video/*"
                                    onChange={(e) =>
                                        handleFileChange(e, 'video')
                                    }
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary file:text-white file:cursor-pointer hover:file:bg-primary/90"
                                />
                            ) : (
                                <input
                                    type="text"
                                    name="videoUrl"
                                    value={formData.videoUrl}
                                    onChange={handleChange}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-primary transition-colors"
                                    placeholder="Enter video URL"
                                />
                            )}
                        </div>
                    )}

                    {/* Episodes Section - Only for SERIES type */}
                    {formData.type === 'SERIES' && (
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <label className="text-white text-sm font-medium">
                                    Episodes
                                </label>
                                <button
                                    type="button"
                                    onClick={() => setShowEpisodeForm(true)}
                                    className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
                                >
                                    <span className="material-symbols-outlined text-lg">
                                        add
                                    </span>
                                    Add Episode
                                </button>
                            </div>

                            {/* Episodes List */}
                            {episodes.length > 0 && (
                                <div className="space-y-3 mb-4">
                                    {episodes.map((episode, index) => (
                                        <div
                                            key={index}
                                            className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between"
                                        >
                                            <div className="flex-1">
                                                <p className="text-white font-medium">
                                                    {episode.title}
                                                </p>
                                                <p className="text-white/60 text-sm mt-1">
                                                    Duration:{' '}
                                                    {episode.duration || 'N/A'}{' '}
                                                    |
                                                    {episode.videoFile
                                                        ? ' File uploaded'
                                                        : episode.videoUrl
                                                          ? ' URL provided'
                                                          : ' No video'}
                                                </p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeEpisode(index)
                                                }
                                                className="px-3 py-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg transition-colors text-sm font-medium"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Add Episode Form Modal */}
                            {showEpisodeForm && (
                                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                                    <div className="bg-[#1a0b2e] border border-white/10 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                                        <h3 className="text-white text-xl font-bold mb-6">
                                            Add Episode
                                        </h3>

                                        <div className="space-y-4">
                                            <div>
                                                <label className="text-white text-sm font-medium mb-2 block">
                                                    Episode Title *
                                                </label>
                                                <input
                                                    type="text"
                                                    value={currentEpisode.title}
                                                    name="title"
                                                    onChange={(e) =>
                                                        handleEpisodeChange(
                                                            'title',
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-primary transition-colors"
                                                    placeholder="Enter episode title"
                                                />
                                            </div>

                                            <div>
                                                <label className="text-white text-sm font-medium mb-2 block">
                                                    Episode Description *
                                                </label>
                                                <input
                                                    type="text"
                                                    value={
                                                        currentEpisode.description
                                                    }
                                                    onChange={(e) =>
                                                        handleEpisodeChange(
                                                            'desciption',
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-primary transition-colors"
                                                    placeholder="Enter episode title"
                                                />
                                            </div>

                                            <div>
                                                <label className="text-white text-sm font-medium mb-2 block">
                                                    Duration (e.g., 45:30)
                                                </label>
                                                <input
                                                    type="text"
                                                    value={
                                                        currentEpisode.duration
                                                    }
                                                    onChange={(e) =>
                                                        handleEpisodeChange(
                                                            'duration',
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-primary transition-colors"
                                                    placeholder="mm:ss or hh:mm:ss"
                                                />
                                            </div>

                                            <div>
                                                <div className="flex items-center justify-between mb-2">
                                                    <label className="text-white text-sm font-medium">
                                                        Video *
                                                    </label>
                                                    <div className="flex gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleEpisodeChange(
                                                                    'uploadMode',
                                                                    'file'
                                                                )
                                                            }
                                                            className={`px-3 py-1 text-xs rounded-lg transition-colors ${currentEpisode.uploadMode === 'file' ? 'bg-primary text-white' : 'bg-white/10 text-white/60'}`}
                                                        >
                                                            File
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleEpisodeChange(
                                                                    'uploadMode',
                                                                    'url'
                                                                )
                                                            }
                                                            className={`px-3 py-1 text-xs rounded-lg transition-colors ${currentEpisode.uploadMode === 'url' ? 'bg-primary text-white' : 'bg-white/10 text-white/60'}`}
                                                        >
                                                            URL
                                                        </button>
                                                    </div>
                                                </div>
                                                {currentEpisode.uploadMode ===
                                                'file' ? (
                                                    <input
                                                        type="file"
                                                        accept="video/*"
                                                        onChange={
                                                            handleEpisodeFileChange
                                                        }
                                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary file:text-white file:cursor-pointer hover:file:bg-primary/90"
                                                    />
                                                ) : (
                                                    <input
                                                        type="text"
                                                        value={
                                                            currentEpisode.videoUrl
                                                        }
                                                        onChange={(e) =>
                                                            handleEpisodeChange(
                                                                'videoUrl',
                                                                e.target.value
                                                            )
                                                        }
                                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-primary transition-colors"
                                                        placeholder="Enter video URL"
                                                    />
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex gap-4 mt-6">
                                            <button
                                                type="button"
                                                onClick={addEpisode}
                                                className="flex-1 px-4 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors"
                                            >
                                                Add Episode
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowEpisodeForm(false)
                                                }
                                                className="flex-1 px-4 py-3 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Submit Buttons */}
                    <div className="flex gap-4 pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Uploading...' : 'Upload Movie'}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/admin/movies')}
                            className="px-8 py-3 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-all"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
