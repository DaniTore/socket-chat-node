const { io } = require('../server');
const { Usuarios } = require('../classes/usuarios');
const { crearMensaje } = require('../utilidades/utilidades');

const usuarios = new Usuarios();

io.on('connection', (client) => {

    // escucha el emit del front 'entradaChat'
    client.on('entrarChat', (datosUsuario, callback) => {

        if (!datosUsuario.nombre || !datosUsuario.sala) {
            return callback({
                error: true,
                mensaje: 'El nombre/sala es necesario'
            });
        }

        client.join(datosUsuario.sala)

        usuarios.agregarPersonaAlChat(client.id, datosUsuario.nombre, datosUsuario.sala);

        // evento hacía front comunica la conexion a todos los user de la misama sala
        client.broadcast.to(datosUsuario.sala).emit('listaPersonasConectadas', usuarios.getPersonasPorSala(datosUsuario.sala));

        //este callback lo usa connection, en el emit. que tiene un calback
        callback(usuarios.getPersonasPorSala(datosUsuario.sala))
    })

    //viene el mensaje de un usuario
    client.on('crearMensaje', (data) => {

        //quiero todos los datos del user que manda el mensaje, que estan en client
        let persona = usuarios.getPersona(client.id)

        let mensaje = crearMensaje(persona.nombre, data.mensaje);

        client.broadcast.to(persona.sala).emit('escucharMensaje', mensaje)
    })


    client.on('disconnect', () => {

        // devuelve la persona borrada
        let personaborrada = usuarios.borrarPersonaEnChat(client.id);

        client.broadcast.to(personaborrada.sala).emit('abandonaChat', crearMensaje('Administrador', `${personaborrada.nombre} abandonó el chat`));

        client.broadcast.to(personaborrada.sala).emit('listaPersonasConectadas', usuarios.getPersonasPorSala(personaborrada.sala));

    });

    //Mensaje privado a alguien
    client.on('mensajePrivado', data => {

        let persona = usuarios.getPersona(client.id);

        client.broadcast.to(data.para).emit('mensajePrivado', crearMensaje(persona.nombre, data.mensaje));
    });

});