#!/usr/bin/env python3
"""
海子诗歌整理工具
1. 转换 frontmatter 为新格式
2. 按年份整理短诗到对应文件夹

使用方法:
python organize_poems.py ./haizi_poems
"""

import os
import re
from pathlib import Path
import argparse
import shutil

def parse_frontmatter(content):
    """解析 Markdown 文件的 frontmatter"""
    if not content.startswith('---'):
        return None, content
    
    # 找到第二个 ---
    end_idx = content.find('---', 3)
    if end_idx == -1:
        return None, content
    
    frontmatter_text = content[3:end_idx].strip()
    body = content[end_idx + 3:].strip()
    
    # 解析 YAML 格式的 frontmatter
    frontmatter = {}
    for line in frontmatter_text.split('\n'):
        line = line.strip()
        if ':' in line:
            key, value = line.split(':', 1)
            key = key.strip()
            value = value.strip().strip('"').strip("'")
            frontmatter[key] = value
    
    return frontmatter, body


def extract_year_from_date(date_str):
    """从日期字符串提取年份"""
    if not date_str:
        return None
    match = re.match(r'(\d{4})', date_str)
    if match:
        return match.group(1)
    return None


def extract_year_from_period(period_str):
    """从时期字符串提取年份范围，返回第一个年份"""
    if not period_str:
        return None
    # 格式如 "1983-1986"
    match = re.match(r'(\d{4})', period_str)
    if match:
        return match.group(1)
    return None


def determine_type(category):
    """根据分类确定类型"""
    type_mapping = {
        '短诗': 'short',
        '长诗': 'long',
        '神秘故事': 'story',
        '太阳七部书': 'sun',
        '文论': 'essay',
    }
    return type_mapping.get(category, 'other')


def create_new_frontmatter(old_fm, order):
    """创建新格式的 frontmatter"""
    title = old_fm.get('title', '无题')
    category = old_fm.get('category', '短诗')
    poem_type = determine_type(category)
    
    # 优先使用 date 中的年份，否则用 period
    year = extract_year_from_date(old_fm.get('date', ''))
    if not year:
        year = extract_year_from_period(old_fm.get('period', ''))
    if not year:
        year = 'unknown'
    
    # 构建 tags
    tags = []
    if category:
        tags.append(category)
    if year and year != 'unknown':
        tags.append(year)
    
    # 格式化 tags 为 YAML 数组格式
    tags_str = '[' + ', '.join(f'"{tag}"' for tag in tags) + ']'
    
    new_fm = f'''---
title: "{title}"
type: "{poem_type}"
year: "{year}"
tags: {tags_str}
order: {order}
---'''
    
    return new_fm, year


def process_poems(input_dir, output_dir=None):
    """处理诗歌文件"""
    input_path = Path(input_dir)
    
    if output_dir:
        output_path = Path(output_dir)
    else:
        output_path = input_path.parent / f"{input_path.name}_organized"
    
    # 创建输出目录
    output_path.mkdir(parents=True, exist_ok=True)
    
    # 统计信息
    stats = {
        'total': 0,
        'success': 0,
        'by_year': {},
        'by_type': {},
    }
    
    # 用于跟踪每年的诗歌顺序
    year_order_counter = {}
    
    # 收集所有需要处理的文件
    all_files = []
    
    # 遍历输入目录
    for subdir in input_path.iterdir():
        if subdir.is_dir():
            for md_file in subdir.glob('*.md'):
                all_files.append((subdir.name, md_file))
        elif subdir.suffix == '.md':
            all_files.append(('', subdir))
    
    print(f"找到 {len(all_files)} 个 Markdown 文件")
    print("=" * 50)
    
    for folder_name, md_file in all_files:
        stats['total'] += 1
        
        try:
            content = md_file.read_text(encoding='utf-8')
            old_fm, body = parse_frontmatter(content)
            
            if not old_fm:
                print(f"  ✗ 无法解析 frontmatter: {md_file.name}")
                continue
            
            category = old_fm.get('category', '')
            
            # 获取年份
            year = extract_year_from_date(old_fm.get('date', ''))
            if not year:
                year = extract_year_from_period(old_fm.get('period', ''))
            if not year:
                year = 'unknown'
            
            # 更新顺序计数器
            if year not in year_order_counter:
                year_order_counter[year] = 0
            year_order_counter[year] += 1
            order = year_order_counter[year]
            
            # 创建新的 frontmatter
            new_fm, year = create_new_frontmatter(old_fm, order)
            
            # 组合新内容
            new_content = new_fm + '\n\n' + body
            
            # 确定输出路径
            poem_type = determine_type(category)
            
            if poem_type == 'short':
                # 短诗按年份分文件夹
                year_folder = output_path / year
                year_folder.mkdir(parents=True, exist_ok=True)
                output_file = year_folder / md_file.name
            else:
                # 其他类型保持原有结构
                type_folder = output_path / folder_name if folder_name else output_path / poem_type
                type_folder.mkdir(parents=True, exist_ok=True)
                output_file = type_folder / md_file.name
            
            # 处理重名文件
            counter = 1
            original_name = output_file.stem
            while output_file.exists():
                output_file = output_file.parent / f"{original_name}_{counter}.md"
                counter += 1
            
            # 写入文件
            output_file.write_text(new_content, encoding='utf-8')
            
            # 更新统计
            stats['success'] += 1
            stats['by_year'][year] = stats['by_year'].get(year, 0) + 1
            stats['by_type'][poem_type] = stats['by_type'].get(poem_type, 0) + 1
            
            print(f"  ✓ {md_file.name} -> {output_file.relative_to(output_path)}")
            
        except Exception as e:
            print(f"  ✗ 处理失败 {md_file.name}: {e}")
    
    # 输出统计
    print("\n" + "=" * 50)
    print(f"处理完成！成功: {stats['success']}/{stats['total']}")
    print(f"\n按年份统计:")
    for year in sorted(stats['by_year'].keys()):
        print(f"  {year}: {stats['by_year'][year]} 首")
    print(f"\n按类型统计:")
    for ptype, count in stats['by_type'].items():
        print(f"  {ptype}: {count} 篇")
    print(f"\n输出目录: {output_path.absolute()}")
    
    return stats


def main():
    parser = argparse.ArgumentParser(
        description='海子诗歌整理工具 - 转换frontmatter并按年份整理',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog='''
示例:
  python organize_poems.py ./haizi_poems
  python organize_poems.py ./haizi_poems -o ./organized_poems

输出结构:
  organized_poems/
  ├── 1983/           # 1983年短诗
  ├── 1984/           # 1984年短诗
  ├── 1985/           # 1985年短诗
  ├── 1986/           # 1986年短诗
  ├── 1987/           # 1987年短诗
  ├── 1988/           # 1988年短诗
  ├── 1989/           # 1989年短诗
  ├── unknown/        # 日期不明的短诗
  ├── long_poems/     # 长诗
  ├── sun_seven_books/# 太阳七部书
  └── essays/         # 文论

新的 frontmatter 格式:
  ---
  title: "诗歌标题"
  type: "short"
  year: "1985"
  tags: ["短诗", "1985"]
  order: 5
  ---
'''
    )
    parser.add_argument('input_dir', help='输入目录（爬虫生成的 haizi_poems 文件夹）')
    parser.add_argument('-o', '--output', help='输出目录（默认为 input_dir_organized）')
    
    args = parser.parse_args()
    
    input_path = Path(args.input_dir)
    if not input_path.exists():
        print(f"错误: 输入目录不存在: {input_path}")
        return 1
    
    process_poems(args.input_dir, args.output)
    return 0


if __name__ == "__main__":
    exit(main())
