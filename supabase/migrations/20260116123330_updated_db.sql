
  create policy "permisos_basico 96uo7t_0"
  on "storage"."objects"
  as permissive
  for select
  to public
using ((bucket_id = 'catalog'::text));



  create policy "permisos_basico 96uo7t_1"
  on "storage"."objects"
  as permissive
  for insert
  to public
with check ((bucket_id = 'catalog'::text));



  create policy "permisos_basico 96uo7t_2"
  on "storage"."objects"
  as permissive
  for update
  to public
using ((bucket_id = 'catalog'::text));



  create policy "permisos_basico 96uo7t_3"
  on "storage"."objects"
  as permissive
  for delete
  to public
using ((bucket_id = 'catalog'::text));



