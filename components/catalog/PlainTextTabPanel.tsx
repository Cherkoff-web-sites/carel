'use client'

type PlainTextTabPanelProps = {
  text: string
}

export default function PlainTextTabPanel({ text }: PlainTextTabPanelProps) {
  const paragraphs = text.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean)
  if (paragraphs.length === 0) {
    return null
  }
  return (
    <div className="space-y-4">
      {paragraphs.map((paragraph, index) => (
        <p key={index} className="leading-relaxed text-[#232326]/90">
          {paragraph}
        </p>
      ))}
    </div>
  )
}
