import { toArray } from './collections'

export function getUserRoles(user) {
  const roleValues = [
    ...toArray(user?.roles),
    ...toArray(user?.role),
    ...toArray(user?.roleName),
  ]

  return roleValues
    .map((role) => role?.name || role?.roleName || role?.code || role)
    .filter(Boolean)
    .map((role) => String(role).toUpperCase())
}

export function hasAnyRole(user, allowedRoles) {
  const roles = getUserRoles(user)
  return allowedRoles.some((role) => roles.includes(role))
}

export function isFarmer(user) {
  return hasAnyRole(user, ['AGRICULTOR'])
}
