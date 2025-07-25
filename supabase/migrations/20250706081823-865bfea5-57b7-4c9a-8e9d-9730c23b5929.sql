-- Créer le compte administrateur par défaut
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@synergyai.com',
  crypt('AdminSynergy2025!', gen_salt('bf')),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"first_name":"Admin","last_name":"System","profile_type":"administrateur"}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
);