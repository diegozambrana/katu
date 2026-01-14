
  create policy "product_images_delete_owner"
  on "public"."product_images"
  as permissive
  for delete
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.products
  WHERE ((products.id = product_images.product_id) AND (products.user_id = auth.uid())))));



  create policy "product_images_insert_authenticated"
  on "public"."product_images"
  as permissive
  for insert
  to authenticated
with check ((EXISTS ( SELECT 1
   FROM public.products
  WHERE ((products.id = product_images.product_id) AND (products.user_id = auth.uid())))));



  create policy "product_images_select_public"
  on "public"."product_images"
  as permissive
  for select
  to public
using (true);



  create policy "product_images_update_owner"
  on "public"."product_images"
  as permissive
  for update
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.products
  WHERE ((products.id = product_images.product_id) AND (products.user_id = auth.uid())))))
with check ((EXISTS ( SELECT 1
   FROM public.products
  WHERE ((products.id = product_images.product_id) AND (products.user_id = auth.uid())))));



  create policy "product_prices_delete_owner"
  on "public"."product_prices"
  as permissive
  for delete
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.products
  WHERE ((products.id = product_prices.product_id) AND (products.user_id = auth.uid())))));



  create policy "product_prices_insert_authenticated"
  on "public"."product_prices"
  as permissive
  for insert
  to authenticated
with check ((EXISTS ( SELECT 1
   FROM public.products
  WHERE ((products.id = product_prices.product_id) AND (products.user_id = auth.uid())))));



  create policy "product_prices_select_public"
  on "public"."product_prices"
  as permissive
  for select
  to public
using (true);



  create policy "product_prices_update_owner"
  on "public"."product_prices"
  as permissive
  for update
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.products
  WHERE ((products.id = product_prices.product_id) AND (products.user_id = auth.uid())))))
with check ((EXISTS ( SELECT 1
   FROM public.products
  WHERE ((products.id = product_prices.product_id) AND (products.user_id = auth.uid())))));



  create policy "products_delete_owner"
  on "public"."products"
  as permissive
  for delete
  to authenticated
using ((auth.uid() = user_id));



  create policy "products_insert_authenticated"
  on "public"."products"
  as permissive
  for insert
  to authenticated
with check ((auth.uid() = user_id));



  create policy "products_select_public"
  on "public"."products"
  as permissive
  for select
  to public
using (true);



  create policy "products_update_owner"
  on "public"."products"
  as permissive
  for update
  to authenticated
using ((auth.uid() = user_id))
with check ((auth.uid() = user_id));



  create policy "permisos_basico 1ifhysk_0"
  on "storage"."objects"
  as permissive
  for select
  to public
using ((bucket_id = 'products'::text));



  create policy "permisos_basico 1ifhysk_1"
  on "storage"."objects"
  as permissive
  for insert
  to public
with check ((bucket_id = 'products'::text));



  create policy "permisos_basico 1ifhysk_2"
  on "storage"."objects"
  as permissive
  for update
  to public
using ((bucket_id = 'products'::text));



  create policy "permisos_basico 1ifhysk_3"
  on "storage"."objects"
  as permissive
  for delete
  to public
using ((bucket_id = 'products'::text));



