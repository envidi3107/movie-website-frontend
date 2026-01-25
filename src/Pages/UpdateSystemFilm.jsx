import { useState, useEffect, useRef } from "react";
import Header from "../components/Header/Header";
import {
  FiImage,
  FiVideo,
  FiUpload,
  FiLoader,
  FiPlusCircle,
  FiTrash2,
} from "react-icons/fi";
import { useNotification } from "../context/NotificationContext";
import CropModal from "../components/CropModal";
import convertDataURLtoFile from "../utils/convertDataURLtoFile";
import getCroppedImg from "../utils/cropImage";
import { useParams } from "react-router-dom";
import axiosClient from "../libs/axiosClient";

const genreOptions = [
  "Action",
  "Comedy",
  "Drama",
  "Fantasy",
  "Horror",
  "Romance",
  "Sci-fi",
  "Thriller",
];

function UpdateSystemFilm() {
  const { systemFilmId } = useParams();
  const formData = useRef({
    adult: false,
    title: null,
    overview: null,
    releaseDate: null,
    backdrop: null,
    poster: null,
    video: null,
  });
  const [previewImages, setPreviewImages] = useState({
    backdrop: null,
    poster: null,
    video: null,
  });

  const [loading, setLoading] = useState(false);
  const [genreSelection, setGenreSelection] = useState([""]);
  const { showNotification } = useNotification();
  console.log("genreSelection:", genreSelection);
  const videoRef = useRef(null);

  const [cropModal, setCropModal] = useState({
    open: false,
    type: null,
    image: null,
  });
  const handleGenreChange = (e, index) => {
    const { value } = e.target;
    const newGenreSelection = [...genreSelection];
    newGenreSelection[index] = value;
    setGenreSelection(newGenreSelection);
  };

  const handleRemoveGenreSelect = (index) => {
    const newGenreSelection = genreSelection.filter((_, idx) => idx !== index);
    setGenreSelection(newGenreSelection);
  };

  const handleCropDone = async (croppedAreaPixels) => {
    try {
      const croppedImage = await getCroppedImg(
        cropModal.image,
        croppedAreaPixels,
      );
      formData.current[cropModal.type] = convertDataURLtoFile(
        croppedImage,
        `${cropModal.type}.jpg`,
      );
      setPreviewImages((prev) => ({
        ...prev,
        [cropModal.type]: croppedImage,
      }));
      setCropModal((prev) => ({
        ...prev,
        open: false,
      }));
    } catch (error) {
      showNotification("error", error);
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;

    if (files && files[0]) {
      if (files[0].size > 100 * 1024 * 1024) {
        showNotification("error", "File size exceeds 100MB");
        return;
      }

      if (name === "video") {
        const videoUrl = URL.createObjectURL(files[0]);
        setPreviewImages((prev) => ({
          ...prev,
          video: videoUrl,
        }));
        formData.current.video = files[0];
      } else {
        const reader = new FileReader();
        reader.onload = (event) => {
          const img = new Image();
          img.src = event.target.result;

          img.onload = () => {
            setCropModal({
              open: true,
              type: name,
              image: event.target.result,
              originalAspect: img.width / img.height,
            });
          };
        };
        reader.readAsDataURL(files[0]);
      }
    }
    e.target.value = "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    const form = new FormData();
    form.append("title", e.target.title.value);
    form.append("overview", e.target.overview.value);
    form.append("releaseDate", e.target.releaseDate.value);
    form.append("adult", e.target.adult.checked);
    form.append("totalDurations", videoRef.current.duration);
    genreSelection.forEach((genre) => {
      if (genre) {
        form.append("genres", genre);
      }
    });
    form.append("backdrop", formData.current.backdrop);
    form.append("poster", formData.current.poster);
    form.append("video", formData.current.video);

    axiosClient
      .put(`/admin/update/system-film/${systemFilmId}`, form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((data) => showNotification("success", data.message))
      .catch((err) => showNotification("error", err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const fetchFilmDetail = async () => {
      setLoading(true);
      try {
        const data = await axiosClient.get(
          `/system-films/${systemFilmId}/detail`,
        );
        const film = data.results;
        formData.current = {
          adult: film.adult ?? null,
          title: film.title ?? null,
          overview: film.overview ?? null,
          releaseDate: film.releaseDate ?? null,
          backdrop: null,
          poster: null,
          video: null,
        };
        console.log("form data:", formData.current);
        setGenreSelection(data.results.genres);
      } catch (error) {
        showNotification("error", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchFilmDetail();
  }, [systemFilmId, showNotification]);

  useEffect(() => {
    return () => {
      if (previewImages.video) {
        URL.revokeObjectURL(previewImages.video);
      }
    };
  }, [previewImages.video]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Header onSearching={() => {}} onReset={() => {}} />

      <div className="container mx-auto px-4 pt-[70px] max-w-3xl">
        <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
          {/* Form Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6">
            <h1 className="text-3xl font-bold text-white">Update Film</h1>
            <p className="text-blue-100 mt-1">
              Fill in the details below to update this film
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-200 border-b border-gray-700 pb-2">
                Film Information
              </h2>

              {/* Adult Checkbox */}
              <div className="flex items-center">
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="adult"
                    defaultValue={formData.current.adult || ""}
                    onChange={(e) => {
                      formData.current.title = e.target.value;
                    }}
                    className="h-5 w-5 text-indigo-600 rounded focus:ring-indigo-500 bg-gray-700 border-gray-600"
                  />
                  <span className="ml-3 text-gray-300">
                    This film contains adult content
                  </span>
                </label>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Film Title *
                </label>
                <input
                  type="text"
                  name="title"
                  defaultValue={formData.current.title || ""}
                  onChange={(e) => {
                    formData.current.title = e.target.value;
                  }}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-gray-400 transition"
                  placeholder="Enter film title"
                  required
                />
              </div>

              {/* Overview */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Overview *
                </label>
                <textarea
                  name="overview"
                  defaultValue={formData.current.overview || ""}
                  onChange={(e) => {
                    formData.current.overview = e.target.value;
                  }}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-gray-400 transition min-h-[120px]"
                  placeholder="Brief description of the film"
                  required
                />
              </div>

              {/* Release Date */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Release Date *
                </label>
                <input
                  type="date"
                  name="releaseDate"
                  defaultValue={formData.current.releaseDate || ""}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white transition"
                  required
                />
              </div>
            </div>

            {/* Media Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-200 border-b border-gray-700 pb-2">
                Media Assets
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Backdrop */}
                <div className="relative group flex flex-col gap-y-[10px]">
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Backdrop Image *
                  </label>
                  <div className="relative h-40 bg-gray-700 border-2 border-dashed border-gray-600 rounded-xl flex flex-col items-center justify-center transition hover:border-indigo-500 group-hover:border-indigo-500 overflow-hidden">
                    <div className="flex flex-col items-center justify-center h-full">
                      <FiImage className="text-gray-500 text-2xl mb-2" />
                      <span className="text-gray-400 text-sm">
                        Click to upload
                      </span>
                    </div>

                    <input
                      type="file"
                      name="backdrop"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      required={formData.current.backdrop === null}
                    />
                  </div>
                  {previewImages.backdrop && (
                    <img
                      src={previewImages.backdrop}
                      alt="Backdrop Preview"
                      className="w-full h-auto object-cover rounded-[8px]"
                    />
                  )}
                </div>

                {/* Poster */}
                <div className="relative group flex flex-col gap-y-[10px]">
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Poster Image *
                  </label>
                  <div className="relative h-40 bg-gray-700 border-2 border-dashed border-gray-600 rounded-xl flex flex-col items-center justify-center transition hover:border-indigo-500 group-hover:border-indigo-500 overflow-hidden">
                    <div className="flex flex-col items-center justify-center h-full">
                      <FiImage className="text-gray-500 text-2xl mb-2" />
                      <span className="text-gray-400 text-sm">
                        Click to upload
                      </span>
                    </div>
                    <input
                      type="file"
                      name="poster"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      required={formData.current.poster === null}
                    />
                  </div>
                  {previewImages.poster && (
                    <img
                      src={previewImages.poster}
                      alt="Backdrop Preview"
                      className="w-full h-auto object-cover rounded-[8px]"
                    />
                  )}
                </div>
              </div>

              {/* Video */}
              <div className="relative group flex flex-col gap-y-[10px]">
                <label className="block text-sm font-medium text-gray-400">
                  Video File *
                </label>
                <div className="relative bg-gray-700 border-2 border-dashed border-gray-600 rounded-xl flex flex-col items-center justify-center transition hover:border-indigo-500 group-hover:border-indigo-500 overflow-hidden min-h-[150px]">
                  <div className="flex flex-col items-center justify-center h-full">
                    <FiVideo className="text-gray-500 text-2xl mb-2" />
                    <span className="text-gray-400 text-sm">
                      Click to upload video
                    </span>
                    <span className="text-gray-500 text-xs mt-1">
                      Max 100MB
                    </span>
                  </div>
                  <input
                    type="file"
                    name="video"
                    accept="video/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    required={formData.current.video === null}
                  />
                </div>
                {previewImages.video && (
                  <video
                    ref={videoRef}
                    controls
                    className="w-full max-h-64 object-contain rounded-[8px]"
                    src={previewImages.video}
                  />
                )}
              </div>
            </div>

            {/* Genres Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-200 border-b border-gray-700 pb-2">
                Genres
              </h2>

              <div className="space-y-3">
                {genreSelection.map((ele, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <select
                      name="genres"
                      onChange={(e) => handleGenreChange(e, index)}
                      className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white cursor-pointer"
                      required
                    >
                      {genreOptions.map((genre) => (
                        <option value={genre} selected={ele === genre}>
                          {genre}
                        </option>
                      ))}
                    </select>
                    {genreSelection.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveGenreSelect(index)}
                        className="p-2 text-gray-400 hover:text-red-500 transition"
                        aria-label="Remove genre"
                      >
                        <FiTrash2 />
                      </button>
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => setGenreSelection((prev) => [...prev, ""])}
                  className="flex items-center text-indigo-400 hover:text-indigo-300 transition mt-2"
                >
                  <FiPlusCircle className="mr-2" />
                  Add Another Genre
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-6 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-medium text-white transition flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800"
              >
                {loading ? (
                  <>
                    <FiLoader className="animate-spin mr-2" />
                    Updating...
                  </>
                ) : (
                  <>
                    <FiUpload className="mr-2" />
                    Update this Film
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {cropModal.open && (
        <CropModal
          cropModal={cropModal}
          onCancel={setCropModal}
          onComplete={handleCropDone}
        />
      )}
    </div>
  );
}

export default UpdateSystemFilm;
