set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = user_id
    AND profiles.role = 'ADMIN'
  );
END;
$function$
;


  create policy "Authenticated users can create support messages"
  on "public"."support_messages"
  as permissive
  for insert
  to authenticated
with check ((auth.uid() = user_id));



  create policy "Only admins can delete support messages"
  on "public"."support_messages"
  as permissive
  for delete
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND ((profiles.role)::text = 'ADMIN'::text)))));



  create policy "Only admins can update support messages"
  on "public"."support_messages"
  as permissive
  for update
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND ((profiles.role)::text = 'ADMIN'::text)))))
with check ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND ((profiles.role)::text = 'ADMIN'::text)))));



  create policy "Users can view their own messages or admins can view all"
  on "public"."support_messages"
  as permissive
  for select
  to authenticated
using (((auth.uid() = user_id) OR (EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND ((profiles.role)::text = 'ADMIN'::text))))));



