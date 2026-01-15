
  create policy "catalog_contacts_delete_owner"
  on "public"."catalog_contacts"
  as permissive
  for delete
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.catalogs
  WHERE ((catalogs.id = catalog_contacts.catalog_id) AND (catalogs.user_id = auth.uid())))));



  create policy "catalog_contacts_insert_authenticated"
  on "public"."catalog_contacts"
  as permissive
  for insert
  to authenticated
with check ((EXISTS ( SELECT 1
   FROM public.catalogs
  WHERE ((catalogs.id = catalog_contacts.catalog_id) AND (catalogs.user_id = auth.uid())))));



  create policy "catalog_contacts_select_public"
  on "public"."catalog_contacts"
  as permissive
  for select
  to public
using (true);



  create policy "catalog_contacts_update_owner"
  on "public"."catalog_contacts"
  as permissive
  for update
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.catalogs
  WHERE ((catalogs.id = catalog_contacts.catalog_id) AND (catalogs.user_id = auth.uid())))))
with check ((EXISTS ( SELECT 1
   FROM public.catalogs
  WHERE ((catalogs.id = catalog_contacts.catalog_id) AND (catalogs.user_id = auth.uid())))));



  create policy "catalog_section_products_delete_owner"
  on "public"."catalog_section_products"
  as permissive
  for delete
  to authenticated
using ((EXISTS ( SELECT 1
   FROM (public.catalog_sections
     JOIN public.catalogs ON ((catalogs.id = catalog_sections.catalog_id)))
  WHERE ((catalog_sections.id = catalog_section_products.catalog_section_id) AND (catalogs.user_id = auth.uid())))));



  create policy "catalog_section_products_insert_authenticated"
  on "public"."catalog_section_products"
  as permissive
  for insert
  to authenticated
with check ((EXISTS ( SELECT 1
   FROM (public.catalog_sections
     JOIN public.catalogs ON ((catalogs.id = catalog_sections.catalog_id)))
  WHERE ((catalog_sections.id = catalog_section_products.catalog_section_id) AND (catalogs.user_id = auth.uid())))));



  create policy "catalog_section_products_select_public"
  on "public"."catalog_section_products"
  as permissive
  for select
  to public
using (true);



  create policy "catalog_section_products_update_owner"
  on "public"."catalog_section_products"
  as permissive
  for update
  to authenticated
using ((EXISTS ( SELECT 1
   FROM (public.catalog_sections
     JOIN public.catalogs ON ((catalogs.id = catalog_sections.catalog_id)))
  WHERE ((catalog_sections.id = catalog_section_products.catalog_section_id) AND (catalogs.user_id = auth.uid())))))
with check ((EXISTS ( SELECT 1
   FROM (public.catalog_sections
     JOIN public.catalogs ON ((catalogs.id = catalog_sections.catalog_id)))
  WHERE ((catalog_sections.id = catalog_section_products.catalog_section_id) AND (catalogs.user_id = auth.uid())))));



  create policy "catalog_sections_delete_owner"
  on "public"."catalog_sections"
  as permissive
  for delete
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.catalogs
  WHERE ((catalogs.id = catalog_sections.catalog_id) AND (catalogs.user_id = auth.uid())))));



  create policy "catalog_sections_insert_authenticated"
  on "public"."catalog_sections"
  as permissive
  for insert
  to authenticated
with check ((EXISTS ( SELECT 1
   FROM public.catalogs
  WHERE ((catalogs.id = catalog_sections.catalog_id) AND (catalogs.user_id = auth.uid())))));



  create policy "catalog_sections_select_public"
  on "public"."catalog_sections"
  as permissive
  for select
  to public
using (true);



  create policy "catalog_sections_update_owner"
  on "public"."catalog_sections"
  as permissive
  for update
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.catalogs
  WHERE ((catalogs.id = catalog_sections.catalog_id) AND (catalogs.user_id = auth.uid())))))
with check ((EXISTS ( SELECT 1
   FROM public.catalogs
  WHERE ((catalogs.id = catalog_sections.catalog_id) AND (catalogs.user_id = auth.uid())))));



  create policy "catalog_slides_delete_owner"
  on "public"."catalog_slides"
  as permissive
  for delete
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.catalogs
  WHERE ((catalogs.id = catalog_slides.catalog_id) AND (catalogs.user_id = auth.uid())))));



  create policy "catalog_slides_insert_authenticated"
  on "public"."catalog_slides"
  as permissive
  for insert
  to authenticated
with check ((EXISTS ( SELECT 1
   FROM public.catalogs
  WHERE ((catalogs.id = catalog_slides.catalog_id) AND (catalogs.user_id = auth.uid())))));



  create policy "catalog_slides_select_public"
  on "public"."catalog_slides"
  as permissive
  for select
  to public
using (true);



  create policy "catalog_slides_update_owner"
  on "public"."catalog_slides"
  as permissive
  for update
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.catalogs
  WHERE ((catalogs.id = catalog_slides.catalog_id) AND (catalogs.user_id = auth.uid())))))
with check ((EXISTS ( SELECT 1
   FROM public.catalogs
  WHERE ((catalogs.id = catalog_slides.catalog_id) AND (catalogs.user_id = auth.uid())))));



  create policy "catalogs_delete_owner"
  on "public"."catalogs"
  as permissive
  for delete
  to authenticated
using ((auth.uid() = user_id));



  create policy "catalogs_insert_authenticated"
  on "public"."catalogs"
  as permissive
  for insert
  to authenticated
with check ((auth.uid() = user_id));



  create policy "catalogs_select_public"
  on "public"."catalogs"
  as permissive
  for select
  to public
using (true);



  create policy "catalogs_update_owner"
  on "public"."catalogs"
  as permissive
  for update
  to authenticated
using ((auth.uid() = user_id))
with check ((auth.uid() = user_id));



