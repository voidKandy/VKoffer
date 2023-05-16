-- Enable pgvector extension
create extension if not exists vector with schema public;

-- ParentFile Table
create table "public"."file" (
    id uuid primary key,
    path text not null unique,
    type text null,
    name text null,
    content text null
  ) tablespace pg_default;

alter table "public"."file"
  enable row level security;

-- FileChunk table
create table "public"."file_section" (
    id uuid primary key,
    parent_file_id uuid,
    content text,
    token_count integer null,
    embedding public.vector(1536),
    constraint file_section_parent_file_id_fkey foreign key (parent_file_id) references file (id) on delete cascade
  ) tablespace pg_default;

alter table "public"."file_section"
  enable row level security;

  -- Create embedding similarity search functions
create or replace function match_file_sections(
    query_embedding vector(1536),
    match_threshold float,
    match_count int,
    min_content_length int
)
returns table (
    id uuid,
    parent_file_id uuid,
    content text,
    similarity float
)
language plpgsql
as $$
-- #variable_conflict use_variable
begin
  return query
  select
    file_section.id,
    file_section.parent_file_id,
    file_section.content,
    (file_section.embedding <#> query_embedding) * -1 as similarity
  from file_section

  -- We only care about sections that have a useful amount of content
  where length(file_section.content) >= min_content_length

  -- The dot product is negative because of a Postgres limitation, so we negate it
  and (file_section.embedding <#> embedding) * -1 > match_threshold

  -- OpenAI embeddings are normalized to length 1, so
  -- cosine similarity and dot product will produce the same results.
  -- Using dot product which can be computed slightly faster.
  --
  -- For the different syntaxes, see https://github.com/pgvector/pgvector
  order by file_section.embedding <#> embedding

  limit match_count;
end;
$$;
