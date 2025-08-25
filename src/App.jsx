import { useMemo, useState } from 'react'
import { useLocalStorage } from './hooks/useLocalStorage'
import Toolbar from './components/Toolbar'
import Modal from './components/Modal'
import ItemForm from './components/ItemForm'
import ItemTable from './components/ItemTable'

function uuid(){
  if (crypto?.randomUUID) return crypto.randomUUID()
  return String(Date.now()) + '-' + Math.random().toString(16).slice(2)
}

export default function App(){
  const [items, setItems] = useLocalStorage('crud-items', demoData)
  const [q, setQ] = useState('')
  const [sort, setSort] = useState('-createdAt')
  const [isOpen, setIsOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  function addItem(){
    setEditing(null)
    setIsOpen(true)
  }
  function onSubmit(form){
    if (editing){
      setItems(list => list.map(x => x.id===editing.id ? ({ ...x, ...form, updatedAt: Date.now() }) : x))
    } else {
      setItems(list => [{ id: uuid(), ...form, createdAt: Date.now(), updatedAt: Date.now() }, ...list])
    }
    setIsOpen(false); setEditing(null)
  }
  function onEdit(it){ setEditing(it); setIsOpen(true) }
  function onDelete(id){ if (confirm('Xoá mục này?')) setItems(list => list.filter(x => x.id!==id)) }
  function onToggle(it){ setItems(list => list.map(x => x.id===it.id ? ({ ...x, status: it.status==='ok'?'pending':'ok', updatedAt: Date.now() }) : x)) }
  function clearAll(){ if (confirm('Xoá toàn bộ dữ liệu?')) setItems([]) }
  function exportJson(){
    const blob = new Blob([JSON.stringify(items, null, 2)], {type: 'application/json'})
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'items.json'; a.click()
    URL.revokeObjectURL(url)
  }
  function importJson(e){
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result)
        if (!Array.isArray(data)) throw new Error('Invalid file')
        setItems(data)
        alert('Import thành công')
      } catch {
        alert('File không hợp lệ')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const filtered = useMemo(() => {
    const keyword = q.trim().toLowerCase()
    let list = items.filter(x => !keyword || (x.name.toLowerCase().includes(keyword) || (x.note||'').toLowerCase().includes(keyword)))
    list.sort((a,b)=>{
      const dir = sort.startsWith('-') ? -1 : 1
      const key = sort.replace('-', '')
      const av = a[key]; const bv = b[key]
      if (av < bv) return -1*dir
      if (av > bv) return 1*dir
      return 0
    })
    return list
  }, [items, q, sort])

  return (
    <div className="container">
      <div className="header">
        <div className="brand">
          <div className="dot" /><div>
            <div style={{fontSize:20, fontWeight:700}}>Quản lý — React</div>
          </div>
        </div>
        <div className="row">
          <button className="button" onClick={exportJson}>Export JSON</button>
          <label className="button">
            Import JSON
            <input type="file" accept="application/json" style={{display:'none'}} onChange={importJson} />
          </label>
          <button className="button danger" onClick={clearAll}>Xoá tất cả</button>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <strong>Danh sách</strong>
          <span className="small">{filtered.length} mục</span>
        </div>
        <div className="card-body">
          <Toolbar q={q} setQ={setQ} sort={sort} setSort={setSort} onAdd={addItem} />
        </div>
        <div className="card-body" style={{paddingTop:0}}>
          <ItemTable items={filtered} onEdit={onEdit} onDelete={onDelete} onToggle={onToggle} />
        </div>
      </div>

      <div className="footer">
        <div>{new Date().toLocaleDateString()} • v1.0</div>
      </div>

      <Modal open={isOpen} title={editing?'Sửa mục':'Thêm mục'} onClose={()=>{setIsOpen(false); setEditing(null)}} footer={null}>
        <ItemForm initial={editing} onSubmit={onSubmit} />
      </Modal>
    </div>
  )
}

function demoData(){
  const now = Date.now()
  return [
    { id: 'd1', name:'Chuột không dây', quantity:12, price:129000, status:'ok', note:'Logi M331', createdAt: now-86400000*2, updatedAt: now-86400000*2 },
    { id: 'd2', name:'Bàn phím cơ', quantity:7, price:690000, status:'pending', note:'Red switch', createdAt: now-86400000*1.5, updatedAt: now-86400000*1.5 },
    { id: 'd3', name:'USB 64GB', quantity:25, price:159000, status:'ok', note:'Sandisk', createdAt: now-3600000*8, updatedAt: now-3600000*8 }
  ]
}
