import { Link } from 'react-router-dom';
import { Shield, ShieldAlert, Users, CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'motion/react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 md:px-12 bg-white/80 backdrop-blur-md sticky top-0 z-50 border-bottom border-slate-100">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Shield className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-bold text-slate-900 tracking-tight">SafeSchool</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login">
            <Button variant="ghost" className="font-medium">Login</Button>
          </Link>
          <Link to="/login">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6">
              Mulai Lapor
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 py-16 md:px-12 md:py-24 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold"
          >
            <ShieldAlert className="w-4 h-4" />
            Stop Bullying di Sekolah
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold text-slate-900 leading-[1.1]"
          >
            Ciptakan Sekolah yang <span className="text-blue-600">Aman</span> & <span className="text-blue-600">Nyaman</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-slate-600 max-w-xl leading-relaxed"
          >
            SafeSchool adalah platform pelaporan bullying rahasia yang membantu siswa melaporkan kejadian secara aman. Bersama kita cegah perundungan untuk masa depan yang lebih cerah.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap gap-4"
          >
            <Link to="/login">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg rounded-xl flex gap-2">
                Laporkan Sekarang <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="px-8 py-6 text-lg rounded-xl border-slate-200">
              Pelajari Lebih Lanjut
            </Button>
          </motion.div>
        </div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="flex-1 relative"
        >
          <div className="absolute -top-4 -left-4 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
          <div className="absolute -bottom-8 -right-4 w-72 h-72 bg-red-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
          <img 
            src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1000" 
            alt="Students collaborating" 
            className="rounded-3xl shadow-2xl relative z-10 w-full object-cover aspect-[4/3]"
            referrerPolicy="no-referrer"
          />
        </motion.div>
      </section>

      {/* Features */}
      <section className="bg-slate-50 py-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Mengapa Memilih SafeSchool?</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Sistem kami dirancang untuk memberikan perlindungan maksimal bagi pelapor dan penanganan yang tepat sasaran.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Shield className="w-8 h-8 text-blue-600" />,
                title: "Laporan Anonim",
                desc: "Identitas pelapor dapat dirahasiakan untuk menjamin keamanan dan kenyamanan siswa."
              },
              {
                icon: <Users className="w-8 h-8 text-blue-600" />,
                title: "Penanganan Guru BK",
                desc: "Setiap laporan akan langsung diterima dan ditindaklanjuti oleh guru BK yang berkompeten."
              },
              {
                icon: <CheckCircle className="w-8 h-8 text-blue-600" />,
                title: "Monitoring Status",
                desc: "Siswa dapat memantau perkembangan laporan mereka secara real-time melalui dashboard."
              }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -5 }}
                className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-4"
              >
                <div className="bg-blue-50 w-16 h-16 flex items-center justify-center rounded-xl mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 md:px-12 border-t border-slate-100 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Shield className="text-blue-600 w-6 h-6" />
          <span className="text-xl font-bold text-slate-900 tracking-tight">SafeSchool</span>
        </div>
        <p className="text-slate-500 text-sm">© 2026 SafeSchool. Bersama Ciptakan Lingkungan Sekolah Tanpa Bullying.</p>
      </footer>
    </div>
  );
}
