import { Bank, CreditCard, Smartphone, Wallet, type Icon } from "@phosphor-icons/react"

export interface PaymentMethodMeta {
  icon: Icon
  label: string
}

export function getPaymentMethodMeta(method?: string): PaymentMethodMeta {
  const m = (method || "").toLowerCase()

  if (/(bkash|rocket|nagad|upay|mfs|mobile)/.test(m)) {
    return { icon: Smartphone, label: cleanMethodLabel(method) || "Mobile Banking" }
  }

  if (/(visa|master|amex|card|mc)/.test(m)) {
    return { icon: CreditCard, label: cleanMethodLabel(method) || "Card" }
  }

  if (/(bank|internet|netbank)/.test(m)) {
    return { icon: Bank, label: cleanMethodLabel(method) || "Bank" }
  }

  return { icon: Wallet, label: cleanMethodLabel(method) || "Payment" }
}

function cleanMethodLabel(method?: string): string | null {
  if (!method) return null

  const afterDash = method.split("-")[1]?.trim()
  if (afterDash) return afterDash

  const match = method.match(/[A-Za-z][a-z]+(?:\s+[A-Za-z][a-z]+)*/)
  return match?.[0] ?? method
}
