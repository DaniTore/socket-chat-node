const { io } = require('../server');
const { Usuarios } = require('../classes/usuarios');
const { crearMensaje } = require('../utilidades/utilidades');

const usuarios = new Usuarios();

io.on('connection', (client) => {

    // escucha el emit del front 'entradaChat'
    client.on('entrarChat', (usuario, callback) => {

        if (!usuario.nombre) {
            return callback({
                error: true,
                mensaje: 'El nombre es necesario'
            });
        }

        let personasConectadas = usuarios.agregarPersonaAlChat(client.id, usuario.nombre);

        // evento hacía front comunica todas las personas conectadas al chat
        client.broadcast.emit('listaPersonasConectadas', usuarios.getTodasLasPersonas());

        callback(personasConectadas)
    })

    //viene el mensaje de un usuario
    client.on('crearMensaje', (data) => {

        //quiero todos los datos del user que manda el mensaje, que estan en client
        let persona = usuarios.getPersona(client.id)

        let mensaje = crearMensaje(persona.nombre, data.mensaje);

        client.broadcast.emit('escucharMensaje', mensaje)
    })


    client.on('disconnect', () => {

        // devuelve la persona borrada
        let personaborrada = usuarios.borrarPersonaEnChat(client.id);

        client.broadcast.emit('abandonaChat', crearMensaje('Administrador', `${personaborrada.nombre} abandonó el chat`));

        client.broadcast.emit('listaPersonasConectadas', usuarios.getTodasLasPersonas());

    });

    //Mensaje privado a alguien
    client.on('mensajePrivado', data => {

        let persona = usuarios.getPersona(client.id);

        client.broadcast.to(data.para).emit('mensajePrivado', crearMensaje(persona.nombre, data.mensaje));
    });

});