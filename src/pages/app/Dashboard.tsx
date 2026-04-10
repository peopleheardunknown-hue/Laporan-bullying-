import React, { useEffect, useState } from 'react';
import { 
  FileText, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  TrendingUp,
  Users,
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { Report } from '@/types';
import { motion } from 'motion/react';

export default function Dashboard() {
  const { profile, isAdmin, isGuruBK, isSiswa } = useAuth();
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    processing: 0,
    completed: 0
  });
  const [recentReports, setRecentReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    fetchRecentReports();
  }, [profile]);

  const fetchStats = async () => {
    try {
      let query = supabase.from('reports').select('*', { count: 'exact' });
      
      if (isSiswa) {
        query = query.eq('reporter_id', profile?.id);
      }

      const { data, count, error } = await query;
      if (error) throw error;

      const reports = data as Report[];
      setStats({
        total: count || 0,
        pending: reports.filter(r => r.status === 'diterima').length,
        processing: reports.filter(r => r.status === 'diproses').length,
        completed: reports.filter(r => r.status === 'selesai').length
      });
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const fetchRecentReports = async () => {
    try {
      let query = supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (isSiswa) {
        query = query.eq('reporter_id', profile?.id);
      }

      const { data, error } = await query;
      if (error) throw error;
      setRecentReports(data as Report[]);
    } catch (err) {
      console.error('Error fetching reports:', err);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { 
      title: 'Total Laporan', 
      value: stats.total, 
      icon: <FileText className="w-5 h-5 text-blue-600" />,
      bg: 'bg-blue-50',
      color: 'text-blue-600'
    },
    { 
      title: 'Belum Diproses', 
      value: stats.pending, 
      icon: <Clock className="w-5 h-5 text-amber-600" />,
      bg: 'bg-amber-50',
      color: 'text-amber-600'
    },
    { 
      title: 'Sedang Diproses', 
      value: stats.processing, 
      icon: <TrendingUp className="w-5 h-5 text-indigo-600" />,
      bg: 'bg-indigo-50',
      color: 'text-indigo-600'
    },
    { 
      title: 'Selesai', 
      value: stats.completed, 
      icon: <CheckCircle className="w-5 h-5 text-emerald-600" />,
      bg: 'bg-emerald-50',
      color: 'text-emerald-600'
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-slate-900">Halo, {profile?.full_name}! 👋</h1>
        <p className="text-slate-500">Berikut adalah ringkasan aktivitas pelaporan bullying.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="border-none shadow-sm hover:shadow-md transition-shadow duration-200 rounded-2xl overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                    <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                  </div>
                  <div className={`${stat.bg} p-3 rounded-xl`}>
                    {stat.icon}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Reports */}
        <Card className="lg:col-span-2 border-none shadow-sm rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-bold">Laporan Terbaru</CardTitle>
            <button className="text-sm font-semibold text-blue-600 hover:underline">Lihat Semua</button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loading ? (
                <div className="py-8 text-center text-slate-400">Memuat data...</div>
              ) : recentReports.length === 0 ? (
                <div className="py-8 text-center text-slate-400">Belum ada laporan.</div>
              ) : (
                recentReports.map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${
                        report.status === 'diterima' ? 'bg-amber-100 text-amber-600' :
                        report.status === 'diproses' ? 'bg-blue-100 text-blue-600' :
                        'bg-emerald-100 text-emerald-600'
                      }`}>
                        <ShieldAlert className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{report.victim_name}</p>
                        <p className="text-xs text-slate-500">{new Date(report.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${
                        report.status === 'diterima' ? 'bg-amber-100 text-amber-700' :
                        report.status === 'diproses' ? 'bg-blue-100 text-blue-700' :
                        'bg-emerald-100 text-emerald-700'
                      }`}>
                        {report.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions / Info */}
        <div className="space-y-6">
          <Card className="border-none shadow-sm rounded-2xl bg-blue-600 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
            <CardHeader>
              <CardTitle className="text-lg font-bold">Butuh Bantuan?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 relative z-10">
              <p className="text-sm text-blue-100">Jika Anda dalam keadaan darurat atau butuh bantuan segera, hubungi guru BK atau petugas keamanan sekolah.</p>
              <button className="w-full py-3 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-colors">
                Hubungi Guru BK
              </button>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Statistik Pengguna</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-600">Total Siswa</span>
                  </div>
                  <span className="font-bold">1,240</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-600">Laporan Bulan Ini</span>
                  </div>
                  <span className="font-bold text-red-600">+12</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
