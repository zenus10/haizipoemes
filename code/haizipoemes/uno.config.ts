import { defineConfig, presetUno } from 'unocss'
import { presetTypography } from '@unocss/preset-typography'

export default defineConfig({
  presets: [
    presetUno(),
    presetTypography({
      selectorName: 'prose',
      cssExtend: {
        // 去掉默认的 max-width 限制，由父容器控制宽度
        'max-width': 'none',
        // 中文标题优化
        'h1,h2,h3,h4': {
          'font-family': 'var(--fontDisplay)',
          'letter-spacing': '0.05em',
        },
        // 中文不用斜体引用
        'blockquote': {
          'font-style': 'normal',
          'border-inline-start-color': 'var(--colorPrimary)',
        },
        // 去掉西文引号装饰
        'blockquote p:first-of-type::before': { 'content': 'none' },
        'blockquote p:last-of-type::after': { 'content': 'none' },
        // 链接颜色
        'a': {
          'color': 'var(--colorPrimary)',
          'text-decoration-color': 'var(--colorPrimary)',
        },
        'hr': {
          'border-color': 'var(--colorBorder)',
        },
      },
    }),
  ],
})
