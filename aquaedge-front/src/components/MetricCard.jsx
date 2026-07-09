import StatusBadge from './StatusBadge'

function MetricCard({ title, value, unit, icon: Icon, status, helper }) {
  return (
    <article className="metric-card">
      <div className="metric-card__header">
        <span className="metric-card__icon">{Icon ? <Icon size={20} /> : null}</span>
        {status ? <StatusBadge status={status} /> : null}
      </div>
      <p className="metric-card__title">{title}</p>
      <div className="metric-card__value">
        <span>{value}</span>
        {unit ? <small>{unit}</small> : null}
      </div>
      {helper ? <p className="metric-card__helper">{helper}</p> : null}
    </article>
  )
}

export default MetricCard
