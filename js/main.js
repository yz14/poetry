/**
 * main.js - 主入口模块
 * 职责：初始化应用、协调各模块
 */

(function() {
    'use strict';

    /**
     * 应用初始化
     */
    function initApp() {
        // 1. 初始化渲染器
        Renderer.init();

        // 2. 初始化搜索模块
        SearchManager.init(handlePoemChange);

        // 3. 初始化导航模块
        NavigationManager.init(handlePoemChange);

        // 4. 渲染首首诗词
        Renderer.renderCurrent(false);

        // 5. 添加页面可见性处理
        handleVisibilityChange();

        console.log('🎋 古诗词鉴赏应用已启动');
    }

    /**
     * 诗词切换处理
     * @param {Object} poem 新的诗词对象
     */
    function handlePoemChange(poem) {
        Renderer.renderPoem(poem, true);
    }

    /**
     * 页面可见性变化处理
     * 当页面重新可见时，确保状态正确
     */
    function handleVisibilityChange() {
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                Renderer.updateNavigationButtons();
            }
        });
    }

    // DOM加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initApp);
    } else {
        initApp();
    }
})();
