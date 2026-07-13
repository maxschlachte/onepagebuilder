## 1. Badge component

- [x] 1.1 Create `src/components/Badge.vue`: a `variant` prop (`'hero' | 'psyker' | 'group' | 'combined' | 'attached'`), an internal variant→class lookup copied verbatim from each badge's current inline classes (per design.md), rendering `<span class="rounded px-1 text-xs" :class="variantClasses[variant]"><slot /></span>`.

## 2. Use it in BuilderView.vue

- [x] 2.1 Import `Badge` in `src/views/BuilderView.vue` and replace the Hero span (`v-if="unit.isHero"`) with `<Badge variant="hero" class="ml-1">Hero</Badge>`.
- [x] 2.2 Replace the Psyker span (`v-else-if="unit.specialRules.some(...)"`) with `<Badge variant="psyker" class="ml-1">Psyker</Badge>`.
- [x] 2.3 Replace the Group span with `<Badge variant="group">Group</Badge>`.
- [x] 2.4 Replace the Combined span with `<Badge variant="combined">Combined</Badge>`.
- [x] 2.5 Replace the Attached span with `<Badge variant="attached">Attached</Badge>`.

## 3. Verify

- [x] 3.1 Run `vue-tsc --noEmit` and the full test suite (`npm run test`).
- [x] 3.2 In a live browser, confirm all five badges (Hero, Psyker, Group, Combined, Attached) render pixel-identical to before — same colors, same spacing — in both light and dark mode.
