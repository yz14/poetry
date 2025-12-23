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
            title: '静夜思',
            author: '李白',
            dynasty: '唐',
            lines: ['床前明月光，', '疑是地上霜。', '举头望明月，', '低头思故乡。'],
            image: 'https://pic1.imgdb.cn/item/694a7937ba772b0367e2fbb7.png',
            seal: '白'
        },
        {
            id: 2,
            title: '春晓',
            author: '孟浩然',
            dynasty: '唐',
            lines: ['春眠不觉晓，', '处处闻啼鸟。', '夜来风雨声，', '花落知多少。'],
            image: 'https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?w=600&h=600&fit=crop',
            seal: '孟'
        },
        {
            id: 3,
            title: '登鹳雀楼',
            author: '王之涣',
            dynasty: '唐',
            lines: ['白日依山尽，', '黄河入海流。', '欲穷千里目，', '更上一层楼。'],
            image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=600&fit=crop',
            seal: '王'
        },
        {
            id: 4,
            title: '相思',
            author: '王维',
            dynasty: '唐',
            lines: ['红豆生南国，', '春来发几枝。', '愿君多采撷，', '此物最相思。'],
            image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=600&h=600&fit=crop',
            seal: '维'
        },
        {
            id: 5,
            title: '悯农',
            author: '李绅',
            dynasty: '唐',
            lines: ['锄禾日当午，', '汗滴禾下土。', '谁知盘中餐，', '粒粒皆辛苦。'],
            image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&h=600&fit=crop',
            seal: '绅'
        },
        {
            id: 6,
            title: '江雪',
            author: '柳宗元',
            dynasty: '唐',
            lines: ['千山鸟飞绝，', '万径人踪灭。', '孤舟蓑笠翁，', '独钓寒江雪。'],
            image: 'https://images.unsplash.com/photo-1491002052546-bf38f186af56?w=600&h=600&fit=crop',
            seal: '柳'
        },
        {
            id: 7,
            title: '望庐山瀑布',
            author: '李白',
            dynasty: '唐',
            lines: ['日照香炉生紫烟，', '遥看瀑布挂前川。', '飞流直下三千尺，', '疑是银河落九天。'],
            image: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=600&h=600&fit=crop',
            seal: '白'
        },
        {
            id: 8,
            title: '早发白帝城',
            author: '李白',
            dynasty: '唐',
            lines: ['朝辞白帝彩云间，', '千里江陵一日还。', '两岸猿声啼不住，', '轻舟已过万重山。'],
            image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&h=600&fit=crop',
            seal: '白'
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
