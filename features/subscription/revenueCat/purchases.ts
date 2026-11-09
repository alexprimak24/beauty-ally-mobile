import type { CustomerInfo, PurchasesPackage } from 'react-native-purchases'
import Purchases, { PURCHASES_ERROR_CODE } from 'react-native-purchases'

export function isRevenueCatPurchaseCancelled(error: unknown): boolean {
  if (typeof error !== 'object' || error === null) return false

  const userCancelled = 'userCancelled' in error && error.userCancelled === true
  const code = 'code' in error ? error.code : undefined
  return userCancelled || code === PURCHASES_ERROR_CODE.PURCHASE_CANCELLED_ERROR
}

export async function getRevenueCatCustomerInfo(): Promise<CustomerInfo> {
  return Purchases.getCustomerInfo()
}

export async function getRevenueCatOfferings() {
  return Purchases.getOfferings()
}

export async function purchaseRevenueCatPackage(pkg: PurchasesPackage): Promise<CustomerInfo> {
  const result = await Purchases.purchasePackage(pkg)
  return result.customerInfo
}

export async function restoreRevenueCatPurchases(): Promise<CustomerInfo> {
  return Purchases.restorePurchases()
}

export function subscribeToRevenueCatCustomerInfo(
  listener: (customerInfo: CustomerInfo) => void,
): () => void {
  Purchases.addCustomerInfoUpdateListener(listener)
  return () => Purchases.removeCustomerInfoUpdateListener(listener)
}
