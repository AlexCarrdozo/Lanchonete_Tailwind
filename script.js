// Variáveis globais
let carrinhoItens = [];
let carrinhoTotal = 0;

// Aguarda o documento estar completamente carregado
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const menuLateral = document.querySelector('#menu-lateral');

    // Função para alternar a visibilidade do menu lateral
    function toggleMenu(event) {
        event.stopPropagation();
        menuLateral.classList.toggle('-left-full'); // Move para fora da tela
        menuLateral.classList.toggle('left-0');     // Move para dentro da tela
    }

    // Função para fechar o menu
    function closeMenu() {
        menuLateral.classList.add('-left-full');
        menuLateral.classList.remove('left-0');
    }

    if (menuToggle) {
        menuToggle.addEventListener('click', toggleMenu);
    }

    // Fecha o menu se um clique ocorrer fora dele
    document.addEventListener('click', function(event) {
        if (!menuLateral.contains(event.target) && !menuToggle.contains(event.target)) {
            closeMenu();
        }
    });

    // Fecha o menu ao clicar em um de seus links
    const menuLinks = document.querySelectorAll('#menu-lateral a');
    menuLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });
});

// Alterna a visibilidade do carrinho
function toggleCarrinho() {
    const carrinho = document.getElementById('carrinho');
    carrinho.classList.toggle('hidden');
}

// Adiciona um item ao carrinho
function adicionarAoCarrinho(nome, preco) {
    carrinhoItens.push({ nome, preco });
    carrinhoTotal += preco;

    atualizarCarrinho();
    mostrarMensagem('Item adicionado ao carrinho!');

    document.getElementById('carrinho-contador').textContent = carrinhoItens.length;
    atualizarBotaoFinalizar();
    fecharModal(); // Fecha o modal após adicionar
}

// Atualiza a exibição do carrinho
function atualizarCarrinho() {
    const carrinhoItensElement = document.getElementById('carrinho-itens');
    const carrinhoTotalElement = document.getElementById('carrinho-total');

    carrinhoItensElement.innerHTML = ''; // Limpa os itens antigos
    carrinhoItens.forEach((item, index) => {
        const itemElement = document.createElement('div');
        // Usando classes do Tailwind para estilizar o item do carrinho
        itemElement.className = 'flex justify-between items-center py-2 text-sm';
        itemElement.innerHTML = `
            <span>${item.nome} - R$ ${item.preco.toFixed(2)}</span>
            <button onclick="removerDoCarrinho(${index})" class="text-red-500 hover:text-red-700 font-bold">×</button>
        `;
        carrinhoItensElement.appendChild(itemElement);
    });

    carrinhoTotalElement.textContent = carrinhoTotal.toFixed(2);
}

// Remove um item do carrinho
function removerDoCarrinho(index) {
    carrinhoTotal -= carrinhoItens[index].preco;
    carrinhoItens.splice(index, 1);

    atualizarCarrinho();
    document.getElementById('carrinho-contador').textContent = carrinhoItens.length;
    atualizarBotaoFinalizar();
    mostrarMensagem('Item removido do carrinho!');
}

// Mostra ou esconde o botão de finalizar pedido
function atualizarBotaoFinalizar() {
    const btnFinalizar = document.getElementById('btn-finalizar');
    if (carrinhoItens.length > 0) {
        btnFinalizar.classList.remove('hidden');
    } else {
        btnFinalizar.classList.add('hidden');
    }
}

// Exibe uma mensagem de notificação temporária
function mostrarMensagem(texto) {
    const mensagem = document.getElementById('mensagem');
    mensagem.textContent = texto;
    mensagem.classList.remove('hidden');

    setTimeout(() => {
        mensagem.classList.add('hidden');
    }, 3000);
}


// Funções de Modal (com HTML gerado usando Tailwind)

function abrirModal(titulo, descricao, preco, imagem) {
    const modal = document.getElementById('modal');
    const modalContent = modal.querySelector('.modal-content');

    modalContent.innerHTML = `
        <button class="modal-fechar absolute top-2 right-4 text-3xl text-gray-500 hover:text-gray-800" onclick="fecharModal()">&times;</button>
        <img src="${imagem}" alt="${titulo}" class="w-full h-64 object-cover rounded-lg mb-4">
        <h2 class="text-3xl font-bold mb-2">${titulo}</h2>
        <p class="text-gray-600 mb-4">${descricao}</p>
        <p class="text-2xl font-bold text-red-700 mb-6">R$ ${preco.toFixed(2)}</p>
        <button class="w-full bg-[#C70039] hover:bg-[#99002C] text-white font-bold py-3 px-4 rounded-lg transition" onclick="adicionarAoCarrinho('${titulo.replace(/'/g, "\\'")}', ${preco})">
            Adicionar ao Carrinho
        </button>
    `;
    modal.classList.remove('hidden');
    modal.classList.add('flex'); // 'flex' para centralizar o conteúdo
}

function abrirModalLanches(categoria, opcoes) {
    const modal = document.getElementById('modal');
    const modalContent = modal.querySelector('.modal-content');

    modalContent.innerHTML = `
        <button class="absolute top-2 right-4 text-3xl text-gray-500 hover:text-gray-800" onclick="fecharModal()">&times;</button>
        <h2 class="text-3xl font-bold mb-6">Opções de ${categoria}</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            ${opcoes.map(opcao => `
                <div class="border rounded-lg p-4 text-center">
                    <img src="${opcao.imagem}" alt="${opcao.nome}" class="w-full h-32 object-cover rounded-md mb-3">
                    <h4 class="font-bold text-lg">${opcao.nome}</h4>
                    <p class="text-sm text-gray-500 mb-2">${opcao.descricao}</p>
                    <p class="font-bold text-red-700 mb-3">R$ ${opcao.preco.toFixed(2)}</p>
                    <button class="w-full bg-[#C70039] hover:bg-[#99002C] text-white font-bold py-2 px-3 text-sm rounded-md transition" onclick="adicionarAoCarrinho('${opcao.nome.replace(/'/g, "\\'")}', ${opcao.preco})">
                        Adicionar
                    </button>
                </div>
            `).join('')}
        </div>
    `;
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

// As funções abrirModalBebidas e abrirModalSobremesas são idênticas a abrirModalLanches
const abrirModalBebidas = abrirModalLanches;
const abrirModalSobremesas = abrirModalLanches;


function fecharModal() {
    const modal = document.getElementById('modal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}

// Lógica de Finalização de Pedido

function finalizarPedido() {
    const modal = document.getElementById('modal');
    const modalContent = modal.querySelector('.modal-content');
    const total = document.getElementById('carrinho-total').textContent;

    // Formulário com classes do Tailwind
    modalContent.innerHTML = `
        <button class="absolute top-2 right-4 text-3xl text-gray-500 hover:text-gray-800" onclick="fecharModal()">&times;</button>
        <h2 class="text-2xl font-bold mb-4">Finalizar Pedido</h2>
        <form id="formPedido" onsubmit="enviarPedido(event)" class="w-full text-left">
            <div class="mb-4">
                <label for="nome" class="block text-gray-700 text-sm font-bold mb-2">Nome Completo:</label>
                <input type="text" id="nome" required placeholder="Digite seu nome" class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#C70039]">
            </div>
            <div class="mb-4">
                <label for="celular" class="block text-gray-700 text-sm font-bold mb-2">Celular:</label>
                <input type="tel" id="celular" required placeholder="(00) 00000-0000" class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#C70039]">
            </div>
            <div class="mb-4">
                <label for="endereco" class="block text-gray-700 text-sm font-bold mb-2">Endereço:</label>
                <input type="text" id="endereco" required placeholder="Rua, número" class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#C70039]">
            </div>
            <div class="mb-4">
                <label for="formaPagamento" class="block text-gray-700 text-sm font-bold mb-2">Forma de Pagamento:</label>
                <select id="formaPagamento" required class="w-full px-3 py-2 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[#C70039]">
                    <option value="">Selecione</option>
                    <option value="dinheiro">Dinheiro</option>
                    <option value="cartao">Cartão (na entrega)</option>
                </select>
            </div>
            <div id="trocoContainer" class="mb-4 hidden">
                <label for="troco" class="block text-gray-700 text-sm font-bold mb-2">Troco para quanto?</label>
                <input type="number" id="troco" placeholder="Deixe em branco se não precisar" class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#C70039]">
            </div>
             <div class="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 class="font-bold mb-2">Resumo do Pedido</h3>
                <div class="text-sm text-gray-600">${carrinhoItens.map(item => `<div>${item.nome}</div>`).join('')}</div>
                <p class="text-right font-bold mt-2">Total: R$ ${total}</p>
            </div>
            <button type="submit" class="w-full mt-6 bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-md transition">Confirmar Pedido</button>
        </form>
    `;

    modal.classList.remove('hidden');
    modal.classList.add('flex');

    // Lógica para mostrar campo de troco
    const formaPagamento = document.getElementById('formaPagamento');
    const trocoContainer = document.getElementById('trocoContainer');
    formaPagamento.addEventListener('change', function() {
        if (this.value === 'dinheiro') {
            trocoContainer.classList.remove('hidden');
        } else {
            trocoContainer.classList.add('hidden');
        }
    });
}

function enviarPedido(event) {
    event.preventDefault(); // Impede o envio real do formulário
    const numeroPedido = Math.floor(Math.random() * 10000) + 1000;
    
    const modal = document.getElementById('modal');
    const modalContent = modal.querySelector('.modal-content');
    
    // Gera o HTML do modal de confirmação
    modalContent.innerHTML = `
        <div class="text-center">
            <i class="fas fa-check-circle text-6xl text-green-500 mb-4"></i>
            <h2 class="text-3xl font-bold mb-2">Pedido Confirmado!</h2>
            <p class="text-gray-600 mb-4">Seu pedido <span class="font-bold text-gray-800">#${numeroPedido}</span> está sendo preparado.</p>
            <div class="my-6 border-t pt-4">
                <h3 class="font-bold text-lg">Acompanhe:</h3>
                <div class="flex justify-between items-center text-center mt-4 text-xs">
                    
                    <div class="status-item text-green-500 font-bold">
                        <div class="icon-container w-10 h-10 mx-auto rounded-full bg-green-500 text-white flex items-center justify-center">
                            <i class="fas fa-check"></i>
                        </div>
                        <p class="mt-1">Confirmado</p>
                    </div>

                    <div class="status-line flex-1 h-0.5 bg-gray-200"></div>
                    
                    <div class="status-item text-gray-400">
                         <div class="icon-container w-10 h-10 mx-auto rounded-full bg-gray-200 flex items-center justify-center">
                            <i class="fas fa-kitchen-set"></i>
                         </div>
                        <p class="mt-1">Preparando</p>
                    </div>
                    
                     <div class="status-line flex-1 h-0.5 bg-gray-200"></div>

                    <div class="status-item text-gray-400">
                        <div class="icon-container w-10 h-10 mx-auto rounded-full bg-gray-200 flex items-center justify-center">
                            <i class="fas fa-motorcycle"></i>
                        </div>
                        <p class="mt-1">Em Entrega</p>
                    </div>
                </div>
            </div>
            <button class="w-full bg-[#C70039] hover:bg-[#99002C] text-white font-bold py-3 rounded-md transition mt-4" onclick="finalizarCompra()">OK</button>
        </div>
    `;

    // Mostra o modal
    modal.classList.remove('hidden');
    modal.classList.add('flex');

    // --- SIMULAÇÃO DA ATUALIZAÇÃO DE STATUS ---
    const statusItems = modalContent.querySelectorAll('.status-item');
    const statusLines = modalContent.querySelectorAll('.status-line');

    // Simula a passagem para "Preparando"
    setTimeout(() => {
        const item = statusItems[1];
        const iconContainer = item.querySelector('.icon-container');
        
        item.classList.remove('text-gray-400');
        item.classList.add('text-green-500', 'font-bold');
        
        // Esta parte muda o fundo do ícone para verde
        iconContainer.classList.remove('bg-gray-200');
        iconContainer.classList.add('bg-green-500', 'text-white');
        
        statusLines[0].classList.remove('bg-gray-200');
        statusLines[0].classList.add('bg-green-500');
    }, 5000); // 5 segundos

    // Simula a passagem para "Em Entrega"
    setTimeout(() => {
        const item = statusItems[2];
        const iconContainer = item.querySelector('.icon-container');

        item.classList.remove('text-gray-400');
        item.classList.add('text-green-500', 'font-bold');

        // Esta parte muda o fundo do ícone para verde
        iconContainer.classList.remove('bg-gray-200');
        iconContainer.classList.add('bg-green-500', 'text-white');

        statusLines[1].classList.remove('bg-gray-200');
        statusLines[1].classList.add('bg-green-500');
    }, 10000); // 10 segundos
}


function finalizarCompra() {
    fecharModal();
    limparCarrinho();
    toggleCarrinho(); // Esconde o carrinho
}

function limparCarrinho() {
    carrinhoItens = [];
    carrinhoTotal = 0;
    atualizarCarrinho();
    document.getElementById('carrinho-contador').textContent = '0';
    atualizarBotaoFinalizar();
}