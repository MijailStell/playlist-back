const { response } = require('express');
let webpush = require('web-push');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');
const Subscriptor = require('../models/Subscriptor');
const { generarJWT } = require('../helpers/jwt');
const { use } = require('../routes/auth');
 
const crearUsuario = async(req, res = response ) => {

    const { email, password } = req.body;

    try {
        let usuario = await Usuario.findOne({ email });

        if ( usuario ) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario ya existe'
            });
        }

        usuario = new Usuario( req.body );
    
        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync( password, salt );


        await usuario.save();

        // Generar JWT
        const token = await generarJWT( usuario.id, usuario.username );
    
        res.status(201).json({
            ok: true,
            uid: usuario.id,
            username: usuario.username,
            token
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }
}


const loginUsuario = async(req, res = response ) => {

    const { email, password } = req.body;

    try {
        const usuario = await Usuario.findOne({ email });

        if ( !usuario ) {
            return res.status(400).json({
                ok: false,
                msg: 'No existe usuario con ese email'
            });
        }

        // Confirmar los passwords
        const validPassword = bcrypt.compareSync( password, usuario.password );

        if ( !validPassword ) {
            return res.status(400).json({
                ok: false,
                msg: 'Password incorrecto'
            });
        }

        // Generar JWT
        const token = await generarJWT( usuario.id, usuario.username );

        res.json({
            ok: true,
            uid: usuario.id,
            username: usuario.username,
            genderId: usuario.genderId,
            token
        })


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }

}


const revalidarToken = async (req, res = response ) => {

    const { uid, username } = req;

    // Generar JWT
    const token = await generarJWT( uid, username );

    res.json({
        ok: true,
        token
    })
}


const subscribeUsuario = async (req, res = response ) => {
    try {
        const { pushSubscription, username } = req.body;
        console.log(JSON.stringify(req.body));
        const endpoint = pushSubscription.endpoint;
        const subscriptorFind = await Subscriptor.findOne({ endpoint });

        if (subscriptorFind ) {
            return res.status(400).json({
                ok: false,
                msg: 'Usted ya está subscrito al canal.'
            });
        }

        const subscriptor = new Subscriptor(pushSubscription);
        await subscriptor.save();
        
        webpush.setVapidDetails(
        'mailto:mijailstell@gmail.com',
        "BAkNsj2kN7ZYEbdKHDJwvEhuaeT6GJB9FYRbPHEFYSBHxxy8Zm2-k9Xmcbv20Z3kYsOdmcIODe9yH4h4CtVRCBQ", 
        "GhNxnBf6mXMD1Kvg7YCYigcfJJT8uM3X1GE9IyjLoEU"
        );
    
        let payload = JSON.stringify({
            "notification": {
                "title": "Youtube Room",
                "body": `Gracias por subscribirte al canal, ${username} está disponible para ver un video`,
                "icon": "assets/icons/icon-72x72.png",
                "vibrate": [100, 50, 100],
                "data": {
                    "url": "https://playlist-pwa.herokuapp.com/",
                    "dateOfArrival": Date.now(),
                    "primaryKey": 1
                },
                "actions": [{
                    "action": "explore",
                    "title": "Ir al Youtube Room"
                }]                
            }
        });

        const subscriptorList = await Subscriptor.find();
        console.log(subscriptorList.length + ' subscripciones.');

        for (let i = 0; i < subscriptorList.length; i++) {
            if(subscriptorList[i].endpoint !== endpoint){
                webpush.sendNotification(subscriptorList[i], payload);
            }
        }
        res.set('Content-Type', 'application/json');
        res.status(200).json({
            ok: true,
            msg: 'Notificación enviada'
        });  
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }
}



module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken,
    subscribeUsuario
}