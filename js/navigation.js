/**
 * navigation.js - 导航模块
 * 职责：处理上一首/下一首切换、键盘快捷键
 */

const NavigationManager = (function() {
    'use strict';

    // DOM元素
    let btnPrev = null;
    let btnNext = null;

    // 回调函数
    let onChangeCallback = null;

    // 防止快速连续点击
    let isTransitioning = false;
    const TRANSITION_DELAY = 300;

    /**
     * 初始化导航模块
     * @param {Function} onChange 切换诗词后的回调
     */
    function init(onChange) {
        btnPrev = document.getElementById('btn-prev');
        btnNext = document.getElementById('btn-next');
        onChangeCallback = onChange;

        bindEvents();
    }

    /**
     * 绑定事件
     */
    function bindEvents() {
        // 按钮点击
        btnPrev.addEventListener('click', goToPrev);
        btnNext.addEventListener('click', goToNext);

        // 键盘快捷键
        document.addEventListener('keydown', handleKeydown);
    }

    /**
     * 切换到上一首
     */
    function goToPrev() {
        if (isTransitioning || !PoemsManager.hasPrev()) return;

        isTransitioning = true;
        const poem = PoemsManager.prev();
        
        if (poem && onChangeCallback) {
            onChangeCallback(poem);
        }

        setTimeout(() => {
            isTransitioning = false;
        }, TRANSITION_DELAY);
    }

    /**
     * 切换到下一首
     */
    function goToNext() {
        if (isTransitioning || !PoemsManager.hasNext()) return;

        isTransitioning = true;
        const poem = PoemsManager.next();
        
        if (poem && onChangeCallback) {
            onChangeCallback(poem);
        }

        setTimeout(() => {
            isTransitioning = false;
        }, TRANSITION_DELAY);
    }

    /**
     * 跳转到指定索引
     * @param {number} index 
     */
    function goToIndex(index) {
        if (isTransitioning) return;

        isTransitioning = true;
        
        if (PoemsManager.setCurrentIndex(index)) {
            const poem = PoemsManager.getCurrent();
            if (poem && onChangeCallback) {
                onChangeCallback(poem);
            }
        }

        setTimeout(() => {
            isTransitioning = false;
        }, TRANSITION_DELAY);
    }

    /**
     * 键盘事件处理
     * @param {KeyboardEvent} e 
     */
    function handleKeydown(e) {
        // 如果焦点在输入框，不处理
        if (e.target.tagName === 'INPUT') return;

        switch (e.key) {
            case 'ArrowLeft':
            case 'ArrowUp':
                e.preventDefault();
                goToPrev();
                break;

            case 'ArrowRight':
            case 'ArrowDown':
                e.preventDefault();
                goToNext();
                break;

            case 'Home':
                e.preventDefault();
                goToIndex(0);
                break;

            case 'End':
                e.preventDefault();
                goToIndex(PoemsManager.getCount() - 1);
                break;
        }
    }

    // 公开API
    return {
        init,
        goToPrev,
        goToNext,
        goToIndex
    };
})();
