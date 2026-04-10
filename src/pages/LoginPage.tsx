import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Mail, Lock, Loader2, ArrowLeft } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isRegistering) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw error;
        
        if (data.user) {
          // Check if it's the first user to make them admin
          const { count } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
          const role = count === 0 ? 'admin' : 'siswa';

          const { error: profileError } = await supabase.from('profiles').insert([
            {
              id: data.user.id,
              email: email,
              full_name: email.split('@')[0],
              role: role,
            }
          ]);

          if (profileError) console.error('Error creating profile:', profileError);
          
          toast.success('Registrasi berhasil! Silakan cek email untuk verifikasi.');
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        
        toast.success('Login berhasil!');
        navigate('/app');
      }
    } catch (error: any) {
      toast.error(error.message || 'Terjadi kesalahan saat autentikasi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans">
      <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Kembali ke Beranda
      </Link>

      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-200 mb-2">
            <Shield className="text-white w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">SafeSchool</h1>
          <p className="text-slate-500">Sistem Pelaporan Bullying Sekolah</p>
        </div>

        <Card className="border-none shadow-xl shadow-slate-200/60 rounded-3xl overflow-hidden">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl font-bold">{isRegistering ? 'Buat Akun' : 'Selamat Datang'}</CardTitle>
            <CardDescription>
              {isRegistering 
                ? 'Daftar sebagai siswa untuk mulai melaporkan bullying.' 
                : 'Masuk ke akun Anda untuk mengakses dashboard.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAuth} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="nama@sekolah.sch.id" 
                    className="pl-10 h-11 rounded-xl border-slate-200 focus:ring-blue-500"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  {!isRegistering && (
                    <button type="button" className="text-xs font-medium text-blue-600 hover:underline">
                      Lupa password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="••••••••" 
                    className="pl-10 h-11 rounded-xl border-slate-200 focus:ring-blue-500"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              <Button 
                type="submit" 
                className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  isRegistering ? 'Daftar Sekarang' : 'Masuk'
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 bg-slate-50/50 border-t border-slate-100 py-6">
            <div className="text-sm text-center text-slate-600">
              {isRegistering ? 'Sudah punya akun?' : 'Belum punya akun?'}
              <button 
                onClick={() => setIsRegistering(!isRegistering)}
                className="ml-1 font-semibold text-blue-600 hover:underline"
              >
                {isRegistering ? 'Masuk di sini' : 'Daftar sebagai siswa'}
              </button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
