const authenticationUrls = [
    '/login', 
    '/esqueci-minha-senha'
];

const guaranteeUrls = [
    '/',
    '/clientes',
    '/clientes/editar',
    '/clientes/novo',
    '/clientes/resumo',
    '/crediarios',
    '/crediarios/informativo',
    '/crediarios/novo',
    '/despesas',
    '/despesas/nova',
    '/relatorios'
];

window.addEventListener('load', async () => {
    const token = getCookie('sessionToken');

    if (!authenticationUrls.includes(window.location.pathname)) {
        if (token) {
            const sessionData = await fetch(
                `${BASEPATH}/user/validatesession`,
                {
                    method: 'POST',
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        token: token
                    })
                }
            );

            const response = await sessionData.json();

            var modules = [];

            response.modules.forEach(module => {
                modules.push(module[0]);
            })
            
            if (guaranteeUrls.includes(window.location.pathname)) {
                if (!modules.includes('guarantee')) {
                    eraseCookie('UID');
                    eraseCookie('sessionToken');

                    window.location.replace('/login?redirectTo=' + encodeURIComponent(window.location.href));
                }
            }
                                                  
            if (document.getElementById('user-name')){
                document.getElementById("user-name").innerText = response.name;
            }

            if (response.message === 'jwt expired') {
                eraseCookie('UID');
                eraseCookie('sessionToken');

                window.location.replace('/login?redirectTo=' + encodeURIComponent(window.location.href));
            }

        } else {
            window.location.replace('/login?redirectTo=' + encodeURIComponent(window.location.href));
        }
    }
})