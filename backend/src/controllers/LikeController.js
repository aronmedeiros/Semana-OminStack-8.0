const Dev = require('../models/Dev');

module.exports = {
    async store(req, res){
        const { devId } = req.params;
        const { user } = req.headers;

        const loggedDev = await Dev.findById(user); // quem esta dando o like  
        const targetDev = await Dev.findById(devId); // quem esta recebendo o like

        if(!targetDev){
            return res.status(400).json({ error: 'Dev não existe'});
        }

        // acrescenta o ID de quem esta dando em quem esta recebendo
        loggedDev.likes.push(targetDev._id);
        await loggedDev.save();

        if(targetDev.likes.includes(loggedDev._id)){
            const loggedSocket = req.connectedUsers[user];
            const targetSocket = req.connectedUsers[devId];

            if(loggedSocket){
                req.io.to(loggedSocket).emit('match', targetDev);
            }

            if(targetSocket){
                req.io.to(targetSocket).emit('match', loggedDev);
            }
        }

        return res.json(loggedDev);
    }
};