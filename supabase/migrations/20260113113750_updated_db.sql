alter table "public"."businesses" add column "avatar" text;

alter table "public"."businesses" add column "avatar_caption" text;

alter table "public"."businesses" add column "cover" text;

alter table "public"."businesses" add column "cover_caption" text;

alter table "public"."catalog_slides" add column "image" text;

alter table "public"."catalog_slides" add column "image_caption" text;

alter table "public"."product_images" drop column "alt_text";

alter table "public"."product_images" drop column "storage_path";

alter table "public"."product_images" add column "image" text not null;

alter table "public"."product_images" add column "image_caption" text;

alter table "public"."product_images" add column "updated_at" timestamp with time zone default now();

alter table "public"."products" add column "business_id" uuid default gen_random_uuid();

alter table "public"."products" add column "user_id" uuid default gen_random_uuid();

alter table "public"."products" add constraint "products_business_id_fkey" FOREIGN KEY (business_id) REFERENCES public.businesses(id) not valid;

alter table "public"."products" validate constraint "products_business_id_fkey";

alter table "public"."products" add constraint "products_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."products" validate constraint "products_user_id_fkey";


