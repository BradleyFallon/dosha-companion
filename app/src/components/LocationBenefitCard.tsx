import { Link } from 'react-router-dom'
import { locationEntryPath, type LocationReturnPath } from '../location/returnTargets'
import { LocationIcon } from '../ui/icons'

export function LocationBenefitCard({ returnTo }: { returnTo: LocationReturnPath }) {
  return (
    <section className="location-benefit-card" aria-labelledby="location-benefit-title">
      <LocationIcon aria-hidden="true" className="location-benefit-icon" focusable="false" weight="duotone" />
      <div>
        <h2 id="location-benefit-title">See what supports you where you live</h2>
        <p>Add your general area to see today’s weather, daylight, season, and foods currently growing nearby.</p>
        <Link className="button secondary icon-label" to={locationEntryPath(returnTo)}><LocationIcon aria-hidden="true" className="icon-leading" focusable="false" />Add my location</Link>
      </div>
    </section>
  )
}
