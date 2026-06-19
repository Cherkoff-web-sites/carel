'use client'

import { useEffect, useState } from 'react'
import {
  findCatalogNodeById,
  getCatalogAncestorIds,
  type CatalogTreeNode,
} from '@/lib/catalogData'

type AdminTreeProps = {
  tree: CatalogTreeNode[]
  activeId: string
  onSelect: (id: string) => void
  title?: string
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      className={`h-3.5 w-3.5 shrink-0 text-[#232326]/50 transition-transform ${open ? 'rotate-180' : ''}`}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
    >
      <path
        d="M4 6L8 10L12 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
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
            className="mr-1 flex h-6 w-6 items-center justify-center rounded hover:bg-gray-100"
            aria-label={isExpanded ? 'Свернуть' : 'Развернуть'}
          >
            <Chevron open={isExpanded} />
          </button>
        ) : (
          <span className="mr-1 w-6" />
        )}
        <button
          type="button"
          onClick={() => onSelect(node.id)}
          className={`min-w-0 flex-1 truncate rounded-md px-2 py-1.5 text-left text-sm transition-colors ${
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

  const activeLabel = findCatalogNodeById(tree, activeId)?.label

  return (
    <div className="flex h-full flex-col border-r border-gray-200 bg-white">
      <div className="border-b border-gray-200 px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#232326]/50">{title}</p>
        {activeLabel ? (
          <p className="mt-1 truncate text-sm font-medium text-[#232326]">{activeLabel}</p>
        ) : null}
      </div>
      <div className="flex-1 overflow-y-auto py-2">
        <ul>
          <li>
            <button
              type="button"
              onClick={() => onSelect('all')}
              className={`mx-2 block w-[calc(100%-16px)] rounded-md px-2 py-1.5 text-left text-sm ${
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
              onSelect={onSelect}
            />
          ))}
        </ul>
      </div>
    </div>
  )
}
