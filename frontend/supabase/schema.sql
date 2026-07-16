-- Profiles table (extends Supabase Auth users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'worker', 'admin')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Listings table
CREATE TABLE listings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  category TEXT,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contact messages table
CREATE TABLE contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Testimonials table
CREATE TABLE testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT,
  content TEXT NOT NULL,
  avatar_url TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  is_visible BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Services table
CREATE TABLE services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  price DECIMAL(10,2),
  color TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT USING (TRUE);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Listings policies
CREATE POLICY "Listings are viewable by everyone"
  ON listings FOR SELECT USING (TRUE);

CREATE POLICY "Authenticated users can insert listings"
  ON listings FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update own listings"
  ON listings FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own listings"
  ON listings FOR DELETE USING (auth.uid() = user_id);

-- Contact messages policies
CREATE POLICY "Anyone can insert contact messages"
  ON contact_messages FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Only admins can view contact messages"
  ON contact_messages FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Testimonials policies
CREATE POLICY "Visible testimonials are viewable by everyone"
  ON testimonials FOR SELECT USING (is_visible = TRUE);

CREATE POLICY "Admins can manage testimonials"
  ON testimonials FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Services policies
CREATE POLICY "Active services are viewable by everyone"
  ON services FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Admins can manage services"
  ON services FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Triggers
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, phone, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    NEW.email,
    NEW.raw_user_meta_data->>'phone',
    COALESCE(NEW.raw_user_meta_data->>'role', 'customer')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Seed data
INSERT INTO services (name, description, icon, price, color) VALUES
  ('Plumber', 'Pipe fitting, leak repair, bathroom fitting', 'FaWrench', 199, 'bg-blue-100 text-blue-600'),
  ('Electrician', 'Wiring, switch repair, fan installation', 'FaBolt', 179, 'bg-yellow-100 text-yellow-600'),
  ('Carpenter', 'Furniture repair, door fitting, shelf work', 'FaHammer', 249, 'bg-amber-100 text-amber-600'),
  ('House Painter', 'Interior & exterior painting, texture work', 'FaPaintRoller', 299, 'bg-purple-100 text-purple-600'),
  ('House Cleaning', 'Deep cleaning, kitchen, bathroom, full home', 'FaBroom', 149, 'bg-green-100 text-green-600'),
  ('Driver / Maid', 'Daily driver, part-time maid, cooking help', 'FaCar', 399, 'bg-red-100 text-red-600');

INSERT INTO testimonials (name, role, content, rating) VALUES
  ('Ravi Singh', 'Homeowner', 'GharSathi helped me find a great plumber in minutes. The service was professional and affordable!', 5),
  ('Neha Gupta', 'Homeowner', 'I love how easy it is to book services. The workers are always on time and very skilled.', 5),
  ('Arun Mehta', 'Homeowner', 'The emergency service is a lifesaver! Got an electrician in 15 minutes at 11 PM.', 4),
  ('Priya Sharma', 'Homeowner', 'Very reliable platform. I have booked multiple services and every experience has been great.', 5),
  ('Amit Patel', 'Homeowner', 'The trust score system is amazing. I can see reviews before booking. Very transparent.', 4),
  ('Sunita Verma', 'Homeowner', 'My go-to app for all home services. The membership plan saves me a lot of money.', 5);
