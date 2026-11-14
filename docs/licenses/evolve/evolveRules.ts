// SPDX-License-Identifier: MPL-2.0
// Adapted from Evolve, Peter Motschmann and contributors.
// Commit 3436358dcd03d9f9e071d51ea071e0a78c0322e4:
// src/actions.js checkTechRequirements; src/resources.js craft method.
// Changes: typed explicit inputs replace global state; no DOM, race modifiers,
// prediction queue, key multiplier, inventory mutation or output bonus.
// Corresponding source and license ship under licenses/evolve/.

export function researchAvailable(
  tech: Record<string, number>,
  requirements: Record<string, number>,
  grant: readonly [string, number],
): boolean {
  let isMet = true;
  Object.keys(requirements).forEach(function (req) {
    if (!tech[req] || tech[req] < requirements[req]) isMet = false;
  });
  if (isMet && (!tech[grant[0]] || tech[grant[0]] < grant[1])) return true;
  return false;
}

/** Inputs are validated positive recipe costs and integer requested units by the host. */
export function craftable(
  stock: Record<string, number>,
  costs: readonly { r: string; a: number }[],
  requested: number,
): number {
  let volume = Math.floor((stock[costs[0].r] ?? 0) / costs[0].a);
  for (let i = 1; i < costs.length; i++) {
    const temp = Math.floor((stock[costs[i].r] ?? 0) / costs[i].a);
    if (temp < volume) volume = temp;
  }
  if (requested < volume) volume = requested;
  return volume;
}
