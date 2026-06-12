-- ApartZM Schema
-- Run in Supabase SQL Editor

-- Landlords / property managers
CREATE TABLE IF NOT EXISTS landlords (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL UNIQUE,
  email TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  subscription_tier TEXT DEFAULT 'free', -- free | basic (ZMW 150/mo) | pro (ZMW 400/mo)
  subscription_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Apartment listings
CREATE TABLE IF NOT EXISTS apartments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  landlord_id UUID REFERENCES landlords(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  area TEXT NOT NULL,           -- Woodlands, Kalingalinga, Ibex, Roma, Kabulonga, etc.
  address TEXT,
  bedrooms INT NOT NULL,        -- 0=bedsitter, 1,2,3,4+
  bathrooms INT DEFAULT 1,
  rent_zmw NUMERIC(10,2) NOT NULL,
  deposit_zmw NUMERIC(10,2),
  furnished TEXT DEFAULT 'unfurnished', -- unfurnished | semi-furnished | fully-furnished
  amenities TEXT[],             -- ['WiFi','DSTV','Borehole','Parking','Security','Generator']
  rules TEXT[],                 -- ['No parties','Couples only','No pets']
  contact_phone TEXT NOT NULL,
  contact_whatsapp TEXT,
  availability TEXT DEFAULT 'available', -- available | occupied | reserved
  privacy_level TEXT DEFAULT 'standard', -- standard | private | discreet
  images TEXT[],
  is_active BOOLEAN DEFAULT TRUE,
  views INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Viewing requests
CREATE TABLE IF NOT EXISTS viewing_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  apartment_id UUID REFERENCES apartments(id) ON DELETE SET NULL,
  landlord_id UUID REFERENCES landlords(id) ON DELETE SET NULL,
  requester_name TEXT NOT NULL,
  requester_phone TEXT NOT NULL,
  preferred_date TEXT,
  message TEXT,
  status TEXT DEFAULT 'pending', -- pending | confirmed | declined
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS apt_area_idx ON apartments(area);
CREATE INDEX IF NOT EXISTS apt_bedrooms_idx ON apartments(bedrooms);
CREATE INDEX IF NOT EXISTS apt_availability_idx ON apartments(availability);
CREATE INDEX IF NOT EXISTS apt_landlord_idx ON apartments(landlord_id);
CREATE INDEX IF NOT EXISTS apt_active_idx ON apartments(is_active);
