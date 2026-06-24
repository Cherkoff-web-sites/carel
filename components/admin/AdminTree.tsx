'use client'

import { useEffect, useState } from 'react'
import {
  findCatalogNodeById,
  getCatalogAncestorIds,
  type CatalogTreeNode,
} from '@/lib/catalogData'
import { ChevronDownIcon } from '@/components/ui/ChevronIcon'

type AdminTreeProps = {
  tree: CatalogTreeNode[]
  activeId: string
  onSelect: (id: string) => void
  title?: string
}

function Chevron({ open }: { open: boolean }) {
  return (
    <ChevronDownIcon
      className={`h-3.5 w-3.5 shrink-0 text-[#232326]/50 transition-transform ${open ? 'rotate-180' : ''}`}
    />
  )
}

function TreeItem({
  node,
  depth,
  expandedIds,
  activeId,
  onToggle,
  onSelect,
}: {
  node: CatalogTreeNode
  depth: number
  expandedIds: Set<string>
  activeId: string
  onToggle: (id: string) => void
  onSelect: (id: string) => void
}) {
  const hasChildren = Boolean(node.children?.length)
  const isExpanded = expandedIds.has(node.id)
  const isActive = activeId === node.id

  const handleSelect = () => {
    onSelect(node.id)
  }

  return (
    <li>
      <div
        className="flex items-center"
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
      >
        {hasChildren ? (
          <button
            type="button"
            onClick={() => onToggle(node.id)}
            className="mr-1 flex h-8 w-8 items-center justify-center rounded hover:bg-gray-100"
            aria-label={isExpanded ? 'Свернуть' : 'Развернуть'}
          >
            <Chevron open={isExpanded} />
          </button>
        ) : (
          <span className="mr-1 w-8" />
        )}
        <button
          type="button"
          onClick={handleSelect}
          className={`min-w-0 flex-1 truncate rounded-md px-2 py-2 text-left text-sm transition-colors ${
            isActive
              ? 'bg-[#E62614]/10 font-semibold text-[#E62614]'
              : 'text-[#232326]/85 hover:bg-gray-100'
          }`}
        >
          {node.label}
        </button>
      </div>
      {hasChildren && isExpanded ? (
        <ul>
          {node.children!.map((child) => (
            <TreeItem
              key={child.id}
              node={child}
              depth={depth + 1}
              expandedIds={expandedIds}
              activeId={activeId}
              onToggle={onToggle}
              onSelect={onSelect}
            />
          ))}
        </ul>
      ) : null}
    </li>
  )
}

export default function AdminTree({ tree, activeId, onSelect, title = 'Дерево каталога' }: AdminTreeProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => new Set())
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const ancestors = getCatalogAncestorIds(tree, activeId) ?? []
    setExpandedIds((prev) => {
      const next = new Set(prev)
      for (const id of ancestors) {
        next.add(id)
      }
      return next
    })
  }, [activeId, tree])

  const handleToggle = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const handleSelect = (id: string) => {
    onSelect(id)
    setMobileOpen(false)
  }

  const activeLabel =
    activeId === 'all' ? 'Все товары' : findCatalogNodeById(tree, activeId)?.label

  return (
    <div className="flex shrink-0 flex-col border-b border-gray-200 bg-white lg:h-full lg:border-b-0 lg:border-r">
      <button
        type="button"
        onClick={() => setMobileOpen((open) => !open)}
        className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left lg:pointer-events-none lg:cursor-default"
        aria-expanded={mobileOpen}
      >
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#232326]/50">{title}</p>
          {activeLabel ? (
            <p className="mt-1 truncate text-sm font-medium text-[#232326]">{activeLabel}</p>
          ) : null}
        </div>
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-gray-200 lg:hidden">
          <Chevron open={mobileOpen} />
        </span>
      </button>

      <div
        className={`overflow-y-auto py-2 transition-[max-height] duration-200 lg:max-h-none lg:flex-1 ${
          mobileOpen ? 'max-h-[45vh]' : 'max-h-0 lg:max-h-none'
        }`}
      >
        <ul>
          <li>
            <button
              type="button"
              onClick={() => handleSelect('all')}
              className={`mx-2 block w-[calc(100%-16px)] rounded-md px-2 py-2 text-left text-sm ${
                activeId === 'all'
                  ? 'bg-[#E62614]/10 font-semibold text-[#E62614]'
                  : 'text-[#232326]/85 hover:bg-gray-100'
              }`}
            >
              Все товары
            </button>
          </li>
          {tree.map((node) => (
            <TreeItem
              key={node.id}
              node={node}
              depth={0}
              expandedIds={expandedIds}
              activeId={activeId}
              onToggle={handleToggle}
              onSelect={handleSelect}
            />
          ))}
        </ul>
      </div>
    </div>
  )
}
