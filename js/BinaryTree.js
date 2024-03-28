class TreeNode {
    constructor(product) {
        this.product = product;
        this.left = null;
        this.right = null;
    }

    toJSON() {
        return {
            product: this.product,
            left: this.left ? this.left.toJSON() : null,
            right: this.right ? this.right.toJSON() : null
        };
    }
}

export class BinaryTree {
    constructor() {
        this.root = null;
    }

    addProduct(product) {
        const newNode = new TreeNode(product);

        if (!this.root) {
            this.root = newNode;
        } else {
            this._insertNode(this.root, newNode);
        }

        this.updateLocalStorage();
    }

    _insertNode(node, newNode) {
        if (!node.product) {
            // Se o nó atual não tiver um produto, atribua o novo nó diretamente
            node.product = newNode.product;
        } else if (newNode.product.id < node.product.id) {
            if (!node.left) {
                node.left = new TreeNode(newNode.product);
            } else {
                this._insertNode(node.left, newNode);
            }
        } else {
            if (!node.right) {
                node.right = new TreeNode(newNode.product);
            } else {
                this._insertNode(node.right, newNode);
            }
        }
    }

    getAllProducts() {
        const products = [];
        this._inOrderTraversal(this.root, (node) => {
            products.push(node.product);
        });
        return products;
    }

    _inOrderTraversal(node, callback) {
        if (node) {
            this._inOrderTraversal(node.left, callback);
            callback(node);
            this._inOrderTraversal(node.right, callback);
        }
    }

    updateLocalStorage() {
        localStorage.setItem('catalogTree', JSON.stringify(this.root ? this.root.toJSON() : null));
    }

    restoreFromLocalStorage() {
        const storedData = localStorage.getItem('catalogTree');
        if (storedData) {
            this.root = this._restoreFromJSON(JSON.parse(storedData));
        }
    }

    _restoreFromJSON(jsonNode) {
        if (!jsonNode) {
            return null;
        }

        const node = new TreeNode(jsonNode.product);
        node.left = this._restoreFromJSON(jsonNode.left);
        node.right = this._restoreFromJSON(jsonNode.right);

        return node;
    }

    findProductById(id) {
        return this._findProductById(this.root, id);
    }

    _findProductById(node, id) {
        if (!node) {
            return null;
        }

        if (node.product.id === id) {
            return node.product;
        } else if (id < node.product.id) {
            return this._findProductById(node.left, id);
        } else {
            return this._findProductById(node.right, id);
        }
    }

    removeProduct(productId) {
        this.root = this._removeProduct(this.root, productId);
        this.updateLocalStorage();
    }

    _removeProduct(node, productId) {
        if (!node) {
            return null;
        }

        if (productId < node.product.id) {
            node.left = this._removeProduct(node.left, productId);
        } else if (productId > node.product.id) {
            node.right = this._removeProduct(node.right, productId);
        } else {
            if (!node.left) {
                return node.right;
            } else if (!node.right) {
                return node.left;
            }

            const minValueNode = this._findMin(node.right);
            node.product = minValueNode.product;
            node.right = this._removeProduct(node.right, minValueNode.product.id);
        }

        return node;
    }

    _findMin(node) {
        while (node.left) {
            node = node.left;
        }
        return node;
    }

    listProductsByCategory(category) {
        const products = this.getAllProducts();
        const filteredProducts = products.filter(product => product.category === category);
        return filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
    }
}