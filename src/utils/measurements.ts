import type { Preferences } from '../types'

export type UnitSystem = Preferences['units']

const round = (value: number, digits: number) => Number(value.toFixed(digits))

export function rainValue(mm: number, units: UnitSystem): number {
  return units === 'imperial' ? round(mm / 25.4, 2) : round(mm, 1)
}

export function levelValue(metres: number, units: UnitSystem): number {
  return units === 'imperial' ? round(metres * 3.28084, 2) : round(metres, 2)
}

export function rainUnit(units: UnitSystem): string { return units === 'imperial' ? 'in' : 'mm' }
export function levelUnit(units: UnitSystem): string { return units === 'imperial' ? 'ft' : 'm' }
