/**
 * render.js - 渲染模块
 * 职责：负责将诗词数据渲染到页面DOM
 */

const Renderer = (function() {
    'use strict';

    // DOM元素缓存
    let elements = null;

    /**
     * 初始化，缓存DOM元素
     */
    function init() {
        elements = {
            poemLines: document.getElementById('poem-lines'),
            poemTitle: document.getElementById('poem-title'),
            poemAuthor: document.getElementById('poem-author'),
            poemSeal: document.getElementById('poem-seal'),
            poemImage: document.getElementById('poem-image'),
            currentIndex: document.getElementById('current-index'),
            totalCount: document.getElementById('total-count'),
            btnPrev: document.getElementById('btn-prev'),
            btnNext: document.getElementById('btn-next')
        };

        // 设置总数
        elements.totalCount.textContent = PoemsManager.getCount();
    }

    /**
     * 渲染诗词内容
     * @param {Object} poem 诗词对象
     * @param {boolean} animate 是否使用动画
     */
    function renderPoem(poem, animate = true) {
        if (!poem || !elements) return;

        if (animate) {
            // 淡出动画
            elements.poemLines.parentElement.classList.add('transitioning');
            elements.poemImage.classList.add('transitioning');

            setTimeout(() => {
                updateContent(poem);
                
                // 淡入动画
                setTimeout(() => {
                    elements.poemLines.parentElement.classList.remove('transitioning');
                    elements.poemImage.classList.remove('transitioning');
                }, 50);
            }, 200);
        } else {
            updateContent(poem);
        }
    }

    /**
     * 更新内容（无动画）
     * @param {Object} poem 
     */
    function updateContent(poem) {
        // 渲染诗句（竖排，从左到右）
        elements.poemLines.innerHTML = poem.lines
            .map(line => `<div class="poem-line">${escapeHtml(line)}</div>`)
            .join('');

        // 渲染标题（横排，简洁格式）
        elements.poemTitle.textContent = poem.title;

        // 渲染作者（朝代和作者，中间点在HTML中已有）
        elements.poemAuthor.textContent = `${poem.dynasty} ${poem.author}`;

        // 渲染印章
        elements.poemSeal.textContent = poem.seal || poem.author.charAt(0);

        // 渲染图片
        elements.poemImage.src = poem.image;
        elements.poemImage.alt = `${poem.title} 配图`;

        // 更新页码
        elements.currentIndex.textContent = PoemsManager.getCurrentIndex() + 1;

        // 更新按钮状态
        updateNavigationButtons();
    }

    /**
     * 更新导航按钮状态
     */
    function updateNavigationButtons() {
        elements.btnPrev.disabled = !PoemsManager.hasPrev();
        elements.btnNext.disabled = !PoemsManager.hasNext();
    }

    /**
     * HTML转义，防止XSS
     * @param {string} text 
     * @returns {string}
     */
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * 渲染当前诗词
     * @param {boolean} animate 
     */
    function renderCurrent(animate = true) {
        const poem = PoemsManager.getCurrent();
        if (poem) {
            renderPoem(poem, animate);
        }
    }

    // 公开API
    return {
        init,
        renderPoem,
        renderCurrent,
        updateNavigationButtons
    };
})();
