document.addEventListener('DOMContentLoaded', function() {
    // Get form and fields
    const form = document.getElementById('quoteForm');
    const successMessage = document.getElementById('successMessage');

    // An object to hold all the required fields for easier access
    const fields = {
        name: document.getElementById('name'),
        phone: document.getElementById('phone'),
        marca: document.getElementById('marca'),
        modelo: document.getElementById('modelo'),
        service: document.getElementById('service'),
        description: document.getElementById('description')
    };
    
    // Character counter elements
    const charCounter = document.getElementById('charCounter');
    const maxLength = 500;

    /**
     * Shows an error message for a specific field.
     * @param {HTMLElement} field - The input element.
     * @param {HTMLElement} errorElement - The element to display the error message.
     */
    const showError = (field, errorElement) => {
        field.classList.add('invalid');
        errorElement.style.display = 'block';
    };

    /**
     * Clears the error message for a specific field.
     * @param {HTMLElement} field - The input element.
     * @param {HTMLElement} errorElement - The element that displays the error message.
     */
    const clearError = (field, errorElement) => {
        field.classList.remove('invalid');
        errorElement.style.display = 'none';
    };

    /**
     * Validates the entire form and displays errors if any.
     * @returns {boolean} - True if the form is valid, false otherwise.
     */
    const validateForm = () => {
        let isValid = true;

        // Clear all previous errors before validating again
        for (const fieldName in fields) {
            const field = fields[fieldName];
            const errorElement = document.getElementById(`${fieldName}Error`);
            if (errorElement) {
               clearError(field, errorElement);
            }
        }

        // --- Field Validations ---
        if (fields.name.value.trim() === '') {
            isValid = false;
            showError(fields.name, document.getElementById('nameError'));
        }
        
        if (fields.phone.value.trim() === '') {
            isValid = false;
            showError(fields.phone, document.getElementById('phoneError'));
        }
        
        if (fields.marca.value.trim() === '') {
            isValid = false;
            showError(fields.marca, document.getElementById('marcaError'));
        }
        
        if (fields.modelo.value.trim() === '') {
            isValid = false;
            showError(fields.modelo, document.getElementById('modeloError'));
        }
        
        if (fields.service.value === '') {
            isValid = false;
            showError(fields.service, document.getElementById('serviceError'));
        }
        
        if (fields.description.value.trim() === '') {
            isValid = false;
            showError(fields.description, document.getElementById('descriptionError'));
        }

        return isValid;
    };

    // --- Event Listener for Form Submission ---
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        successMessage.style.display = 'none';

        if (validateForm()) {
            // Número de WhatsApp da assistência técnica
            const numeroWhatsapp = '5588981342993'; // Seu número.

            // Coleta os dados do formulário
            const nome = fields.name.value.trim();
            const contato = fields.phone.value.trim();
            const marca = fields.marca.value.trim();
            const modelo = fields.modelo.value.trim();
            const problema = fields.service.options[fields.service.selectedIndex].text;
            const descricao = fields.description.value.trim();

            // Formata a mensagem para o WhatsApp
            const mensagem = `*Novo Pedido de Orçamento - Art Tech*

*Nome:* ${nome}
*Contato:* ${contato}
*Aparelho:* ${marca} - ${modelo}
*Problema Principal:* ${problema}

*Descrição:*
${descricao}`;

            // --- MUDANÇA PRINCIPAL AQUI ---
            // Cria o link usando a API oficial e redireciona a página atual
            const linkWhatsapp = `https://api.whatsapp.com/send?phone=${numeroWhatsapp}&text=${encodeURIComponent(mensagem)}`;

            // Redireciona a página atual para o WhatsApp. É mais robusto que abrir nova aba.
            window.location.href = linkWhatsapp;

        } else {
            console.log('Form validation failed.');
        }
    });
    
    // --- Live Validation & Character Counter ---
    fields.description.addEventListener('input', () => {
        const currentLength = fields.description.value.length;
        charCounter.textContent = `${currentLength} / ${maxLength}`;
        
        const errorElement = document.getElementById('descriptionError');
        if (errorElement && fields.description.value.trim() !== '') {
            clearError(fields.description, errorElement);
        }
    });
    
    // Add listeners for other fields to clear errors on input
    ['name', 'phone', 'marca', 'modelo', 'service'].forEach(fieldName => {
        const field = fields[fieldName];
        field.addEventListener('input', () => {
             const errorElement = document.getElementById(`${fieldName}Error`);
             if(errorElement && field.value.trim() !== '') {
                 clearError(field, errorElement);
             }
         });
    });
});
