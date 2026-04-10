import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Shield, 
  Bell,
  PlusCircle,
  BarChart3,
  ClipboardList
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

export default function DashboardLayout() {
  const { profile, signOut, isAdmin, isGuruBK, isSiswa } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const menuItems = [
    { 
      title: 'Dashboard', 
      icon: <LayoutDashboard className="w-5 h-5" />, 
      path: '/app',
      show: true 
    },
    { 
      title: 'Buat Laporan', 
      icon: <PlusCircle className="w-5 h-5" />, 
      path: '/app/report/new',
      show: isSiswa 
    },
    { 
      title: 'Laporan Saya', 
      icon: <FileText className="w-5 h-5" />, 
      path: '/app/reports',
      show: isSiswa 
    },
    { 
      title: 'Laporan Bullying', 
      icon: <ClipboardList className="w-5 h-5" />, 
      path: '/app/reports',
      show: isAdmin || isGuruBK 
    },
    { 
      title: 'Rekap Laporan', 
      icon: <BarChart3 className="w-5 h-5" />, 
      path: '/app/recap',
      show: isAdmin || isGuruBK 
    },
    { 
      title: 'User Management', 
      icon: <Users className="w-5 h-5" />, 
      path: '/app/users',
      show: isAdmin 
    },
    { 
      title: 'Pengaturan', 
      icon: <Settings className="w-5 h-5" />, 
      path: '/app/settings',
      show: true 
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* Sidebar */}
      <aside className={cn(
        "bg-white border-r border-slate-200 transition-all duration-300 flex flex-col z-40",
        isSidebarOpen ? "w-64" : "w-20"
      )}>
        <div className="p-6 flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg shrink-0">
            <Shield className="text-white w-6 h-6" />
          </div>
          {isSidebarOpen && <span className="font-bold text-xl tracking-tight text-slate-900">SafeSchool</span>}
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {menuItems.filter(item => item.show).map((item) => (
            <Link 
              key={item.path} 
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group",
                location.pathname === item.path 
                  ? "bg-blue-50 text-blue-600" 
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <div className={cn(
                "shrink-0 transition-colors",
                location.pathname === item.path ? "text-blue-600" : "text-slate-400 group-hover:text-slate-900"
              )}>
                {item.icon}
              </div>
              {isSidebarOpen && <span className="font-medium">{item.title}</span>}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-slate-50 text-slate-400"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-slate-900">
              {menuItems.find(item => item.path === location.pathname)?.title || 'Dashboard'}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-blue-600 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-3 pl-2 pr-1 h-10 rounded-full hover:bg-slate-50">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-bold text-slate-900 leading-none">{profile?.full_name}</p>
                    <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider mt-1">{profile?.role}</p>
                  </div>
                  <Avatar className="h-8 w-8 border border-slate-200">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.email}`} />
                    <AvatarFallback>{profile?.full_name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-xl p-2">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{profile?.full_name}</p>
                    <p className="text-xs leading-none text-slate-500">{profile?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="rounded-lg cursor-pointer">
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="rounded-lg cursor-pointer">
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="rounded-lg cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                  onClick={handleSignOut}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
