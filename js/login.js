// Dados fictícios de usuário (pode ser substituído por um sistema de backend real)
const mockUserData = [
    { username: 'admin', password: '1234' },
    { username: 'user2', password: 'password2' },
    // Adicione mais usuários conforme necessário
];

document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.querySelector('form');

    loginForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const usernameInput = document.getElementById('username');
        const passwordInput = document.getElementById('password');

        const username = usernameInput.value;
        const password = passwordInput.value;

        if (authenticateUser(username, password)) {
            alert('Login successful!');
            // Redirecionar para a página do painel do usuário
            window.location.href = '/html/dashboard.html';
        } else {
            alert('Invalid username or password. Please try again.');
        }

        // Limpar os campos de entrada
        usernameInput.value = '';
        passwordInput.value = '';
    });

    function authenticateUser(username, password) {
        // Verificar se o usuário existe nos dados fictícios
        const user = mockUserData.find(user => user.username === username && user.password === password);

        return user !== undefined;
    }
});