const Dev = require('../models/Dev');

module.exports = {
    async store(req, res){
        const { devId } = req.params;
        const { user } = req.headers;

        const loggedDev = await Dev.findById(user); // quem esta dando o deslike 
        const targetDev = await Dev.findById(devId); // quem esta recebendo o deslike
        
        if(!targetDev){
            return res.status(400).json({ error: 'Dev não existe'});
        }

        // acrescenta o ID de quem esta dando em quem esta recebendo
        loggedDev.deslikes.push(targetDev._id);
        await loggedDev.save();

        return res.json({ ok: true });
    }
};