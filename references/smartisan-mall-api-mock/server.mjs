import http from 'node:http'

const port = Number(process.env.PORT || 3333)
const origin = `http://127.0.0.1:${port}`

const products = [
  {
    productId: '1001001',
    productName: 'Smartisan T2',
    sub_title: '漂亮得不像实力派',
    salePrice: 2499,
    productImageBig: `${origin}/mock-assets/product-t2.svg`,
  },
  {
    productId: '1001002',
    productName: '坚果 Pro',
    sub_title: '圆滑当道时代的锐丽异类',
    salePrice: 1799,
    productImageBig: `${origin}/mock-assets/product-jianguopro.svg`,
  },
  {
    productId: '1001003',
    productName: 'Smartisan M1',
    sub_title: '性能强劲，细节精致',
    salePrice: 2999,
    productImageBig: `${origin}/mock-assets/product-m1.svg`,
  },
  {
    productId: '1001004',
    productName: '畅呼吸智能空气净化器',
    sub_title: '专业、强劲、安静',
    salePrice: 3499,
    productImageBig: `${origin}/mock-assets/product-purifier.svg`,
  },
]

const floorImage = `${origin}/mock-assets/floor.svg`

function json(res, payload) {
  const body = JSON.stringify(payload)
  res.writeHead(200, {
    'content-type': 'application/json; charset=utf-8',
    'access-control-allow-origin': '*',
    'access-control-allow-methods': 'GET,POST,OPTIONS',
    'access-control-allow-headers': '*',
  })
  res.end(body)
}

function normalize(pathname) {
  return pathname.startsWith('/api/') ? pathname.slice(4) : pathname
}

function escapeXml(text) {
  return text.replace(/[&<>"']/g, (char) => {
    if (char === '&') return '&amp;'
    if (char === '<') return '&lt;'
    if (char === '>') return '&gt;'
    if (char === '"') return '&quot;'
    return '&apos;'
  })
}

function productSvg(title, subtitle, kind) {
  const isPurifier = kind === 'purifier'
  const device = isPurifier
    ? '<rect x="145" y="74" width="110" height="148" rx="18" fill="#f8f8f6" stroke="#cfc9bf" stroke-width="3"/><rect x="165" y="96" width="70" height="8" rx="4" fill="#d8d3cb"/><circle cx="200" cy="177" r="26" fill="none" stroke="#d8d3cb" stroke-width="5"/><circle cx="200" cy="177" r="7" fill="#bbb4aa"/>'
    : '<rect x="158" y="58" width="84" height="166" rx="18" fill="#f7f5ef" stroke="#c8c0b4" stroke-width="4"/><rect x="171" y="78" width="58" height="116" rx="5" fill="#ebe7df"/><circle cx="200" cy="207" r="8" fill="#d6d0c6"/>'

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300" role="img" aria-label="${escapeXml(title)}">
  <rect width="400" height="300" fill="#fbfaf7"/>
  <rect x="38" y="34" width="324" height="232" rx="18" fill="#f4f1ea" stroke="#ded8cf"/>
  ${device}
  <text x="200" y="252" text-anchor="middle" font-family="-apple-system,BlinkMacSystemFont,'Helvetica Neue',Arial,sans-serif" font-size="21" fill="#333">${escapeXml(title)}</text>
  <text x="200" y="276" text-anchor="middle" font-family="-apple-system,BlinkMacSystemFont,'Helvetica Neue',Arial,sans-serif" font-size="13" fill="#8a8176">${escapeXml(subtitle)}</text>
</svg>`
}

function floorSvg() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1120" height="460" viewBox="0 0 1120 460" role="img" aria-label="Smartisan floor image">
  <rect width="1120" height="460" fill="#f6f3ec"/>
  <rect x="90" y="70" width="940" height="320" rx="28" fill="#ebe5da" stroke="#d6cec1"/>
  <text x="560" y="210" text-anchor="middle" font-family="-apple-system,BlinkMacSystemFont,'Helvetica Neue',Arial,sans-serif" font-size="46" fill="#34302c">Smartisan</text>
  <text x="560" y="265" text-anchor="middle" font-family="-apple-system,BlinkMacSystemFont,'Helvetica Neue',Arial,sans-serif" font-size="22" fill="#7a7166">原始接口图片已失效，本地 mock 仅用于恢复页面观感</text>
</svg>`
}

function svg(res, body) {
  res.writeHead(200, {
    'content-type': 'image/svg+xml; charset=utf-8',
    'access-control-allow-origin': '*',
  })
  res.end(body)
}

function route(pathname) {
  const path = normalize(pathname)

  if (path === '/users/userInfo') return { status: '1', result: null, message: 'not login' }
  if (path === '/goods/productHome') {
    return {
      status: '0',
      result: {
        home_hot: products,
        home_floors: [
          { title: '官方精选', image: { image: floorImage }, tabs: products },
          { title: '品牌周边', image: { image: floorImage }, tabs: products.slice().reverse() },
        ],
      },
    }
  }
  if (path === '/goods/computer') return { status: '0', result: { list: products, total: products.length } }
  if (path === '/goods/productDet') return { status: '0', result: products[0] }
  if (path.includes('/cart')) return { status: '0', result: [] }
  if (path.includes('/address')) return { status: '0', result: [] }
  if (path.includes('/order')) return { status: '0', result: [] }
  if (path.includes('/login') || path.includes('/register') || path.includes('/upload')) {
    return { status: '1', result: null, message: 'mock only' }
  }

  return { status: '0', result: null }
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`)
  if (req.method === 'OPTIONS') return json(res, {})
  if (url.pathname === '/mock-assets/product-t2.svg') return svg(res, productSvg('Smartisan T2', '漂亮得不像实力派', 'phone'))
  if (url.pathname === '/mock-assets/product-jianguopro.svg') return svg(res, productSvg('坚果 Pro', '圆滑当道时代的锐丽异类', 'phone'))
  if (url.pathname === '/mock-assets/product-m1.svg') return svg(res, productSvg('Smartisan M1', '性能强劲，细节精致', 'phone'))
  if (url.pathname === '/mock-assets/product-purifier.svg') return svg(res, productSvg('畅呼吸智能空气净化器', '专业、强劲、安静', 'purifier'))
  if (url.pathname === '/mock-assets/floor.svg') return svg(res, floorSvg())
  json(res, route(url.pathname))
})

server.listen(port, '127.0.0.1', () => {
  console.log(`smartisan mall mock api listening at http://127.0.0.1:${port}`)
})
