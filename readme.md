# ToDoList

Aplicación full-stack de lista de tareas con autenticación JWT (access + refresh tokens en cookie httpOnly), Google OAuth, soporte de archivos y PostgreSQL (Supabase).

---

## Requisitos previos

- Node.js v20 o superior
- npm v10 o superior
- Una cuenta gratuita en [Supabase](https://supabase.com)
- Una cuenta de Google (la que usás para todo)

---

## Paso 1 — Clonar el repositorio

```bash
git clone https://github.com/ARVIRZUZZTS/ToDoList.git
cd ToDoList
```

---

## Paso 2 — Crear el proyecto en Supabase
1. Cree un archivo .env en la raiz del proyecto
2. Ir a https://supabase.com e iniciar sesión
3. Hacer click en **New project**
4. Completar:
   - **Name:** `todolist` (o el que quieras)
   - **Database Password:** creá una contraseña fuerte y **guardala**, la vas a necesitar
   - **Region:** elegí la más cercana (Por defecto deje America que tiene seleccionado us-east-1)
   - **Pricing Plan:** Free
   - **Security:** Deje marcado tal como esta por defecto.
5. Esperar a que termine la creación (2-3 minutos)
6. Una vez terminada la creacion, estara en la pestana de **project overview**, desplazece hasta abajo, hasta **Get connect**, seleccione **ORM**, luego deje seleccionado Prisma como el ORM
7. Desplazece hasta abajo, en el paso 2 de supabase **Configure ORM** vera un archivo .env.local, copie su contenido al archivo .env que acaba de crear

Su .env se deberia ver asi: 
```
# Connect to Postgres via the shared transaction-mode pooler (IPv4-only)
DATABASE_URL="postgresql://postgres.jzzxzdnbwswhmxbjkzgi:[YOUR-PASSWORD]@aws-1-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Connect to Postgres via the shared session-mode pooler (used for migrations)
DIRECT_URL="postgresql://postgres.jzzxzdnbwswhmxbjkzgi:[YOUR-PASSWORD]@aws-1-us-east-1.pooler.supabase.com:5432/postgres"
```

Reemplazá `[TU_PASSWORD]` por la contraseña que pusiste en el paso 4.

---

## Paso 3 — Crear proyecto en Google Cloud Console

1. Ir a https://console.cloud.google.com
2. Si es la primera vez, aceptar los términos
3. Hacer click en **Seleccionar un proyecto** (arriba a la izquierda) → **Proyecto nuevo**
   - **Project name:** `ToDoListOAUTH`
   - Hacer click en **Crear**
4. Seleccionar el proyecto recién creado
5. Ir a **APIs & Servicios → Pantalla de consentimiento de OAuth -> Comenzar**
1. Nombre de la aplicacion: ToDoList
2. Correo electronico de asistencia al usuario: el correo de google con el que inicio sesion en console.cloud.google
3. Siguiente
4. Seleccione **Usuarios externos**
5. Siguiente
6. Informacion de contacto -> Direcciones de correo electronico: coloque su correo
7. Siguiente
8. Seleccione **Acepto la politica de datos...**
9. Continuar
10. Crear
11. Vuelva a la pantalla principal de google cloud, sleecione el proyecto ToDoListOAUTH
12. Click en la hamburguesa de la esquina superior izquierda
13. **Apis y servicios -> Credenciales**
14. **Crear credenciales -> ID de cliente de OAuth**
15. Tipo de aplicacion: Aplicacion web
16. Nombre: ToDoList local
17. Desplazece hacia abajo hasta **URIs de redireccionamiento autorizados** y haga click en **Agregar URI**
18. Coloque: https://localhost:5000/api/auth/google/callback
19. Click en crear
7. Aparece un modal con **ID de cliente** y **Secreto del cliente**. Copialos a un bloc de notas.
8. Cree las variables en el .env asi:
```
GOOGLE_CLIENT_ID="el id de cliente que acaba de copiar del modal"
GOOGLE_CLIENT_SECRET="el secreto del cliente que acaba de crear"
GOOGLE_CALLBACK_URL="https://localhost:5000/api/auth/google/callback"
```
---

## Paso 4 — Instalar dependencias

```bash
npm install
```

Esto instala todo lo necesario (Express, Prisma, Passport, React, Vite, etc.)

---

## Paso 5 — Completar el .env
Su .env deberia verse asi de momento:
```env
DATABASE_URL="postgresql://postgres:TU_PASSWORD@aws-0-us-west-2.pooler.supabase.com:6543/postgres?pgbouncer=true"

DIRECT_URL="postgresql://postgres:TU_PASSWORD@aws-0-us-west-2.pooler.supabase.com:5432/postgres"

GOOGLE_CLIENT_ID="abc...."
GOOGLE_CLIENT_SECRET="def...."
GOOGLE_CALLBACK_URL="https://localhost:5000/api/auth/google/callback"
```

Ahora completalo con los siguientes valores:

1. Corre en la terminal:
   ```bash
   openssl rand -hex 64
   ```
   Copiá el resultado (64 bytes en hex = 128 caracteres)
   Ahora coloca la variable en el .env asi:
   ```
   JWT_ACCESS_SECRET="lo que acaba de copiar"
   ```
2. Corre de nuevo:
   ```bash
   openssl rand -hex 64
   ```
   Copiá el resultado (DEBE ser distinto al de access, no uses el mismo)
   Ahora coloca la variable en el .env asi:
   ```
   JWT_REFRESH_SECRET="lo que acaba de copiar"
   ```
3. Agregue:
```
JWT_ACCESS_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"
NODE_ENV="production"
FRONTEND_URL="https://localhost:5173"
```
**Verificá que cada `=` tenga su valor del lado derecho, sin espacios.**


Ahora si el .env deberia verse asi:

```
##Connect to Postgres via the shared transaction-mode pooler (IPv4-only)
DATABASE_URL="postgresql://postgres.asdsadasd:tucontrasena@aws-1-us-west-2.pooler.supabase.com:6543/postgres?pgbouncer=true"

##Connect to Postgres via the shared session-mode pooler (used for migrations)
DIRECT_URL="postgresql://postgres.asasas:tucontrasena@aws-1-us-west-2.pooler.supabase.com:5432/postgres"

JWT_ACCESS_SECRET="abc..."
JWT_REFRESH_SECRET="def..."

JWT_ACCESS_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

NODE_ENV="production"

GOOGLE_CLIENT_ID="ghi-jkl.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="mnopqr"
GOOGLE_CALLBACK_URL="https://localhost:5000/api/auth/google/callback"

FRONTEND_URL="https://localhost:5173"
```

---

## Paso 6 — Crear las tablas de la base de datos

```bash
npx prisma db push
npx prisma generate
```

`db push` crea todas las tablas y columnas en Supabase directamente desde el archivo `prisma/schema.prisma`. `generate` crea el cliente de Prisma que el backend usa para conectarse a la base de datos.

---

## Paso 7 — Verificar que no faltan dependencias

```bash
node --version
npm --version
```

Ambos comandos deben mostrar un número de versión. Si alguno falla, instala Node.js desde https://nodejs.org y volvé a intentar.

---

## Paso 8 — Generar certificados HTTPS

El proyecto está configurado para funcionar con HTTPS local. Necesitás generar certificados para que el servidor arranque.

### 8.1 Instalar mkcert

macOS:

```bash
brew install mkcert
```

Windows:

```bash
choco install mkcert
```

Linux:

```bash
sudo apt install libnss3-tools
sudo dnf install nss-tools # en fedora
curl -JLO "https://dl.filippo.io/mkcert/latest?for=linux/amd64"
chmod +x mkcert-v*-linux-amd64
sudo mv mkcert-v*-linux-amd64 /usr/local/bin/mkcert
```

### 8.2 Generar certificados

```bash
mkcert -install
mkcert -key-file key.pem -cert-file cert.pem localhost
```

Esto genera los archivos `key.pem` y `cert.pem` en la raíz del proyecto. Son necesarios para que el backend y el frontend sirvan contenido por HTTPS.

---

## Paso 9 — Correr el proyecto

Para correr backend y frontend juntos (en una sola terminal):
```bash
npm run dev
```

**Importante:** Al entrar por primera vez a `https://localhost:5173`, el navegador va a mostrar una advertencia de "Conexión no segura" porque el certificado es autofirmado. Hacé click en **Avanzado → Continuar a localhost**. Esto solo pasa una vez.

## Paso 11 — Correr el poblador
   1. Vaya a supabase.com
   2. Dashboard (Esquina superior derecha)
   3. Click en la organizacion donde esta el proyecto
   4. Click en el proyecto recien creado
   5. En el menu desplegable a la izquierda
   6. Click en **SQL Editor**
   7. Copie el contenido de poblador.sql
   8. Copielo en el sql editor de supabase
   9. Click en **Run**

Y ya tiene la base de datos poblada
## Paso 12 — Puede entrar a la aplicacion con los siguientes usuarios:
usuario 1: websito@gmail.com
contrasena: 12345678

usuario 2: bruce@bati.com
contrasena: batiContra
  
## Aclaracion:
No poblamos los archivos en la base de datos, ya que los archivos de guardan de manera local en la carpeta media/