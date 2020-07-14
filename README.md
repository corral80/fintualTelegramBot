# Fintual - Bot de telegram
Notifica los cambios en la ganancia (Profit) de Fintual con un bot en Telegram.
Se debe crear un bot en Telegram y añadirlo a un grupo con permisos de Administrador.
Siempre que exista un cambio en la ganancia (Profit) el bot mandará un mensaje con el valor ganado o perdido.
Se recomienda configurar un crontab que llame con nodejs el archivo app.js para ejecutar de forma diaria el script.
## No guarda datos de usuario
No se almacena ningún usuario o contraseña ya que todo está en texto plano, sin uso de BD.
## Solo 1 fondo
Permite revisar solo 1 fondo, revisar el archivo app.js para la configuración inicial
