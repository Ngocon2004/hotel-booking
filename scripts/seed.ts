/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
/**
 * Seed script - tạo dữ liệu mẫu cho dự án.
 *
 * Cách chạy:
 *   1. Chạy schema.sql trên Supabase SQL Editor trước.
 *   2. Cập nhật .env.local với SUPABASE_SERVICE_ROLE_KEY
 *   3. Chạy: npm run seed
 */
import { createClient } from '@supabase/supabase-js'
import { faker } from '@faker-js/faker'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import * as dotenv from 'dotenv'
import path from 'path'

dayjs.extend(utc)
dayjs.extend(timezone)

const HOTEL_TIME_ZONE = 'Asia/Ho_Chi_Minh'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing env vars. Please check .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

function slugify(text: string) {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
}

async function seed() {
  console.log('🚀 Bắt đầu seed dữ liệu...')

  try {
    // ==========================================================
    // 1. Cleanup
    // ==========================================================
    console.log('🧹 Xóa dữ liệu cũ...')
    await supabase.from('booking_services').delete().neq('booking_id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('reviews').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('payments').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('bookings').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('rooms').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('room_types').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('services').delete().neq('id', '00000000-0000-0000-0000-000000000000')

    // ==========================================================
    // 2. Tạo Admin + Customers
    // ==========================================================
    console.log('👥 Tạo users...')
    const userIds: { id: string; role: string }[] = []

    // Admin
    const { data: adminAuth, error: adminErr } = await supabase.auth.admin.createUser({
      email: 'admin@hbms.vn',
      password: 'Admin123!',
      email_confirm: true,
      user_metadata: { full_name: 'System Admin' },
    })
    if (adminErr && !adminErr.message.includes('already')) console.error(adminErr.message)
    const adminId =
      adminAuth?.user?.id ||
      (
        await supabase.auth.admin.listUsers().then((r) =>
          r.data.users.find((u) => u.email === 'admin@hbms.vn')
        )
      )?.id
    if (adminId) {
      await supabase
        .from('profiles')
        .update({ role: 'admin', full_name: 'System Admin', phone: '0901234567' })
        .eq('id', adminId)
      userIds.push({ id: adminId, role: 'admin' })
      console.log('   ✅ Admin: admin@hbms.vn / Admin123!')
    }

    // 5 Customers
    for (let i = 1; i <= 5; i++) {
      const email = `customer${i}@hbms.vn`
      const fullName = faker.person.fullName()
      const { data: cust, error } = await supabase.auth.admin.createUser({
        email,
        password: 'Customer123!',
        email_confirm: true,
        user_metadata: { full_name: fullName },
      })
      if (error && !error.message.includes('already')) {
        console.error(`   ❌ ${email}: ${error.message}`)
        continue
      }
      const id =
        cust?.user?.id ||
        (
          await supabase.auth.admin.listUsers().then((r) =>
            r.data.users.find((u) => u.email === email)
          )
        )?.id
      if (id) {
        await supabase
          .from('profiles')
          .update({
            full_name: fullName,
            phone: faker.phone.number(),
            address: faker.location.streetAddress(),
          })
          .eq('id', id)
        userIds.push({ id, role: 'customer' })
      }
    }
    console.log(`   ✅ Đã tạo ${userIds.length - 1} customers`)

    // ==========================================================
    // 3. Room Types
    // ==========================================================
    console.log('🏨 Tạo loại phòng...')
    const roomTypes = [
      {
        name: 'Standard',
        slug: 'standard',
        description: 'Phòng tiêu chuẩn ấm cúng, đầy đủ tiện nghi cơ bản.',
        base_price: 800000,
        max_occupancy: 2,
        amenities: ['wifi', 'tv', 'air_conditioner', 'mini_fridge'],
      },
      {
        name: 'Deluxe',
        slug: 'deluxe',
        description: 'Phòng cao cấp với view đẹp và không gian rộng rãi.',
        base_price: 1500000,
        max_occupancy: 3,
        amenities: ['wifi', 'tv', 'air_conditioner', 'mini_fridge', 'bathtub', 'balcony'],
      },
      {
        name: 'Suite',
        slug: 'suite',
        description: 'Suite sang trọng với phòng khách riêng và bồn tắm jacuzzi.',
        base_price: 3000000,
        max_occupancy: 4,
        amenities: [
          'wifi',
          'tv',
          'air_conditioner',
          'mini_fridge',
          'jacuzzi',
          'balcony',
          'living_room',
          'safe',
        ],
      },
      {
        name: 'Presidential',
        slug: 'presidential',
        description: 'Phòng tổng thống đẳng cấp 5 sao với butler service riêng.',
        base_price: 7500000,
        max_occupancy: 6,
        amenities: [
          'wifi',
          'tv',
          'air_conditioner',
          'mini_bar',
          'jacuzzi',
          'balcony',
          'living_room',
          'safe',
          'butler',
          'private_pool',
        ],
      },
    ]

    const { data: createdTypes, error: typeErr } = await supabase
      .from('room_types')
      .insert(roomTypes)
      .select()
    if (typeErr) throw typeErr
    console.log(`   ✅ ${createdTypes.length} loại phòng`)

    // ==========================================================
    // 4. Rooms (12 phòng)
    // ==========================================================
    console.log('🚪 Tạo phòng...')
    const placeholderImages = [
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800',
    ]

    const rooms: any[] = []
    let roomNum = 101
    for (const type of createdTypes) {
      const count = type.slug === 'presidential' ? 1 : type.slug === 'suite' ? 2 : 4
      for (let i = 0; i < count; i++) {
        rooms.push({
          room_number: String(roomNum++),
          room_type_id: type.id,
          floor: Math.ceil((roomNum - 100) / 4),
          description: `Phòng ${type.name} sang trọng với đầy đủ tiện nghi.`,
          status: 'available',
          images: faker.helpers.arrayElements(placeholderImages, 3),
        })
      }
    }
    const { data: createdRooms, error: roomErr } = await supabase
      .from('rooms')
      .insert(rooms)
      .select()
    if (roomErr) throw roomErr
    console.log(`   ✅ ${createdRooms.length} phòng`)

    // ==========================================================
    // 5. Services
    // ==========================================================
    console.log('🛎️  Tạo dịch vụ...')
    const services = [
      { name: 'Bữa sáng buffet', description: 'Buffet sáng đa dạng món Á - Âu', price: 250000, icon: 'coffee' },
      { name: 'Đưa đón sân bay', description: 'Xe Mercedes 5-7 chỗ', price: 500000, icon: 'car' },
      { name: 'Giặt ủi', description: 'Giặt ủi trong ngày', price: 100000, icon: 'shirt' },
      { name: 'Spa massage', description: 'Massage thư giãn 60 phút', price: 800000, icon: 'sparkles' },
      { name: 'Tour city', description: 'Tour tham quan thành phố', price: 600000, icon: 'map' },
      { name: 'Late check-out', description: 'Trả phòng muộn đến 18h', price: 200000, icon: 'clock' },
    ]
    await supabase.from('services').insert(services)
    console.log(`   ✅ ${services.length} dịch vụ`)

    // ==========================================================
    // 6. Bookings + Reviews
    // ==========================================================
    console.log('📅 Tạo bookings...')
    const customers = userIds.filter((u) => u.role === 'customer')
    const bookings: any[] = []
    const today = dayjs().tz(HOTEL_TIME_ZONE).startOf('day')

    for (let i = 0; i < 10; i++) {
      const room = faker.helpers.arrayElement(createdRooms)
      const roomType = createdTypes.find((t) => t.id === room.room_type_id)!
      const checkIn = today.add(faker.number.int({ min: -30, max: 30 }), 'day')
      const nights = faker.number.int({ min: 1, max: 5 })
      const checkOut = checkIn.add(nights, 'day')
      const checkInDate = checkIn.format('YYYY-MM-DD')
      const checkOutDate = checkOut.format('YYYY-MM-DD')

      const status = faker.helpers.arrayElement([
        'pending',
        'confirmed',
        'checked_in',
        'checked_out',
        'cancelled',
      ])

      bookings.push({
        booking_code: `HTL-${checkInDate.replace(/-/g, '')}-${faker.string
          .alphanumeric(4)
          .toUpperCase()}`,
        customer_id: faker.helpers.arrayElement(customers).id,
        room_id: room.id,
        check_in_date: checkInDate,
        check_out_date: checkOutDate,
        total_guests: faker.number.int({ min: 1, max: roomType.max_occupancy }),
        total_price: nights * roomType.base_price,
        status,
        payment_status: status === 'cancelled' ? 'unpaid' : 'paid',
        special_requests: faker.helpers.maybe(() => faker.lorem.sentence(), { probability: 0.3 }),
      })
    }

    const { data: createdBookings, error: bookErr } = await supabase
      .from('bookings')
      .insert(bookings)
      .select()
    if (bookErr) throw bookErr
    console.log(`   ✅ ${createdBookings.length} bookings`)

    // Reviews cho các booking checked_out
    console.log('⭐ Tạo reviews...')
    const checkedOut = createdBookings.filter((b) => b.status === 'checked_out')
    if (checkedOut.length > 0) {
      const reviews = checkedOut.map((b) => ({
        booking_id: b.id,
        customer_id: b.customer_id,
        rating: faker.number.int({ min: 3, max: 5 }),
        comment: faker.lorem.sentences(2),
      }))
      await supabase.from('reviews').insert(reviews)
      console.log(`   ✅ ${reviews.length} reviews`)
    }

    console.log('\n✨ Seed thành công!')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('📧 Admin:    admin@hbms.vn / Admin123!')
    console.log('📧 Customer: customer1@hbms.vn / Customer123!')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
  } catch (error: any) {
    console.error('❌ Seed thất bại:', error.message)
    process.exit(1)
  }
}

seed()
