import { useEffect, useState } from 'react'

export default function ItemForm({ initial, onSubmit }) {
  const [form, setForm] = useState(() => initial ?? { name:'', quantity:1, price:0, status:'pending', note:'' })
  useEffect(() => { setForm(initial ?? { name:'', quantity:1, price:0, status:'pending', note:'' }) }, [initial])
  function update(k, v){ setForm(s => ({ ...s, [k]: v })) }

  function submit(e){
    e.preventDefault()
    const f = { ...form, name: form.name.trim() }
    if (!f.name) return alert('Vui lòng nhập Tên')
    if (f.quantity<0) return alert('Số lượng phải ≥ 0')
    if (f.price<0) return alert('Giá phải ≥ 0')
    onSubmit(f)
  }

  return (
    <form onSubmit={submit} className="row" style={{gap:12}}>
      <div style={{flex:1}}>
        <div className="small">Tên *</div>
        <input className="input" value={form.name} onChange={e=>update('name', e.target.value)} placeholder="VD: Chuột không dây" />
      </div>
      <div>
        <div className="small">Số lượng</div>
        <input className="input" type="number" value={form.quantity} onChange={e=>update('quantity', Number(e.target.value))} style={{width:120}} />
      </div>
      <div>
        <div className="small">Giá (₫)</div>
        <input className="input" type="number" value={form.price} onChange={e=>update('price', Number(e.target.value))} style={{width:140}} />
      </div>
      <div>
        <div className="small">Trạng thái</div>
        <select className="select" value={form.status} onChange={e=>update('status', e.target.value)} style={{width:160}}>
          <option value="pending">Đang xử lý</option>
          <option value="ok">Hoàn tất</option>
        </select>
      </div>
      <div style={{flexBasis:'100%'}}>
        <div className="small">Ghi chú</div>
        <input className="input" value={form.note} onChange={e=>update('note', e.target.value)} placeholder="Mô tả ngắn..." />
      </div>
      <div style={{display:'flex', gap:8}}>
        <button className="button primary" type="submit">Lưu</button>
      </div>
    </form>
  )
}
