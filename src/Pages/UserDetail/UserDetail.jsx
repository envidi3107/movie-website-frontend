import React, { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import Header from "../../components/Header/Header";
import { useNotification } from "../../context/NotificationContext";
import { useUserContext } from "../../context/AuthUserContext";
import axiosClient from "../../libs/axiosClient";

const UserDetail = () => {
  const [image, setImage] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null); // NEW
  const [passwordChangingBox, setPasswordChangingBox] = useState(false);
  const [authenticatedPassword, setAuthenticatedPassword] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { showNotification } = useNotification();
  const { authUser, saveAuthUser } = useUserContext();

  const authenticatePassword = (e) => {
    const fetchPassword = async () => {
      const data = await axiosClient.post("/auth/authenticate-password", {
        email: authUser.email,
        password: e.target.value,
      });
      setAuthenticatedPassword(data.code === 2000);
    };
    if (e.target.value) fetchPassword();
  };

  const handleChangingPassword = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newPassword = formData.get("newPassword");
    const confirmPassword = formData.get("confirmPassword");

    if (newPassword !== confirmPassword) {
      showNotification("error", "Passwords don't match!");
      return;
    }

    if (!authenticatedPassword) {
      showNotification("error", "Current password is incorrect!");
      return;
    }

    setLoading(true);
    try {
      const data = await axiosClient.post("/users/update-password", {
        password: newPassword,
      });
      showNotification("success", data.message);
      setPasswordChangingBox(false);
    } catch (err) {
      showNotification("error", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadAvatar = async () => {
    if (!avatarFile) return;

    const formData = new FormData();
    formData.append("avatarFile", avatarFile);

    try {
      const data = await axiosClient.post("/users/update", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      saveAuthUser(data.results);
      showNotification(
        "success",
        data.message || "Avatar updated successfully!",
      );

      setAvatarFile(null);
    } catch (err) {
      showNotification("error", err.message);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Header onSearching={() => {}} onReset={() => {}} />

      <div className="max-w-4xl mx-auto p-6 mt-[50px]">
        <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="md:flex">
            {/* Avatar Section */}
            <div className="md:w-1/3 p-6 flex flex-col items-center justify-center bg-gray-900">
              <div className="relative mb-4">
                {authUser?.avatarPath ? (
                  <img
                    className="w-40 h-40 rounded-full object-cover border-4 border-purple-600"
                    src={image || authUser.avatarPath}
                    alt="User avatar"
                  />
                ) : (
                  <div className="w-40 h-40 rounded-full bg-gray-700 flex items-center justify-center">
                    <FaUserCircle className="w-full h-full text-gray-400" />
                  </div>
                )}
                <label className="absolute bottom-2 right-2 bg-purple-600 p-2 rounded-full cursor-pointer hover:bg-purple-700">
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setAvatarFile(file);
                        setImage(URL.createObjectURL(file));
                      }
                    }}
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z"
                      clipRule="evenodd"
                    />
                  </svg>
                </label>
              </div>
              {avatarFile && (
                <button
                  className="mt-4 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md text-sm"
                  onClick={handleUploadAvatar}
                >
                  Upload Avatar
                </button>
              )}
              <h2 className="text-2xl font-bold text-center mt-4">
                {authUser?.username || "Username"}
              </h2>
            </div>

            {/* Info Section */}
            <div className="md:w-2/3 p-6">
              <h3 className="text-xl font-semibold mb-4 text-purple-400">
                User Information
              </h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <span className="w-32 text-gray-400">Email:</span>
                  <span className="font-medium">
                    {authUser?.email || "Not available"}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="w-32 text-gray-400">Joined:</span>
                  <span>{formatDate(authUser?.createdAt)}</span>
                </div>
                <div className="flex items-center">
                  <span className="w-32 text-gray-400">Birthday:</span>
                  <span>{formatDate(authUser?.dateOfBirth)}</span>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-gray-700">
                <button
                  onClick={() => setPasswordChangingBox(true)}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-md transition-colors"
                >
                  Change Password
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      {passwordChangingBox && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md relative">
            <button
              onClick={() => {
                setPasswordChangingBox(false);
                setAuthenticatedPassword(true);
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              ✕
            </button>

            <h3 className="text-xl font-semibold mb-4 text-center">
              Change Password
            </h3>

            <form onSubmit={handleChangingPassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="oldPassword"
                    className="w-full bg-gray-700 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter current password"
                    onBlur={authenticatePassword}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
                {!authenticatedPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    Incorrect password
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="newPassword"
                    className="w-full bg-gray-700 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter new password"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    className="w-full bg-gray-700 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Confirm new password"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 bg-purple-600 hover:bg-purple-700 rounded-md flex items-center justify-center transition-colors"
              >
                {loading ? (
                  <span className="inline-block h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  "Update Password"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDetail;
