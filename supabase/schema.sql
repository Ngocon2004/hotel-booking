-- =============================================================================
-- HOTEL BOOKING MANAGEMENT SYSTEM - DATABASE SCHEMA
-- =============================================================================
-- Run this file trong Supabase SQL Editor để khởi tạo toàn bộ database.
-- Bao gồm: 8 bảng, RLS policies, functions, triggers.
-- =============================================================================

-- Cleanup nếu cần (chỉ dùng khi reset hoàn toàn)
-- DROP TABLE IF EXISTS booking_services, payments, reviews, bookings, services, rooms, room_types, profiles CASCADE;

-- =============================================================================
-- 1. PROFILES (Mở rộng auth.users)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  address TEXT,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('admin', 'customer')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- 2. ROOM TYPES (Loại phòng)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.room_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  base_price DECIMAL(10, 2) NOT NULL CHECK (base_price >= 0),
  max_occupancy INT NOT NULL DEFAULT 2 CHECK (max_occupancy > 0),
  amenities JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- 3. ROOMS (Phòng vật lý)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_number TEXT UNIQUE NOT NULL,
  room_type_id UUID NOT NULL REFERENCES public.room_types(id) ON DELETE RESTRICT,
  floor INT,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'maintenance')),
  images JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_rooms_room_type_id ON public.rooms(room_type_id);
CREATE INDEX IF NOT EXISTS idx_rooms_status ON public.rooms(status);

-- =============================================================================
-- 4. SERVICES (Dịch vụ kèm theo)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
  icon TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- 5. BOOKINGS (Đặt phòng)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_code TEXT UNIQUE NOT NULL,
  customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  room_id UUID NOT NULL REFERENCES public.rooms(id) ON DELETE RESTRICT,
  check_in_date DATE NOT NULL,
  check_out_date DATE NOT NULL,
  total_guests INT NOT NULL DEFAULT 1 CHECK (total_guests > 0),
  total_price DECIMAL(10, 2) NOT NULL CHECK (total_price >= 0),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (
    status IN ('pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled')
  ),
  payment_status TEXT NOT NULL DEFAULT 'unpaid' CHECK (
    payment_status IN ('unpaid', 'paid', 'refunded')
  ),
  special_requests TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (check_out_date > check_in_date)
);

CREATE INDEX IF NOT EXISTS idx_bookings_customer_id ON public.bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_room_id ON public.bookings(room_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_dates ON public.bookings(check_in_date, check_out_date);

-- =============================================================================
-- 6. PAYMENTS (Thanh toán)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL CHECK (amount >= 0),
  method TEXT NOT NULL CHECK (method IN ('cash', 'bank_transfer', 'momo', 'vnpay')),
  transaction_id TEXT,
  paid_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- 7. REVIEWS (Đánh giá)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL UNIQUE REFERENCES public.bookings(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- 8. BOOKING_SERVICES (Many-to-many)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.booking_services (
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE RESTRICT,
  quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
  price_at_booking DECIMAL(10, 2) NOT NULL,
  PRIMARY KEY (booking_id, service_id)
);

-- =============================================================================
-- TRIGGERS: Tự động tạo profile khi user mới đăng ký
-- =============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================================================
-- TRIGGERS: Tự động cập nhật updated_at
-- =============================================================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_room_types_updated_at ON public.room_types;
CREATE TRIGGER update_room_types_updated_at BEFORE UPDATE ON public.room_types
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_rooms_updated_at ON public.rooms;
CREATE TRIGGER update_rooms_updated_at BEFORE UPDATE ON public.rooms
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_bookings_updated_at ON public.bookings;
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================================================
-- FUNCTION: Kiểm tra phòng có trống trong khoảng ngày không
-- =============================================================================
CREATE OR REPLACE FUNCTION public.check_room_availability(
  p_room_id UUID,
  p_check_in DATE,
  p_check_out DATE,
  p_exclude_booking_id UUID DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
AS $$
  SELECT NOT EXISTS (
    SELECT 1 FROM public.bookings
    WHERE room_id = p_room_id
      AND status NOT IN ('cancelled', 'checked_out')
      AND (p_exclude_booking_id IS NULL OR id != p_exclude_booking_id)
      AND daterange(check_in_date, check_out_date, '[)') && daterange(p_check_in, p_check_out, '[)')
  );
$$;

-- =============================================================================
-- FUNCTION: Sinh booking code (HTL-YYYYMMDD-XXXX)
-- =============================================================================
CREATE OR REPLACE FUNCTION public.generate_booking_code()
RETURNS TEXT
LANGUAGE SQL
AS $$
  SELECT 'HTL-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' ||
    UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 4));
$$;

-- =============================================================================
-- FUNCTION: Lấy danh sách phòng trống theo điều kiện
-- =============================================================================
CREATE OR REPLACE FUNCTION public.get_available_rooms(
  p_check_in DATE,
  p_check_out DATE,
  p_guests INT DEFAULT 1,
  p_room_type_id UUID DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  room_number TEXT,
  room_type_id UUID,
  floor INT,
  description TEXT,
  images JSONB,
  type_name TEXT,
  base_price DECIMAL,
  max_occupancy INT,
  amenities JSONB
)
LANGUAGE SQL
STABLE
AS $$
  SELECT
    r.id,
    r.room_number,
    r.room_type_id,
    r.floor,
    r.description,
    r.images,
    rt.name AS type_name,
    rt.base_price,
    rt.max_occupancy,
    rt.amenities
  FROM public.rooms r
  INNER JOIN public.room_types rt ON r.room_type_id = rt.id
  WHERE r.status = 'available'
    AND rt.max_occupancy >= p_guests
    AND (p_room_type_id IS NULL OR r.room_type_id = p_room_type_id)
    AND public.check_room_availability(r.id, p_check_in, p_check_out)
  ORDER BY rt.base_price ASC;
$$;

-- =============================================================================
-- FUNCTION: Tạo booking trong 1 transaction, khóa theo room để tránh race condition
-- =============================================================================
CREATE OR REPLACE FUNCTION public.create_booking_transaction(
  p_room_id UUID,
  p_check_in DATE,
  p_check_out DATE,
  p_guests INT,
  p_special_requests TEXT DEFAULT NULL,
  p_service_ids UUID[] DEFAULT ARRAY[]::UUID[]
)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_room_base_price DECIMAL(10, 2);
  v_max_occupancy INT;
  v_nights INT;
  v_services_total DECIMAL(10, 2) := 0;
  v_total_price DECIMAL(10, 2);
  v_booking_id UUID;
  v_booking_code TEXT;
  v_service_count INT;
  v_attempts INT := 0;
BEGIN
  v_user_id := auth.uid();

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Bạn cần đăng nhập để đặt phòng';
  END IF;

  IF p_check_out <= p_check_in THEN
    RAISE EXCEPTION 'Check-out phải sau check-in';
  END IF;

  IF p_check_in < CURRENT_DATE THEN
    RAISE EXCEPTION 'Không thể đặt phòng trong quá khứ';
  END IF;

  IF p_guests < 1 THEN
    RAISE EXCEPTION 'Số khách tối thiểu là 1';
  END IF;

  -- Serialize toàn bộ booking cho cùng 1 phòng trong transaction hiện tại.
  PERFORM pg_advisory_xact_lock(hashtextextended(p_room_id::TEXT, 0));

  SELECT rt.base_price, rt.max_occupancy
  INTO v_room_base_price, v_max_occupancy
  FROM public.rooms r
  INNER JOIN public.room_types rt ON rt.id = r.room_type_id
  WHERE r.id = p_room_id
    AND r.status = 'available';

  IF v_room_base_price IS NULL THEN
    RAISE EXCEPTION 'Không tìm thấy phòng khả dụng';
  END IF;

  IF p_guests > v_max_occupancy THEN
    RAISE EXCEPTION 'Phòng này tối đa % khách', v_max_occupancy;
  END IF;

  IF NOT public.check_room_availability(p_room_id, p_check_in, p_check_out) THEN
    RAISE EXCEPTION 'Phòng đã có người đặt trong khoảng ngày này';
  END IF;

  IF COALESCE(array_length(p_service_ids, 1), 0) > 0 THEN
    SELECT COUNT(*), COALESCE(SUM(price), 0)
    INTO v_service_count, v_services_total
    FROM public.services
    WHERE id = ANY(p_service_ids)
      AND is_active = TRUE;

    IF v_service_count != array_length(p_service_ids, 1) THEN
      RAISE EXCEPTION 'Một số dịch vụ không còn khả dụng';
    END IF;
  END IF;

  v_nights := p_check_out - p_check_in;
  v_total_price := (v_room_base_price * v_nights) + v_services_total;

  LOOP
    v_attempts := v_attempts + 1;
    v_booking_code := public.generate_booking_code();

    BEGIN
      INSERT INTO public.bookings (
        booking_code,
        customer_id,
        room_id,
        check_in_date,
        check_out_date,
        total_guests,
        total_price,
        special_requests
      )
      VALUES (
        v_booking_code,
        v_user_id,
        p_room_id,
        p_check_in,
        p_check_out,
        p_guests,
        v_total_price,
        NULLIF(TRIM(p_special_requests), '')
      )
      RETURNING id INTO v_booking_id;

      EXIT;
    EXCEPTION
      WHEN unique_violation THEN
        IF v_attempts >= 5 THEN
          RAISE EXCEPTION 'Không thể sinh mã booking duy nhất';
        END IF;
    END;
  END LOOP;

  IF COALESCE(array_length(p_service_ids, 1), 0) > 0 THEN
    INSERT INTO public.booking_services (
      booking_id,
      service_id,
      quantity,
      price_at_booking
    )
    SELECT
      v_booking_id,
      s.id,
      1,
      s.price
    FROM public.services s
    WHERE s.id = ANY(p_service_ids)
      AND s.is_active = TRUE;
  END IF;

  RETURN v_booking_code;
END;
$$;

-- =============================================================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================================================

-- Bật RLS trên tất cả các bảng
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_services ENABLE ROW LEVEL SECURITY;

-- Helper function: kiểm tra user hiện tại có phải admin không
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- =============================================================================
-- RLS: PROFILES
-- =============================================================================
DROP POLICY IF EXISTS "profiles_select_all" ON public.profiles;
CREATE POLICY "profiles_select_all" ON public.profiles
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "profiles_update_self" ON public.profiles;
CREATE POLICY "profiles_update_self" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_admin_all" ON public.profiles;
CREATE POLICY "profiles_admin_all" ON public.profiles
  FOR ALL USING (public.is_admin());

-- =============================================================================
-- RLS: ROOM_TYPES
-- =============================================================================
DROP POLICY IF EXISTS "room_types_select_all" ON public.room_types;
CREATE POLICY "room_types_select_all" ON public.room_types
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "room_types_admin_write" ON public.room_types;
CREATE POLICY "room_types_admin_write" ON public.room_types
  FOR ALL USING (public.is_admin());

-- =============================================================================
-- RLS: ROOMS
-- =============================================================================
DROP POLICY IF EXISTS "rooms_select_all" ON public.rooms;
CREATE POLICY "rooms_select_all" ON public.rooms
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "rooms_admin_write" ON public.rooms;
CREATE POLICY "rooms_admin_write" ON public.rooms
  FOR ALL USING (public.is_admin());

-- =============================================================================
-- RLS: SERVICES
-- =============================================================================
DROP POLICY IF EXISTS "services_select_all" ON public.services;
CREATE POLICY "services_select_all" ON public.services
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "services_admin_write" ON public.services;
CREATE POLICY "services_admin_write" ON public.services
  FOR ALL USING (public.is_admin());

-- =============================================================================
-- RLS: BOOKINGS
-- =============================================================================
DROP POLICY IF EXISTS "bookings_select_own" ON public.bookings;
CREATE POLICY "bookings_select_own" ON public.bookings
  FOR SELECT USING (auth.uid() = customer_id OR public.is_admin());

DROP POLICY IF EXISTS "bookings_insert_self" ON public.bookings;
CREATE POLICY "bookings_insert_self" ON public.bookings
  FOR INSERT WITH CHECK (auth.uid() = customer_id);

DROP POLICY IF EXISTS "bookings_update_own_or_admin" ON public.bookings;
CREATE POLICY "bookings_update_own_or_admin" ON public.bookings
  FOR UPDATE USING (auth.uid() = customer_id OR public.is_admin());

DROP POLICY IF EXISTS "bookings_admin_delete" ON public.bookings;
CREATE POLICY "bookings_admin_delete" ON public.bookings
  FOR DELETE USING (public.is_admin());

-- =============================================================================
-- RLS: PAYMENTS
-- =============================================================================
DROP POLICY IF EXISTS "payments_select_own" ON public.payments;
CREATE POLICY "payments_select_own" ON public.payments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.bookings b
      WHERE b.id = payments.booking_id AND (b.customer_id = auth.uid() OR public.is_admin())
    )
  );

DROP POLICY IF EXISTS "payments_admin_write" ON public.payments;
CREATE POLICY "payments_admin_write" ON public.payments
  FOR ALL USING (public.is_admin());

-- =============================================================================
-- RLS: REVIEWS
-- =============================================================================
DROP POLICY IF EXISTS "reviews_select_all" ON public.reviews;
CREATE POLICY "reviews_select_all" ON public.reviews
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "reviews_insert_after_checkout" ON public.reviews;
CREATE POLICY "reviews_insert_after_checkout" ON public.reviews
  FOR INSERT WITH CHECK (
    auth.uid() = customer_id AND
    EXISTS (
      SELECT 1 FROM public.bookings
      WHERE id = booking_id
        AND customer_id = auth.uid()
        AND status = 'checked_out'
    )
  );

DROP POLICY IF EXISTS "reviews_update_own" ON public.reviews;
CREATE POLICY "reviews_update_own" ON public.reviews
  FOR UPDATE USING (auth.uid() = customer_id);

DROP POLICY IF EXISTS "reviews_delete_own_or_admin" ON public.reviews;
CREATE POLICY "reviews_delete_own_or_admin" ON public.reviews
  FOR DELETE USING (auth.uid() = customer_id OR public.is_admin());

-- =============================================================================
-- RLS: BOOKING_SERVICES
-- =============================================================================
DROP POLICY IF EXISTS "booking_services_select_own" ON public.booking_services;
CREATE POLICY "booking_services_select_own" ON public.booking_services
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.bookings
      WHERE id = booking_services.booking_id
        AND (customer_id = auth.uid() OR public.is_admin())
    )
  );

DROP POLICY IF EXISTS "booking_services_insert_own" ON public.booking_services;
CREATE POLICY "booking_services_insert_own" ON public.booking_services
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.bookings
      WHERE id = booking_services.booking_id AND customer_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "booking_services_admin_write" ON public.booking_services;
CREATE POLICY "booking_services_admin_write" ON public.booking_services
  FOR ALL USING (public.is_admin());

-- =============================================================================
-- STORAGE BUCKETS
-- =============================================================================
-- Tạo bucket để upload ảnh phòng và avatar
INSERT INTO storage.buckets (id, name, public)
VALUES
  ('rooms', 'rooms', true),
  ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Policies cho Storage
DROP POLICY IF EXISTS "Public read rooms" ON storage.objects;
CREATE POLICY "Public read rooms" ON storage.objects
  FOR SELECT USING (bucket_id = 'rooms');

DROP POLICY IF EXISTS "Admin upload rooms" ON storage.objects;
CREATE POLICY "Admin upload rooms" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'rooms' AND public.is_admin());

DROP POLICY IF EXISTS "Admin delete rooms" ON storage.objects;
CREATE POLICY "Admin delete rooms" ON storage.objects
  FOR DELETE USING (bucket_id = 'rooms' AND public.is_admin());

DROP POLICY IF EXISTS "Public read avatars" ON storage.objects;
CREATE POLICY "Public read avatars" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "User upload own avatar" ON storage.objects;
CREATE POLICY "User upload own avatar" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]
  );

DROP POLICY IF EXISTS "User update own avatar" ON storage.objects;
CREATE POLICY "User update own avatar" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- =============================================================================
-- HOÀN THÀNH SCHEMA
-- =============================================================================
-- Sau khi chạy file này, hãy:
-- 1. Tạo Admin user đầu tiên qua Supabase Dashboard hoặc dùng script seed.ts
-- 2. UPDATE profiles SET role = 'admin' WHERE id = 'your-admin-uid';
-- =============================================================================
