-- Execute este script no SQL Editor do seu projeto Supabase
-- (Painel do Supabase > SQL Editor > New query > colar e Run)

-- 1. Tabela de transações
create table if not exists public.transacoes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  descricao text not null,
  valor numeric(12, 2) not null,
  categoria text not null,
  data timestamptz not null default now(),
  created_at timestamptz not null default now()
);

-- 2. Índice para consultas por usuário
create index if not exists transacoes_user_id_idx on public.transacoes (user_id);

-- 3. Ativa Row Level Security (obrigatório: sem isso, ninguém acessa a tabela)
alter table public.transacoes enable row level security;

-- 4. Políticas: cada usuário só enxerga e mexe nas próprias transações
create policy "Usuários veem apenas suas transações"
  on public.transacoes for select
  using (auth.uid() = user_id);

create policy "Usuários inserem apenas suas transações"
  on public.transacoes for insert
  with check (auth.uid() = user_id);

create policy "Usuários atualizam apenas suas transações"
  on public.transacoes for update
  using (auth.uid() = user_id);

create policy "Usuários excluem apenas suas transações"
  on public.transacoes for delete
  using (auth.uid() = user_id);
