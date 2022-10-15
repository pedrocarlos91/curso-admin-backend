const {Schema, model} = require('mongoose');

const MedicoSchema = Schema({
    nombre: {
        type: String,
        required: true
    },
    img: {
        type: String
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }
});

// Se trasnforma el __id por uid y se elimina la version de la respuesta
MedicoSchema.method('toJSON', function() {
    const {__v, _id, password, ...object} = this.toObject();
    object.id = _id;
    return object;
}, {collection: 'medicos'});

module.exports = model('Medico', MedicoSchema);