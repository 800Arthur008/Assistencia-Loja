// Aguarda o conteúdo do HTML ser completamente carregado antes de executar o script
document.addEventListener('DOMContentLoaded', () => {
    // Inicializa a biblioteca jsPDF, se disponível
    const { jsPDF } = window.jspdf || {};
    
    // --- SELEÇÃO DE ELEMENTOS DO DOM ---
    const osForm = document.getElementById('os-form');
    const osList = document.getElementById('os-list');
    const noOrdersMessage = document.getElementById('no-orders-message');
    const viewTabs = document.querySelectorAll('.view-tab');
    const deviceViews = document.getElementById('device-model-views');
    
    // Elementos do Modal de Danos
    const damageModal = document.getElementById('damage-modal');
    const modalContent = damageModal.querySelector('.modal-content');
    const modalPointName = document.getElementById('modal-point-name');
    const damageDescription = document.getElementById('damage-description');
    const saveDamageBtn = document.getElementById('save-damage-btn');
    const cancelDamageBtn = document.getElementById('cancel-damage-btn');
    const removeDamageBtn = document.getElementById('remove-damage-btn');

    // --- VARIÁVEIS DE ESTADO DA APLICAÇÃO ---
    let serviceOrders = []; // Armazena todas as ordens de serviço criadas
    let damageData = [];    // Armazena os dados de danos para a OS atual
    let currentHotspot = null; // Armazena o ponto de dano clicado

    // --- LÓGICA DAS ABAS DE VISUALIZAÇÃO DO APARELHO ---
    viewTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const viewId = `view-${tab.dataset.view}`;
            
            viewTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            deviceViews.querySelectorAll('svg').forEach(view => view.classList.add('hidden'));
            document.getElementById(viewId).classList.remove('hidden');
        });
    });

    // --- LÓGICA DO MODAL DE REGISTRO DE DANOS ---
    function openModal(hotspot) {
        currentHotspot = hotspot;
        const pointId = hotspot.dataset.pointId;
        const pointName = hotspot.dataset.pointName;
        modalPointName.textContent = `Local: ${pointName}`;
        
        const existingDamage = damageData.find(d => d.id === pointId);
        damageDescription.value = existingDamage ? existingDamage.description : '';
        removeDamageBtn.classList.toggle('hidden', !existingDamage);

        damageModal.classList.remove('hidden');
        // Adiciona classe para animação de entrada (se houver)
    }

    function closeModal() {
         damageModal.classList.add('hidden');
         currentHotspot = null;
    }

    deviceViews.addEventListener('click', e => {
        const hotspot = e.target.closest('.damage-hotspot');
        if (hotspot) openModal(hotspot);
    });

    saveDamageBtn.addEventListener('click', () => {
        if (!currentHotspot || !damageDescription.value.trim()) return;
        
        const pointId = currentHotspot.dataset.pointId;
        const pointName = currentHotspot.dataset.pointName;
        const description = damageDescription.value.trim();
        
        const existingDamageIndex = damageData.findIndex(d => d.id === pointId);
        if (existingDamageIndex > -1) {
            damageData[existingDamageIndex].description = description;
        } else {
            damageData.push({ id: pointId, name: pointName, description });
        }
        
        currentHotspot.classList.add('damaged');
        closeModal();
    });

    removeDamageBtn.addEventListener('click', () => {
        if (!currentHotspot) return;
        const pointId = currentHotspot.dataset.pointId;
        damageData = damageData.filter(d => d.id !== pointId);
        currentHotspot.classList.remove('damaged');
        closeModal();
    });

    cancelDamageBtn.addEventListener('click', closeModal);
    damageModal.addEventListener('click', e => { if (e.target === damageModal) closeModal(); });

    // --- LÓGICA DO FORMULÁRIO PRINCIPAL ---
    osForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const newOrder = {
            id: Date.now(),
            clientName: document.getElementById('clientName').value.trim(),
            clientContact: document.getElementById('clientContact').value.trim(),
            deviceBrand: document.getElementById('deviceBrand').value.trim(),
            deviceModel: document.getElementById('deviceModel').value.trim(),
            reportedProblem: document.getElementById('reportedProblem').value.trim(),
            damages: [...damageData]
        };

        if (!newOrder.clientName || !newOrder.clientContact || !newOrder.deviceBrand || !newOrder.deviceModel || !newOrder.reportedProblem) {
            console.error("Validação falhou: todos os campos são obrigatórios.");
            return;
        }
        
        serviceOrders.push(newOrder);
        renderServiceOrders();

        osForm.reset();
        damageData = [];
        document.querySelectorAll('.damage-hotspot.damaged').forEach(el => el.classList.remove('damaged'));
    });

    // --- FUNÇÕES AUXILIARES ---
    function formatPhoneNumber(phoneStr) {
        const cleaned = ('' + phoneStr).replace(/\D/g, '');
        const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);
        if (match) return `(${match[1]}) ${match[2]}-${match[3]}`;
        const shortMatch = cleaned.match(/^(\d{2})(\d{4})(\d{4})$/);
        if (shortMatch) return `(${shortMatch[1]}) ${shortMatch[2]}-${shortMatch[3]}`;
        return phoneStr;
    }

    // --- FUNÇÃO DE RENDERIZAÇÃO DAS ORDENS DE SERVIÇO ---
    function renderServiceOrders() {
        osList.innerHTML = '';
        if (serviceOrders.length === 0) {
            noOrdersMessage.style.display = 'block';
            osList.appendChild(noOrdersMessage);
            return;
        }
        noOrdersMessage.style.display = 'none';

        serviceOrders.forEach(order => {
            const entryDate = new Date(order.id).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
            const entryTime = new Date(order.id).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

            let damagedPartsHtml = '<p>Nenhuma avaria externa registrada.</p>';
            if (order.damages.length > 0) {
                damagedPartsHtml = `<ul>` +
                order.damages.map(d => `<li><span>${d.name}:</span> ${d.description}</li>`).join('') +
                `</ul>`;
            }
            
            const phoneOnlyDigits = order.clientContact.replace(/\D/g, '');
            const formattedPhone = formatPhoneNumber(order.clientContact);

            const orderCard = document.createElement('div');
            orderCard.className = 'card';
            orderCard.id = `os-${order.id}`;
            orderCard.innerHTML = `
                <div class="os-card-header">
                    <div>
                        <h3>${order.deviceBrand} ${order.deviceModel}</h3>
                        <p>Cliente: ${order.clientName}</p>
                        <a href="tel:${phoneOnlyDigits}">${formattedPhone}</a>
                    </div>
                    <div class="os-card-id-block">
                        <span class="os-card-id">OS #${order.id}</span>
                        <p class="os-card-date">Entrada: ${entryDate} às ${entryTime}</p>
                    </div>
                </div>
                <div class="os-card-body">
                    <div>
                        <h4>Problema Relatado:</h4>
                        <div class="details-box">${order.reportedProblem}</div>
                    </div>
                    <div>
                        <h4>Relatório de Avarias:</h4>
                        <div class="details-box">${damagedPartsHtml}</div>
                    </div>
                </div>
                <div class="os-card-footer">
                    <div>
                       <h4>Status:</h4>
                       <p class="status-text">Aguardando Avaliação</p>
                    </div>
                    <div class="os-card-actions">
                        <button title="Gerar PDF" class="generate-pdf-btn" data-os-id="${order.id}">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                        </button>
                        <button title="Deletar Ordem" class="delete-os-btn" data-os-id="${order.id}">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        </button>
                    </div>
                </div>`;
            osList.appendChild(orderCard);
        });
    }

    // --- LÓGICA DOS BOTÕES NA OS (DELETAR, PDF) ---
    osList.addEventListener('click', e => {
        const deleteBtn = e.target.closest('.delete-os-btn');
        const pdfBtn = e.target.closest('.generate-pdf-btn');

        if (deleteBtn) {
            const osId = deleteBtn.dataset.osId;
            serviceOrders = serviceOrders.filter(order => order.id != osId);
            renderServiceOrders();
        }

        if (pdfBtn) {
            const osId = pdfBtn.dataset.osId;
            const orderData = serviceOrders.find(order => order.id == osId);
            if (orderData && typeof jsPDF !== 'undefined') {
                generatePdfForOrder(orderData);
            } else if (typeof jsPDF === 'undefined') {
                console.error("A biblioteca jsPDF não foi carregada.");
                // Poderíamos mostrar um erro para o usuário aqui.
            }
        }
    });

    // --- LÓGICA DE GERAÇÃO DE PDF ---
    function generatePdfForOrder(order) {
        const doc = new jsPDF();
        let y = 20;

        doc.setFontSize(22);
        doc.setFont("helvetica", "bold");
        doc.text("Art Tech - Ordem de Serviço", 105, y, { align: "center" });
        y += 15;
        
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        const entryDate = new Date(order.id).toLocaleString('pt-BR');
        doc.text(`OS #${order.id}`, 20, y);
        doc.text(`Data de Entrada: ${entryDate}`, 190, y, { align: "right" });
        y += 7;
        doc.line(20, y, 190, y);
        y += 10;

        doc.setFont("helvetica", "bold");
        doc.text("Informações do Cliente", 20, y);
        y += 7;
        doc.setFont("helvetica", "normal");
        doc.text(`Nome: ${order.clientName}`, 20, y);
        doc.text(`Contato: ${formatPhoneNumber(order.clientContact)}`, 100, y);
        y += 10;
        
        doc.setFont("helvetica", "bold");
        doc.text("Informações do Aparelho", 20, y);
        y += 7;
        doc.setFont("helvetica", "normal");
        doc.text(`Marca: ${order.deviceBrand}`, 20, y);
        doc.text(`Modelo: ${order.deviceModel}`, 100, y);
        y += 10;

        doc.setFont("helvetica", "bold");
        doc.text("Problema Principal Relatado", 20, y);
        y += 7;
        doc.setFont("helvetica", "normal");
        const problemLines = doc.splitTextToSize(order.reportedProblem, 170);
        doc.text(problemLines, 20, y);
        y += (problemLines.length * 5) + 5;

        doc.setFont("helvetica", "bold");
        doc.text("Relatório de Avarias Externas", 20, y);
        y += 7;
        doc.setFont("helvetica", "normal");
        if(order.damages.length > 0) {
            order.damages.forEach(d => {
                const damageLines = doc.splitTextToSize(`- ${d.name}: ${d.description}`, 165);
                doc.text(damageLines, 25, y);
                y += (damageLines.length * 5);
            });
        } else {
            doc.text("Nenhuma avaria externa registrada.", 25, y);
            y += 6;
        }
        y += 10;

        doc.line(20, y, 190, y);
        y += 15;
        doc.text("Assinatura do Cliente:", 20, y);
        doc.line(65, y, 190, y);

        doc.save(`OS-${order.id}.pdf`);
    }
});
