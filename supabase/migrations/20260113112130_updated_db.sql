
  create table "public"."catalog_contacts" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "active" boolean not null,
    "sort_order" integer not null,
    "label" character varying not null,
    "type" character varying not null,
    "value" character varying not null,
    "catalog_id" uuid not null default gen_random_uuid()
      );


alter table "public"."catalog_contacts" enable row level security;


  create table "public"."catalog_section_products" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "active" boolean not null default true,
    "product_id" uuid not null default gen_random_uuid(),
    "catalog_section_id" uuid not null default gen_random_uuid(),
    "sort_order" integer not null default 0
      );


alter table "public"."catalog_section_products" enable row level security;


  create table "public"."product_images" (
    "id" uuid not null default gen_random_uuid(),
    "product_id" uuid not null,
    "storage_path" text not null,
    "display_order" integer default 0,
    "is_primary" boolean default false,
    "alt_text" text,
    "created_at" timestamp with time zone default now()
      );


alter table "public"."product_images" enable row level security;

alter table "public"."business_social_links" alter column "sort_order" drop default;

alter table "public"."business_social_links" alter column "sort_order" set data type integer using "sort_order"::integer;

alter table "public"."catalog_sections" alter column "sort_order" drop default;

alter table "public"."catalog_sections" alter column "sort_order" set data type integer using "sort_order"::integer;

alter table "public"."catalog_slides" alter column "sort_order" set data type integer using "sort_order"::integer;

alter table "public"."products" drop column "sort_order";

CREATE UNIQUE INDEX catalog_contacts_pkey ON public.catalog_contacts USING btree (id);

CREATE UNIQUE INDEX catalog_section_products_pkey ON public.catalog_section_products USING btree (id);

CREATE INDEX product_images_display_order_idx ON public.product_images USING btree (display_order);

CREATE UNIQUE INDEX product_images_pkey ON public.product_images USING btree (id);

CREATE INDEX product_images_product_id_idx ON public.product_images USING btree (product_id);

alter table "public"."catalog_contacts" add constraint "catalog_contacts_pkey" PRIMARY KEY using index "catalog_contacts_pkey";

alter table "public"."catalog_section_products" add constraint "catalog_section_products_pkey" PRIMARY KEY using index "catalog_section_products_pkey";

alter table "public"."product_images" add constraint "product_images_pkey" PRIMARY KEY using index "product_images_pkey";

alter table "public"."catalog_contacts" add constraint "catalog_contacts_catalog_id_fkey" FOREIGN KEY (catalog_id) REFERENCES public.catalogs(id) ON DELETE CASCADE not valid;

alter table "public"."catalog_contacts" validate constraint "catalog_contacts_catalog_id_fkey";

alter table "public"."catalog_section_products" add constraint "catalog_section_products_catalog_section_id_fkey" FOREIGN KEY (catalog_section_id) REFERENCES public.catalog_sections(id) ON DELETE CASCADE not valid;

alter table "public"."catalog_section_products" validate constraint "catalog_section_products_catalog_section_id_fkey";

alter table "public"."catalog_section_products" add constraint "catalog_section_products_product_id_fkey" FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE not valid;

alter table "public"."catalog_section_products" validate constraint "catalog_section_products_product_id_fkey";

alter table "public"."product_images" add constraint "product_images_product_id_fkey" FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE not valid;

alter table "public"."product_images" validate constraint "product_images_product_id_fkey";

grant delete on table "public"."catalog_contacts" to "anon";

grant insert on table "public"."catalog_contacts" to "anon";

grant references on table "public"."catalog_contacts" to "anon";

grant select on table "public"."catalog_contacts" to "anon";

grant trigger on table "public"."catalog_contacts" to "anon";

grant truncate on table "public"."catalog_contacts" to "anon";

grant update on table "public"."catalog_contacts" to "anon";

grant delete on table "public"."catalog_contacts" to "authenticated";

grant insert on table "public"."catalog_contacts" to "authenticated";

grant references on table "public"."catalog_contacts" to "authenticated";

grant select on table "public"."catalog_contacts" to "authenticated";

grant trigger on table "public"."catalog_contacts" to "authenticated";

grant truncate on table "public"."catalog_contacts" to "authenticated";

grant update on table "public"."catalog_contacts" to "authenticated";

grant delete on table "public"."catalog_contacts" to "postgres";

grant insert on table "public"."catalog_contacts" to "postgres";

grant references on table "public"."catalog_contacts" to "postgres";

grant select on table "public"."catalog_contacts" to "postgres";

grant trigger on table "public"."catalog_contacts" to "postgres";

grant truncate on table "public"."catalog_contacts" to "postgres";

grant update on table "public"."catalog_contacts" to "postgres";

grant delete on table "public"."catalog_contacts" to "service_role";

grant insert on table "public"."catalog_contacts" to "service_role";

grant references on table "public"."catalog_contacts" to "service_role";

grant select on table "public"."catalog_contacts" to "service_role";

grant trigger on table "public"."catalog_contacts" to "service_role";

grant truncate on table "public"."catalog_contacts" to "service_role";

grant update on table "public"."catalog_contacts" to "service_role";

grant delete on table "public"."catalog_section_products" to "anon";

grant insert on table "public"."catalog_section_products" to "anon";

grant references on table "public"."catalog_section_products" to "anon";

grant select on table "public"."catalog_section_products" to "anon";

grant trigger on table "public"."catalog_section_products" to "anon";

grant truncate on table "public"."catalog_section_products" to "anon";

grant update on table "public"."catalog_section_products" to "anon";

grant delete on table "public"."catalog_section_products" to "authenticated";

grant insert on table "public"."catalog_section_products" to "authenticated";

grant references on table "public"."catalog_section_products" to "authenticated";

grant select on table "public"."catalog_section_products" to "authenticated";

grant trigger on table "public"."catalog_section_products" to "authenticated";

grant truncate on table "public"."catalog_section_products" to "authenticated";

grant update on table "public"."catalog_section_products" to "authenticated";

grant delete on table "public"."catalog_section_products" to "postgres";

grant insert on table "public"."catalog_section_products" to "postgres";

grant references on table "public"."catalog_section_products" to "postgres";

grant select on table "public"."catalog_section_products" to "postgres";

grant trigger on table "public"."catalog_section_products" to "postgres";

grant truncate on table "public"."catalog_section_products" to "postgres";

grant update on table "public"."catalog_section_products" to "postgres";

grant delete on table "public"."catalog_section_products" to "service_role";

grant insert on table "public"."catalog_section_products" to "service_role";

grant references on table "public"."catalog_section_products" to "service_role";

grant select on table "public"."catalog_section_products" to "service_role";

grant trigger on table "public"."catalog_section_products" to "service_role";

grant truncate on table "public"."catalog_section_products" to "service_role";

grant update on table "public"."catalog_section_products" to "service_role";

grant delete on table "public"."product_images" to "anon";

grant insert on table "public"."product_images" to "anon";

grant references on table "public"."product_images" to "anon";

grant select on table "public"."product_images" to "anon";

grant trigger on table "public"."product_images" to "anon";

grant truncate on table "public"."product_images" to "anon";

grant update on table "public"."product_images" to "anon";

grant delete on table "public"."product_images" to "authenticated";

grant insert on table "public"."product_images" to "authenticated";

grant references on table "public"."product_images" to "authenticated";

grant select on table "public"."product_images" to "authenticated";

grant trigger on table "public"."product_images" to "authenticated";

grant truncate on table "public"."product_images" to "authenticated";

grant update on table "public"."product_images" to "authenticated";

grant delete on table "public"."product_images" to "postgres";

grant insert on table "public"."product_images" to "postgres";

grant references on table "public"."product_images" to "postgres";

grant select on table "public"."product_images" to "postgres";

grant trigger on table "public"."product_images" to "postgres";

grant truncate on table "public"."product_images" to "postgres";

grant update on table "public"."product_images" to "postgres";

grant delete on table "public"."product_images" to "service_role";

grant insert on table "public"."product_images" to "service_role";

grant references on table "public"."product_images" to "service_role";

grant select on table "public"."product_images" to "service_role";

grant trigger on table "public"."product_images" to "service_role";

grant truncate on table "public"."product_images" to "service_role";

grant update on table "public"."product_images" to "service_role";


