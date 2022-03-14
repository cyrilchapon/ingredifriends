// dif=4&exp=3
// dt=entree&dt=platprincipal&dt=dessert&dt=amusegueule&dt=accompagnement&dt=sauce

const marmitonDifficulty = [1, 2, 3, 4] as const
const marmitonCost = [1, 2, 3] as const
const marmitonTimeToPrepare = [15, 30, 45] as const
const marmitonDishType = [
  'platprincipal',
  'dessert',
  'amusegueule',
  'accompagnement',
  'sauce'
] as const

type MarmitonDifficulty = typeof marmitonDifficulty[number]
type MarmitonCost = typeof marmitonCost[number]
type MarmitonTimeToPrepare = typeof marmitonTimeToPrepare[number]
type MarmitonDishType = typeof marmitonDishType[number]

export {
  MarmitonDifficulty,
  MarmitonCost,
  MarmitonTimeToPrepare,
  MarmitonDishType,
  marmitonDifficulty,
  marmitonCost,
  marmitonTimeToPrepare,
  marmitonDishType
}
