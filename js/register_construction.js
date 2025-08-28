document.addEventListener('DOMContentLoaded', function() {
    console.log('Página de Cadastro de Obra carregada!');

    const fotoObraInput = document.getElementById('fotoObra');
    const fileNameDisplay = document.getElementById('fileNameDisplay');
    const imagePreview = document.getElementById('imagePreview');
    const constructionRegisterForm = document.getElementById('constructionRegisterForm');
    const cepInput = document.getElementById('cep');

    // --- Função para exibir a notificação ---
    function showNotification(message, type = 'success', duration = 3000) {
        let notification = document.createElement('div');
        notification.classList.add('notification-message', type);
        notification.innerHTML = `
            ${message}
            <button class="close-notification"><i class="fas fa-times"></i></button>
        `;
        document.body.appendChild(notification);

        // Força o reflow para garantir que a transição ocorra
        notification.offsetHeight; 
        notification.classList.add('show'); // Inicia a animação de entrada

        // Adiciona listener para fechar ao clicar no 'x'
        notification.querySelector('.close-notification').addEventListener('click', () => {
            hideNotification(notification);
        });

        // Esconde a notificação após 'duration' milissegundos
        setTimeout(() => {
            hideNotification(notification);
        }, duration);
    }

    function hideNotification(notificationElement) {
        notificationElement.classList.remove('show'); // Inicia a animação de saída
        // Remove o elemento do DOM após a transição
        notificationElement.addEventListener('transitionend', () => {
            if (notificationElement.parentNode) {
                notificationElement.parentNode.removeChild(notificationElement);
            }
        }, { once: true }); // Garante que o listener seja removido após uma execução
    }
    // --- Fim da Função de Notificação ---


    // Função para formatar o CEP
    if (cepInput) {
        cepInput.addEventListener('input', function (e) {
            let value = e.target.value.replace(/\D/g, ''); // Remove tudo que não é dígito
            if (value.length > 5) {
                value = value.substring(0, 5) + '-' + value.substring(5, 8);
            }
            e.target.value = value;
        });
    }

    // Pré-visualização da imagem selecionada
    if (fotoObraInput) {
        fotoObraInput.addEventListener('change', function() {
            const file = this.files[0];

            if (file) {
                fileNameDisplay.textContent = file.name;

                const reader = new FileReader();
                reader.onload = function(e) {
                    imagePreview.innerHTML = `<img src="${e.target.result}" alt="Pré-visualização da Obra">`;
                };
                reader.readAsDataURL(file);
            } else {
                fileNameDisplay.textContent = 'Nenhuma foto selecionada';
                imagePreview.innerHTML = 'Nenhuma imagem selecionada';
            }
        });
    }

    // Lógica para submeter o formulário
    if (constructionRegisterForm) {
        constructionRegisterForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Impede o envio padrão do formulário

            // Aqui você coletaria os dados do formulário
            const cnpjCpf = document.getElementById('cnpjCpf').value;
            const nomeObra = document.getElementById('nomeObra').value;
            const localObra = document.getElementById('localObra').value;
            const cep = document.getElementById('cep').value;
            const dataInicio = document.getElementById('dataInicio').value;
            const previsaoTermino = document.getElementById('previsaoTermino').value;
            const fotoObra = fotoObraInput.files[0]; // O arquivo da imagem

            // Exemplo de console log dos dados (em um ambiente real, você enviaria para um backend)
            console.log('Dados da Obra:', {
                cnpjCpf,
                nomeObra,
                localObra,
                cep,
                dataInicio,
                previsaoTermino,
                fotoObra: fotoObra ? fotoObra.name : 'Nenhuma foto'
            });

            // Simulando um cadastro bem-sucedido:
            // Em um sistema real, você faria uma requisição AJAX/Fetch para um servidor aqui.
            // Se a requisição for bem-sucedida, você chamaria:
            showNotification('Obra cadastrada com sucesso!', 'success'); // Notificação verde de sucesso

            // Se houvesse um erro na requisição:
            // showNotification('Erro ao cadastrar obra. Tente novamente.', 'error'); // Notificação vermelha de erro
            
            // Limpa o formulário após o "cadastro" simulado
            constructionRegisterForm.reset();
            fileNameDisplay.textContent = 'Nenhuma foto selecionada';
            imagePreview.innerHTML = 'Nenhuma imagem selecionada';
        });
    }
});