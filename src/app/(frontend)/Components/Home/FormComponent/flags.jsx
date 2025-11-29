// flags.jsx
// ✅ Use `countries.all` (not `lookup.countries.all`)
import { countries } from "country-data-list";

// Build full country list from the dataset, keep only those with a calling code
const ALL = (countries.all || [])
  .filter(
    (c) =>
      c &&
      c.alpha2 &&
      Array.isArray(c.countryCallingCodes) &&
      c.countryCallingCodes.length > 0
  )
  .map((c) => ({
    label: c.name,
    value: c.alpha2.toUpperCase(),   // e.g. "AE", "IN"
    dialCode: c.countryCallingCodes[0], // e.g. "+971"
  }))
  .sort((a, b) => a.label.localeCompare(b.label));

// UAE on top, then the rest (no duplicates)
export const COUNTRIES = [
  { label: "United Arab Emirates", value: "AE", dialCode: "+971" },
  ...ALL.filter((c) => c.value !== "AE"),
];
