import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldAlert, 
  User, 
  MapPin, 
  Calendar as CalendarIcon, 
  FileText, 
  Image as ImageIcon,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { motion } from 'motion/react';

export default function CreateReport() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [formData, setFormData] = useState({
    victim_name: '',
    perpetrator_name: '',
    location: '',
    incident_date: '',
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from('reports').insert([
        {
          reporter_id: isAnonymous ? null : profile?.id,
          victim_name: formData.victim_name,
          perpetrator_name: formData.perpetrator_name,
          location: formData.location,
          incident_date: formData.incident_date,
          description: formData.description,
          status: 'diterima',
          is_anonymous: isAnonymous
        }
      ]);

      if (error) throw error;

      toast.success('Laporan berhasil dikirim! Guru BK akan segera meninjau.');
      navigate('/app/reports');
    } catch (error: any) {
      toast.error(error.message || 'Gagal mengirim laporan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-slate-900">Buat Laporan Bullying</h1>
        <p className="text-slate-500">Laporkan kejadian bullying yang Anda alami atau saksikan.</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
          <CardHeader className="bg-blue-600 text-white p-8">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-2xl">
                <ShieldAlert className="w-8 h-8 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold">Formulir Pelaporan</CardTitle>
                <CardDescription className="text-blue-100">Mohon isi data dengan sejujur-jujurnya.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Anonymous Toggle */}
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="space-y-0.5">
                  <Label className="text-base font-bold">Lapor sebagai Anonim</Label>
                  <p className="text-sm text-slate-500">Identitas Anda tidak akan ditampilkan dalam laporan.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAnonymous(!isAnonymous)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${isAnonymous ? 'bg-blue-600' : 'bg-slate-200'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isAnonymous ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="victim_name">Nama Korban</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input 
                      id="victim_name" 
                      placeholder="Nama lengkap korban" 
                      className="pl-10 h-11 rounded-xl border-slate-200"
                      value={formData.victim_name}
                      onChange={(e) => setFormData({...formData, victim_name: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="perpetrator_name">Nama Pelaku (Jika diketahui)</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input 
                      id="perpetrator_name" 
                      placeholder="Nama lengkap pelaku" 
                      className="pl-10 h-11 rounded-xl border-slate-200"
                      value={formData.perpetrator_name}
                      onChange={(e) => setFormData({...formData, perpetrator_name: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="location">Lokasi Kejadian</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input 
                      id="location" 
                      placeholder="Contoh: Kantin, Lapangan" 
                      className="pl-10 h-11 rounded-xl border-slate-200"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="incident_date">Tanggal Kejadian</Label>
                  <div className="relative">
                    <CalendarIcon className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input 
                      id="incident_date" 
                      type="date" 
                      className="pl-10 h-11 rounded-xl border-slate-200"
                      value={formData.incident_date}
                      onChange={(e) => setFormData({...formData, incident_date: e.target.value})}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Deskripsi Kejadian</Label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Textarea 
                    id="description" 
                    placeholder="Ceritakan kronologi kejadian secara detail..." 
                    className="pl-10 min-h-[120px] rounded-xl border-slate-200 pt-3"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Upload Bukti (Opsional)</Label>
                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center hover:border-blue-400 hover:bg-blue-50/50 transition-all cursor-pointer group">
                  <div className="flex flex-col items-center gap-2">
                    <div className="bg-slate-100 p-3 rounded-full group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                      <ImageIcon className="w-6 h-6 text-slate-400 group-hover:text-blue-600" />
                    </div>
                    <p className="text-sm font-medium text-slate-600">Klik atau seret foto bukti kejadian</p>
                    <p className="text-xs text-slate-400">Format: JPG, PNG, Max 5MB</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex gap-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex-1 h-12 rounded-xl border-slate-200"
                  onClick={() => navigate('/app')}
                >
                  Batal
                </Button>
                <Button 
                  type="submit" 
                  className="flex-[2] h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <span className="flex items-center gap-2">Kirim Laporan <CheckCircle2 className="w-5 h-5" /></span>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
