import { useState, useEffect } from 'react';
import useRequest from '@/hooks/useRequest';
import { useNotification } from '@/contexts/NotificationContext';

export default function UserManagement() {
    const { get, remove } = useRequest();
    const { showNotification } = useNotification();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    useEffect(() => {
        fetchUsers(currentPage);
    }, [currentPage]);

    const fetchUsers = async (page) => {
        setLoading(true);
        try {
            const response = await get(`/admin/get-users?page=${page}`);
            if (response?.results) {
                setUsers(response.results);
                setTotalPages(response.totalPages || 1);
            }
        } catch (error) {
            showNotification(error.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (userId) => {
        try {
            const response = await remove(`/admin/delete?userId=${userId}`);
            if (response) {
                showNotification(error.message, 'success');
                fetchUsers(currentPage);
                setDeleteConfirm(null);
            }
        } catch (error) {
            showNotification(error.message, 'error');
        }
    };

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-white text-3xl font-black">
                    User Management
                </h1>
                <p className="text-white/60 mt-2">
                    Manage all registered users
                </p>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="text-white/60">Loading users...</div>
                </div>
            ) : (
                <>
                    <div className="bg-[#1a0b2e] border border-white/10 rounded-2xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-white/5 border-b border-white/10">
                                    <tr>
                                        <th className="text-left text-white/80 font-semibold text-sm px-6 py-4">
                                            Username
                                        </th>
                                        <th className="text-left text-white/80 font-semibold text-sm px-6 py-4">
                                            Email
                                        </th>
                                        <th className="text-left text-white/80 font-semibold text-sm px-6 py-4">
                                            Role
                                        </th>
                                        <th className="text-left text-white/80 font-semibold text-sm px-6 py-4">
                                            Country
                                        </th>
                                        <th className="text-left text-white/80 font-semibold text-sm px-6 py-4">
                                            Created At
                                        </th>
                                        <th className="text-left text-white/80 font-semibold text-sm px-6 py-4">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/10">
                                    {users.map((user) => (
                                        <tr
                                            key={user.id}
                                            className="hover:bg-white/5 transition-colors"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                                                        {user.avatarPath ? (
                                                            <img
                                                                src={
                                                                    user.avatarPath
                                                                }
                                                                alt={
                                                                    user.username
                                                                }
                                                                className="w-full h-full rounded-full object-cover"
                                                            />
                                                        ) : (
                                                            <span className="material-symbols-outlined text-primary">
                                                                person
                                                            </span>
                                                        )}
                                                    </div>
                                                    <span className="text-white font-medium">
                                                        {user.username}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-white/80">
                                                {user.email}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                        user.role === 'ADMIN'
                                                            ? 'bg-primary/20 text-primary'
                                                            : 'bg-green-500/20 text-green-500'
                                                    }`}
                                                >
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-white/80">
                                                {user.country || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 text-white/80">
                                                {new Date(
                                                    user.createdAt
                                                ).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                {user.role !== 'ADMIN' && (
                                                    <button
                                                        onClick={() =>
                                                            setDeleteConfirm(
                                                                user.id
                                                            )
                                                        }
                                                        className="px-4 py-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg transition-colors font-medium text-sm"
                                                    >
                                                        Delete
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-4 mt-8">
                            <button
                                onClick={() =>
                                    setCurrentPage((prev) =>
                                        Math.max(1, prev - 1)
                                    )
                                }
                                disabled={currentPage === 1}
                                className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>
                            <span className="text-white">
                                Page {currentPage} of {totalPages}
                            </span>
                            <button
                                onClick={() =>
                                    setCurrentPage((prev) =>
                                        Math.min(totalPages, prev + 1)
                                    )
                                }
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-[#1a0b2e] border border-white/10 rounded-2xl p-8 max-w-md w-full">
                        <h3 className="text-white text-xl font-bold mb-4">
                            Confirm Delete
                        </h3>
                        <p className="text-white/60 mb-6">
                            Are you sure you want to delete this user? This
                            action cannot be undone.
                        </p>
                        <div className="flex gap-4">
                            <button
                                onClick={() => handleDelete(deleteConfirm)}
                                className="flex-1 px-4 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-colors"
                            >
                                Delete
                            </button>
                            <button
                                onClick={() => setDeleteConfirm(null)}
                                className="flex-1 px-4 py-3 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
