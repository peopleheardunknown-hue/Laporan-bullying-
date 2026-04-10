-- 1. Create Profiles Table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT CHECK (role IN ('admin', 'guru_bk', 'siswa')) DEFAULT 'siswa',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Create Reports Table
CREATE TABLE reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reporter_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  victim_name TEXT NOT NULL,
  perpetrator_name TEXT,
  location TEXT NOT NULL,
  incident_date DATE NOT NULL,
  description TEXT NOT NULL,
  evidence_url TEXT,
  status TEXT CHECK (status IN ('diterima', 'diproses', 'selesai')) DEFAULT 'diterima',
  is_anonymous BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Create Follow Ups Table
CREATE TABLE follow_ups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  report_id UUID REFERENCES reports(id) ON DELETE CASCADE,
  guru_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  notes TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. Create Categories Table
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE follow_ups ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- 6. Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone." ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile." ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- 7. Reports Policies
CREATE POLICY "Siswa can view own reports." ON reports
  FOR SELECT USING (auth.uid() = reporter_id);

CREATE POLICY "Guru BK and Admin can view all reports." ON reports
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'guru_bk')
    )
  );

CREATE POLICY "Siswa can create reports." ON reports
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Guru BK and Admin can update reports." ON reports
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'guru_bk')
    )
  );

-- 8. Follow Ups Policies
CREATE POLICY "Everyone can view follow ups of their reports." ON follow_ups
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM reports 
      WHERE id = follow_ups.report_id AND (reporter_id = auth.uid() OR is_anonymous = false)
    ) OR
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'guru_bk')
    )
  );

CREATE POLICY "Guru BK and Admin can create follow ups." ON follow_ups
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'guru_bk')
    )
  );

-- 9. Categories Policies
CREATE POLICY "Categories are viewable by everyone." ON categories
  FOR SELECT USING (true);

CREATE POLICY "Only Admin can manage categories." ON categories
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 10. Initial Data
INSERT INTO categories (name) VALUES 
  ('Fisik'), 
  ('Verbal'), 
  ('Sosial/Relasional'), 
  ('Cyber Bullying'), 
  ('Seksual');
