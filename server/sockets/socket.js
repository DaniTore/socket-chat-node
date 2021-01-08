const { io } = require('../server');

const { Usuarios } = require('../classes/usuarios');

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

    client.on('disconnect', () => {

        // devuelve la persona borrada
        let personaborrada = usuarios.borrarPersonaEnChat(client.id);

        client.broadcast.emit('abandonaChat', {
            usuario: 'Administrador',
            mensaje: `${personaborrada.nombre} abandonó el chat`
        });

        client.broadcast.emit('listaPersonasConectadas', usuarios.getTodasLasPersonas());

    })

});