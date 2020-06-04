(() => {
    const selector = selector =>  document.querySelector(selector)/* trecho omitido */
    const create = element =>  document.createElement(element) /* trecho omitido */
    
    const app = selector('#app');

    const Login = create('div');
    Login.classList.add('login');

    const Logo = create('img');
    Logo.src = './assets/images/logo.svg';   
    Logo.classList.add('logo');

    const Form = create('form');

    Form.onsubmit = async e => {
        e.preventDefault();
        const email = document.getElementById('email');
        const password = document.getElementById('password');

        const {url} = await fakeAuthenticate(email.value, password.value);

        location.href='#users';
        
        const users = await getDevelopersList(url);        
        renderPageUsers(users);        
    }
  

    Form.oninput = e => {         
     
        const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
       
        const [email, password, button] = e.target.parentElement.children;
        
        (!email.value.match(regex) || !email.value || password.value.length <= 5) 
            ? button.setAttribute('disabled','disabled')
            : button.removeAttribute('disabled');
    };
    
    Form.innerHTML =  '<div class="login-page"><div class="form"> <form class="login-form"> <input type="text" id="email" placeholder="Entre com seu e-mail"/> <input type="password" id="password" placeholder="Digite sua senha supersecreta"/>   <button disabled="true" id="submitBtn" type="submit">login</button> </form>  </div> </div>';


    app.appendChild(Logo);
    Login.appendChild(Form);

    async function fakeAuthenticate(email, password) {

        /**
         * bloco de código omitido
         * aqui esperamos que você faça a requisição ao URL informado
         */
        
        const urlData = fetch("http://www.mocky.io/v2/5dba690e3000008c00028eb6")
         .then(res => 
                res.json())
         .then( data => {          
                const fakeJwtToken = `${btoa(email+password)}.${btoa(data.url)}.${(new Date()).getTime()+300000}`;
                localStorage.setItem("token" , fakeJwtToken)                
                return data
            })
            .catch(err => {
                console.log(err)
            })
         app.removeChild(Login)   

         return urlData;                
    }

    async function getDevelopersList(url) {
        /**
         * bloco de código omitido
         * aqui esperamos que você faça a segunda requisição 
         * para carregar a lista de desenvolvedores
         */

         let devList = fetch(url)
        .then(res => 
            res.json()
        )
        .then( data => {   
           return data     
        })    
        .catch(err => {
            console.log(err)
        })    

        return devList
        
    }

    function renderPageUsers(users) {
        app.classList.add('logged');
        Login.style.display = false; /* trecho omitido */ 
           

        const Ul = create('ul');
        Ul.classList.add('container')    

        users.forEach(e => {            
            const Li = create('li');
            Li.classList.add('contributor');
            Li.innerHTML = `<img class="avatar" src="${e.avatar_url}"> <p>${e.login}</p>`
            Ul.appendChild(Li)         
           
        });
        
        /**
         * bloco de código omitido
         * exiba a lista de desenvolvedores
         */

        app.appendChild(Ul)
        expireTokenTime();
    }

    function logout () {
        console.log('saiu')
        localStorage.removeItem('token')
    }

    function expireTokenTime() {
        setTimeout(() => 
            logout(), 300000   
        )
    }

    // init
    (async function(){
        const rawToken = localStorage.getItem('token')
        const token = rawToken ? rawToken.split('.') : null
        if (!token || token[2] < (new Date()).getTime()) {
            localStorage.removeItem('token');
            location.href='#login';
            app.appendChild(Login);
            console.log()
        } else {
            location.href='#users';
            const users = await getDevelopersList(atob(token[1]));
            renderPageUsers(users);
            
        }
    })()
})()