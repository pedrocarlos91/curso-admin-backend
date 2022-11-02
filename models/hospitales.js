const {Schema, model} = require('mongoose');

const HospitalSchema = Schema({
    nombre: {
        type: String,
        required: true
    },
    img: {
        type: String
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    }
});

// Se trasnforma el __id por uid y se elimina la version de la respuesta
HospitalSchema.method('toJSON', function() {
    const {__v, _id, password, ...object} = this.toObject();
    object.id = _id;
    return object;
}, {collection: 'hospitales'});

module.exports = model('Hospital', HospitalSchema);