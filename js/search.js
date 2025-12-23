/**
 * search.js - 搜索模块
 * 职责：处理搜索输入、显示搜索结果、处理结果选择
 */

const SearchManager = (function() {
    'use strict';

    // DOM元素
    let searchToggle = null;
    let searchContainer = null;
    let searchInput = null;
    let searchResults = null;
    let searchClose = null;

    // 防抖定时器
    let debounceTimer = null;
    const DEBOUNCE_DELAY = 300;

    // 回调函数
    let onSelectCallback = null;

    /**
     * 初始化搜索模块
     * @param {Function} onSelect 选择诗词后的回调
     */
    function init(onSelect) {
        searchToggle = document.getElementById('search-toggle');
        searchContainer = document.getElementById('search-container');
        searchInput = document.getElementById('search-input');
        searchResults = document.getElementById('search-results');
        searchClose = document.getElementById('search-close');
        onSelectCallback = onSelect;

        bindEvents();
    }

    /**
     * 绑定事件
     */
    function bindEvents() {
        // 点击搜索按钮展开搜索框
        searchToggle.addEventListener('click', toggleSearch);

        // 点击关闭按钮
        searchClose.addEventListener('click', closeSearch);

        // 输入事件（防抖）
        searchInput.addEventListener('input', handleInput);

        // 获得焦点时，如果有内容则显示结果
        searchInput.addEventListener('focus', () => {
            if (searchInput.value.trim()) {
                performSearch(searchInput.value);
            }
        });

        // 点击结果项
        searchResults.addEventListener('click', handleResultClick);

        // 点击外部关闭搜索框
        document.addEventListener('click', (e) => {
            if (!searchContainer.classList.contains('hidden') &&
                !searchContainer.contains(e.target) && 
                !searchToggle.contains(e.target)) {
                closeSearch();
            }
        });

        // 键盘导航
        searchInput.addEventListener('keydown', handleKeydown);
    }

    /**
     * 切换搜索框显示/隐藏
     */
    function toggleSearch() {
        const isHidden = searchContainer.classList.contains('hidden');
        if (isHidden) {
            searchContainer.classList.remove('hidden');
            searchInput.focus();
        } else {
            closeSearch();
        }
    }

    /**
     * 关闭搜索框
     */
    function closeSearch() {
        searchContainer.classList.add('hidden');
        searchInput.value = '';
        hideResults();
    }

    /**
     * 处理输入事件
     * @param {Event} e 
     */
    function handleInput(e) {
        const value = e.target.value;

        // 清除之前的定时器
        if (debounceTimer) {
            clearTimeout(debounceTimer);
        }

        // 如果输入为空，隐藏结果
        if (!value.trim()) {
            hideResults();
            return;
        }

        // 防抖搜索
        debounceTimer = setTimeout(() => {
            performSearch(value);
        }, DEBOUNCE_DELAY);
    }

    /**
     * 执行搜索
     * @param {string} keyword 
     */
    function performSearch(keyword) {
        const results = PoemsManager.search(keyword);
        renderResults(results);
    }

    /**
     * 渲染搜索结果
     * @param {Array} results 
     */
    function renderResults(results) {
        if (results.length === 0) {
            searchResults.innerHTML = `
                <div class="search-no-result">
                    未找到相关诗词
                </div>
            `;
        } else {
            searchResults.innerHTML = results.map(poem => `
                <div class="search-result-item" data-index="${poem.index}">
                    <span class="icon">📜</span>
                    <span class="title">${escapeHtml(poem.title)}</span>
                    <span class="author">${escapeHtml(poem.dynasty)}·${escapeHtml(poem.author)}</span>
                </div>
            `).join('');
        }

        showResults();
    }

    /**
     * 处理结果点击
     * @param {Event} e 
     */
    function handleResultClick(e) {
        const item = e.target.closest('.search-result-item');
        if (!item) return;

        const index = parseInt(item.dataset.index, 10);
        selectPoem(index);
    }

    /**
     * 选择诗词
     * @param {number} index 
     */
    function selectPoem(index) {
        if (PoemsManager.setCurrentIndex(index)) {
            closeSearch();  // 关闭整个搜索框
            
            if (onSelectCallback) {
                onSelectCallback(PoemsManager.getCurrent());
            }
        }
    }

    /**
     * 键盘导航处理
     * @param {KeyboardEvent} e 
     */
    function handleKeydown(e) {
        if (searchResults.classList.contains('hidden')) return;

        const items = searchResults.querySelectorAll('.search-result-item');
        if (items.length === 0) return;

        const currentActive = searchResults.querySelector('.search-result-item.active');
        let currentIndex = currentActive ? Array.from(items).indexOf(currentActive) : -1;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                currentIndex = Math.min(currentIndex + 1, items.length - 1);
                setActiveItem(items, currentIndex);
                break;

            case 'ArrowUp':
                e.preventDefault();
                currentIndex = Math.max(currentIndex - 1, 0);
                setActiveItem(items, currentIndex);
                break;

            case 'Enter':
                e.preventDefault();
                if (currentActive) {
                    const index = parseInt(currentActive.dataset.index, 10);
                    selectPoem(index);
                }
                break;

            case 'Escape':
                closeSearch();  // 关闭整个搜索框
                break;
        }
    }

    /**
     * 设置激活项
     * @param {NodeList} items 
     * @param {number} index 
     */
    function setActiveItem(items, index) {
        items.forEach((item, i) => {
            item.classList.toggle('active', i === index);
        });

        // 确保可见
        if (items[index]) {
            items[index].scrollIntoView({ block: 'nearest' });
        }
    }

    /**
     * 显示搜索结果
     */
    function showResults() {
        searchResults.classList.remove('hidden');
    }

    /**
     * 隐藏搜索结果
     */
    function hideResults() {
        searchResults.classList.add('hidden');
    }

    /**
     * HTML转义
     * @param {string} text 
     * @returns {string}
     */
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // 公开API
    return {
        init,
        closeSearch
    };
})();
