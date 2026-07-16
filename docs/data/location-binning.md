# Location binning

## Decision

Treat device coordinates and map-pin coordinates as transient input. Before browser persistence or export, snap them to a 0.1-degree grid and store the grid center as a versioned area:

```json
{
  "areaId": "grid-v1:45.5:-122.7",
  "latitude": 45.5,
  "longitude": -122.7,
  "precisionKm": 10,
  "displayName": "Portland, Oregon, United States",
  "countryCode": "US",
  "admin1Code": "OR",
  "timeZone": "America/Los_Angeles",
  "produceRegionId": "us-pacific-northwest",
  "units": "us"
}
```

The grid is nominally about 10 km. Its east-west width varies by latitude, so `precisionKm` describes the privacy/product tier rather than a surveyed radius. Device, map, and city entry all resolve to this complete shape before setup continues.

City search uses Open-Meteo's geocoding endpoint. Device and map confirmation use one user-triggered Nominatim reverse lookup at the already coarsened point, then Open-Meteo resolves the time zone. The public Nominatim endpoint must never be used for autocomplete, bulk lookup, or requests above its published limit; the provider URL stays isolated in the adapter so a production deployment can replace it with a contracted or self-hosted service.

This is a useful default because it is precise enough to select a sunset calculation point and a regional weather forecast while avoiding storage of a home-scale location. It is not precise enough for street-level services, and weather can still vary sharply near mountains, coasts, and urban boundaries.

## Derived location facets

Keep the base location bin separate from provider-specific classifications:

| Facet | Purpose | Suggested source and lifetime |
| --- | --- | --- |
| Time zone | Local date, greeting, daylight schedule | Time-zone polygon lookup; refresh when area changes |
| Solar context | Sunrise, sunset, day length | Calculate from grid center and date; daily |
| Weather cell | Current conditions and short forecast | Weather provider grid/cell ID; provider-defined cache |
| Climate zone | Typical seasonal baseline | Köppen-Geiger or another documented global dataset; long-lived |
| Administrative region | Country/subdivision and locale | Coarse reverse geocoding; refresh when area changes |
| Foodshed region | Produce calendar and market availability | Curated country/subdivision/metro mapping; seasonal |

Do not infer produce availability from latitude, weather, or climate alone. “In season” needs a dated regional source and may differ by growing method, supply chain, and market. Store source, region, and effective dates with each produce calendar.

## Content-selection boundary

Location-derived signals may select local-time, daylight, weather, climate, and regional-food content. They do not change baseline dosha scoring. Food content must also pass dietary and allergy exclusions. Any future “supportive for you” claim requires the separate, approved interpretation layer; until then, the app can truthfully present locally seasonal foods and general educational qualities without claiming a calculated dosha match.

## Privacy and lifecycle

- Never persist the raw permission result or raw dragged-pin coordinates.
- Never request continuous/background location.
- Do not send coordinates or `areaId` to language-model context; send only a necessary derived summary such as `cool and damp` or `sunset around 7:45 PM`.
- Let the user replace, manually broaden, or remove the saved area.
- Version the bin scheme so a future precision change does not silently alter existing area IDs.
