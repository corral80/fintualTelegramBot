const fintual = require('./utils.js');
const fs = require('fs').promises;
const TelegramBot = require('node-telegram-bot-api');

cuenta = {
    
    email : 'usuario de fintual',
    password : 'contraseña de fintual',
    fondo : 'Nombre del fondo a buscar',
}

fintualBot = {

    token : 'api key de telegram',
    id_grupo : 'id del grupo de telegram'
    
}

fintual.fondo( cuenta , fintualBot ).
        then( ( resp ) => {
            console.log( "Flujo OK! "+resp ); 
            process.exit();
        } ).
        catch( ( err ) => { 
            console.log( "Error : " , err );
            process.exit();
        } );
