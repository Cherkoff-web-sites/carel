'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import {
  findCatalogNodeById,
  getCatalogAncestorIds,
  type CatalogTreeNode,
} from '@/lib/catalogData'
import {
  catalogSidebarThumbSrc,
  hasCatalogSidebarThumb,
} from '@/lib/catalogSidebarThumbs'
import { ChevronDownIcon } from '@/components/ui/ChevronIcon'

type CatalogSidebarProps = {
  tree: CatalogTreeNode[]
  activeId: string | null
  onSelect: (id: string) => void
  showThumbnails?: boolean
  title?: string
}

function Chevron({ open }: { open: boolean }) {
  return (
    <ChevronDownIcon
      className={`h-4 w-4 text-[#232326]/60 transition-transform ${open ? 'rotate-180' : ''}`}
    />
  )
}

function SidebarThumb({ nodeId }: { nodeId: string }) {
  const [visible, setVisible] = useState(true)

  if (!hasCatalogSidebarThumb(nodeId) || !visible) {
    return null
  }

  return (
    <span className="relative ml-2 h-10 w-10 shrink-0 sm:h-11 sm:w-11">
      <Image
        src={catalogSidebarThumbSrc(nodeId)}
        alt=""
        fill
        className="object-contain object-center"
        sizes="44px"
        onError={() => setVisible(false)}
      />
    </span>
  )
}

function CatalogTreeItem({
  node,
  depth,
  parentId,
  expandedIds,
  activeId,
  onToggle,
  onSelect,
  showThumbnails,
}: {
  node: CatalogTreeNode
  depth: number
  parentId: string | null
  expandedIds: Set<string>
  activeId: string | null
  onToggle: (id: string) => void
  onSelect: (id: string) => void
  showThumbnails: boolean
}) {
  const hasChildren = Boolean(node.children?.length)
  const isExpanded = expandedIds.has(node.id)
  const isActive = activeId === node.id
  const opensSectionOnClick = depth >= 0
  const isAdiabaticLeaf = parentId === 'adiabatic' && depth === 1 && !hasChildren
  const showLeafBullet = !hasChildren && (showThumbnails ? depth >= 2 : depth >= 1)
  const paddingLeft = depth === 0 ? 0 : depth === 1 ? 12 : depth === 2 ? 28 : 40

  const labelClass = (() => {
    if (isActive) return 'font-bold text-[#E62614]'
    if (depth === 0) return 'font-bold'
    return 'font-normal'
  })()

  if (hasChildren) {
    return (
      <li className={isAdiabaticLeaf ? 'border-b border-[#232326]/10 last:border-b-0' : undefined}>
        <button
          type="button"
          onClick={() => {
            onToggle(node.id)
            onSelect(node.id)
          }}
          className="flex w-full items-center gap-1 py-2.5 text-left text-sm transition-colors hover:text-[#E62614] sm:text-base"
          style={{ paddingLeft }}
          aria-expanded={isExpanded}
          aria-current={isActive ? 'true' : undefined}
        >
          <span className={`min-w-0 flex-1 ${labelClass}`}>{node.label}</span>
          {showThumbnails ? <SidebarThumb nodeId={node.id} /> : null}
          <Chevron open={isExpanded} />
        </button>
        {isExpanded ? (
          <ul className={depth === 0 ? 'space-y-0' : 'space-y-0.5 pb-1'}>
            {node.children!.map((child) => (
              <CatalogTreeItem
                key={child.id}
                node={child}
                depth={depth + 1}
                parentId={node.id}
                expandedIds={expandedIds}
                activeId={activeId}
                onToggle={onToggle}
                onSelect={onSelect}
                showThumbnails={showThumbnails}
              />
            ))}
          </ul>
        ) : null}
      </li>
    )
  }

  return (
    <li
      className={
        isAdiabaticLeaf || parentId === 'evaporative-cooling' || parentId === 'water-treatment'
          ? 'border-b border-[#232326]/10 last:border-b-0'
          : undefined
      }
    >
      <button
        type="button"
        onClick={() => onSelect(node.id)}
        className="flex w-full items-center gap-2 py-2.5 text-left text-sm transition-colors sm:text-base"
        style={{ paddingLeft }}
        aria-current={isActive ? 'true' : undefined}
      >
        {showLeafBullet ? (
          <span
            className={`shrink-0 ${isActive ? 'text-[#E62614]' : 'text-[#E62614]/80'}`}
            aria-hidden
          >
            •
          </span>
        ) : null}
        <span
          className={`min-w-0 flex-1 ${isActive ? 'font-bold text-[#E62614]' : 'font-normal text-[#232326]/90 hover:text-[#E62614]'}`}
        >
          {node.label}
        </span>
        {showThumbnails ? <SidebarThumb nodeId={node.id} /> : null}
      </button>
    </li>
  )
}

export default function CatalogSidebar({
  tree,
  activeId,
  onSelect,
  showThumbnails = true,
  title = 'Каталог',
}: CatalogSidebarProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (!activeId) return
    const ancestors = getCatalogAncestorIds(tree, activeId)
    const node = findCatalogNodeById(tree, activeId)
    setExpandedIds((prev) => {
      const next = new Set(prev)
      ancestors?.forEach((id) => next.add(id))
      if (node?.children?.length) {
        next.add(activeId)
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

  return (
    <aside className="catalog-sidebar relative isolate w-full shrink-0 lg:w-[375px] lg:self-stretch">
      <div className="relative z-10 px-4 py-6 sm:px-5 sm:py-8 lg:min-h-full">
        <h2 className="mb-5 text-lg font-medium text-[#E62614] sm:text-xl">{title}</h2>
        <ul className="space-y-0.5">
          {tree.map((node) => (
            <CatalogTreeItem
              key={node.id}
              node={node}
              depth={0}
              parentId={null}
              expandedIds={expandedIds}
              activeId={activeId}
              onToggle={handleToggle}
              onSelect={onSelect}
              showThumbnails={showThumbnails}
            />
          ))}
        </ul>
      </div>
    </aside>
  )
}
