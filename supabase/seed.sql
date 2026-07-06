-- =========================================================
-- Zhongwen_xuexi - DU LIEU BAN DAU (3 tai khoan co san)
-- Chay SAU khi da chay schema.sql
-- Vao Supabase > SQL Editor > dan file nay > Run
-- =========================================================

-- Tao 3 tai khoan theo yeu cau
insert into public.users (username, password, full_name, role, plan, status, is_unlimited)
values
  ('NgoXuanKien22263',    '096666',    'Ngo Xuan Kien', 'admin',   'vip',    'active', true),
  ('Kngo22263@gmail',     'kien1234@', 'Admin Kien',    'admin',   'vip',    'active', true),
  ('hocthuzhongwenxuexi', '12356789',  'Hoc Vien Demo', 'student', 'normal', 'active', true)
on conflict (username) do nothing;

-- =========================================================
-- Ket thuc du lieu ban dau
-- =========================================================