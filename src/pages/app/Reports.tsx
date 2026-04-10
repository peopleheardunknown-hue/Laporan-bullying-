import React, { useEffect, useState } from 'react';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Eye, 
  MessageSquare, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  ShieldAlert,
  ChevronRight,
  User
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Report } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';

export default function Reports() {
  const { profile, isAdmin, isGuruBK, isSiswa } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [followUpNotes, setFollowUpNotes] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    fetchReports();
  }, [profile]);

  const fetchReports = async () => {
    try {
      let query = supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (isSiswa) {
        query = query.eq('reporter_id', profile?.id);
      }

      const { data, error } = await query;
      if (error) throw error;
      setReports(data as Report[]);
    } catch (err) {
      console.error('Error fetching reports:', err);
      toast.error('Gagal memuat laporan');
    } finally {
      setLoading(false);
    }
  };

  const updateReportStatus = async (reportId: string, newStatus: Report['status']) => {
    setUpdatingStatus(true);
    try {
      const { error } = await supabase
        .from('reports')
        .update({ status: newStatus })
        .eq('id', reportId);

      if (error) throw error;

      // Add follow up if notes provided
      if (followUpNotes) {
        await supabase.from('follow_ups').insert([
          {
            report_id: reportId,
            guru_id: profile?.id,
            notes: followUpNotes
          }
        ]);
      }

      toast.success(`Status laporan diperbarui menjadi ${newStatus}`);
      fetchReports();
      setIsDetailOpen(false);
      setFollowUpNotes('');
    } catch (err: any) {
      toast.error(err.message || 'Gagal memperbarui status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const filteredReports = reports.filter(report => 
    report.victim_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    report.perpetrator_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    report.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: Report['status']) => {
    switch (status) {
      case 'diterima':
        return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-none px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">Diterima</Badge>;
      case 'diproses':
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">Diproses</Badge>;
      case 'selesai':
        return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">Selesai</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-slate-900">Daftar Laporan</h1>
          <p className="text-slate-500">
            {isSiswa ? 'Riwayat laporan bullying yang Anda kirimkan.' : 'Kelola semua laporan bullying yang masuk.'}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Cari laporan..." 
              className="pl-10 w-full md:w-64 h-11 rounded-xl border-slate-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" className="h-11 rounded-xl border-slate-200 gap-2">
            <Filter className="w-4 h-4" /> Filter
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <AnimatePresence mode="popLayout">
          {loading ? (
            <div className="py-20 text-center text-slate-400">Memuat data laporan...</div>
          ) : filteredReports.length === 0 ? (
            <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200">
              <ShieldAlert className="w-12 h-12 text-slate-200 mx-auto mb-4" />
              <p className="text-slate-500 font-medium">Tidak ada laporan ditemukan.</p>
            </div>
          ) : (
            filteredReports.map((report, i) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card 
                  className="border-none shadow-sm hover:shadow-md transition-all duration-200 rounded-2xl overflow-hidden cursor-pointer group"
                  onClick={() => {
                    setSelectedReport(report);
                    setIsDetailOpen(true);
                  }}
                >
                  <CardContent className="p-0">
                    <div className="flex items-center p-4 md:p-6 gap-6">
                      <div className={`hidden md:flex shrink-0 w-14 h-14 items-center justify-center rounded-2xl ${
                        report.status === 'diterima' ? 'bg-amber-50 text-amber-600' :
                        report.status === 'diproses' ? 'bg-blue-50 text-blue-600' :
                        'bg-emerald-50 text-emerald-600'
                      }`}>
                        <ShieldAlert className="w-7 h-7" />
                      </div>
                      
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-slate-900 truncate">Korban: {report.victim_name}</h3>
                          {report.is_anonymous && (
                            <Badge variant="outline" className="text-[9px] uppercase tracking-tighter h-4 px-1 border-slate-200 text-slate-400">Anonim</Badge>
                          )}
                        </div>
                        <p className="text-sm text-slate-500 line-clamp-1">{report.description}</p>
                        <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(report.created_at).toLocaleDateString('id-ID')}</span>
                          <span className="flex items-center gap-1"><User className="w-3 h-3" /> Pelaku: {report.perpetrator_name || 'Tidak diketahui'}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="hidden sm:block">
                          {getStatusBadge(report.status)}
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-600 transition-colors" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Report Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
          {selectedReport && (
            <>
              <DialogHeader className="bg-slate-900 text-white p-8">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <DialogTitle className="text-2xl font-bold">Detail Laporan</DialogTitle>
                    <DialogDescription className="text-slate-400">ID Laporan: #{selectedReport.id.slice(0, 8)}</DialogDescription>
                  </div>
                  {getStatusBadge(selectedReport.status)}
                </div>
              </DialogHeader>
              
              <div className="p-8 space-y-8 max-h-[60vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Nama Korban</p>
                    <p className="text-lg font-bold text-slate-900">{selectedReport.victim_name}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Nama Pelaku</p>
                    <p className="text-lg font-bold text-slate-900">{selectedReport.perpetrator_name || 'Tidak diketahui'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Lokasi Kejadian</p>
                    <p className="text-slate-700 font-medium">{selectedReport.location}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tanggal Kejadian</p>
                    <p className="text-slate-700 font-medium">{new Date(selectedReport.incident_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Deskripsi Kejadian</p>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-slate-700 leading-relaxed">
                    {selectedReport.description}
                  </div>
                </div>

                {(isAdmin || isGuruBK) && selectedReport.status !== 'selesai' && (
                  <div className="space-y-4 pt-4 border-t border-slate-100">
                    <p className="text-sm font-bold text-slate-900">Tindak Lanjut Guru BK</p>
                    <textarea 
                      className="w-full min-h-[100px] p-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
                      placeholder="Tambahkan catatan tindak lanjut..."
                      value={followUpNotes}
                      onChange={(e) => setFollowUpNotes(e.target.value)}
                    />
                  </div>
                )}
              </div>

              <DialogFooter className="bg-slate-50 p-6 border-t border-slate-100 flex flex-row gap-3">
                <Button variant="outline" className="flex-1 h-11 rounded-xl" onClick={() => setIsDetailOpen(false)}>
                  Tutup
                </Button>
                
                {(isAdmin || isGuruBK) && (
                  <>
                    {selectedReport.status === 'diterima' && (
                      <Button 
                        className="flex-1 h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
                        onClick={() => updateReportStatus(selectedReport.id, 'diproses')}
                        disabled={updatingStatus}
                      >
                        Proses Laporan
                      </Button>
                    )}
                    {selectedReport.status === 'diproses' && (
                      <Button 
                        className="flex-1 h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                        onClick={() => updateReportStatus(selectedReport.id, 'selesai')}
                        disabled={updatingStatus}
                      >
                        Selesaikan
                      </Button>
                    )}
                  </>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
