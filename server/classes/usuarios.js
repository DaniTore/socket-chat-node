class Usuarios {

    constructor() {
        this.personasEnChat = []; // en el chat
    }

    agregarPersonaAlChat(id, nombre) {

        let persona = { id, nombre } // creo la persona

        this.personasEnChat.push(persona); // agrego la persona al array de personas

        return this.personasEnChat;
    }

    getPersona(id) {
        let personaEncontradaPorId = this.personasEnChat.filter(cadaPersona => cadaPersona.id === id)[0]; // [0] para devolver solo el primer registro

        // Si no encutra ninguna persona por el id sera undefine

        return personaEncontradaPorId;
    }

    getTodasLasPersonas() {
        return this.personasEnChat;
    }

    getPersonasPorSala(sala) {
        // ...
    }

    borrarPersonaEnChat(id) {
        //al borrar perdemos la relación, no podríamos mandar un mensaje, "persona x salio", por lo que la guardamos antes de borrar
        let personaBorrada = this.getPersona(id);

        // guardamos en el mismo array donde filtramos todas las personas del chat - la borrada
        this.personasEnChat = this.personasEnChat.filter(cadaPersona => cadaPersona.id != id);

        return personaBorrada;
    }

}

module.exports = {
    Usuarios
}