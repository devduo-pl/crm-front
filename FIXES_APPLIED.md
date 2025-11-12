# Fixes Applied to Invoice Module

## Issue 1: Backend GROUP BY SQL Error

### Problem
```json
{
  "statusCode": 500,
  "error": "QueryFailedError",
  "details": "column \"invoice.issueDate\" must appear in the GROUP BY clause or be used in an aggregate function"
}
```

### Root Cause
Backend SQL query issue when using `include` parameter to fetch related entities (seller, buyer).

### Frontend Fix (Temporary Workaround)
**File**: `components/pages/InvoicesPage.tsx`

**Changed:**
```typescript
// Before (causing backend error)
useInvoices({ page, limit: 10, include: "seller,buyer" })

// After (temporary workaround)
useInvoices({ page, limit: 10 })
```

### Backend Fix Required
The backend team needs to fix the SQL query generation in the invoice service. The issue is in the `GET /invoices` endpoint.

**Backend file to fix**: `src/modules/invoice/services/invoice.service.ts` (or similar)

**Solution options:**
1. Remove unnecessary `GROUP BY` clause
2. Add all selected columns to `GROUP BY` if aggregation is needed
3. Use proper TypeORM `leftJoinAndSelect` instead of manual joins

**Example fix:**
```typescript
// In invoice.service.ts (backend)
async getInvoices(queryParams: GetInvoicesDto) {
  const queryBuilder = this.invoiceRepository
    .createQueryBuilder('invoice');

  if (queryParams.include?.includes('seller')) {
    queryBuilder.leftJoinAndSelect('invoice.seller', 'seller');
  }
  
  if (queryParams.include?.includes('buyer')) {
    queryBuilder.leftJoinAndSelect('invoice.buyer', 'buyer');
  }

  // Don't use GROUP BY unless needed for aggregation
  return queryBuilder.getMany();
}
```

---

## Issue 2: TypeError - toFixed is not a function

### Problem
```
Runtime TypeError
item.unitNetPrice.toFixed is not a function
```

### Root Cause
Backend returns numeric fields as strings instead of numbers. This is common with JSON APIs and some ORMs.

### Frontend Fix (Permanent Solution)
**Files affected:**
- `components/pages/InvoiceViewPage.tsx`
- `components/pages/InvoicesPage.tsx`

**Changes:**
Wrapped all numeric values with `Number()` before calling `.toFixed()`:

```typescript
// Before (causes error if value is string)
{item.unitNetPrice.toFixed(2)}
{invoice.totalGross.toFixed(2)}

// After (works with both strings and numbers)
{Number(item.unitNetPrice).toFixed(2)}
{Number(invoice.totalGross).toFixed(2)}
```

### Specific Changes Made

#### InvoiceViewPage.tsx
- ✅ Fixed invoice items table (quantity, unitNetPrice, vatRate, netAmount, vatAmount, grossAmount)
- ✅ Fixed totals footer (totalNet, totalVat, totalGross)
- ✅ Fixed payment amounts
- ✅ Fixed totalPaid and remainingAmount

#### InvoicesPage.tsx
- ✅ Fixed totalGross display in table

### New Utility Functions
Created `lib/number-utils.ts` with helper functions for future use:

```typescript
import { formatNumber, formatCurrency, formatPercentage, toNumber } from '@/lib/number-utils';

// Usage examples:
formatNumber(item.unitNetPrice, 2)        // "150.00"
formatCurrency(invoice.totalGross, 'PLN') // "1845.00 PLN"
formatPercentage(item.vatRate, 0)         // "23%"
toNumber(item.quantity)                   // 100
```

---

## Why This Happens

### Backend Perspective
Some databases (PostgreSQL with certain drivers) and ORMs (TypeORM with specific configurations) serialize `decimal` and `numeric` columns as strings to preserve precision.

### Frontend Perspective
TypeScript types don't match runtime values when backend sends strings for numeric fields.

### Long-term Solutions

#### Option 1: Frontend Type Guards (Implemented)
Convert strings to numbers when displaying:
```typescript
Number(value).toFixed(2)
```

**Pros:**
- ✅ Works immediately
- ✅ Handles inconsistent APIs
- ✅ No backend changes needed

**Cons:**
- ⚠️ Need to remember to convert everywhere
- ⚠️ Runtime type mismatch

#### Option 2: Backend Configuration (Recommended for Backend Team)
Configure TypeORM to return numbers:

```typescript
// In TypeORM entity
@Column('decimal', { precision: 10, scale: 2, transformer: {
  to: (value: number) => value,
  from: (value: string) => parseFloat(value)
}})
unitNetPrice: number;
```

**Pros:**
- ✅ Type-safe across the stack
- ✅ Frontend code cleaner
- ✅ Consistent data types

**Cons:**
- ⚠️ Requires backend changes
- ⚠️ May affect other parts of backend

#### Option 3: API Response Transformer
Transform API responses in frontend API client:

```typescript
// In api-client-proxy.ts
function transformInvoiceResponse(data: any) {
  return {
    ...data,
    totalNet: Number(data.totalNet),
    totalVat: Number(data.totalVat),
    totalGross: Number(data.totalGross),
    items: data.items?.map(item => ({
      ...item,
      quantity: Number(item.quantity),
      unitNetPrice: Number(item.unitNetPrice),
      // ... etc
    }))
  };
}
```

**Pros:**
- ✅ Centralized conversion
- ✅ Type-safe in components
- ✅ Single source of truth

**Cons:**
- ⚠️ Requires maintenance when API changes
- ⚠️ More complex API client

---

## Testing Checklist

### Verify These Work Now:
- ✅ Invoice list page loads without errors
- ✅ Invoice detail page displays all numbers correctly
- ✅ Creating new invoices works
- ✅ Viewing invoice items table shows proper formatting
- ✅ Payment amounts display correctly
- ✅ Totals (net, VAT, gross) show with 2 decimals
- ✅ VAT rates show without decimals (23%, not 23.00%)
- ✅ Quantities display as whole numbers when appropriate

### Test Cases:
1. **Create invoice with multiple items**
   - Navigate to `/invoices/create`
   - Add 2-3 items with different VAT rates
   - Verify totals calculate correctly
   - Submit and view created invoice

2. **View invoice details**
   - Open any invoice
   - Verify all numbers display correctly
   - Check items table formatting
   - Check totals section

3. **Record payment**
   - Open unpaid invoice
   - Click "Record Payment"
   - Enter payment details
   - Verify payment shows in list
   - Verify status updates

---

## Summary

✅ **Fixed**: TypeError with `.toFixed()` by wrapping numeric values with `Number()`
✅ **Workaround**: Removed `include` parameter to avoid backend GROUP BY error
✅ **Created**: Utility functions for number formatting (`lib/number-utils.ts`)
⏳ **Backend Action Required**: Fix GROUP BY SQL query issue

The invoice module should now work correctly! 🚀

