/* ==================================================================
   静态演示引擎（无后端）
   背景：本次发布到 GitHub Pages，纯静态托管没有 Python 后端。
         这里用本地规则模拟 /api/understand、/api/plan、/api/adjust
         三个接口，返回结构与真实接口一致，
         所以页面的渲染逻辑、校验展示、预算核算一行都不用改。
   覆盖城市：成都 / 杭州 / 北京 / 西安 / 苏州
   ================================================================== */
(function (global) {

  const CITIES = {
    '成都': {
      center: '市中心',
      arrive: { mode: '飞机', label: '飞机 · 上海 → 成都', price: 980, start: '09:00', end: '12:10', back: '15:00-18:00' },
      hotel: { name: '春熙路商圈酒店', price: 520 },
      meals: ['川菜火锅', '老码头火锅', '龙抄手小吃', '玉林串串香'],
      pois: [
        { n: '宽窄巷子', p: '免费', d: 120, area: '市中心', ticket: 0, half: 1 },
        { n: '人民公园·鹤鸣茶社', p: '人均 ¥60', d: 120, area: '市中心', ticket: 0, half: 1 },
        { n: '成都大熊猫繁育研究基地', p: '¥55/人', d: 180, area: '北郊', ticket: 55 },
        { n: '武侯祠', p: '¥50/人', d: 90, area: '武侯', ticket: 50 },
        { n: '锦里古街', p: '免费', d: 90, area: '武侯', ticket: 0 },
        { n: '成都博物馆', p: '免费（需预约）', d: 120, area: '市中心', ticket: 0 },
        { n: '东郊记忆', p: '免费', d: 120, area: '成华', ticket: 0 },
        { n: '青城山', p: '¥80/人', d: 240, area: '都江堰', ticket: 80 }
      ]
    },
    '杭州': {
      center: '上城',
      arrive: { mode: '高铁', label: '高铁 · 上海虹桥 → 杭州东', price: 73, start: '08:30', end: '09:30', back: '16:00-17:00' },
      hotel: { name: '湖滨商圈酒店', price: 580 },
      meals: ['楼外楼杭帮菜', '知味观小吃', '绿茶餐厅', '新白鹿餐厅'],
      pois: [
        { n: '河坊街', p: '免费', d: 90, area: '上城', ticket: 0, half: 1 },
        { n: '西湖·断桥残雪', p: '免费', d: 120, area: '西湖', ticket: 0 },
        { n: '灵隐寺', p: '¥75/人', d: 120, area: '灵隐', ticket: 75 },
        { n: '苏堤春晓', p: '免费', d: 90, area: '西湖', ticket: 0 },
        { n: '龙井村茶园', p: '免费', d: 120, area: '龙井', ticket: 0 },
        { n: '浙江省博物馆', p: '免费（需预约）', d: 120, area: '上城', ticket: 0 },
        { n: '西溪湿地', p: '¥80/人', d: 180, area: '西湖区', ticket: 80 },
        { n: '九溪烟树', p: '免费', d: 120, area: '西湖', ticket: 0 }
      ]
    },
    '北京': {
      center: '东城',
      arrive: { mode: '飞机', label: '飞机 · 上海 → 北京', price: 1050, start: '08:20', end: '10:50', back: '16:30-19:00' },
      hotel: { name: '王府井商圈酒店', price: 620 },
      meals: ['四季民福烤鸭', '护国寺小吃', '全聚德烤鸭', '姚记炒肝'],
      pois: [
        { n: '南锣鼓巷', p: '免费', d: 90, area: '东城', ticket: 0, half: 1 },
        { n: '什刹海', p: '免费', d: 90, area: '西城', ticket: 0, half: 1 },
        { n: '故宫博物院', p: '¥60/人', d: 210, area: '东城', ticket: 60 },
        { n: '景山公园', p: '¥2/人', d: 60, area: '东城', ticket: 2 },
        { n: '天安门广场', p: '免费（需预约）', d: 45, area: '东城', ticket: 0 },
        { n: '颐和园', p: '¥30/人', d: 180, area: '海淀', ticket: 30 },
        { n: '中国国家博物馆', p: '免费（需预约）', d: 150, area: '东城', ticket: 0 },
        { n: '798 艺术区', p: '免费', d: 120, area: '朝阳', ticket: 0 }
      ]
    },
    '西安': {
      center: '雁塔',
      arrive: { mode: '飞机', label: '飞机 · 上海 → 西安', price: 900, start: '08:40', end: '11:20', back: '16:00-18:30' },
      hotel: { name: '钟楼商圈酒店', price: 420 },
      meals: ['老孙家泡馍', 'biangbiang 面', '德发长饺子宴', '回民街小吃'],
      pois: [
        { n: '回民街', p: '免费', d: 90, area: '莲湖', ticket: 0, half: 1 },
        { n: '大唐不夜城', p: '免费', d: 90, area: '雁塔', ticket: 0, half: 1 },
        { n: '秦始皇兵马俑', p: '¥120/人', d: 210, area: '临潼', ticket: 120 },
        { n: '陕西历史博物馆', p: '免费（需预约）', d: 150, area: '雁塔', ticket: 0 },
        { n: '西安城墙', p: '¥54/人', d: 120, area: '碑林', ticket: 54 },
        { n: '华清宫', p: '¥120/人', d: 150, area: '临潼', ticket: 120 },
        { n: '大雁塔', p: '¥40/人', d: 90, area: '雁塔', ticket: 40 }
      ]
    },
    '苏州': {
      center: '姑苏',
      arrive: { mode: '高铁', label: '高铁 · 上海 → 苏州', price: 40, start: '08:40', end: '09:15', back: '16:30-17:10' },
      hotel: { name: '观前街商圈酒店', price: 460 },
      meals: ['松鹤楼苏帮菜', '同得兴面馆', '哑巴生煎', '老苏州茶酒楼'],
      pois: [
        { n: '平江路', p: '免费', d: 90, area: '姑苏', ticket: 0, half: 1 },
        { n: '山塘街', p: '免费', d: 90, area: '姑苏', ticket: 0, half: 1 },
        { n: '拙政园', p: '¥80/人', d: 120, area: '姑苏', ticket: 80 },
        { n: '苏州博物馆', p: '免费（需预约）', d: 120, area: '姑苏', ticket: 0 },
        { n: '狮子林', p: '¥40/人', d: 90, area: '姑苏', ticket: 40 },
        { n: '虎丘', p: '¥70/人', d: 120, area: '姑苏', ticket: 70 },
        { n: '金鸡湖·诚品书店', p: '免费', d: 120, area: '园区', ticket: 0 }
      ]
    }
  };

  const NAME_LIST = Object.keys(CITIES);
  const ST = { dest: '成都' };

  /* ---------- 小工具 ---------- */
  function pad(n) { return String(n).padStart(2, '0'); }
  function toMin(t) { const p = t.split(':'); return (+p[0]) * 60 + (+p[1]); }
  function toHM(v) {
    v = ((Math.round(v) % 1440) + 1440) % 1440;
    return pad(Math.floor(v / 60)) + ':' + pad(v % 60);
  }
  function fmtNow() {
    const d = new Date();
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate())
      + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes());
  }
  const has = (s, re) => re.test(String(s || ''));

  /* ---------- ① 需求理解 ---------- */
  const CN_NUM = { '一': 1, '两': 2, '二': 2, '三': 3, '四': 4, '五': 5, '六': 6, '七': 7, '八': 8 };

  function understand(query) {
    const q = String(query || '');
    const dest = NAME_LIST.find(n => q.includes(n));
    const prefill = [], clarify = [];

    const mFrom = q.match(/从([\u4e00-\u9fa5]{1,4}?)(?:出发|走|飞|去)/);
    prefill.push({
      key: 'from', value: mFrom ? mFrom[1] : '上海', source: mFrom ? 'query' : 'profile',
      why: mFrom ? '你在 query 里说了出发地' : '历史方案默认出发地'
    });

    let crew = null, crewWhy = '';
    if (has(q, /爸妈|父母|老爹|老妈|老人|长辈/)) { crew = '2 大人 + 2 老人'; crewWhy = '提到"带爸妈"，按 2 老 2 少估算'; }
    else if (has(q, /孩子|小孩|娃|儿童|亲子/)) { crew = '2 大人 + 1 儿童'; crewWhy = '提到带孩子，按 1 儿童估算'; }
    else if (has(q, /情侣|女朋友|男朋友|对象|老婆|老公/)) { crew = '2 大人'; crewWhy = '按双人同行估算'; }
    else if (has(q, /一个人|独自|自己一个|独行/)) { crew = '1 人'; crewWhy = '提到一个人出行'; }

    const mDays = q.match(/(\d+|[一两二三四五六七八])\s*[天日]/);
    const mBudget = q.match(/(?:人均|预算|花费)[^\d]{0,4}(\d{2,5})/);

    let startDate = '';
    if (has(q, /十一|国庆/)) startDate = '10 月 1 日';
    else if (has(q, /五一/)) startDate = '5 月 1 日';
    else if (has(q, /下周末/)) startDate = '下周六';
    else if (has(q, /周末/)) startDate = '本周六';

    if (crew) prefill.push({ key: 'crew', value: crew, source: 'query', why: crewWhy });
    else clarify.push({ key: 'crew', question: '和谁一起去？', options: ['1 人', '2 大人', '2 大人 + 1 儿童', '2 大人 + 2 老人'] });

    if (mDays) {
      const n = /^\d+$/.test(mDays[1]) ? +mDays[1] : CN_NUM[mDays[1]];
      if (n >= 1 && n <= 7) prefill.push({ key: 'days', value: n + ' 天', source: 'query', why: '你说的时间跨度' });
    }
    if (!prefill.some(p => p.key === 'days')) clarify.push({ key: 'days', question: '想玩几天？', options: ['2 天', '3 天', '4 天', '5 天'] });

    if (mBudget) prefill.push({ key: 'budget', value: '人均 ' + mBudget[1] + ' 元', source: 'query', why: '你给的预算' });
    else clarify.push({ key: 'budget', question: '人均预算大概多少？', options: ['人均 800 元', '人均 1500 元', '人均 3000 元', '人均 6000 元'] });

    let pace = '适中，每天 2-3 个点', paceWhy = '未提节奏偏好，按中等强度';
    if (has(q, /轻松|悠闲|慢|休闲|不赶|别太赶|不要太赶|养老|带老人/)) { pace = '轻松、不赶'; paceWhy = '你强调"轻松、别太赶"'; }
    else if (has(q, /紧凑|特种兵|多玩|尽可能多|多逛/)) { pace = '紧凑，尽量多看'; paceWhy = '你希望多看几个点'; }
    prefill.push({ key: 'pace', value: pace, source: 'query', why: paceWhy });

    if (!dest) clarify.push({ key: 'destination', question: '想去哪？', options: ['成都', '杭州', '北京', '西安', '苏州'] });

    return { ok: true, data: { destination: dest || null, start_date: startDate, prefill, need_clarify: clarify } };
  }

  /* ---------- ② 生成 + 校验 ---------- */
  function buildPlan(c) {
    const dest = c.destination;
    const city = CITIES[dest];
    if (!city) return { ok: false, raw: '演示暂未覆盖该目的地' };

    const days = Math.max(1, Math.min(6, +(String(c.days || '2').match(/\d+/) || [2])[0]));
    const pace = c.pace || '';
    const crew = String(c.crew || '');
    const from = c.from || '上海';
    const perDay = has(pace, /轻松/) ? 2 : (has(pace, /紧凑/) ? 3 : 2);
    const validation = [];
    let autoFixed = false;

    const halfPool = city.pois.filter(p => p.half);
    const fullPool = city.pois.filter(p => !p.half);
    const used = [];
    const takeHalf = () => halfPool.find(p => !used.includes(p)) || halfPool[used.length % halfPool.length];
    const takeFull = () => fullPool.find(p => !used.includes(p)) || fullPool[used.length % fullPool.length];
    const use = p => { used.push(p); return p; };

    const areaOf = n => (city.pois.find(p => p.n === n) || {}).area || city.center;

    function legBetween(a, b) {
      const aa = areaOf(a.name), bb = areaOf(b.name);
      if (a.type === 'transport' || b.type === 'transport') return { mode: '打车', note: '约 40 分钟（往返站点/机场）' };
      if (aa === bb) return { mode: '步行', note: '约 12 分钟（同片区，约 1.2km）' };
      return { mode: '打车', note: '约 26 分钟（跨片区）' };
    }

    function attachLegs(items) {
      const legs = [];
      for (let i = 0; i < items.length - 1; i++) {
        let lg = legBetween(items[i], items[i + 1]);
        // 校验规则：带老人时单段步行不宜超过 1.5km（约 20 分钟）
        if (has(crew, /老人/) && lg.mode === '步行') {
          lg = { mode: '打车', note: '约 10 分钟（原步行 1.2km 超老人阈值，已改打车）' };
          autoFixed = true;
          validation.push('「' + items[i].name + ' → ' + items[i + 1].name + '」原为步行约 1.2km，超过带老人时单段 1.5km 阈值，已自动改为打车');
        }
        legs.push({ from: items[i].name, to: items[i + 1].name, mode: lg.mode, note: lg.note });
      }
      return legs;
    }

    function dinnerItem(d, at) {
      return { name: city.meals[(d + 2) % city.meals.length], start: at, end: toHM(toMin(at) + 75), type: 'meal', price_note: '人均 ¥' + (70 + 15 * (d % 3)), source: '高德收录' };
    }

    const dayArr = [];

    for (let d = 1; d <= days; d++) {
      const isFirst = d === 1, isLast = d === days && days > 1;
      const items = [];

      if (isFirst) {
        // 抵达日：交通 → 入住 → 一个同片区轻景点 → 晚餐
        items.push({ name: city.arrive.label.replace('上海', from), start: city.arrive.start, end: city.arrive.end, type: 'transport', price_note: '¥' + city.arrive.price + '/人', source: '票价区间估算' });
        items.push({ name: city.hotel.name, start: '14:00', end: '15:00', type: 'rest', price_note: '¥' + city.hotel.price + '/晚', source: '高德收录' });
        const p = use(takeHalf());
        items.push({ name: p.n, start: '16:00', end: toHM(960 + p.d), type: 'poi', price_note: p.p, source: '高德收录' });
        items.push(dinnerItem(d, '18:30'));
      } else if (isLast) {
        // 返程日：上午一个景点 → 午餐 → 返程
        const p = use(takeFull());
        items.push({ name: p.n, start: '09:00', end: toHM(540 + p.d), type: 'poi', price_note: p.p, source: '高德收录' });
        const lunchAt = toHM(540 + p.d + 30);
        items.push({ name: city.meals[(d + 3) % city.meals.length], start: lunchAt, end: toHM(toMin(lunchAt) + 60), type: 'meal', price_note: '人均 ¥65', source: '高德收录' });
        items.push({ name: city.arrive.mode + ' · ' + dest + ' → ' + from, start: city.arrive.back.split('-')[0], end: city.arrive.back.split('-')[1], type: 'transport', price_note: '¥' + city.arrive.price + '/人', source: '票价区间估算' });
      } else {
        // 完整游玩日：上午 → 午餐 → 下午（可选第三个点）→ 晚餐
        let t = 9 * 60;
        const count = perDay;
        for (let i = 0; i < count; i++) {
          const p = use(takeFull());
          items.push({ name: p.n, start: toHM(t), end: toHM(t + p.d), type: 'poi', price_note: p.p, source: '高德收录' });
          t += p.d + 30;
          if (i === 0) {
            const lunch = city.meals[(d + i) % city.meals.length];
            items.push({ name: lunch, start: toHM(t), end: toHM(t + 60), type: 'meal', price_note: '人均 ¥' + (55 + 10 * i), source: '高德收录' });
            t += 90;
          } else if (i < count - 1) {
            t += 30;
          }
        }
        items.push(dinnerItem(d, toHM(Math.max(t + 30, 18 * 60 + 30))));
      }

      // 校验：只在景点时段上算在外时长（09:00-18:00 ≈ 9h 属正常）
      const pois = items.filter(x => x.type === 'poi');
      if (pois.length) {
        const s = toMin(pois[0].start), e = toMin(pois[pois.length - 1].end);
        if (e - s > 600) validation.push('Day' + d + ' 景点时段跨度约 ' + ((e - s) / 60).toFixed(1) + ' 小时，超过单日 10 小时，建议砍掉一个点');
      }

      dayArr.push({
        date: 'Day' + d + (isFirst ? ' · 抵达日' : (isLast ? ' · 返程日' : '')),
        items,
        legs: attachLegs(items)
      });
    }

    // 预算
    const nights = Math.max(0, days - 1);
    const ticket = used.reduce((s, p) => s + (p.ticket || 0), 0);
    const tk = ticket > 0 ? '¥' + ticket : '¥0（多为免费场馆，需预约）';
    const budget_breakdown = [
      { item: city.arrive.mode + '往返（' + from + ' ⇄ ' + dest + '）', price_range: '¥' + Math.round(city.arrive.price * 0.9) + '-¥' + Math.round(city.arrive.price * 1.15) },
      { item: '住宿 ' + nights + ' 晚（2 人同住折算）', price_range: '¥' + Math.round(city.hotel.price * nights / 2 * 0.9) + '-¥' + Math.round(city.hotel.price * nights / 2 * 1.2) },
      { item: '餐饮 ' + days + ' 天', price_range: '¥' + (150 * days) + '-¥' + (220 * days) },
      { item: '门票合计', price_range: tk }
    ];
    const assumptions = [
      '本页为静态演示：行程内容来自内置样例库（覆盖成都/杭州/北京/西安/苏州），不是实时查询结果',
      '真实产品中，POI、营业时间、票价由地图 POI 与路径规划接口实时核验，并标注核验时间',
      '住宿按 2 人同住折算，单人出行需按单房差上调；票价/门票为公开区间估算，非实时报价'
    ];

    return { ok: true, data: { days: dayArr, budget_breakdown, assumptions }, validation, checked_at: fmtNow(), auto_fixed: autoFixed };
  }

  /* ---------- ③ 局部重排 ---------- */
  function adjust(itinerary, instruction) {
    const ins = String(instruction || '');
    const city = CITIES[ST.dest] || CITIES['成都'];
    const it = JSON.parse(JSON.stringify(itinerary || {}));
    let summary = '';

    if (has(ins, /省|便宜|降|预算|实惠|穷游|贵/)) {
      (it.days || []).forEach(day => {
        (day.items || []).forEach(x => {
          if (x.type === 'rest') {
            x.name = x.name.replace(/酒店$/, '') + '经济型酒店';
            x.price_note = '¥' + Math.round(city.hotel.price * 0.65) + '/晚';
          }
          if (x.type === 'meal') x.price_note = '人均 ¥45';
        });
      });
      (it.budget_breakdown || []).forEach(b => {
        if (/住宿/.test(b.item)) b.price_range = '¥' + Math.round(city.hotel.price * 0.65 * 0.9) + '-¥' + Math.round(city.hotel.price * 0.65 * 1.2);
        if (/餐饮/.test(b.item)) { const m = (b.price_range.match(/\d+/g) || [0, 0]).map(Number); b.price_range = '¥' + Math.round(m[0] * 0.6) + '-¥' + Math.round(m[1] * 0.6); }
      });
      summary = '住宿换成同商圈经济型酒店、餐饮降一档，景点与天数不动 —— 只重算受影响的部分，不整份重生成';
    } else if (has(ins, /慢|轻松|悠闲|松|累|少一点|别太满|赶/)) {
      (it.days || []).forEach((day, i) => {
        if (i === 0) return;
        const ps = (day.items || []).filter(x => x.type === 'poi');
        if (ps.length > 1) {
          const drop = ps[ps.length - 1];
          day.items = day.items.filter(x => x !== drop);
          day.legs = (day.legs || []).filter(l => !String(l.to).includes(drop.name) && !String(l.from).includes(drop.name));
        }
      });
      summary = '每个非抵达日砍掉最后一个景点，并删掉它对应的路段衔接；原有顺序不动';
    } else if (has(ins, /加|增|再来|安排/) && has(ins, /博物|美术|展|书店|艺术/)) {
      const extra = city.pois.find(p => /博物|美术|书店|艺术/.test(p.n)) || { n: '城市博物馆', p: '免费（需预约）' };
      const day2 = (it.days || [])[1] || (it.days || [])[0];
      if (day2) {
        const prev = day2.items[day2.items.length - 1];
        day2.items.push({ name: extra.n, start: '16:30', end: '18:30', type: 'poi', price_note: extra.p, source: '高德收录（已校验当日开放）' });
        day2.legs = day2.legs || [];
        if (prev) day2.legs.push({ from: prev.name, to: extra.n, mode: '打车', note: '约 18 分钟' });
      }
      summary = '在 Day2 下午插入「' + extra.n + '」，并补上从上一站过去的交通衔接与耗时';
    } else if (has(ins, /天/)) {
      const m = ins.match(/(\d+|[一两二三四五六])/);
      const n = m ? (/^\d+$/.test(m[1]) ? +m[1] : CN_NUM[m[1]]) : 0;
      if (n && n < it.days.length) {
        it.days = it.days.slice(0, n);
        summary = '行程压缩到 ' + n + ' 天：砍掉靠后的天数，前面几天原样保留';
      } else if (n && n > it.days.length) {
        for (let i = it.days.length; i < n; i++) {
          const p1 = city.pois[i % city.pois.length], p2 = city.pois[(i + 2) % city.pois.length];
          it.days.push({
            date: 'Day' + (i + 1),
            items: [
              { name: p1.n, start: '09:00', end: '11:30', type: 'poi', price_note: p1.p, source: '高德收录' },
              { name: city.meals[i % city.meals.length], start: '12:00', end: '13:00', type: 'meal', price_note: '人均 ¥70', source: '高德收录' },
              { name: p2.n, start: '14:00', end: '16:30', type: 'poi', price_note: p2.p, source: '高德收录' }
            ],
            legs: [
              { from: p1.n, to: city.meals[i % city.meals.length], mode: '步行', note: '约 12 分钟' },
              { from: city.meals[i % city.meals.length], to: p2.n, mode: '打车', note: '约 20 分钟' }
            ]
          });
        }
        summary = '延长到 ' + n + ' 天：新增天数按同城同片区补点，原有天数不动';
      } else {
        summary = '已按你说的天数调整';
      }
    } else if (has(ins, /老人|爸妈|不走|腿脚|轮椅/)) {
      (it.days || []).forEach(day => {
        (day.legs || []).forEach(l => { if (/步行/.test(l.mode)) { l.mode = '打车'; l.note = '约 10 分钟（带老人改打车）'; } });
      });
      summary = '把所有步行衔接改为打车，单段通勤控制在 15 分钟内';
    } else {
      const day2 = (it.days || [])[1];
      if (day2) {
        const ps = day2.items.filter(x => x.type === 'poi');
        if (ps.length >= 2) {
          const a = ps[0], b = ps[1];
          const tn = a.name; a.name = b.name; b.name = tn;
          const tp = a.price_note; a.price_note = b.price_note; b.price_note = tp;
        }
      }
      summary = '按你的描述重排了 Day2 的景点顺序，其余天数与预算不动';
    }

    return { ok: true, data: { diff_summary: summary, itinerary: it }, validation: [], checked_at: fmtNow(), auto_fixed: false };
  }

  /* ---------- 输出结构自检 ----------
     宁可返回 ok:false 让上层走降级，也不要把坏数据丢给渲染层导致白屏 */
  function checkPayload(path, res){
    if(!res || typeof res !== 'object') return '返回不是对象';
    if(path === '/api/understand'){
      if(!res.data || !Array.isArray(res.data.prefill)) return '缺少 prefill 字段';
      return null;
    }
    if(path === '/api/plan'){
      if(!res.ok) return null;                     // 业务性失败原样交给上层
      const d = res.data || {};
      if(!Array.isArray(d.days) || !d.days.length) return '缺少 days';
      if(!Array.isArray(d.budget_breakdown)) return '缺少 budget_breakdown';
      const bad = d.days.find(x => !Array.isArray(x.items) || !x.items.length);
      if(bad) return '存在空日程：' + (bad.date || '未命名');
      return null;
    }
    if(path === '/api/adjust'){
      const d = res.data || {};
      if(!d.itinerary || !Array.isArray(d.itinerary.days)) return '缺少 itinerary.days';
      return null;
    }
    return null;
  }

  /* 人工延迟：?slow=3000 用来演示超时与等待态 */
  const SLOW = (function(){
    try{ return Math.max(0, Number(new URLSearchParams(location.search).get('slow')) || 0); }
    catch(e){ return 0; }
  })();

  /* ---------- 调度 ---------- */
  global.mockApi = function (path, body) {
    return new Promise(resolve => {
      setTimeout(() => {
        try {
          if(!body || typeof body !== 'object') return resolve({ ok: false, raw: '入参为空' });
          let res;
          if (path === '/api/understand') res = understand(body.query);
          else if (path === '/api/plan') {
            ST.dest = (body.constraints || {}).destination || ST.dest;
            res = buildPlan(body.constraints || {});
          }
          else if (path === '/api/adjust') res = adjust(body.itinerary, body.instruction);
          else return resolve({ ok: false, raw: '演示模式不支持的接口：' + path });

          const bad = checkPayload(path, res);
          if(bad) return resolve({ ok: false, raw: '演示引擎输出异常：' + bad });
          resolve(res);
        } catch (e) {
          resolve({ ok: false, raw: '演示引擎异常：' + (e && e.message ? e.message : e) });
        }
      }, SLOW || (420 + Math.random() * 480));
    });
  };
})(window);
