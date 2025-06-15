<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Art Tech - Sistema de Ordem de Serviço</title>
    
    <!-- Dependências Externas -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
    
    <!-- Folha de Estilos Local -->
    <link rel="stylesheet" href="style.css">
</head>
<body>

    <!-- Cabeçalho -->
    <header class="header">
        <div class="container">
            <h1><span class="text-primary">Art</span> Tech</h1>
            <p>Sistema de Controle de Ordens de Serviço</p>
        </div>
    </header>

    <!-- Conteúdo Principal -->
    <main class="container main-grid">
        
        <!-- Coluna do Formulário -->
        <div class="form-column">
            <div class="card">
                <h2 class="card-title">Nova Ordem de Serviço</h2>
                <form id="os-form">
                    <div class="form-group">
                        <label for="clientName">Nome do Cliente</label>
                        <input type="text" id="clientName" name="clientName" required>
                    </div>
                    <div class="form-group">
                        <label for="clientContact">Contato (Telefone)</label>
                        <input type="tel" id="clientContact" name="clientContact" placeholder="(XX) XXXXX-XXXX" required>
                    </div>
                    <div class="form-group">
                        <label for="deviceBrand">Marca</label>
                        <input type="text" id="deviceBrand" name="deviceBrand" required>
                    </div>
                    <div class="form-group">
                        <label for="deviceModel">Modelo</label>
                        <input type="text" id="deviceModel" name="deviceModel" required>
                    </div>
                     <div class="form-group">
                        <label for="reportedProblem">Problema Relatado</label>
                        <textarea id="reportedProblem" name="reportedProblem" rows="3" required></textarea>
                    </div>
                    
                    <!-- Seção de Avarias do Aparelho -->
                    <div class="damage-section">
                        <label>Registrar Avarias Externas</label>
                        <div class="tabs-container">
                            <nav class="tabs-nav">
                                <button type="button" data-view="front" class="view-tab active">Frente</button>
                                <button type="button" data-view="back" class="view-tab">Traseira</button>
                                <button type="button" data-view="sides" class="view-tab">Laterais</button>
                            </nav>
                        </div>
                        <div id="device-model-views" class="device-views-container">
                            <!-- SVGs dos modelos de aparelho -->
                            <svg id="view-front" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 250">
                                <rect x="5" y="5" width="140" height="240" rx="20" class="device-body"/>
                                <rect x="15" y="15" width="120" height="220" rx="10" class="device-screen"/>
                                <circle class="damage-hotspot" data-point-id="front-top" data-point-name="Tela Superior" cx="75" cy="50" r="10"/>
                                <circle class="damage-hotspot" data-point-id="front-middle" data-point-name="Tela Central" cx="75" cy="125" r="10"/>
                                <circle class="damage-hotspot" data-point-id="front-bottom" data-point-name="Tela Inferior" cx="75" cy="200" r="10"/>
                                <circle class="damage-hotspot" data-point-id="front-corner-tl" data-point-name="Canto Superior Esquerdo (Frente)" cx="30" cy="30" r="8"/>
                                <circle class="damage-hotspot" data-point-id="front-corner-tr" data-point-name="Canto Superior Direito (Frente)" cx="120" cy="30" r="8"/>
                                <circle class="damage-hotspot" data-point-id="front-corner-bl" data-point-name="Canto Inferior Esquerdo (Frente)" cx="30" cy="220" r="8"/>
                                <circle class="damage-hotspot" data-point-id="front-corner-br" data-point-name="Canto Inferior Direito (Frente)" cx="120" cy="220" r="8"/>
                            </svg>
                            <svg id="view-back" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 250" class="hidden">
                                <rect x="5" y="5" width="140" height="240" rx="20" class="device-body-back"/>
                                <rect x="15" y="20" width="35" height="45" rx="5" class="device-screen"/>
                                <circle class="damage-hotspot" data-point-id="back-top" data-point-name="Traseira Superior" cx="75" cy="50" r="10"/>
                                <circle class="damage-hotspot" data-point-id="back-middle" data-point-name="Traseira Central" cx="75" cy="125" r="10"/>
                                <circle class="damage-hotspot" data-point-id="back-bottom" data-point-name="Traseira Inferior" cx="75" cy="200" r="10"/>
                                <circle class="damage-hotspot" data-point-id="back-corner-tl" data-point-name="Canto Superior Esquerdo (Traseira)" cx="30" cy="30" r="8"/>
                                <circle class="damage-hotspot" data-point-id="back-corner-tr" data-point-name="Canto Superior Direito (Traseira)" cx="120" cy="30" r="8"/>
                                <circle class="damage-hotspot" data-point-id="back-corner-bl" data-point-name="Canto Inferior Esquerdo (Traseira)" cx="30" cy="220" r="8"/>
                                <circle class="damage-hotspot" data-point-id="back-corner-br" data-point-name="Canto Inferior Direito (Traseira)" cx="120" cy="220" r="8"/>
                            </svg>
                            <svg id="view-sides" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 250" class="hidden">
                                <rect x="5" y="5" width="20" height="240" rx="5" class="device-body-back"/>
                                <rect x="125" y="5" width="20" height="240" rx="5" class="device-body-back"/>
                                <circle class="damage-hotspot" data-point-id="side-left-top" data-point-name="Lateral Esquerda Superior" cx="15" cy="40" r="6"/>
                                <circle class="damage-hotspot" data-point-id="side-left-bottom" data-point-name="Lateral Esquerda Inferior" cx="15" cy="210" r="6"/>
                                <circle class="damage-hotspot" data-point-id="side-right-top" data-point-name="Lateral Direita Superior" cx="135" cy="40" r="6"/>
                                <circle class="damage-hotspot" data-point-id="side-right-bottom" data-point-name="Lateral Direita Inferior" cx="135" cy="210" r="6"/>
                                <circle class="damage-hotspot" data-point-id="side-top" data-point-name="Borda Superior" cx="75" cy="10" r="6"/>
                                <circle class="damage-hotspot" data-point-id="side-bottom" data-point-name="Borda Inferior" cx="75" cy="240" r="6"/>
                            </svg>
                        </div>
                    </div>
                </div>
                <div class="form-footer">
                    <button type="submit" class="btn btn-primary">
                        Criar Ordem de Serviço
                    </button>
                </div>
            </form>
        </div>

        <!-- Coluna das Ordens de Serviço -->
        <div class="os-column">
            <h2 class="section-title">Ordens de Serviço Ativas</h2>
            <div id="os-list" class="os-list-container">
                <div id="no-orders-message" class="card-placeholder">
                    <p>Nenhuma ordem de serviço criada ainda.</p>
                </div>
            </div>
        </div>
    </main>
    
    <!-- Modal para Descrição do Dano -->
    <div id="damage-modal" class="modal hidden">
        <div class="modal-content">
            <h3 id="modal-title">Adicionar Descrição do Dano</h3>
            <p id="modal-point-name" class="modal-subtitle">Local: </p>
            <div class="form-group">
                <textarea id="damage-description" rows="4" placeholder="Ex: Tela trincada, arranhão profundo..."></textarea>
            </div>
            <div class="modal-actions">
                <button id="save-damage-btn" class="btn btn-primary">Salvar</button>
                <button id="cancel-damage-btn" class="btn">Cancelar</button>
                <button id="remove-damage-btn" class="btn btn-danger hidden">Remover</button>
            </div>
        </div>
    </div>

    <!-- Script Local -->
    <script src="script.js" defer></script>
</body>
</html>
