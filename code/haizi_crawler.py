#!/usr/bin/env python3
"""
海子诗歌爬虫
从 haizi.huhaitai.com 抓取所有诗歌，生成带 frontmatter 的 Markdown 文件

使用方法:
1. 安装依赖: pip install requests beautifulsoup4
2. 运行脚本: python haizi_crawler.py
3. 诗歌将保存在当前目录的 haizi_poems 文件夹中

可选参数:
  --include-essays    包含文论（第五编）
  --output, -o        指定输出目录
"""

import requests
from bs4 import BeautifulSoup
import os
import re
import time
from urllib.parse import urljoin
from pathlib import Path

BASE_URL = "https://haizi.huhaitai.com"
OUTPUT_DIR = Path("./haizi_poems")

# 诗歌链接列表（从目录页解析得到）
# 格式: (路径, 标题)
POEM_LINKS = [
    # ===== 第一编 短诗（1983-1986）=====
    ("/01/001", "亚洲铜"),
    ("/01/002", "阿尔的太阳"),
    ("/01/003", "海上"),
    ("/01/004", "新娘"),
    ("/01/005", "我，以及其他的证人"),
    ("/01/006", "单翅鸟"),
    ("/01/007", "爱情故事"),
    ("/01/008", "跳跃者"),
    ("/01/009", "秋天"),
    ("/01/010", "中国器乐"),
    ("/01/011", "煤堆"),
    ("/01/012", "春天的夜晚和早晨"),
    ("/01/013", "木鱼儿"),
    ("/01/014", "印度之夜"),
    ("/01/015", "不要问我那绿色是什么"),
    ("/01/016", "黑风"),
    ("/01/017", "东方山脉"),
    ("/01/018", "农耕民族"),
    ("/01/019", "历史"),
    ("/01/020", "龙"),
    ("/01/021", "村庄"),
    ("/01/022", "自画像"),
    ("/01/023", "女孩子"),
    ("/01/024", "海上婚礼"),
    ("/01/025", "妻子和鱼"),
    ("/01/026", "思念前生"),
    ("/01/027", "船尾之梦"),
    ("/01/028", "河伯"),
    ("/01/029", "坛子"),
    ("/01/030", "燕子和蛇（组诗）"),
    ("/01/031", "活在珍贵的人间"),
    ("/01/032", "夏天的太阳"),
    ("/01/033", "主人"),
    ("/01/034", "浑曲"),
    ("/01/035", "你的手"),
    ("/01/036", "得不到你"),
    ("/01/037", "中午"),
    ("/01/038", "日光"),
    ("/01/039", "北方门前"),
    ("/01/040", "写给脖子上的菩萨"),
    ("/01/041", "房屋"),
    ("/01/042", "粮食"),
    ("/01/043", "民间艺人"),
    ("/01/044", "熟了麦子"),
    ("/01/045", "哑脊背"),
    ("/01/046", "我请求：雨"),
    ("/01/047", "为了美丽"),
    ("/01/048", "早祷与枭"),
    ("/01/049", "打钟"),
    ("/01/050", "蓝姬的巢"),
    ("/01/051", "莲界慈航"),
    ("/01/052", "明天醒来我会在哪一只鞋子里"),
    ("/01/053", "夜月"),
    ("/01/054", "月"),
    ("/01/055", "孤独的东方人"),
    ("/01/056", "城里"),
    ("/01/057", "给母亲（组诗）"),
    ("/01/058", "九盏灯（组诗）"),
    ("/01/059", "村庄"),
    ("/01/060", "无题"),
    ("/01/061", "麦地"),
    ("/01/062", "坐在纸箱上想起疯了的朋友们"),
    ("/01/063", "我们坐在一棵木头中"),
    ("/01/064", "春天"),
    ("/01/065", "歌：阳光打在地上"),
    ("/01/066", "在昌平的孤独"),
    ("/01/067", "马（断片）"),
    ("/01/068", "春天（断片）"),
    ("/01/069", "半截的诗"),
    ("/01/070", "爱情诗集"),
    ("/01/071", "诗集"),
    ("/01/072", "歌或哭"),
    ("/01/073", "门关户闭"),
    ("/01/074", "幸福"),
    ("/01/075", "我的窗户里埋着一只为你祝福的杯子"),
    ("/01/076", "海滩上为女士算命"),
    ("/01/077", "抱着白虎走过海洋"),
    ("/01/078", "让我把脚丫搁在黄昏中一位木匠的工具箱上"),
    ("/01/079", "从六月到十月"),
    ("/01/080", "八月尾"),
    ("/01/081", "葡萄园之西的话语"),
    ("/01/082", "果园"),
    ("/01/083", "感动"),
    ("/01/084", "肉体（之一）"),
    ("/01/085", "肉体（之二）"),
    ("/01/086", "死亡之诗（之一）"),
    ("/01/087", "死亡之诗（之二：采摘葵花）"),
    ("/01/088", "自杀者之歌"),
    ("/01/089", "黎明"),
    ("/01/090", "给萨福"),
    ("/01/091", "给安徒生"),
    ("/01/092", "梭罗这人有脑子"),
    ("/01/093", "给托尔斯泰"),
    ("/01/094", "给卡夫卡"),
    ("/01/095", "大自然"),
    ("/01/096", "莫扎特在《安魂曲》中说"),
    ("/01/097", "天鹅"),
    ("/01/098", "不幸"),
    ("/01/099", "泪水"),
    ("/01/100", "给1986"),
    ("/01/101", "海水没顶"),
    ("/01/102", "七月的大海"),
    ("/01/103", "海子小夜曲"),
    ("/01/104", "给你"),
    ("/01/105", "谣曲"),
    ("/01/106", "给B的生日"),
    ("/01/107", "哭泣"),
    ("/01/108", "我感到魅惑"),
    ("/01/109", "北斗七星七座村庄"),
    ("/01/110", "黄金草原"),
    ("/01/111", "怅望祁连（之一）"),
    ("/01/112", "怅望祁连（之二）"),
    ("/01/113", "七月不远"),
    ("/01/114", "敦煌"),
    ("/01/115", "云朵"),
    ("/01/116", "九月"),
    ("/01/117", "喜马拉雅"),
    
    # ===== 第二编 长诗（1984-1985）=====
    ("/02/21/21-0", "河流"),
    ("/02/22/22-0", "传说"),
    ("/02/23/23-0", "但是水、水"),
    # 神秘故事六篇
    ("/02/24/24-1", "龟王"),
    ("/02/24/24-2", "木船"),
    ("/02/24/24-3", "初恋"),
    ("/02/24/24-4", "诞生"),
    ("/02/24/24-5", "公鸡"),
    ("/02/24/24-6", "南方"),
    
    # ===== 第三编 短诗（1987-1989）=====
    ("/03/001", "冬天的雨"),
    ("/03/002", "雨"),
    ("/03/003", "雨鞋"),
    ("/03/004", "九寨之星"),
    ("/03/005", "吊半坡并给擅入都市的农民"),
    ("/03/006", "黎明：一首小诗"),
    ("/03/007", "给安庆"),
    ("/03/008", "九首诗的村庄"),
    ("/03/009", "两座村庄"),
    ("/03/010", "病少女"),
    ("/03/011", "野花"),
    ("/03/012", "在家乡"),
    ("/03/013", "粮食两节"),
    ("/03/014", "光棍"),
    ("/03/015", "生殖"),
    ("/03/016", "土地·忧郁·死亡"),
    ("/03/017", "马、火、灰——鼎"),
    ("/03/018", "石头的病或八七年"),
    ("/03/019", "日出"),
    ("/03/020", "水抱屈原"),
    ("/03/021", "耶稣"),
    ("/03/022", "但丁来到此时此地"),
    ("/03/023", "不幸"),
    ("/03/024", "尼采，你使我想起悲伤的热带"),
    ("/03/025", "公爵的私生女"),
    ("/03/026", "献给韩波：诗歌的烈士"),
    ("/03/027", "给伦敦"),
    ("/03/028", "盲目"),
    ("/03/029", "马雅可夫斯基自传"),
    ("/03/030", "诗人叶赛宁（组诗）"),
    ("/03/031", "长发飞舞的姑娘"),
    ("/03/032", "美丽白杨树"),
    ("/03/033", "北方的树林"),
    ("/03/034", "盲目"),
    ("/03/035", "月光"),
    ("/03/036", "灯"),
    ("/03/037", "灯诗"),
    ("/03/038", "夜晚　亲爱的朋友"),
    ("/03/039", "晨雨时光"),
    ("/03/040", "昌平柿子树"),
    ("/03/041", "枫"),
    ("/03/042", "野鸽子"),
    ("/03/043", "汉俳"),
    ("/03/044", "五月的麦地"),
    ("/03/045", "麦地　或遥远"),
    ("/03/046", "麦地与诗人"),
    ("/03/047", "幸福的一日"),
    ("/03/048", "重建家园"),
    ("/03/049", "献诗"),
    ("/03/050", "十四行：夜晚的月亮"),
    ("/03/051", "十四行：王冠"),
    ("/03/052", "十四行：玫瑰花"),
    ("/03/053", "十四行：玫瑰花园"),
    ("/03/054", "秋日想起春天的痛苦也想起雷锋"),
    ("/03/055", "秋日山谷"),
    ("/03/056", "秋"),
    ("/03/057", "八月之杯"),
    ("/03/058", "八月　黑色的火把"),
    ("/03/059", "九月的云"),
    ("/03/060", "秋天"),
    ("/03/061", "秋日黄昏"),
    ("/03/062", "秋"),
    ("/03/063", "为什么你不生活在沙漠上"),
    ("/03/064", "祖国（或以梦为马）"),
    ("/03/065", "秋天的祖国"),
    ("/03/066", "一滴水中的黑夜"),
    ("/03/067", "眺望北方"),
    ("/03/068", "乳房"),
    ("/03/069", "夜色"),
    ("/03/070", "星"),
    ("/03/071", "跳伞塔"),
    ("/03/072", "生日"),
    ("/03/073", "太阳和野花"),
    ("/03/074", "在一个阿拉伯沙漠的村镇上"),
    ("/03/075", "酒杯：情诗一束"),
    ("/03/076", "两行诗"),
    ("/03/077", "四行诗"),
    ("/03/078", "海底卧室"),
    ("/03/079", "冬天"),
    ("/03/080", "我飞遍草原的天空"),
    ("/03/081", "远方"),
    ("/03/082", "在大草原上预感到海的降临"),
    ("/03/083", "黑翅膀"),
    ("/03/084", "七百年前"),
    ("/03/085", "西藏"),
    ("/03/086", "雪"),
    ("/03/088", "远方"),
    ("/03/089", "大草原　大雪封山"),
    ("/03/090", "青海湖"),
    ("/03/091", "大风"),
    ("/03/092", "绿松石"),
    ("/03/093", "山楂树"),
    ("/03/094", "日记"),
    ("/03/095", "无名的野花"),
    ("/03/096", "花儿为什么这样红"),
    ("/03/097", "叙事诗"),
    ("/03/098", "遥远的路程"),
    ("/03/099", "遥远的路程"),
    ("/03/100", "面朝大海，春暖花开"),
    ("/03/101", "折梅"),
    ("/03/102", "神秘的二月的时光"),
    ("/03/103", "黎明（之一）"),
    ("/03/104", "黎明（之二）"),
    ("/03/105", "黎明（之三）"),
    ("/03/106", "四姐妹"),
    ("/03/107", "酒杯"),
    ("/03/108", "日落时分的部落"),
    ("/03/109", "桃花"),
    ("/03/110", "桃花开放"),
    ("/03/111", "你和桃花"),
    ("/03/112", "桃花时节"),
    ("/03/113", "桃树林"),
    ("/03/114", "桃花"),
    ("/03/115", "黎明和黄昏"),
    ("/03/116", "春天"),
    ("/03/117", "拂晓"),
    ("/03/118", "月全食"),
    ("/03/119", "春天，十个海子"),
    ("/03/120", "太平洋上的贾宝玉"),
    ("/03/121", "献给太平洋"),
    ("/03/122", "太平洋的献诗"),
    ("/03/123", "献诗"),
    ("/03/124", "最后一夜和第一日的献诗"),
    ("/03/125", "献诗"),
    ("/03/126", "黑夜的献诗"),
    
    # ===== 第四编 太阳·七部书（1986-1988）=====
    ("/04/41/41-00", "太阳·断头篇"),
    ("/04/42/42-00", "太阳·土地篇"),
    ("/04/43/43-00", "太阳·大札撒（残稿）"),
    ("/04/44/44-00", "太阳，你是父亲的好女儿"),
    ("/04/45/45-00", "太阳·弑"),
    ("/04/46/46-00", "太阳·诗剧"),
    ("/04/47/47-00", "太阳·弥赛亚"),
]

# 文论（第五编）- 可选是否包含
ESSAYS = [
    ("/05/01", "寻找对实体的接触（《河流》原序）"),
    ("/05/02", "源头和鸟（《河流》原代后记）"),
    ("/05/03", "民间主题（《传说》原序）"),
    ("/05/04", "寂静（《但是水、水》原代后记）"),
    ("/05/05", "日记"),
    ("/05/06", "动作（《太阳·断头篇》代后记）"),
    ("/05/07", "诗学：一份提纲"),
    ("/05/08", "我热爱的诗人——荷尔德林"),
]


def get_soup(url):
    """获取页面并解析"""
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
    }
    try:
        response = requests.get(url, headers=headers, timeout=15)
        response.encoding = response.apparent_encoding or 'utf-8'
        return BeautifulSoup(response.text, 'html.parser')
    except Exception as e:
        print(f"  ✗ 网络错误: {e}")
        return None


def determine_period(path):
    """根据路径判断诗歌创作时期"""
    if path.startswith('/01/'):
        return '1983-1986'
    elif path.startswith('/02/'):
        return '1984-1985'
    elif path.startswith('/03/'):
        return '1987-1989'
    elif path.startswith('/04/'):
        return '1986-1988'
    elif path.startswith('/05/'):
        return ''
    return ''


def determine_category(path):
    """根据路径判断诗歌分类"""
    if path.startswith('/01/'):
        return '短诗'
    elif path.startswith('/02/'):
        if '/24/' in path:
            return '神秘故事'
        return '长诗'
    elif path.startswith('/03/'):
        return '短诗'
    elif path.startswith('/04/'):
        return '太阳七部书'
    elif path.startswith('/05/'):
        return '文论'
    return ''


def extract_poem_content(soup, title):
    """
    从页面提取诗歌正文
    针对 haizi.huhaitai.com 的表格布局进行优化
    """
    if not soup:
        return None, None
    
    content_text = ""
    date_str = None
    
    # 该网站使用表格布局，找到包含诗歌内容的表格单元格
    # 诗歌内容通常在 td 标签中，行之间用双空格分隔
    
    # 方法1: 找到所有 td，查找包含诗歌内容的那个
    all_tds = soup.find_all('td')
    for td in all_tds:
        text = td.get_text(separator='\n')
        # 诗歌内容的 td 通常包含多行，且不是导航
        if len(text) > 50 and '上一页' not in text and '下一页' not in text:
            # 检查是否包含编别标记
            if '第一编' in text or '第二编' in text or '第三编' in text or '第四编' in text or '第五编' in text:
                content_text = text
                break
    
    # 方法2: 如果方法1失败，尝试 body
    if not content_text:
        body = soup.find('body')
        if body:
            body_copy = BeautifulSoup(str(body), 'html.parser').find('body')
            for tag in body_copy(['script', 'style']):
                tag.decompose()
            content_text = body_copy.get_text(separator='\n')
    
    if not content_text:
        return None, None
    
    # 清理文本
    lines = content_text.split('\n')
    cleaned_lines = []
    
    skip_patterns = [
        r'^〖.*〗$',  # 编别标记 〖第三编　短诗（1987—1989）〗
        r'^<<\s*上一页',
        r'回目录',
        r'下一页\s*>>',
        r'^[\[\]<>　\s]+$',
        r'^\|+$',
        r'^-+$',
    ]
    
    title_found = False
    for line in lines:
        line = line.strip()
        if not line:
            continue
        
        # 跳过匹配的模式
        skip = False
        for pattern in skip_patterns:
            if re.match(pattern, line):
                skip = True
                break
        if skip:
            continue
        
        # 跳过导航文本
        if line in ['<<', '>>', '返回', '目录', '上一页', '下一页', '<<上一页', '下一页>>']:
            continue
        
        # 跳过空白表格符号
        if all(c in '| \t-' for c in line):
            continue
        
        # 跳过第一次出现的标题（单独一行且与标题完全匹配或非常相似）
        if not title_found:
            # 清理标题中的特殊字符进行比较
            clean_title = re.sub(r'[（）()：:，,　 ]', '', title)
            clean_line = re.sub(r'[（）()：:，,　 ]', '', line)
            if clean_title == clean_line or title == line:
                title_found = True
                continue
        
        cleaned_lines.append(line)
    
    # 尝试从最后几行提取日期
    if cleaned_lines:
        for i in range(min(3, len(cleaned_lines))):
            last_line = cleaned_lines[-(i+1)]
            # 匹配各种日期格式
            date_match = re.search(r'(\d{4})[.\-年/](\d{1,2})[.\-月/]?(\d{1,2})?', last_line)
            if date_match:
                year = date_match.group(1)
                month = date_match.group(2)
                day = date_match.group(3) if date_match.group(3) else ''
                if day:
                    date_str = f"{year}-{month.zfill(2)}-{day.zfill(2)}"
                else:
                    date_str = f"{year}-{month.zfill(2)}"
                break
    
    return '\n'.join(cleaned_lines) if cleaned_lines else None, date_str


def sanitize_filename(title):
    """清理文件名"""
    title = re.sub(r'[<>:"/\\|?*]', '', title)
    title = re.sub(r'[：]', '-', title)
    title = re.sub(r'\s+', ' ', title).strip()
    if len(title) > 80:
        title = title[:80]
    return title


def create_markdown_file(path, title, content, date_str=None, subdir="poems"):
    """创建 Markdown 文件"""
    period = determine_period(path)
    category = determine_category(path)
    
    frontmatter_lines = [
        '---',
        f'title: "{title}"',
        'author: "海子"',
    ]
    if date_str:
        frontmatter_lines.append(f'date: "{date_str}"')
    if period:
        frontmatter_lines.append(f'period: "{period}"')
    frontmatter_lines.extend([
        f'category: "{category}"',
        f'source: "{BASE_URL}{path}"',
        '---',
        '',
    ])
    
    full_content = '\n'.join(frontmatter_lines) + '\n' + content
    
    output_subdir = OUTPUT_DIR / subdir
    output_subdir.mkdir(parents=True, exist_ok=True)
    
    filename = sanitize_filename(title) + '.md'
    filepath = output_subdir / filename
    
    counter = 1
    original_filename = filename
    while filepath.exists():
        name_part = original_filename[:-3]
        filename = f"{name_part}_{counter}.md"
        filepath = output_subdir / filename
        counter += 1
    
    filepath.write_text(full_content, encoding='utf-8')
    return filepath


def crawl_poems(include_essays=False):
    """主爬虫函数"""
    print("=" * 50)
    print("海子诗歌爬虫")
    print("=" * 50)
    print(f"\n输出目录: {OUTPUT_DIR.absolute()}\n")
    
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    
    all_items = list(POEM_LINKS)
    if include_essays:
        all_items.extend(ESSAYS)
    
    total = len(all_items)
    success = 0
    failed = []
    
    print(f"共 {total} 篇作品待抓取\n")
    
    for i, (path, title) in enumerate(all_items, 1):
        url = BASE_URL + path
        print(f"[{i}/{total}] {title}")
        
        soup = get_soup(url)
        if not soup:
            failed.append((path, title, "网络错误"))
            continue
        
        content, date_str = extract_poem_content(soup, title)
        if not content:
            failed.append((path, title, "内容提取失败"))
            print(f"  ✗ 未能提取内容")
            continue
        
        if path.startswith('/05/'):
            subdir = "essays"
        elif path.startswith('/04/'):
            subdir = "sun_seven_books"
        elif path.startswith('/02/'):
            subdir = "long_poems"
        else:
            subdir = "short_poems"
        
        filepath = create_markdown_file(path, title, content, date_str, subdir)
        print(f"  ✓ 保存至: {filepath.relative_to(OUTPUT_DIR)}")
        success += 1
        
        time.sleep(0.3)
    
    print("\n" + "=" * 50)
    print(f"完成！成功: {success}/{total}")
    if failed:
        print(f"\n失败列表 ({len(failed)} 篇):")
        for path, title, reason in failed:
            print(f"  - {title}: {reason}")
    print(f"\n文件保存在: {OUTPUT_DIR.absolute()}")


if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description='海子诗歌爬虫')
    parser.add_argument('--include-essays', action='store_true', 
                        help='是否包含文论（第五编）')
    parser.add_argument('--output', '-o', type=str, default='./haizi_poems',
                        help='输出目录 (默认: ./haizi_poems)')
    args = parser.parse_args()
    
    OUTPUT_DIR = Path(args.output)
    crawl_poems(include_essays=args.include_essays)
