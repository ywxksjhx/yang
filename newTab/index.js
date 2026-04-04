// 设置 favicon
function getFavicon(url) {
    const match = url.match(/^(https?:\/\/[^\/]+)/);
    if (match) {
        return match[1] + '/favicon.ico';
    }
    return "img/link.png";
}

// 更新时间显示
function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    const dateString = now.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
    });
    document.getElementById('timeDisplay').innerHTML = `
            <div class="time">${timeString}</div>
            <div class="date">${dateString}</div>
        `;
}

// 渲染链接卡片
function renderLinks(key) {
    const $body = document.getElementById('body');
    $body.innerHTML = '';
    document.getElementById('searchResults').style.display = 'none';

    const iData = data[key];
    if (!iData) return;

    iData.forEach(item => {
        const ico = getFavicon(item.url);

        const col = document.createElement('div');
        col.className = 'col-6 col-md-4 col-lg-3 col-xl-2 mb-4';

        const card = document.createElement('a');
        card.className = 'link-card';
        card.href = item.url;
        // card.target = '_blank';
        card.rel = 'noopener noreferrer';

        const imgContainer = document.createElement('div');
        imgContainer.className = 'link-img-container';

        const img = document.createElement('img');
        img.className = 'link-img';
        img.src = ico;

        // 设置3秒超时
        const timeout = setTimeout(() => {
            if (!img.complete) {
                img.src = "img/link.png";
            }
        }, 3000);

        img.onload = function () {
            clearTimeout(timeout);
        };
        
        img.onerror = function () {
            clearTimeout(timeout);
            this.src = "img/link.png";
        };

        const text = document.createElement('p');
        text.className = 'link-text';
        text.textContent = item.text;

        imgContainer.appendChild(img);
        card.appendChild(imgContainer);
        card.appendChild(text);
        col.appendChild(card);
        $body.appendChild(col);
    });
}

// 搜索功能
function searchLinks(keyword) {
    const $results = document.getElementById('searchResults');
    const $body = document.getElementById('body');

    if (!keyword.trim()) {
        $results.style.display = 'none';
        $body.style.display = 'flex';
        return;
    }

    $body.style.display = 'none';
    $results.style.display = 'flex';
    $results.innerHTML = '';

    let results = [];
    for (let key in data) {
        data[key].forEach(item => {
            if (item.text.toLowerCase().includes(keyword.toLowerCase())) {
                results.push({
                    ...item,
                    category: key
                });
            }
        });
    }

    if (results.length === 0) {
        $results.innerHTML = '<div class="no-results">没有找到匹配的网站</div>';
        return;
    }

    results.forEach(item => {
        const ico = getFavicon(item.url);

        const col = document.createElement('div');
        col.className = 'col-6 col-md-4 col-lg-3 col-xl-2 mb-4';

        const card = document.createElement('a');
        card.className = 'link-card';
        card.href = item.url;
        // card.target = '_blank';
        card.rel = 'noopener noreferrer';

        const imgContainer = document.createElement('div');
        imgContainer.className = 'link-img-container';

        const img = document.createElement('img');
        img.className = 'link-img';
        img.src = ico;

        // 设置3秒超时
        const timeout = setTimeout(() => {
            if (!img.complete) {
                img.src = "img/link.png";
            }
        }, 3000);

        img.onload = function () {
            clearTimeout(timeout);
        };
        
        img.onerror = function () {
            clearTimeout(timeout);
            this.src = "img/link.png";
        };

        const text = document.createElement('p');
        text.className = 'link-text';
        text.textContent = item.text;

        const category = document.createElement('span');
        category.className = 'link-category';
        category.textContent = item.category;

        imgContainer.appendChild(img);
        card.appendChild(imgContainer);
        card.appendChild(text);
        card.appendChild(category);
        col.appendChild(card);
        $results.appendChild(col);
    });
}

// 初始化标题按钮
function initTitles() {
    let firstKey = null;

    for (let key in data) {
        if (!firstKey) firstKey = key;

        const navItem = document.createElement('a');
        navItem.className = 'nav-item';
        navItem.href = 'javascript:void(0)';
        navItem.onclick = () => {
            // 移除所有激活状态
            document.querySelectorAll('.nav-item').forEach(item => {
                item.classList.remove('active');
            });
            // 添加激活状态
            navItem.classList.add('active');
            renderLinks(key);
            // 清空搜索框
            document.getElementById('searchInput').value = '';
        };
        navItem.textContent = key;

        document.getElementById('title').appendChild(navItem);
    }

    // 默认选中第一个
    if (firstKey) {
        const firstNav = document.querySelector('.nav-item');
        if (firstNav) firstNav.classList.add('active');
        renderLinks(firstKey);
    }
}

// DOM 加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    initTitles();
    updateTime();
    setInterval(updateTime, 1000);

    // 搜索功能事件绑定
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');

    searchInput.addEventListener('input', (e) => {
        searchLinks(e.target.value);
    });

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const keyword = searchInput.value.trim();
            if (keyword) {
                window.open(`https://www.baidu.com/s?wd=${encodeURIComponent(keyword)}`);
            }
        }
    });

    searchBtn.addEventListener('click', () => {
        const keyword = searchInput.value.trim();
        if (keyword) {
            window.open(`https://www.baidu.com/s?wd=${encodeURIComponent(keyword)}`);
        }
    });
});