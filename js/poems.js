/**
 * poems.js - 诗词数据管理模块
 * 职责：管理诗词数据的加载、存储和查询
 */

const PoemsManager = (function() {
    'use strict';

    // 内置诗词数据（可后续改为从API或JSON文件加载）
    const poemsData = [
        {
            id: 1,
            title: '题都城南庄',
            author: '崔护',
            dynasty: '唐',
            lines: ['去年今日此门中', '人面桃花相映红', '人面不知何处去', '桃花依旧笑春风'],
            image: 'https://pic1.imgdb.cn/item/694a7937ba772b0367e2fbb7.png',
            seal: '崔'
        },
        {
            id: 2,
            title: '诗经 周南 关雎',
            author: '无',
            dynasty: '唐',
            lines: ['关关雎鸠', '在河之洲', '窈窕淑女', '君子好逑'],
            image: 'https://pic1.imgdb.cn/item/694a7e94ba772b0367e30516.png',
            seal: '无'
        },
        {
            id: 3,
            title: '江雪',
            author: '柳宗元',
            dynasty: '唐',
            lines: ['千山鸟飞绝', '万径人踪灭', '孤舟蓑笠翁', '独钓寒江雪'],
            image: 'https://pic1.imgdb.cn/item/694d15ec82ced3073fa6e13c.png',
            seal: '柳'
        },
        {
            id: 4,
            title: '滁州西涧',
            author: '韦应物',
            dynasty: '唐',
            lines: ['独怜幽草涧边生', '上有黄鹂深树鸣', '春潮带雨晚来急', '野渡无人舟自横'],
            image: 'https://pic1.imgdb.cn/item/694d171282ced3073fa6e2e5.png',
            seal: '韦'
        },
        {
            id: 5,
            title: '小池',
            author: '杨万里',
            dynasty: '宋',
            lines: ['泉眼无声惜细流', '树阴照水爱晴柔', '小荷才露尖尖角', '早有蜻蜓立上头'],
            image: 'https://pic1.imgdb.cn/item/694d195282ced3073fa70a2c.png',
            seal: '杨'
        },
        {
            id: 6,
            title: '春晓',
            author: '孟浩然',
            dynasty: '唐',
            lines: ['春眠不觉晓', '处处闻啼鸟', '夜来风雨声', '花落知多少'],
            image: 'https://pic1.imgdb.cn/item/694d1a8082ced3073fa70b3e.png',
            seal: '孟'
        },
        {
            id: 7,
            title: '绝句',
            author: '杜甫',
            dynasty: '唐',
            lines: ['两个黄鹂鸣翠柳', '一行白鹭上青天', '窗含西岭千秋雪', '门泊东吴万里船'],
            image: 'https://pic1.imgdb.cn/item/694d1b0e82ced3073fa70bb6.png',
            seal: '杜'
        },
        {
            id: 8,
            title: '天净沙 秋思',
            author: '马致远',
            dynasty: '元',
            lines: ['枯藤老树昏鸦', '小桥流水人家', '古道西风瘦马', '夕阳西下', '断肠人在天涯'],
            image: 'https://pic1.imgdb.cn/item/694d1cac82ced3073fa70cdf.png',
            seal: '马'
        }
    ];

    // 当前诗词索引
    let currentIndex = 0;

    /**
     * 获取所有诗词
     * @returns {Array} 诗词数组
     */
    function getAll() {
        return [...poemsData];
    }

    /**
     * 获取诗词总数
     * @returns {number}
     */
    function getCount() {
        return poemsData.length;
    }

    /**
     * 根据索引获取诗词
     * @param {number} index 
     * @returns {Object|null}
     */
    function getByIndex(index) {
        if (index < 0 || index >= poemsData.length) {
            return null;
        }
        return { ...poemsData[index] };
    }

    /**
     * 根据ID获取诗词
     * @param {number} id 
     * @returns {Object|null}
     */
    function getById(id) {
        const poem = poemsData.find(p => p.id === id);
        return poem ? { ...poem } : null;
    }

    /**
     * 获取当前诗词
     * @returns {Object}
     */
    function getCurrent() {
        return getByIndex(currentIndex);
    }

    /**
     * 获取当前索引
     * @returns {number}
     */
    function getCurrentIndex() {
        return currentIndex;
    }

    /**
     * 设置当前索引
     * @param {number} index 
     * @returns {boolean} 是否设置成功
     */
    function setCurrentIndex(index) {
        if (index < 0 || index >= poemsData.length) {
            return false;
        }
        currentIndex = index;
        return true;
    }

    /**
     * 切换到下一首
     * @returns {Object|null} 下一首诗词，如果已是最后一首则返回null
     */
    function next() {
        if (currentIndex >= poemsData.length - 1) {
            return null;
        }
        currentIndex++;
        return getCurrent();
    }

    /**
     * 切换到上一首
     * @returns {Object|null} 上一首诗词，如果已是第一首则返回null
     */
    function prev() {
        if (currentIndex <= 0) {
            return null;
        }
        currentIndex--;
        return getCurrent();
    }

    /**
     * 是否有下一首
     * @returns {boolean}
     */
    function hasNext() {
        return currentIndex < poemsData.length - 1;
    }

    /**
     * 是否有上一首
     * @returns {boolean}
     */
    function hasPrev() {
        return currentIndex > 0;
    }

    /**
     * 搜索诗词
     * @param {string} keyword 关键词
     * @returns {Array} 匹配的诗词数组（包含索引信息）
     */
    function search(keyword) {
        if (!keyword || !keyword.trim()) {
            return [];
        }

        const kw = keyword.trim().toLowerCase();
        const results = [];

        poemsData.forEach((poem, index) => {
            // 匹配标题
            if (poem.title.toLowerCase().includes(kw)) {
                results.push({ ...poem, index, matchType: 'title' });
                return;
            }
            // 匹配作者
            if (poem.author.toLowerCase().includes(kw)) {
                results.push({ ...poem, index, matchType: 'author' });
                return;
            }
            // 匹配诗句
            const lineMatch = poem.lines.some(line => 
                line.toLowerCase().includes(kw)
            );
            if (lineMatch) {
                results.push({ ...poem, index, matchType: 'content' });
            }
        });

        return results;
    }

    // 公开API
    return {
        getAll,
        getCount,
        getByIndex,
        getById,
        getCurrent,
        getCurrentIndex,
        setCurrentIndex,
        next,
        prev,
        hasNext,
        hasPrev,
        search
    };
})();
