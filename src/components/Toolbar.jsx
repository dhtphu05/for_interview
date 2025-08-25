export default function Toolbar({ q, setQ, sort, setSort, onAdd }) {
  return (
    <div className="row">
      <input className="input" placeholder="Tìm theo tên hoặc ghi chú..." value={q} onChange={e=>setQ(e.target.value)} style={{flex:1}} />
      <select className="select" value={sort} onChange={e=>setSort(e.target.value)}>
        <option value="-createdAt">Mới nhất</option>
        <option value="createdAt">Cũ nhất</option>
        <option value="name">Tên A → Z</option>
        <option value="-name">Tên Z → A</option>
        <option value="-quantity">Số lượng giảm dần</option>
        <option value="quantity">Số lượng tăng dần</option>
      </select>
      <button className="button primary" onClick={onAdd}>+ Thêm</button>
    </div>
  )
}
