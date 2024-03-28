// product-functions.js

import { BinaryTree } from '/js/BinaryTree.js';

// Criar a instância da árvore binária fora do escopo do evento DOMContentLoaded
let catalogTree = new BinaryTree();
catalogTree.restoreFromLocalStorage();

document.addEventListener('DOMContentLoaded', function () {
    // Adicionar a função addProduct ao escopo global
    window.addProduct = function (event) {
        // Prevenir o comportamento padrão do formulário, que pode recarregar a página
        event.preventDefault();

        // Lógica para adicionar produtos
        console.log('Entering addProduct function');
        const productIdInput = document.getElementById('productId');
        const productNameInput = document.getElementById('productName');
        const productDescriptionInput = document.getElementById('productDescription');
        const productPriceInput = document.getElementById('productPrice');
        const productCategoryInput = document.getElementById('productCategory');

        // Obter valores dos campos
        const productId = productIdInput.value;
        const productName = productNameInput.value;
        const productDescription = productDescriptionInput.value;
        const productPrice = parseFloat(productPriceInput.value);
        const productCategory = productCategoryInput.value;

        console.log('Product details:', {
            productId,
            productName,
            productDescription,
            productPrice,
            productCategory
        });

        // Validar se os campos obrigatórios estão preenchidos
        if (!productId || !productName || !productDescription || isNaN(productPrice) || !productCategory) {
            alert('Please fill in all required fields.');
            console.log('Validation failed');
            return;
        }

        // Criar um objeto representando o produto
        const product = {
            id: productId,
            name: productName,
            description: productDescription,
            price: productPrice,
            category: productCategory
        };

        console.log('Product object:', product);

        // Adicionar o produto à árvore binária
        catalogTree.addProduct(product);

        // Limpar o formulário após adicionar o produto
        productIdInput.value = '';
        productNameInput.value = '';
        productDescriptionInput.value = '';
        productPriceInput.value = '';
        productCategoryInput.value = '';

        // Exibir uma mensagem de sucesso
        alert('Product added successfully!');

        // Atualizar a lista de produtos na tela (se necessário)
        window.searchProduct();

        // Log para verificar se o produto foi adicionado corretamente
        console.log('Product added:', product);

        console.log('Exiting addProduct function');
    };

    window.logout = function () {
        window.location.href = '/html/apresentacao.html';
    };

    window.goToDashboard = function () {
        window.location.href = '/html/dashboard.html';
    }

    window.searchProduct = function () {
        const searchInput = document.getElementById('searchInput').value.toLowerCase();
        const productList = document.getElementById('productList');
    
        // Limpar a lista de produtos
        productList.innerHTML = '';
    
        // Obter a lista de produtos da árvore binária
        const products = catalogTree.getAllProducts();
    
        // Filtrar os produtos com base na pesquisa
        const filteredProducts = products.filter(product => {
            return (
                product.name.toLowerCase().includes(searchInput) ||
                product.category.toLowerCase().includes(searchInput) ||
                product.id.toLowerCase().includes(searchInput) ||
                product.price.toString().includes(searchInput) ||
                product.description.toLowerCase().includes(searchInput)
            );
        });
    
        filteredProducts.forEach(product => {
            const listItem = document.createElement('li');
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
    };
    
    function assignEventListeners() {
        const buttons = document.querySelectorAll('button[data-product-id]');
    
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                const productId = button.getAttribute('data-product-id');
                const product = catalogTree.findProductById(productId);
    
                // Verificar se o botão é "Update" ou "Remove"
                if (button.textContent === 'Update') {
                    showUpdateForm(product);
                } else if (button.textContent === 'Remove') {
                    removeProduct(productId);
                }
            });
        });
    }
    
    function removeProduct(productId) {
        // Remover o produto da árvore binária usando apenas o ID
        catalogTree.removeProduct(productId);
    
        // Atualizar a lista de produtos na tela
        window.searchProduct();
    }

    function showUpdateForm(product) {
        // Preencher o formulário com os detalhes do produto
        document.getElementById('updateProductId').value = product.id;
        document.getElementById('updateProductName').value = product.name;
        document.getElementById('updateProductDescription').value = product.description;
        document.getElementById('updateProductPrice').value = product.price;
        document.getElementById('updateProductCategory').value = product.category;
    
        // Exibir o formulário de atualização
        document.getElementById('updateForm').style.display = 'block';
    }
    
    // Adicione um botão "Cancel" no formulário de atualização para fechá-lo
    const cancelUpdateBtn = document.getElementById('cancelUpdateBtn');
    if (cancelUpdateBtn) {
        cancelUpdateBtn.addEventListener('click', () => {
            document.getElementById('updateForm').style.display = 'none';
        });
    }

    window.updateProduct = function () {
        const productId = document.getElementById('updateProductId').value;
        const productName = document.getElementById('updateProductName').value;
        const productDescription = document.getElementById('updateProductDescription').value;
        const productPriceInput = document.getElementById('updateProductPrice');
        const productPrice = parseFloat(productPriceInput.value);
        const productCategory = document.getElementById('updateProductCategory').value;
    
        // Verificar se o preço é um número válido
        if (isNaN(productPrice)) {
            alert('Please enter a valid price.');
            return;
        }
    
        // Encontrar o produto na árvore binária e atualizá-lo
        const productToUpdate = catalogTree.findProductById(productId);
        if (productToUpdate) {
            productToUpdate.name = productName;
            productToUpdate.description = productDescription;
            productToUpdate.price = productPrice;
            productToUpdate.category = productCategory;
    
            // Atualizar a lista de produtos na tela
            window.searchProduct();
    
            // Ocultar o formulário de atualização
            document.getElementById('updateForm').style.display = 'none';
        } else {
            alert('Product not found.');
        }
    };

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
    
            // Adicionar botões "Update" e "Remove" somente quando não estiver listando os produtos
            if (!category) {
                const updateButton = document.createElement('button');
                updateButton.textContent = 'Update';
                updateButton.setAttribute('data-product-id', product.id); // Definir o ID do produto aqui
                listItem.appendChild(updateButton);
    
                const removeButton = document.createElement('button');
                removeButton.textContent = 'Remove';
                removeButton.setAttribute('data-product-id', product.id); // Definir o ID do produto aqui
                listItem.appendChild(removeButton);
            }
    
            productList.appendChild(listItem);
        });
    
        // Reatribuir ouvintes de evento aos botões "Update" e "Remove"
        if (!category) {
            assignEventListeners();
        }
    }
    
    // Adicionando os ouvintes de evento
    const addProductBtn = document.getElementById('addProductBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const goToDashboardBtn = document.getElementById('goToDashboardBtn');
    const searchBtn = document.getElementById('searchBtn');
    const listProductsBtn = document.getElementById('listProductsBtn');

    if (addProductBtn) {
        addProductBtn.addEventListener('click', function (event) {
        window.addProduct(event);
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', window.logout);
    }

    if (goToDashboardBtn) {
        goToDashboardBtn.addEventListener('click', window.goToDashboard);
    }

    if (searchBtn) {
        searchBtn.addEventListener('click', window.searchProduct);
    }
    if (listProductsBtn) {
        listProductsBtn.addEventListener('click', function () {
            // Obter o valor da caixa de texto
            const category = document.getElementById('categoryInput').value;
            
            // Chamar a função para listar os produtos da categoria especificada
            listProductsByCategory(category);
        });
    }
});