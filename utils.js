const fetch = require('node-fetch');
const fs = require('fs').promises;
const TelegramBot = require('node-telegram-bot-api');

//se obtiene el token del usuario en fintual
const obtenerToken = async ( email , password ) => {
    
    const data = {
        'method': 'POST',
        'headers': {
            'Content-Type': 'application/json',
        },
        body    : JSON.stringify( { "user" : { "email" : email , "password" : password } } )
      };
  
    const respuesta = await fetch('https://fintual.cl/api/access_tokens',data);
    const resultado = await respuesta.json();
    //regresamos solo el token para las próximas consultas
    return resultado.data.attributes.token;

}

//obtenemos los fondos del usuario
const obtenerFondo = async (token,email) => {

    const data = {
        'method': 'GET',
        'headers': {
            'Content-Type': 'application/json',
        }
    };

    const respuesta = await fetch(`https://fintual.cl/api/goals?user_token=${token}&user_email=${email}`, data)
    const resultado = await respuesta.json();
    //regresamos los fondos encontrados
    return resultado.data;

}

//al no usar base de datos
//creamos un archivo en la carpeta movimientos con el saldo xxxx del usuario
//este saldo se comparara contra la consulta a la api, si existe una diferencia se informará al usuario por el chat de telegram
//y se guardará el último valor en el txt, en caso de no existir diferencias no se realizará nada
const leerArchivo = async () => {
                                                //la ruta completa del archivo en la VPS
    const contenidoArchivo = await fs.readFile( 'COLOCAR LA RUTA COMPLETA DE ESTE ARCHIVO/movimientos/profit.txt' );
    return contenidoArchivo;
}

//en caso de existir diferencia se modificará el txt con el nuevo saldo
const escribirArchivo = async (profit) => {
                        //la ruta completa del archivo en la VPS
    await fs.writeFile('COLOCAR LA RUTA COMPLETA DE ESTE ARCHIVO/movimientos/profit.txt', profit );
    return profit;    
}

//envía el mensaje a telegram
const telegram = async (fintualBot, mensaje) => {


    const bot = new TelegramBot( fintualBot.token , { polling : true } );
    
    //obtiene la fecha del día
    let fullfecha = new Date();
    fecha = `${fullfecha.getDate()}/${fullfecha.getMonth()+1}/${fullfecha.getFullYear()}`;
    
    //envía el mensaje al chat de telegram
    let respuesta = await bot.sendMessage(fintualBot.id_grupo, fecha+" \nProfit : "+mensaje);
    return respuesta;
        
}
    
//funcion final que agrupa el resto de funciones async
const fondo = async ( cuenta , fintualBot) => {


    const respuestaToken = await obtenerToken(cuenta.email,cuenta.password);
    const respuestaFondo = await obtenerFondo(respuestaToken,cuenta.email);
    //consulta el fondo a buscar con los fondos encontrados en la cuenta, cuando lo encuentre retornará la data asociado a ese fondo
    let respuestaSaldo = respuestaFondo.find( ( respuestaFondo ) => {
        if(respuestaFondo.attributes.name == cuenta.fondo){
            return respuestaFondo;
        }
    });
    const respuestaLeerArchivo = await leerArchivo();
    
    
    //setea los valores numericos y compara contra el valor guardado en el txt
    if( Math.trunc(respuestaSaldo.attributes.profit).toLocaleString('en').replace(',','.') != respuestaLeerArchivo ) {

        await telegram( fintualBot , Math.trunc(respuestaSaldo.attributes.profit).toLocaleString('en').replace(',','.'));
        const resultado = await escribirArchivo(Math.trunc(respuestaSaldo.attributes.profit).toLocaleString('en').replace(',','.'));
        return resultado; //regresa true
        
    }
    else{
        return false; //retorna false para no mandar ningun mensaje;
    }
}

module.exports.fondo = fondo;