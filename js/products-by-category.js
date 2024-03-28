// product-functions.js

import { BinaryTree } from '/js/BinaryTree.js';

// Criar a instância da árvore binária fora do escopo do evento DOMContentLoaded
let catalogTree = new BinaryTree();
catalogTree.restoreFromLocalStorage();

document.addEventListener('DOMContentLoaded', function () {
    const listProductsBtn = document.getElementById('listProductsBtn');

    if (listProductsBtn) {
        listProductsBtn.addEventListener('click', function () {
            const category = prompt('Enter category:'); // Você pode usar um prompt ou um campo de formulário para obter a categoria
            listProductsByCategory(category);
        });
    }
});

function listProductsByCategory(category) {
    const productList = document.getElementById('productList');

    // Limpar a lista de produtos
    productList.innerHTML = '';

    // Obter a lista de produtos da árvore binária para a categoria específica
    const products = catalogTree.listProductsByCategory(category);

    // Ordenar os produtos por nome (alfabeticamente)
    products.sort((a, b) => a.name.localeCompare(b.name));

    // Exibir os produtos na página
    products.forEach(product => {
        const listItem = document.createElement('div');
        listItem.textContent = `ID: ${product.id} - ${product.name} - ${product.category} - $${product.price.toFixed(2)} - ${product.description}`;

        // Adicionar botões "Update" e "Remove"
        const updateButton = document.createElement('button');
        updateButton.textContent = 'Update';
        updateButton.setAttribute('data-product-id', product.id); // Definir o ID do produto aqui

        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.setAttribute('data-product-id', product.id); // Definir o ID do produto aqui

        listItem.appendChild(updateButton);
        listItem.appendChild(removeButton);
        productList.appendChild(listItem);
    });

    // Reatribuir ouvintes de evento aos botões "Update" e "Remove"
    assignEventListeners();
}