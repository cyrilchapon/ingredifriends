import cheerio from 'cheerio'
import { MarmitonSearchResult } from './marmiton-types'

const getPageDataFromPageHtml = (html: string) => {
  const $ = cheerio.load(html)

  const rawPageData = $("script#__NEXT_DATA__").html()

  if (rawPageData != null) {
    const pageData = JSON.parse(rawPageData)
    return pageData.props.pageProps.searchResults as MarmitonSearchResult
  } else {
    throw new Error('script __NEXT_DATA__ not found')
  }
}

export {
  getPageDataFromPageHtml
}
