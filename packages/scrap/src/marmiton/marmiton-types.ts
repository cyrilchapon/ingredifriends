interface MarmitonPictureUrls {
  origin: string
  originNoCrop: string
  thumb: string
}

interface MarmitonImage {
  id: number
  pictureUrls: MarmitonPictureUrls
  author?: any
  creationDate: Date
  credits: string
  width: number
  height: number
  originWidth: number
  originHeight: number
  centerX: number
  centerY: number
  cropXTop: number
  cropYTop: number
  cropXBottom: number
  cropYBottom: number
  dateString: string
  picturePath: string
}

interface MarmitonHighlightenResult {
  value: string
  matchLevel: string
  matchedWords: any[]
}

interface MarmitonHighlightResult {
  title: MarmitonHighlightenResult
  dishType: MarmitonHighlightenResult
  ingredients: MarmitonHighlightenResult[]
}

interface MarmitonRecipe {
  contentType: string
  title: string
  url: string
  isOnline: boolean
  averageRating: number
  nbRating: number
  isSponsored: boolean
  isPartnered: boolean
  dishType: string
  tags: any[]
  difficulty: number
  cost: number
  duration: number
  cookingType: string
  ingredients: string[]
  isGlutenFree: boolean
  isLactoseFree: boolean
  isVegetarian: boolean
  isVegan: boolean
  isPorkFree: boolean
  isSweet: boolean
  isSalty: boolean
  hasVideo: boolean
  preparationTime: number
  cookingTime: number
  restTime: number
  isSeasonal: boolean
  nutriScore: string
  publicationDate: Date
  relevanceScore: number
  image: MarmitonImage
  imageScore: number
  indexationDate: Date
  objectID: string
  _highlightResult: MarmitonHighlightResult
}

interface MarmitonSearchResult {
  hits: MarmitonRecipe[]
  nbHits: number
  page: number
  nbPages: number
  hitsPerPage: number
  exhaustiveNbHits: boolean
  exhaustiveTypo: boolean
  query: string
  params: string
  processingTimeMS: number
}

export {
  MarmitonPictureUrls,
  MarmitonImage,
  MarmitonHighlightenResult,
  MarmitonHighlightResult,
  MarmitonRecipe,
  MarmitonSearchResult
}
