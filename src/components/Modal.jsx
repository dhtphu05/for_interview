export default function Modal({ open, title, children, footer, onClose }) {
  if (!open) return null
  return (
    <div className="modal" onClick={onClose}>
      <div className="panel card" onClick={e=>e.stopPropagation()}>
        <div className="card-header">
          <strong>{title}</strong>
          <button className="button ghost" onClick={onClose}>✕</button>
        </div>
        <div className="card-body">{children}</div>
        {footer ? <div className="card-body" style={{paddingTop:0}}>{footer}</div> : null}
      </div>
    </div>
  )
}
