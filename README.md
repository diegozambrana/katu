# Katu

## TechStack

- Nextjs
- Supabase
- supabase-ssr. A package to configure Supabase Auth to use cookies
- Password-based authentication block installed via the [Supabase UI Library](https://supabase.com/ui/docs/nextjs/password-based-auth)
- Styling with [Tailwind CSS](https://tailwindcss.com)
- Components with [shadcn/ui](https://ui.shadcn.com/)

## Clone and run locally

1. You'll first need a Supabase project which can be made [via the Supabase dashboard](https://database.new)

2. Clone the NextJS app

3. Rename `.env.example` to `.env.local` and update the following:

```env
NEXT_PUBLIC_SUPABASE_URL=[INSERT SUPABASE PROJECT URL]
NEXT_PUBLIC_SUPABASE_ANON_KEY=[INSERT SUPABASE PROJECT API ANON KEY]
```

5. You can now run the Next.js local development server:

   ```bash
   npm run dev
   ```

   The starter kit should now be running on [localhost:3000](http://localhost:3000/).

## Supabase

### Configuración de Supabase Local

Para desarrollar con Supabase localmente, sigue estos pasos:

1. **Instala Supabase CLI** (si aún no lo tienes instalado):

   ```bash
   npm install -g supabase
   ```

   O usando Homebrew (macOS):

   ```bash
   brew install supabase/tap/supabase
   ```

2. **Inicia Supabase localmente**:

   ```bash
   supabase start
   ```

   Este comando:

   - Descarga e inicia los servicios de Supabase (PostgreSQL, API, Auth, Storage, etc.)
   - Aplica todas las migraciones en `supabase/migrations/`
   - Muestra las URLs y credenciales de tu instancia local

3. **Configura las variables de entorno para desarrollo local**:

   Crea o actualiza tu archivo `.env.local` con las credenciales que aparecen después de ejecutar `supabase start`:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
   NEXT_PUBLIC_SUPABASE_ANON_KEY=[ANON_KEY_FROM_SUPABASE_START]
   ```

   > **Nota**: Las credenciales se muestran en la terminal después de ejecutar `supabase start`. También puedes obtenerlas con `supabase status`.

4. **Aplica migraciones** (si haces cambios en el esquema):

   ```bash
   # Aplicar migraciones locales
   supabase db reset

   # O sincronizar con la base de datos remota
   supabase db push
   ```

5. **Accede a Supabase Studio local**:

   Abre tu navegador en `http://127.0.0.1:54323` para acceder a la interfaz de Supabase Studio local, donde puedes:

   - Ver y editar datos de las tablas
   - Ejecutar consultas SQL
   - Gestionar autenticación
   - Ver logs de la API

6. **Detener Supabase local**:

   ```bash
   supabase stop
   ```

### Comandos útiles de Supabase CLI

- `supabase status` - Ver el estado y las URLs de los servicios locales
- `supabase db reset` - Resetear la base de datos local y aplicar todas las migraciones
- `supabase db push` - Sincronizar migraciones con la base de datos remota
- `supabase db pull` - Generar migraciones desde la base de datos remota
- `supabase migration new <nombre>` - Crear una nueva migración
- `supabase db diff --use-migra -f <nombre>` - Crea una nueva migración con `use-migra`
