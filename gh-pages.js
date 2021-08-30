const ghp = require('gh-pages');

ghp.publish(
    'public',
    {
        branch: 'gh-pages',
        repo: 'https://github.com/Gaizgrol/automatos-finitos-deterministicos.git',
        user: {
            name: 'Gaizgrol',
            email: 'gabrielizotongo@gmail.com'
        }
    },
    err =>
    {
        if (err)
            console.error('Erro!', err);
        else
            console.log('Envio finalizado!');
    }
);
