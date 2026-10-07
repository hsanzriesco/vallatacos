VALLA TACOS — SISTEMA DE PEDIDOS PARA VERCEL

Esta versión sustituye el envío por WhatsApp por un sistema real de pedidos:
- El cliente hace el pedido desde la web.
- /api/orders recibe y guarda el pedido.
- Supabase almacena los pedidos.
- /admin.html es un panel privado para el negocio.
- El panel se actualiza automáticamente cada 10 segundos.
- Estados: nuevo, aceptado, preparando, listo, entregado, cancelado.

IMPORTANTE: la web NO funcionará para guardar pedidos hasta configurar Supabase y las variables de entorno en Vercel.

1) Crea un proyecto Supabase.
2) Abre SQL Editor y ejecuta el archivo supabase-schema.sql.
3) En Vercel > Project Settings > Environment Variables añade:
   SUPABASE_URL = URL del proyecto Supabase
   SUPABASE_SERVICE_ROLE_KEY = service role key de Supabase (SOLO servidor)
   ADMIN_PASSWORD = una contraseña fuerte para /admin.html
   SESSION_SECRET = una cadena aleatoria larga (32+ caracteres)
4) Haz un nuevo deploy.
5) El panel privado estará en:
   https://TU-DOMINIO.vercel.app/admin.html

SEGURIDAD
- La service role key nunca aparece en HTML/JS del cliente.
- La tabla orders tiene RLS activado y no tiene policies públicas.
- El panel usa una cookie HttpOnly firmada.
- No compartas las variables de entorno.

PRÓXIMA MEJORA
Cuando Valla Tacos tenga el sistema funcionando, se puede añadir email, notificaciones push o WhatsApp Business API sin cambiar el flujo del cliente.
