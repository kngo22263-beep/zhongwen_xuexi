-- =========================================================
-- Zhongwen_xuexi - CAU TRUC DATABASE (chay tren Supabase)
-- Vao Supabase > SQL Editor > dan file nay > Run
-- =========================================================

-- 1) BANG TAI KHOAN NGUOI DUNG
create table if not exists public.users (
  id           uuid primary key default gen_random_uuid(),
  username     text unique not null,          -- ten dang nhap hoac gmail
  password     text not null,                 -- mat khau (demo: luu dang text)
  full_name    text,
  role         text not null default 'student', -- 'admin' hoac 'student'
  plan         text not null default 'normal',  -- 'normal' hoac 'vip'
  status       text not null default 'active',  -- 'active' hoac 'locked'
  is_unlimited boolean not null default false,  -- goi vo han hay khong
  start_date   date,                           -- ngay dang ky
  expire_date  date,                           -- ngay het han
  created_at   timestamptz not null default now()
);

-- 2) BANG EBOOK (sach HSK)
create table if not exists public.ebooks (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,                  -- ten sach
  hsk_level   text not null,                  -- HSK1..HSK6
  course      text not null default 'HSK2.0', -- 'HSK2.0' hoac 'HSK3.0'
  author      text,
  description text,
  file_url    text,                           -- link file PDF tren storage
  cover_color text default 'orange',          -- mau bia sach
  is_public   boolean not null default true,  -- cong khai / rieng tu
  created_at  timestamptz not null default now()
);

-- 3) BANG BAI HOC TU VUNG (cua tung nguoi dung)
create table if not exists public.vocab_lessons (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references public.users(id) on delete cascade,
  name        text not null,                  -- ten bai hoc (VD: Bai 1)
  description text,
  created_at  timestamptz not null default now()
);

-- 4) BANG TU VUNG (thuoc mot bai hoc)
create table if not exists public.vocab_words (
  id         uuid primary key default gen_random_uuid(),
  lesson_id  uuid references public.vocab_lessons(id) on delete cascade,
  hanzi      text not null,                   -- Han tu
  word_type  text,                            -- loai tu
  pinyin     text,                            -- phien am
  meaning    text,                            -- nghia tieng Viet
  example    text,                            -- vi du
  hsk_level  text,                            -- cap do HSK
  created_at timestamptz not null default now()
);

-- 5) BANG BAI DOC / DOAN VAN (admin nhap - de luyen AI)
create table if not exists public.reading_passages (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  hsk_level   text not null,
  topic       text,
  source      text,
  content     text not null,
  note        text,
  created_at  timestamptz not null default now()
);

-- 6) BANG TU VUNG HE THONG (admin nhap - dung chung cho API)
create table if not exists public.system_vocab (
  id         uuid primary key default gen_random_uuid(),
  hanzi      text not null,
  pinyin     text,
  meaning    text,
  word_type  text,
  hsk_level  text,
  example    text,
  note       text,
  created_at timestamptz not null default now()
);

-- =========================================================
-- Ket thuc cau truc database
-- =========================================================