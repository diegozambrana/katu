alter table "public"."businesses" drop column "avatar_caption";

alter table "public"."businesses" drop column "cover_caption";


  create policy "Business owners can create social links"
  on "public"."business_social_links"
  as permissive
  for insert
  to authenticated
with check ((EXISTS ( SELECT 1
   FROM public.businesses b
  WHERE ((b.id = business_social_links.business_id) AND (b.user_id = auth.uid())))));



  create policy "Business owners can delete social links"
  on "public"."business_social_links"
  as permissive
  for delete
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.businesses b
  WHERE ((b.id = business_social_links.business_id) AND (b.user_id = auth.uid())))));



  create policy "Business owners can update social links"
  on "public"."business_social_links"
  as permissive
  for update
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.businesses b
  WHERE ((b.id = business_social_links.business_id) AND (b.user_id = auth.uid())))))
with check ((EXISTS ( SELECT 1
   FROM public.businesses b
  WHERE ((b.id = business_social_links.business_id) AND (b.user_id = auth.uid())))));



  create policy "Business social links are publicly readable"
  on "public"."business_social_links"
  as permissive
  for select
  to public
using (true);



  create policy "Enable insert for authenticated users only"
  on "public"."business_social_links"
  as permissive
  for insert
  to authenticated
with check (true);



  create policy "Enable read access for all users"
  on "public"."business_social_links"
  as permissive
  for select
  to public
using (true);



  create policy "Authenticated users can create businesses"
  on "public"."businesses"
  as permissive
  for insert
  to authenticated
with check ((user_id = auth.uid()));



  create policy "Business owners can delete their businesses"
  on "public"."businesses"
  as permissive
  for delete
  to authenticated
using ((user_id = auth.uid()));



  create policy "Business owners can update their businesses"
  on "public"."businesses"
  as permissive
  for update
  to authenticated
using ((user_id = auth.uid()))
with check ((user_id = auth.uid()));



  create policy "Businesses are publicly readable"
  on "public"."businesses"
  as permissive
  for select
  to public
using (true);



  create policy "permisos_basico s5dqi6_0"
  on "storage"."objects"
  as permissive
  for select
  to public
using ((bucket_id = 'businesses'::text));



  create policy "permisos_basico s5dqi6_1"
  on "storage"."objects"
  as permissive
  for insert
  to public
with check ((bucket_id = 'businesses'::text));



  create policy "permisos_basico s5dqi6_2"
  on "storage"."objects"
  as permissive
  for update
  to public
using ((bucket_id = 'businesses'::text));



  create policy "permisos_basico s5dqi6_3"
  on "storage"."objects"
  as permissive
  for delete
  to public
using ((bucket_id = 'businesses'::text));



