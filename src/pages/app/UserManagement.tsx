import React, { useEffect, useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Search, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  Shield, 
  UserCheck,
  Mail,
  Loader2
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Profile, UserRole } from '@/types';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { motion } from 'motion/react';

export default function UserManagement() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data as Profile[]);
    } catch (err) {
      console.error('Error fetching users:', err);
      toast.error('Gagal memuat data pengguna');
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus pengguna ini? Tindakan ini tidak dapat dibatalkan.')) return;

    try {
      // Note: In a real app, you'd need a service role or edge function to delete from auth.users
      // Here we just delete from profiles for demonstration
      const { error } = await supabase.from('profiles').delete().eq('id', userId);
      if (error) throw error;

      toast.success('Pengguna berhasil dihapus');
      fetchUsers();
    } catch (err: any) {
      toast.error(err.message || 'Gagal menghapus pengguna');
    }
  };

  const updateUserRole = async (userId: string, newRole: UserRole) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;

      toast.success(`Role pengguna diperbarui menjadi ${newRole}`);
      fetchUsers();
    } catch (err: any) {
      toast.error(err.message || 'Gagal memperbarui role');
    }
  };

  const filteredUsers = users.filter(user => 
    user.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-none px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">Admin</Badge>;
      case 'guru_bk':
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">Guru BK</Badge>;
      case 'siswa':
        return <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-100 border-none px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">Siswa</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
          <p className="text-slate-500">Kelola data pengguna, role, dan akses sistem.</p>
        </div>
        
        <Button className="h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold gap-2">
          <UserPlus className="w-5 h-5" /> Tambah User Baru
        </Button>
      </div>

      <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
        <CardHeader className="border-b border-slate-100 bg-white p-6">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Cari nama atau email..." 
                className="pl-10 h-11 rounded-xl border-slate-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="hover:bg-transparent border-slate-100">
                <TableHead className="w-[300px] font-bold text-slate-900">Pengguna</TableHead>
                <TableHead className="font-bold text-slate-900">Role</TableHead>
                <TableHead className="font-bold text-slate-900">Terdaftar Pada</TableHead>
                <TableHead className="text-right font-bold text-slate-900">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                    Memuat data pengguna...
                  </TableCell>
                </TableRow>
              ) : filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center text-slate-400">
                    Tidak ada pengguna ditemukan.
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id} className="hover:bg-slate-50/50 border-slate-100 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border border-slate-200">
                          <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} />
                          <AvatarFallback>{user.full_name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-900">{user.full_name}</span>
                          <span className="text-xs text-slate-500">{user.email}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell className="text-sm text-slate-500">
                      {new Date(user.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-400 hover:text-slate-900">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 rounded-xl p-2">
                          <DropdownMenuItem className="rounded-lg cursor-pointer" onClick={() => updateUserRole(user.id, 'admin')}>
                            <Shield className="w-4 h-4 mr-2 text-red-600" /> Jadikan Admin
                          </DropdownMenuItem>
                          <DropdownMenuItem className="rounded-lg cursor-pointer" onClick={() => updateUserRole(user.id, 'guru_bk')}>
                            <UserCheck className="w-4 h-4 mr-2 text-blue-600" /> Jadikan Guru BK
                          </DropdownMenuItem>
                          <DropdownMenuItem className="rounded-lg cursor-pointer" onClick={() => updateUserRole(user.id, 'siswa')}>
                            <Users className="w-4 h-4 mr-2 text-slate-600" /> Jadikan Siswa
                          </DropdownMenuItem>
                          <DropdownMenuItem className="rounded-lg cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50" onClick={() => deleteUser(user.id)}>
                            <Trash2 className="w-4 h-4 mr-2" /> Hapus User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
