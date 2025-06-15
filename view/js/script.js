// Este script controla a exibição do menu de navegação em dispositivos móveis.

document.addEventListener('DOMContentLoaded', function() {
    
    // Seleciona o botão do menu e o menu móvel pelo ID.
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    // Verifica se ambos os elementos existem na página para evitar erros.
    if (mobileMenuButton && mobileMenu) {
        
        // Adiciona um ouvinte de evento de clique ao botão.
        mobileMenuButton.addEventListener('click', function() {
            
            // Alterna a classe 'active' no elemento do menu.
            // A classe 'active' é usada no CSS para mostrar ou esconder o menu.
            mobileMenu.classList.toggle('active');
        });
    }

});
