import Link from 'next/link'

type PersonalDataConsentProps = {
  checked: boolean
  onChange: (checked: boolean) => void
  id?: string
}

export default function PersonalDataConsent({
  checked,
  onChange,
  id = 'personal-data-consent',
}: PersonalDataConsentProps) {
  return (
    <label htmlFor={id} className="flex items-start gap-2.5 text-left text-xs leading-relaxed text-[#232326]/75 sm:text-sm">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        required
        className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300 text-[#E62614] focus:ring-[#E62614]/40"
      />
      <span>
        Я соглашаюсь с{' '}
        <Link href="/legal/personal-data" className="text-[#E62614] hover:underline" target="_blank">
          политикой обработки персональных данных
        </Link>{' '}
        и{' '}
        <Link href="/legal/privacy" className="text-[#E62614] hover:underline" target="_blank">
          политикой конфиденциальности
        </Link>
      </span>
    </label>
  )
}
