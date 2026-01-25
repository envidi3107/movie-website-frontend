import { useState, useEffect } from 'react';
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import useRequest from '@/hooks/useRequest';
import { useNotification } from '@/contexts/NotificationContext';

export default function Dashboard() {
    const { get } = useRequest();
    const { showNotification } = useNotification();
    const [monthlyRegistrations, setMonthlyRegistrations] = useState([]);
    const [popularHours, setPopularHours] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStatistics();
    }, []);

    const fetchStatistics = async () => {
        setLoading(true);
        try {
            // Fetch monthly registrations
            const registrationsResponse = await get(
                '/admin/users/registrations/monthly'
            );
            if (registrationsResponse?.results) {
                setMonthlyRegistrations(registrationsResponse.results);
            }

            // Fetch popular hours
            const hoursResponse = await get('/admin/popular-hours');
            if (hoursResponse?.results) {
                setPopularHours(hoursResponse.results);
            }
        } catch (error) {
            showNotification('Failed to load statistics', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-white text-3xl font-black">Dashboard</h1>
                <p className="text-white/60 mt-2">
                    Overview of your platform statistics
                </p>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="text-white/60">Loading statistics...</div>
                </div>
            ) : (
                <div className="space-y-8">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="bg-[#1a0b2e] border border-white/10 rounded-2xl p-6">
                            <div className="flex items-center gap-4">
                                <div className="bg-primary/20 p-3 rounded-xl">
                                    <span className="material-symbols-outlined text-primary text-2xl">
                                        group
                                    </span>
                                </div>
                                <div>
                                    <p className="text-white/60 text-sm">
                                        Total Users
                                    </p>
                                    <p className="text-white text-2xl font-bold">
                                        {monthlyRegistrations.reduce(
                                            (sum, m) => sum + m.total_users,
                                            0
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#1a0b2e] border border-white/10 rounded-2xl p-6">
                            <div className="flex items-center gap-4">
                                <div className="bg-green-500/20 p-3 rounded-xl">
                                    <span className="material-symbols-outlined text-green-500 text-2xl">
                                        movie
                                    </span>
                                </div>
                                <div>
                                    <p className="text-white/60 text-sm">
                                        Total Movies
                                    </p>
                                    <p className="text-white text-2xl font-bold">
                                        -
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#1a0b2e] border border-white/10 rounded-2xl p-6">
                            <div className="flex items-center gap-4">
                                <div className="bg-blue-500/20 p-3 rounded-xl">
                                    <span className="material-symbols-outlined text-blue-500 text-2xl">
                                        trending_up
                                    </span>
                                </div>
                                <div>
                                    <p className="text-white/60 text-sm">
                                        Peak Hours
                                    </p>
                                    <p className="text-white text-2xl font-bold">
                                        {popularHours.length > 0
                                            ? `${popularHours[0].startHour}h`
                                            : '-'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#1a0b2e] border border-white/10 rounded-2xl p-6">
                            <div className="flex items-center gap-4">
                                <div className="bg-purple-500/20 p-3 rounded-xl">
                                    <span className="material-symbols-outlined text-purple-500 text-2xl">
                                        calendar_month
                                    </span>
                                </div>
                                <div>
                                    <p className="text-white/60 text-sm">
                                        This Month
                                    </p>
                                    <p className="text-white text-2xl font-bold">
                                        {monthlyRegistrations.length > 0
                                            ? monthlyRegistrations[
                                                  monthlyRegistrations.length -
                                                      1
                                              ]?.total_users
                                            : 0}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Monthly Registrations Chart */}
                    <div className="bg-[#1a0b2e] border border-white/10 rounded-2xl p-6">
                        <h2 className="text-white text-xl font-bold mb-6">
                            Monthly User Registrations
                        </h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={monthlyRegistrations}>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="#ffffff20"
                                />
                                <XAxis dataKey="month" stroke="#ffffff60" />
                                <YAxis stroke="#ffffff60" />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#1a0b2e',
                                        border: '1px solid #ffffff20',
                                        borderRadius: '8px',
                                    }}
                                    labelStyle={{ color: '#fff' }}
                                />
                                <Legend />
                                <Bar
                                    dataKey="total_users"
                                    fill="#8b5cf6"
                                    name="New Users"
                                    radius={[8, 8, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Popular Hours Chart */}
                    <div className="bg-[#1a0b2e] border border-white/10 rounded-2xl p-6">
                        <h2 className="text-white text-xl font-bold mb-6">
                            Popular Viewing Hours
                        </h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={popularHours.slice(0, 10)}>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="#ffffff20"
                                />
                                <XAxis
                                    dataKey="startHour"
                                    stroke="#ffffff60"
                                    label={{
                                        value: 'Hour',
                                        position: 'insideBottom',
                                        offset: -5,
                                        fill: '#ffffff60',
                                    }}
                                />
                                <YAxis
                                    stroke="#ffffff60"
                                    label={{
                                        value: 'Users',
                                        angle: -90,
                                        position: 'insideLeft',
                                        fill: '#ffffff60',
                                    }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#1a0b2e',
                                        border: '1px solid #ffffff20',
                                        borderRadius: '8px',
                                    }}
                                    labelStyle={{ color: '#fff' }}
                                />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="userCount"
                                    stroke="#8b5cf6"
                                    strokeWidth={2}
                                    name="Active Users"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}
        </div>
    );
}
