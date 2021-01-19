// Cria estrutura da tabela no MongoDB
const { Schema, model } = require('mongoose');

const DevSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    user: {
        type: String,
        required: true,
    },
    bio: String,
    avatar: {
        type: String,
        required: true,
    },
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'dev',
    }],
    deslikes: [{
        type: Schema.Types.ObjectId,
        ref: 'dev',
    }],
}, {
    timestamps: true, // cria campo de update e cadastro nos campos do DB.
});

// exporta para uso
module.exports = model('Dev', DevSchema);