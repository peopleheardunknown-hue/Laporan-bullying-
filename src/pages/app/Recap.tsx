import React, { useEffect, useState } from 'react';
import { 
  BarChart3, 
  PieChart, 
  Download, 
  Calendar as CalendarIcon,
  Filter,
  TrendingUp,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Report } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'motion/react';

export default function Recap() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReports(data as Report[]);
    } catch (err) {
      console.error('Error fetching reports:', err);
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    total: reports.length,
    pending: reports.filter(r => r.status === 'diterima').length,
    processing: reports.filter(r => r.status === 'diproses').length,
    completed: reports.filter(r => r.status === 'selesai').length,
  };

  // Group by location for simple stats
  const locationStats = reports.reduce((acc: any, report) => {
    acc[report.location] = (acc[report.location] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-slate-900">Rekap Laporan Bullying</h1>
          <p className="text-slate-500">Statistik dan ringkasan data perundungan di sekolah.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-11 rounded-xl border-slate-200 gap-2">
            <CalendarIcon className="w-4 h-4" /> Bulan Ini
          </Button>
          <Button className="h-11 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold gap-2">
            <Download className="w-4 h-4" /> Export PDF
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-sm rounded-2xl bg-white">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="bg-blue-50 p-4 rounded-2xl">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total Kasus</p>
              <p className="text-3xl font-bold text-slate-900">{stats.total}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm rounded-2xl bg-white">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="bg-amber-50 p-4 rounded-2xl">
              <AlertTriangle className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Belum Selesai</p>
              <p className="text-3xl font-bold text-slate-900">{stats.pending + stats.processing}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm rounded-2xl bg-white">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="bg-emerald-50 p-4 rounded-2xl">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Tingkat Penyelesaian</p>
              <p className="text-3xl font-bold text-slate-900">
                {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Location Stats */}
        <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
          <CardHeader className="bg-white border-b border-slate-100 p-6">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <PieChart className="w-5 h-5 text-blue-600" /> Lokasi Kejadian Terbanyak
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              {Object.entries(locationStats).length === 0 ? (
                <p className="text-center text-slate-400 py-8">Belum ada data lokasi.</p>
              ) : (
                Object.entries(locationStats)
                  .sort((a: any, b: any) => b[1] - a[1])
                  .map(([location, count]: any, i) => (
                    <div key={location} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-bold text-slate-700">{location}</span>
                        <span className="font-bold text-slate-900">{count} Kasus</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${(count / stats.total) * 100}%` }}
                          transition={{ duration: 1, delay: i * 0.1 }}
                          className="h-full bg-blue-600 rounded-full"
                        />
                      </div>
                    </div>
                  ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Status Distribution */}
        <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
          <CardHeader className="bg-white border-b border-slate-100 p-6">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" /> Distribusi Status Laporan
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 gap-4">
              {[
                { label: 'Diterima', count: stats.pending, color: 'bg-amber-500', text: 'text-amber-700', bg: 'bg-amber-50' },
                { label: 'Diproses', count: stats.processing, color: 'bg-blue-500', text: 'text-blue-700', bg: 'bg-blue-50' },
                { label: 'Selesai', count: stats.completed, color: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50' },
              ].map((item) => (
                <div key={item.label} className={`flex items-center justify-between p-4 rounded-2xl ${item.bg}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${item.color}`} />
                    <span className={`font-bold ${item.text}`}>{item.label}</span>
                  </div>
                  <span className={`text-xl font-bold ${item.text}`}>{item.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
