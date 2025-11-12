# Invoice Form Improvements - VAT Rates & Units Dropdowns

## Overview
Updated the invoice form to use dropdown selections for VAT rates and units instead of text inputs, following Polish business standards.

## Changes Made

### 1. VAT Rate Dropdown

#### Available Options:
- **23%** - Standard rate (stawka podstawowa)
- **8%** - First reduced rate (pierwsza stawka obniżona)
- **5%** - Second reduced rate (druga stawka obniżona)
- **0%** - Zero-rated (stawka 0%)
- **NP** - Not applicable (nie podlega) - 0% with exemption reason
- **ZW** - Exempt (zwolniona) - 0% with exemption reason
- **Custom** - User can enter custom VAT rate

#### Special Handling:
- **NP/ZW Selection**: When selected, VAT rate is set to 0% and a text field appears for entering the exemption reason
- **Custom Option**: Shows additional number input field for entering custom VAT percentage (0-100%)
- **Standard Rates**: Directly sets the VAT rate to the selected percentage

### 2. Unit Dropdown

#### Available Options:
Common Polish units:
- **szt** - Sztuki (Pieces)
- **godz** - Godziny (Hours)
- **kg** - Kilogramy (Kilograms)
- **g** - Gramy (Grams)
- **t** - Tony (Tonnes)
- **l** - Litry (Liters)
- **m** - Metry (Meters)
- **m²** - Metry kwadratowe (Square meters)
- **m³** - Metry sześcienne (Cubic meters)
- **km** - Kilometry (Kilometers)
- **mb** - Metry bieżące (Running meters)
- **kpl** - Komplet (Set)
- **opak** - Opakowanie (Package)
- **Custom** - User can enter custom unit

#### Special Handling:
- **Custom Option**: Shows additional text input field for entering custom unit name
- **Standard Units**: Directly sets the unit code (e.g., "szt", "godz")

### 3. PKWiU Code Field

Added optional PKWiU (Polish Classification of Products and Services) field:
- Displays next to item description
- Optional field for statistical and tax purposes
- Common in Polish invoicing

### 4. Enhanced Invoice View

Updated invoice detail view to properly display:
- **PKWiU codes** (shown below item description in small text)
- **VAT exemption reasons** (for NP/ZW cases)
- **Special VAT indicators** (shows "NP" or "ZW" instead of "0%" in VAT column)

## Files Modified

### Translation Files
- `messages/en.json` - Added English translations
- `messages/pl.json` - Added Polish translations

New translation keys:
```json
{
  "invoices": {
    "vatRates": { "23", "8", "5", "0", "np", "zw", "custom" },
    "units": { "szt", "godz", "kg", ... "custom" },
    "customVatRate": "...",
    "customUnit": "...",
    "vatExemptionReason": "...",
    "enterVatExemptionReason": "..."
  }
}
```

### Component Files
- `components/organisms/InvoiceForm.tsx` - Updated form with dropdowns
- `components/pages/InvoiceViewPage.tsx` - Enhanced display

## User Experience

### Creating Invoice Item

1. **Standard VAT Rate Flow**:
   - User selects from dropdown (e.g., "23% - Standard rate")
   - VAT rate is automatically set to 23%
   - Form calculates amounts automatically

2. **Exempt/Not Applicable Flow**:
   - User selects "NP - Not applicable" or "ZW - Exempt"
   - VAT rate is set to 0%
   - Additional field appears for exemption reason
   - User enters legal basis for exemption (e.g., "Art. 43 ust. 1 pkt 1 ustawy o VAT")

3. **Custom VAT Rate Flow**:
   - User selects "Custom rate"
   - Number input field appears
   - User enters custom percentage (e.g., 15%)
   - Form uses custom value for calculations

4. **Unit Selection Flow**:
   - User selects from dropdown (e.g., "szt - Sztuki")
   - Unit is automatically set to "szt"
   - OR user selects "Custom unit" and enters their own (e.g., "paczka", "dzień", etc.)

### Viewing Invoice

- Items display with full details including PKWiU codes
- VAT column shows either percentage or exemption code (NP/ZW)
- Exemption reasons are shown below item description
- All information is properly formatted and easy to read

## Benefits

### ✅ User-Friendly
- No need to remember VAT rates
- No typos in unit names
- Quick selection from common options
- Flexibility for custom values

### ✅ Compliance
- Follows Polish tax regulations
- Proper handling of exempt/zero-rated items
- Legal exemption reason tracking
- PKWiU code support

### ✅ Data Quality
- Standardized unit codes
- Consistent VAT rates
- Proper data structure for backend
- Cleaner data for reporting

### ✅ Bilingual
- Full English and Polish support
- Professional translations
- Context-appropriate labels

## Technical Implementation

### State Management
```typescript
const [customVatRates, setCustomVatRates] = useState<Record<number, boolean>>({});
const [customUnits, setCustomUnits] = useState<Record<number, boolean>>({});
```

Tracks which items are using custom values for conditional rendering.

### Event Handlers
```typescript
handleVatRateChange(index, value) // Handles VAT dropdown changes
handleUnitChange(index, value)    // Handles unit dropdown changes
handleItemChange(index, field, value) // Updates item field values
```

Smart handlers that:
- Set appropriate flags for custom mode
- Update exemption reasons for NP/ZW
- Clear custom flags when standard option selected
- Maintain form state consistency

### Data Flow
1. User selects dropdown option
2. Handler checks if "custom" selected
3. Updates state flags and form data
4. Conditional rendering shows/hides custom input
5. Form validation checks all values
6. Submit sends complete data to backend

## Backend Compatibility

The form still sends the same data structure:
```typescript
{
  description: string,
  quantity: number,
  unit: string,           // "szt" or custom value
  unitNetPrice: number,
  vatRate: number,        // 23, 8, 5, 0, or custom
  vatExemptionReason?: string, // "NP", "ZW", or custom text
  pkwiuCode?: string
}
```

No backend changes required - the API already supports all these fields!

## Testing Checklist

### Test Standard VAT Rates
- ✅ Select 23% → Verify calculations
- ✅ Select 8% → Verify calculations
- ✅ Select 5% → Verify calculations
- ✅ Select 0% → Verify calculations

### Test Special Cases
- ✅ Select NP → Verify exemption field appears
- ✅ Enter exemption reason → Verify saved
- ✅ Select ZW → Verify exemption field appears
- ✅ View invoice with NP/ZW → Verify display

### Test Custom Values
- ✅ Select custom VAT → Enter 15% → Verify calculations
- ✅ Select custom unit → Enter "paczka" → Verify saved
- ✅ Switch from custom to standard → Verify state cleared

### Test Units
- ✅ Select each standard unit → Verify code saved
- ✅ Select custom unit → Verify input appears
- ✅ View invoice → Verify unit displayed correctly

### Test PKWiU
- ✅ Enter PKWiU code → Verify saved
- ✅ Leave PKWiU empty → Verify optional
- ✅ View invoice → Verify PKWiU shown below description

## Future Enhancements

1. **Unit Conversion**: Add unit conversion helper
2. **VAT Rate History**: Track historical VAT rates by date
3. **Favorite Units**: Save user's most-used custom units
4. **PKWiU Lookup**: Add dropdown with common PKWiU codes
5. **Exemption Templates**: Predefined exemption reason templates
6. **Multi-Language Units**: Support unit translations

## Summary

✅ **Improved UX** - Dropdowns instead of text inputs
✅ **Polish Compliance** - Standard VAT rates and units
✅ **Flexible** - Custom values when needed
✅ **Professional** - PKWiU codes and exemption tracking
✅ **Bilingual** - Full EN/PL translations
✅ **No Breaking Changes** - Same API structure

The invoice form now meets Polish business standards while remaining user-friendly and flexible! 🎉

