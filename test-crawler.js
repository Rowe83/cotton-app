// Simple test script to verify crawler logic
const cheerio = require('cheerio')

// Mock HTML content based on search results
const mockCottonChinaHTML = `
<html>
<head><title>中国棉花信息网</title></head>
<body>
<table>
<tr>
<td>CC Index 3128B</td>
<td>14896</td>
<td>+5</td>
<td>10000</td>
</tr>
<tr>
<td>CC Index 2227B</td>
<td>13017</td>
<td>-1</td>
<td>8000</td>
</tr>
<tr>
<td>新疆棉花</td>
<td>1582</td>
<td>+0.15%</td>
<td>1200</td>
</tr>
</table>
</body>
</html>
`

const mockCNCottonHTML = `
<html>
<body>
<div class="news-list">
<li><a href="/news/1">新疆棉花收购价持续走强，市场信心得到提振</a></li>
<li><a href="/news/2">国际棉价波澜壮阔，国内外市场联动现象明显</a></li>
<li><a href="/news/3">农业部发布最新棉花补贴政策解读</a></li>
</div>
</body>
</html>
`

function testCottonChinaParsing() {
  console.log('Testing Cotton China parsing...')
  const $ = cheerio.load(mockCottonChinaHTML)
  const prices = []

  $('table tr').each((index, element) => {
    if (index === 0) return // Skip header

    const cells = $(element).find('td')
    if (cells.length >= 3) {
      const varietyName = $(cells[0]).text().trim()
      const priceText = $(cells[1]).text().trim()
      const changeText = $(cells[2]).text().trim()

      const price = parseFloat(priceText) / 100 // Convert from cents
      const isPositive = changeText.includes('+')

      console.log(`Found: ${varietyName} - ${price} - ${changeText}`)

      prices.push({
        variety_name: varietyName,
        price,
        change: changeText,
        is_positive: isPositive
      })
    }
  })

  return prices
}

function testCNCottonParsing() {
  console.log('Testing CNCotton parsing...')
  const $ = cheerio.load(mockCNCottonHTML)
  const news = []

  $('.news-list li').each((index, element) => {
    const title = $(element).find('a').text().trim()
    const link = $(element).find('a').attr('href')

    if (title) {
      console.log(`Found news: ${title}`)
      news.push({
        title,
        link
      })
    }
  })

  return news
}

console.log('=== Crawler Logic Test ===')
const prices = testCottonChinaParsing()
console.log('Parsed prices:', prices.length)

const news = testCNCottonParsing()
console.log('Parsed news:', news.length)

console.log('=== Test Complete ===')
