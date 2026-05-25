import React, { useEffect, useState } from 'react'

const sampleTickets = [
  { id: 1, title: 'Login failure', status: 'Open', assignee: 'Sam', comments: [] },
  { id: 2, title: 'Payment bug', status: 'In Progress', assignee: 'Alex', comments: [] }
]

export default function App() {
  const [tickets, setTickets] = useState([])
  const [newTitle, setNewTitle] = useState('')

  useEffect(() => {
    // load sample data (replace with lowdb persistence later)
    setTickets(sampleTickets)
  }, [])

  function addTicket() {
    if (!newTitle) return
    const t = { id: Date.now(), title: newTitle, status: 'Open', assignee: '', comments: [] }
    setTickets([t, ...tickets])
    setNewTitle('')
    if (window.electronAPI) window.electronAPI.notify({ title: 'Ticket created', body: t.title })
  }

  return (
    <div className="app">
      <header className="bar">
        <h1>mac-ticketing</h1>
        <div className="new">
          <input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="New ticket title" />
          <button onClick={addTicket}>Create</button>
        </div>
      </header>
      <main>
        <ul className="tickets">
          {tickets.map(t => (
            <li key={t.id} className="ticket">
              <div className="title">{t.title}</div>
              <div className="meta">{t.status} — {t.assignee || 'Unassigned'}</div>
            </li>
          ))}
        </ul>
      </main>
    </div>
  )
}
