// Admin Panel JavaScript
class AdminPanel {
    constructor() {
        this.baseURL = '/api';
        this.token = localStorage.getItem('adminToken');
        this.currentUser = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkAuthentication();
    }

    setupEventListeners() {
        // Sidebar toggle
        document.getElementById('sidebarCollapse').addEventListener('click', () => {
            document.getElementById('sidebar').classList.toggle('active');
            document.getElementById('content').classList.toggle('active');
        });

        // Navigation
        document.querySelectorAll('[data-section]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = e.target.closest('[data-section]').dataset.section;
                this.showSection(section);
            });
        });

        // Forms
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.login();
        });

        document.getElementById('addProductForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveProduct();
        });

        document.getElementById('settingsForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveSettings();
        });
    }

    async checkAuthentication() {
        if (!this.token) {
            this.showLoginModal();
            return;
        }

        try {
            const response = await this.apiRequest('/auth/me', 'GET');
            if (response.success && response.data.role === 'admin') {
                this.currentUser = response.data;
                document.getElementById('adminName').textContent = response.data.name;
                this.loadDashboard();
            } else {
                this.showLoginModal();
            }
        } catch (error) {
            this.showLoginModal();
        }
    }

    showLoginModal() {
        const modal = new bootstrap.Modal(document.getElementById('loginModal'));
        modal.show();
    }

    async login() {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        try {
            const response = await this.apiRequest('/auth/login', 'POST', {
                email,
                password
            });

            if (response.success && response.user.role === 'admin') {
                this.token = response.token;
                localStorage.setItem('adminToken', this.token);
                this.currentUser = response.user;
                document.getElementById('adminName').textContent = response.user.name;
                
                const modal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
                modal.hide();
                
                this.loadDashboard();
                this.showNotification('Đăng nhập thành công!', 'success');
            } else {
                this.showNotification('Chỉ admin mới có thể truy cập!', 'error');
            }
        } catch (error) {
            this.showNotification(error.message || 'Đăng nhập thất bại!', 'error');
        }
    }

    async logout() {
        try {
            await this.apiRequest('/auth/logout', 'POST');
        } catch (error) {
            console.error('Logout error:', error);
        }
        
        localStorage.removeItem('adminToken');
        this.token = null;
        this.currentUser = null;
        this.showLoginModal();
    }

    showSection(sectionName) {
        // Hide all sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });

        // Show selected section
        document.getElementById(`${sectionName}-section`).classList.add('active');

        // Update navigation
        document.querySelectorAll('.sidebar li').forEach(li => {
            li.classList.remove('active');
        });
        document.querySelector(`[data-section="${sectionName}"]`).closest('li').classList.add('active');

        // Load section data
        this.loadSectionData(sectionName);
    }

    async loadSectionData(section) {
        switch (section) {
            case 'dashboard':
                await this.loadDashboard();
                break;
            case 'products':
                await this.loadProducts();
                break;
            case 'orders':
                await this.loadOrders();
                break;
            case 'categories':
                await this.loadCategories();
                break;
            case 'users':
                await this.loadUsers();
                break;
            case 'analytics':
                await this.loadAnalytics();
                break;
        }
    }

    async loadDashboard() {
        try {
            // Load statistics
            const [ordersStats, productsCount, usersCount] = await Promise.all([
                this.apiRequest('/orders/stats', 'GET'),
                this.apiRequest('/products?limit=1', 'GET'),
                this.apiRequest('/users?limit=1', 'GET')
            ]);

            // Update dashboard cards
            if (ordersStats.success) {
                document.getElementById('totalRevenue').textContent = 
                    this.formatCurrency(ordersStats.data.totalRevenue);
                document.getElementById('totalOrders').textContent = 
                    ordersStats.data.totalOrders;
            }

            if (productsCount.success) {
                document.getElementById('totalProducts').textContent = 
                    productsCount.total || 0;
            }

            if (usersCount.success) {
                document.getElementById('totalUsers').textContent = 
                    usersCount.total || 0;
            }

            // Load recent orders
            await this.loadRecentOrders();

        } catch (error) {
            console.error('Dashboard loading error:', error);
        }
    }

    async loadRecentOrders() {
        try {
            const response = await this.apiRequest('/orders?limit=5&sort=-createdAt', 'GET');
            if (response.success) {
                this.renderRecentOrders(response.data);
            }
        } catch (error) {
            console.error('Recent orders loading error:', error);
        }
    }

    renderRecentOrders(orders) {
        const tbody = document.querySelector('#recentOrdersTable tbody');
        tbody.innerHTML = '';

        orders.forEach(order => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${order.orderNumber}</td>
                <td>${order.user?.name || 'N/A'}</td>
                <td>${this.formatCurrency(order.total)}</td>
                <td><span class="badge badge-${this.getStatusColor(order.status)}">${this.getStatusText(order.status)}</span></td>
                <td>${this.formatDate(order.createdAt)}</td>
            `;
            tbody.appendChild(row);
        });
    }

    async loadProducts() {
        try {
            const response = await this.apiRequest('/products?limit=50', 'GET');
            if (response.success) {
                this.renderProducts(response.data);
            }
        } catch (error) {
            console.error('Products loading error:', error);
        }
    }

    renderProducts(products) {
        const tbody = document.querySelector('#productsTable tbody');
        tbody.innerHTML = '';

        products.forEach(product => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <img src="${product.images[0]?.url || '/images/default-product.png'}" 
                         alt="${product.name}" class="product-image">
                </td>
                <td>${product.name}</td>
                <td>${product.sku}</td>
                <td>${this.formatCurrency(product.price)}</td>
                <td>${product.stock}</td>
                <td>
                    <span class="badge badge-${product.isActive ? 'success' : 'danger'}">
                        ${product.isActive ? 'Hoạt động' : 'Không hoạt động'}
                    </span>
                </td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="admin.editProduct('${product._id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="admin.deleteProduct('${product._id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    async loadOrders() {
        try {
            const response = await this.apiRequest('/orders?limit=50', 'GET');
            if (response.success) {
                this.renderOrders(response.data);
            }
        } catch (error) {
            console.error('Orders loading error:', error);
        }
    }

    renderOrders(orders) {
        const tbody = document.querySelector('#ordersTable tbody');
        tbody.innerHTML = '';

        orders.forEach(order => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${order.orderNumber}</td>
                <td>${order.user?.name || 'N/A'}</td>
                <td>${this.formatCurrency(order.total)}</td>
                <td>
                    <select class="form-select form-select-sm" onchange="admin.updateOrderStatus('${order._id}', this.value)">
                        <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Chờ xử lý</option>
                        <option value="confirmed" ${order.status === 'confirmed' ? 'selected' : ''}>Đã xác nhận</option>
                        <option value="processing" ${order.status === 'processing' ? 'selected' : ''}>Đang xử lý</option>
                        <option value="shipped" ${order.status === 'shipped' ? 'selected' : ''}>Đã gửi</option>
                        <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Đã giao</option>
                        <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Đã hủy</option>
                    </select>
                </td>
                <td>${this.formatDate(order.createdAt)}</td>
                <td>
                    <button class="btn btn-sm btn-info" onclick="admin.viewOrder('${order._id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    async loadCategories() {
        try {
            const response = await this.apiRequest('/categories', 'GET');
            if (response.success) {
                this.renderCategories(response.data);
            }
        } catch (error) {
            console.error('Categories loading error:', error);
        }
    }

    renderCategories(categories) {
        const tbody = document.querySelector('#categoriesTable tbody');
        tbody.innerHTML = '';

        categories.forEach(category => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${category.name}</td>
                <td>${category.slug}</td>
                <td>${category.productCount || 0}</td>
                <td>
                    <span class="badge badge-${category.isActive ? 'success' : 'danger'}">
                        ${category.isActive ? 'Hoạt động' : 'Không hoạt động'}
                    </span>
                </td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="admin.editCategory('${category._id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="admin.deleteCategory('${category._id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    async loadUsers() {
        try {
            const response = await this.apiRequest('/users', 'GET');
            if (response.success) {
                this.renderUsers(response.data);
            }
        } catch (error) {
            console.error('Users loading error:', error);
        }
    }

    renderUsers(users) {
        const tbody = document.querySelector('#usersTable tbody');
        tbody.innerHTML = '';

        users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.phone || 'N/A'}</td>
                <td>
                    <span class="badge badge-${user.role === 'admin' ? 'warning' : 'info'}">
                        ${user.role === 'admin' ? 'Admin' : 'Khách hàng'}
                    </span>
                </td>
                <td>
                    <span class="badge badge-${user.isActive ? 'success' : 'danger'}">
                        ${user.isActive ? 'Hoạt động' : 'Bị khóa'}
                    </span>
                </td>
                <td>${this.formatDate(user.createdAt)}</td>
                <td>
                    <button class="btn btn-sm btn-warning" onclick="admin.toggleUserStatus('${user._id}')">
                        <i class="fas fa-${user.isActive ? 'lock' : 'unlock'}"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    async loadAnalytics() {
        try {
            // Load revenue chart
            const response = await this.apiRequest('/orders/analytics/revenue', 'GET');
            if (response.success) {
                this.renderRevenueChart(response.data);
            }
        } catch (error) {
            console.error('Analytics loading error:', error);
        }
    }

    renderRevenueChart(data) {
        const ctx = document.getElementById('revenueChart').getContext('2d');
        
        if (this.revenueChart) {
            this.revenueChart.destroy();
        }

        this.revenueChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Doanh Thu (VNĐ)',
                    data: data.revenue || [0, 0, 0, 0, 0, 0],
                    borderColor: 'rgb(75, 192, 192)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return admin.formatCurrency(value);
                            }
                        }
                    }
                }
            }
        });
    }

    // Product Management
    showAddProductModal() {
        this.loadCategoriesForSelect();
        const modal = new bootstrap.Modal(document.getElementById('addProductModal'));
        modal.show();
    }

    async loadCategoriesForSelect() {
        try {
            const response = await this.apiRequest('/categories', 'GET');
            if (response.success) {
                const select = document.getElementById('productCategory');
                select.innerHTML = '<option value="">Chọn danh mục</option>';
                
                response.data.forEach(category => {
                    const option = document.createElement('option');
                    option.value = category._id;
                    option.textContent = category.name;
                    select.appendChild(option);
                });
            }
        } catch (error) {
            console.error('Categories loading error:', error);
        }
    }

    async saveProduct() {
        const productData = {
            name: document.getElementById('productName').value,
            sku: document.getElementById('productSku').value,
            description: document.getElementById('productDescription').value,
            price: parseFloat(document.getElementById('productPrice').value),
            originalPrice: parseFloat(document.getElementById('productOriginalPrice').value) || undefined,
            stock: parseInt(document.getElementById('productStock').value),
            category: document.getElementById('productCategory').value,
            brand: document.getElementById('productBrand').value || undefined,
            images: [{ url: '/images/default-product.png', alt: 'Default product image' }]
        };

        try {
            const response = await this.apiRequest('/products', 'POST', productData);
            if (response.success) {
                this.showNotification('Sản phẩm đã được thêm thành công!', 'success');
                const modal = bootstrap.Modal.getInstance(document.getElementById('addProductModal'));
                modal.hide();
                document.getElementById('addProductForm').reset();
                this.loadProducts();
            }
        } catch (error) {
            this.showNotification(error.message || 'Có lỗi xảy ra khi thêm sản phẩm!', 'error');
        }
    }

    async deleteProduct(productId) {
        if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
            try {
                const response = await this.apiRequest(`/products/${productId}`, 'DELETE');
                if (response.success) {
                    this.showNotification('Sản phẩm đã được xóa!', 'success');
                    this.loadProducts();
                }
            } catch (error) {
                this.showNotification(error.message || 'Có lỗi xảy ra khi xóa sản phẩm!', 'error');
            }
        }
    }

    async updateOrderStatus(orderId, status) {
        try {
            const response = await this.apiRequest(`/orders/${orderId}/status`, 'PUT', { status });
            if (response.success) {
                this.showNotification('Trạng thái đơn hàng đã được cập nhật!', 'success');
            }
        } catch (error) {
            this.showNotification(error.message || 'Có lỗi xảy ra khi cập nhật trạng thái!', 'error');
        }
    }

    async saveSettings() {
        const settings = {
            storeName: document.getElementById('storeName').value,
            contactEmail: document.getElementById('contactEmail').value
        };

        // In a real app, you would save these to a settings API
        this.showNotification('Cài đặt đã được lưu!', 'success');
    }

    // Utility Methods
    async apiRequest(endpoint, method = 'GET', data = null) {
        const config = {
            method,
            headers: {
                'Content-Type': 'application/json',
            }
        };

        if (this.token) {
            config.headers.Authorization = `Bearer ${this.token}`;
        }

        if (data) {
            config.body = JSON.stringify(data);
        }

        const response = await fetch(`${this.baseURL}${endpoint}`, config);
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'API request failed');
        }

        return result;
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    }

    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    getStatusColor(status) {
        const colors = {
            pending: 'warning',
            confirmed: 'info',
            processing: 'primary',
            shipped: 'secondary',
            delivered: 'success',
            cancelled: 'danger',
            returned: 'dark'
        };
        return colors[status] || 'secondary';
    }

    getStatusText(status) {
        const texts = {
            pending: 'Chờ xử lý',
            confirmed: 'Đã xác nhận',
            processing: 'Đang xử lý',
            shipped: 'Đã gửi',
            delivered: 'Đã giao',
            cancelled: 'Đã hủy',
            returned: 'Đã trả'
        };
        return texts[status] || status;
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `alert alert-${type === 'error' ? 'danger' : type} alert-dismissible fade show`;
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.right = '20px';
        notification.style.zIndex = '9999';
        notification.style.minWidth = '300px';
        
        notification.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;

        document.body.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }
}

// Initialize admin panel
const admin = new AdminPanel();

// Global functions for onclick handlers
window.showAddProductModal = () => admin.showAddProductModal();
window.saveProduct = () => admin.saveProduct();
window.login = () => admin.login();
window.logout = () => admin.logout();