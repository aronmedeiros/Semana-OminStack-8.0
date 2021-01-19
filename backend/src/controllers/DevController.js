const axios = require('axios');
const Dev = require('../models/Dev');

// Controla os dados do DB
module.exports = {

    async index(req, res){
        const { user } = req.headers;

        const loggedDev = await Dev.findById(user);

        const users = await Dev.find({
            $and: [
                { _id: { $ne: user } },
                { _id: { $nin: loggedDev.likes } },
                { _id: { $nin: loggedDev.deslikes } },
            ],
        })

        return res.json(users);
    },

    async store(req, res){
        const { username } = req.body;

        // pesquisa no banco
        const userExist = await Dev.findOne({ user: username });

        if(userExist){
            return res.json(userExist);
        }

        // await é para aguardar finalizar a requisição ao GIT (a função tem que ser async)
        const response = await axios.get(`https://api.github.com/users/${username}`);

        const { name, bio, avatar_url: avatar } = response.data;

        // insere no banco
        const devmais = await Dev.create({
            name,
            user: username,
            bio,
            avatar
        });

        return res.json(devmais);
    }
};
