document.addEventListener('DOMContentLoaded', function() {
    // --- Lógica de Verificação de Usuário e Atualização de Nome ---
    const currentUser = JSON.parse(sessionStorage.getItem('jdm_currentUser'));
    
    // Seleciona o elemento na barra superior usando o ID
    const userNameHeader = document.getElementById('userName');
    
    // Seleciona o elemento na seção de boas-vindas usando a CLASSE (conforme a correção do HTML)
    const userNameWelcome = document.querySelector('.welcome-user-name');

    if (currentUser) {
        // Exibe o primeiro nome do usuário na barra superior
        if (userNameHeader) {
            userNameHeader.textContent = currentUser.name.split(' ')[0];
        }
        
        // Exibe o primeiro nome do usuário na seção de boas-vindas
        if (userNameWelcome) {
            userNameWelcome.textContent = currentUser.name.split(' ')[0];
        }
    } else {
        // Se não houver usuário logado, exibe "Visitante"
        if (userNameHeader) {
            userNameHeader.textContent = 'Visitante';
        }
        if (userNameWelcome) {
            userNameWelcome.textContent = 'Usuário'; // Mantém o texto padrão ou pode ser 'Visitante'
        }
        // Redirecionamento de segurança, embora auth.js já lide com isso
        if (window.location.pathname.includes('app.html')) {
            window.location.href = 'index.html';
        }
    }

    // --- Lógica do Menu Interativo ---
    const menuToggle = document.getElementById('menuToggle');
    const closeSidebar = document.getElementById('closeSidebar');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    document.body.appendChild(overlay);

    function openMenu() {
        sidebar.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (menuToggle) {
        menuToggle.addEventListener('click', openMenu);
    }
    if (closeSidebar) {
        closeSidebar.addEventListener('click', closeMenu);
    }
    overlay.addEventListener('click', closeMenu);

    const sidebarMenuItems = document.querySelectorAll('.sidebar-menu li a');
    sidebarMenuItems.forEach(item => {
        item.addEventListener('click', function() {
            closeMenu();
        });
    });

    window.addEventListener('resize', function() {
        if (window.innerWidth >= 992) {
            closeMenu();
        }
    });

    // --- Lógica de Logout ---
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            sessionStorage.removeItem('jdm_currentUser');
            window.location.href = 'index.html';
        });
    }

    // --- Lógica para destacar o item de menu ativo (active) ---
    function highlightActiveMenuItem() {
        const path = window.location.pathname;
        const filename = path.split('/').pop();
        const menuLinks = document.querySelectorAll('.sidebar-menu a');

        menuLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === filename) {
                link.classList.add('active');
            } else if (filename === '' && link.getAttribute('href') === 'app.html') {
                link.classList.add('active');
            }
        });
    }
    highlightActiveMenuItem();
    
    // --- Inicialização dos Gráficos ---
    initCharts();
});

// --- Funções de Gráficos (mantidas como estavam) ---
function initCharts() {
    const materialsData = [
        { name: 'Cimento', value: 120, color: '#FFA500' },
        { name: 'Tijolos', value: 850, color: '#FF8C00' },
        { name: 'Areia', value: 45, color: '#FF7F50' },
        { name: 'Pedra', value: 30, color: '#FF6347' },
        { name: 'Aço', value: 65, color: '#FF4500' }
    ];
    renderColumnChart('materialsChart', materialsData);
    renderPieChart('progressChart', 65, 20, 15);
}

function renderColumnChart(containerId, data) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';
    const maxValue = Math.max(...data.map(item => item.value));
    const barsContainer = document.createElement('div');
    barsContainer.className = 'bars-container';
    data.forEach(item => {
        const barHeightPercentage = (item.value / maxValue) * 100;
        const barElement = document.createElement('div');
        barElement.className = 'bar-element';
        const bar = document.createElement('div');
        bar.className = 'bar';
        bar.style.backgroundColor = item.color;
        bar.style.setProperty('--final-height', `${barHeightPercentage}%`);
        const barValue = document.createElement('div');
        barValue.className = 'bar-value';
        barValue.textContent = item.value;
        const barLabel = document.createElement('div');
        barLabel.className = 'bar-label';
        barLabel.textContent = item.name;
        bar.appendChild(barValue);
        barElement.appendChild(bar);
        barElement.appendChild(barLabel);
        barsContainer.appendChild(barElement);
    });
    container.appendChild(barsContainer);
}

function renderPieChart(containerId, completed, inProgress, pending) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';
    const total = completed + inProgress + pending;
    const chartSize = 200;
    const pieChart = document.createElement('div');
    pieChart.className = 'pie-chart';
    pieChart.style.width = `${chartSize}px`;
    pieChart.style.height = `${chartSize}px`;
    const pieSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    pieSvg.setAttribute('viewBox', `0 0 ${chartSize} ${chartSize}`);
    const completedAngle = (completed / total) * 360;
    const inProgressAngle = (inProgress / total) * 360;
    const bgCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    bgCircle.setAttribute('cx', chartSize / 2);
    bgCircle.setAttribute('cy', chartSize / 2);
    bgCircle.setAttribute('r', chartSize / 2 - 10);
    bgCircle.setAttribute('fill', '#f5f5f5');
    pieSvg.appendChild(bgCircle);
    const completedPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    completedPath.setAttribute('d', describeArc(chartSize / 2, chartSize / 2, chartSize / 2 - 10, 0, completedAngle));
    completedPath.setAttribute('fill', '#FFA500');
    pieSvg.appendChild(completedPath);
    const inProgressPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    inProgressPath.setAttribute('d', describeArc(chartSize / 2, chartSize / 2, chartSize / 2 - 10, completedAngle, completedAngle + inProgressAngle));
    inProgressPath.setAttribute('fill', '#FF8C00');
    pieSvg.appendChild(inProgressPath);
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', chartSize / 2);
    text.setAttribute('y', chartSize / 2);
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('dominant-baseline', 'middle');
    text.setAttribute('font-size', '24');
    text.setAttribute('font-weight', 'bold');
    text.setAttribute('fill', '#333');
    text.textContent = `${completed}%`;
    pieSvg.appendChild(text);
    pieChart.appendChild(pieSvg);
    const legend = document.createElement('div');
    legend.className = 'chart-legend';
    const legendItems = [
        { color: '#FFA500', label: `Concluído (${completed}%)` },
        { color: '#FF8C00', label: `Em Andamento (${inProgress}%)` },
        { color: '#FF6347', label: `Pendente (${pending}%)` }
    ];
    legendItems.forEach(item => {
        const legendItem = document.createElement('div');
        legendItem.className = 'legend-item';
        const color = document.createElement('div');
        color.className = 'legend-color';
        color.style.backgroundColor = item.color;
        const label = document.createElement('span');
        label.textContent = item.label;
        legendItem.appendChild(color);
        legendItem.appendChild(label);
        legend.appendChild(legendItem);
    });
    container.appendChild(pieChart);
    container.appendChild(legend);
}

function describeArc(x, y, radius, startAngle, endAngle) {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    return [
        "M", x, y,
        "L", start.x, start.y,
        "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
        "Z"
    ].join(" ");
}

function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
        x: centerX + (radius * Math.cos(angleInRadians)),
        y: centerY + (radius * Math.sin(angleInRadians))
    };
}