export default function ItemTable({ items, onEdit, onDelete, onToggle }) {
  return (
    <div className="card">
      <div className="card-body" style={{paddingTop:8}}>
        <table className="table">
          <thead>
            <tr>
              <th>Tên</th>
              <th>Số lượng</th>
              <th>Giá</th>
              <th>Trạng thái</th>
              <th>Ngày tạo</th>
              <th style={{textAlign:'right'}}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {items.length===0 ? (
              <tr><td colSpan={6} className="small">Chưa có dữ liệu</td></tr>
            ) : items.map(it => (
              <tr key={it.id}>
                <td>{it.name}{it.note ? <div className="small">{it.note}</div> : null}</td>
                <td>{it.quantity}</td>
                <td>{formatCurrency(it.price)}</td>
                <td>{it.status==='ok' ? <span className="badge ok">Hoàn tất</span> : <span className="badge pending">Đang xử lý</span>}</td>
                <td className="small">{new Date(it.createdAt).toLocaleString()}</td>
                <td style={{textAlign:'right'}}>
                  <button className="button" onClick={()=>onToggle(it)}>{it.status==='ok'?'Đặt lại':'Đánh dấu xong'}</button>{' '}
                  <button className="button" onClick={()=>onEdit(it)}>Sửa</button>{' '}
                  <button className="button danger" onClick={()=>onDelete(it.id)}>Xoá</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function formatCurrency(v){
  try {
    return new Intl.NumberFormat('vi-VN', { style:'currency', currency:'VND', maximumFractionDigits:0 }).format(v || 0)
  } catch {
    return v
  }
}
