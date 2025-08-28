// Simulação de banco de dados de usuários
const usersDB = JSON.parse(localStorage.getItem('jdm_users')) || [];

// Funções auxiliares
function showError(element, message) {
    if (element) {
        element.textContent = message;
        element.style.display = 'block';
        setTimeout(() => {
            element.style.display = 'none';
        }, 5000);
    }
}

function showSuccess(element, message) {
    if (element) {
        element.textContent = message;
        element.style.display = 'block';
    }
}

// --- Lógica de Autenticação Centralizada ---
function checkAuthAndRedirect() {
    const currentUser = sessionStorage.getItem('jdm_currentUser');
    const path = window.location.pathname;

    // Se estiver na página de login/cadastro e já tiver usuário logado, redirecionar para app.html
    if ((path.includes('index.html') || path.includes('cadastro.html')) && currentUser) {
        console.log("Usuário logado, redirecionando para app.html");
        window.location.href = 'app.html';
    } 
    // Se estiver na página principal (app.html) e não tiver usuário logado, redirecionar para index.html
    else if (path.includes('app.html') && !currentUser) {
        console.log("Usuário não logado na app.html, redirecionando para index.html");
        window.location.href = 'index.html';
    }
}

// Chamar a verificação de autenticação ao carregar a página
document.addEventListener('DOMContentLoaded', checkAuthAndRedirect);


// Elementos do formulário de login
// ... (código existente do auth.js)

// Elementos do formulário de login
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const errorElement = document.getElementById('loginError');
        
        if (!email || !password) {
            showError(errorElement, 'Por favor, preencha todos os campos.');
            return;
        }
        
        const user = usersDB.find(u => u.email === email && u.password === password);
        
        if (user) {
            // Salva o objeto do usuário logado na sessionStorage
            sessionStorage.setItem('jdm_currentUser', JSON.stringify(user));
            // Redireciona para a página principal
            window.location.href = 'app.html';
        } else {
            showError(errorElement, 'E-mail ou senha incorretos. Tente novamente.');
        }
    });
}
// ... (restante do código do auth.js)

// Elementos do formulário de cadastro
// ... (seu código existente de usersDB, showError, showSuccess, checkAuthAndRedirect)

document.addEventListener('DOMContentLoaded', function() {
    checkAuthAndRedirect(); // Garante que esta função seja chamada

    // --- Lógica de Máscaras de Input ---
    const registerCPFInput = document.getElementById('registerCPF');
    const registerPhoneInput = document.getElementById('registerPhone');

    if (registerCPFInput) {
        registerCPFInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, ''); // Remove tudo que não é dígito
            if (value.length > 11) value = value.substring(0, 11); // Limita a 11 dígitos
            
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
            e.target.value = value;
        });
    }

    if (registerPhoneInput) {
        registerPhoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, ''); // Remove tudo que não é dígito
            if (value.length > 11) value = value.substring(0, 11); // Limita a 11 dígitos

            if (value.length > 10) {
                value = value.replace(/^(\d\d)(\d{5})(\d{4}).*/, '($1) $2-$3');
            } else if (value.length > 6) {
                value = value.replace(/^(\d\d)(\d{4})(\d{0,4}).*/, '($1) $2-$3');
            } else if (value.length > 2) {
                value = value.replace(/^(\d\d)(\d{0,5})/, '($1) $2');
            } else {
                value = value.replace(/^(\d*)/, '($1');
            }
            e.target.value = value;
        });
    }

    // --- Seus formulários de login e cadastro ---
    // ... (o código do loginForm e registerForm que você já tem)
    
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            const errorElement = document.getElementById('loginError');
            
            if (!email || !password) {
                showError(errorElement, 'Por favor, preencha todos os campos.');
                return;
            }
            
            const user = usersDB.find(u => u.email === email && u.password === password);
            
            if (user) {
                sessionStorage.setItem('jdm_currentUser', JSON.stringify(user));
                window.location.href = 'app.html';
            } else {
                showError(errorElement, 'E-mail ou senha incorretos. Tente novamente.');
            }
        });
    }

    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('registerName').value;
            const cpf = document.getElementById('registerCPF').value;
            const phone = document.getElementById('registerPhone').value;
            const address = document.getElementById('registerAddress').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            const confirmPassword = document.getElementById('registerConfirmPassword').value;
            
            const errorElement = document.getElementById('registerError');
            const successElement = document.getElementById('registerSuccess');
            
            if (!name || !cpf || !phone || !address || !email || !password || !confirmPassword) {
                showError(errorElement, 'Por favor, preencha todos os campos.');
                return;
            }
            
            if (password !== confirmPassword) {
                showError(errorElement, 'As senhas não coincidem!');
                return;
            }
            
            if (password.length < 6) {
                showError(errorElement, 'A senha deve ter pelo menos 6 caracteres.');
                return;
            }
            
            const userExists = usersDB.some(u => u.email === email);
            
            if (userExists) {
                showError(errorElement, 'Este e-mail já está cadastrado.');
                return;
            }
            
            const newUser = {
                id: Date.now().toString(),
                name,
                cpf,
                phone,
                address,
                email,
                password
            };
            
            usersDB.push(newUser);
            localStorage.setItem('jdm_users', JSON.stringify(usersDB));
            
            showSuccess(successElement, 'Cadastro realizado com sucesso! Redirecionando...');
            
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        });
    }
});
function login(username, password) {
    // Lógica para verificar o login, por exemplo, com uma API
    if (login_sucesso) {
        // Salva o nome do usuário no localStorage
        localStorage.setItem('userName', username);
        // Redireciona para a dashboard
        window.location.href = 'app.html';
    } else {
        // Exibe mensagem de erro
    }
}