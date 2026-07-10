<script setup lang="ts">
import { computed } from 'vue'
import { useListsStore } from '../stores/lists'
import { affectsAllModels, isSectionAvailable, maxPicks } from '../domain/calc'
import { createResolver } from '../domain/resolve'
import { rulesDatabase } from '../data/index'
import RuleTooltip from './RuleTooltip.vue'
import type { ListUnit } from '../domain/list'
import type { Faction, RuleRef, UnitProfile, UpgradeOption, UpgradeSection } from '../domain/types'

const props = defineProps<{
  /** Omit both `listId` and `listUnit` for a read-only catalog listing (e.g. a
   * roster unit's available upgrades before it's added) — no checkboxes, no
   * selection/prerequisite state. */
  listId?: string
  profile: UnitProfile
  listUnit?: ListUnit
  faction: Faction
  /** When set, only options matching this class are shown — used to split a
   * combined pair's shared whole-unit controls from its per-entry panels. */
  filter?: 'whole' | 'perModel'
}>()
const store = useListsStore()

const readonly = computed(() => !props.listUnit)

const groups = () => props.faction.upgradeGroups.filter((g) => props.profile.upgradeGroups.includes(g.id))

function optionsFor(section: UpgradeSection) {
  if (!props.filter) return section.options
  const whole = affectsAllModels(section)
  return props.filter === 'whole' ? (whole ? section.options : []) : whole ? [] : section.options
}

function hasVisibleContent(group: Faction['upgradeGroups'][number]): boolean {
  return group.sections.some((s) => optionsFor(s).length > 0)
}

function isSectionUnavailable(section: UpgradeSection): boolean {
  if (readonly.value) return false
  return !isSectionAvailable(props.profile, section, props.listUnit!.selectedUpgrades)
}

/**
 * True when this option can't currently be selected: either its whole section
 * is unavailable per a cross-section prerequisite, or its capped section's
 * selection limit is reached and this option isn't already selected. "one"
 * sections are never disabled by the cap — clicking an unselected option
 * there swaps the selection via `toggleUpgrade` instead of requiring the
 * current one to be unchecked first.
 */
function isOptionDisabled(section: UpgradeSection, optionId: string): boolean {
  if (readonly.value) return false
  if (isSectionUnavailable(section)) return true
  if (section.selection === 'one') return false
  if (props.listUnit!.selectedUpgrades.includes(optionId)) return false
  const siblingIds = new Set(section.options.map((o) => o.id))
  const selectedCount = props.listUnit!.selectedUpgrades.filter((o) => siblingIds.has(o)).length
  return selectedCount >= maxPicks(section.selection)
}

const resolver = createResolver(rulesDatabase, props.faction)

/**
 * If `option`'s label names one of its granted rules — the whole label, or
 * the text before a trailing " (" parenthetical — returns the matching rule
 * ref plus the label split into a tooltip-able prefix and a plain suffix;
 * otherwise `tooltip` is undefined and the whole label renders as plain text
 * (design.md decision 3 of builder-roster-preview-and-army-rules).
 */
function labelTooltip(option: UpgradeOption): { tooltip?: RuleRef; prefix: string; suffix: string } {
  const parenIdx = option.label.indexOf(' (')
  const prefix = parenIdx === -1 ? option.label : option.label.slice(0, parenIdx)
  const suffix = parenIdx === -1 ? '' : option.label.slice(parenIdx)
  const tooltip = option.effects?.addRules?.find((r) => resolver.resolve(r).name === prefix)
  return { tooltip, prefix, suffix }
}

function labelsFor(optionIds: string[]): string[] {
  const options = props.faction.upgradeGroups.flatMap((g) => g.sections.flatMap((s) => s.options))
  return optionIds.map((id) => options.find((o) => o.id === id)?.label ?? id)
}

/** Short explanation for why a currently-unavailable section is locked, or undefined if it's available. */
function unavailableReason(section: UpgradeSection): string | undefined {
  const prereq = section.prerequisite
  if (!prereq) return undefined
  const selected = new Set(props.listUnit!.selectedUpgrades)

  if (prereq.requiresOneOfSelected?.length && !prereq.requiresOneOfSelected.some((id) => selected.has(id))) {
    return `Requires: ${labelsFor(prereq.requiresOneOfSelected).join(' or ')}`
  }

  const blockingId =
    prereq.blockedBySelecting?.find((id) => selected.has(id)) ??
    (props.profile.size === 1
      ? prereq.blockedBySelectingOnSingleModel?.find((id) => selected.has(id))
      : undefined)
  if (blockingId) return `Unavailable — ${labelsFor([blockingId])[0]} selected`
  return undefined
}
</script>

<template>
  <div
    v-for="group in groups().filter(hasVisibleContent)"
    :key="group.id"
    class="mt-2 border-t border-gray-100 pt-2 dark:border-gray-800"
  >
    <div v-for="(section, sIdx) in group.sections" :key="sIdx" class="mb-1">
      <template v-if="optionsFor(section).length">
        <div class="text-xs font-semibold text-gray-500">{{ group.id }}. {{ section.title }}</div>
        <div v-if="isSectionUnavailable(section)" class="text-xs italic text-gray-400">
          {{ unavailableReason(section) }}
        </div>
        <label
          v-for="opt in optionsFor(section)"
          :key="opt.id"
          class="flex items-center gap-2 text-sm"
          :class="readonly ? '' : isOptionDisabled(section, opt.id) ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'"
        >
          <input
            v-if="!readonly"
            type="checkbox"
            class="h-4 w-4"
            :checked="listUnit!.selectedUpgrades.includes(opt.id)"
            :disabled="isOptionDisabled(section, opt.id)"
            @change="store.toggleUpgrade(listId!, listUnit!.instanceId, opt.id)"
          />
          <span>
            <template v-if="labelTooltip(opt).tooltip">
              <RuleTooltip :ref-data="labelTooltip(opt).tooltip!" :faction="faction" />{{ labelTooltip(opt).suffix }}
            </template>
            <template v-else>{{ opt.label }}</template>
          </span>
          <span class="text-gray-500">{{ opt.costDelta === 0 ? 'Free' : `+${opt.costDelta}pts` }}</span>
        </label>
      </template>
    </div>
  </div>
</template>
