import React, { useEffect, useState } from 'react'

const sampleTickets = [
  { id: 1, title: 'Login failure', status: 'Open', assignee: 'Sam', priority: 'High', comments: [] },
  { id: 2, title: 'Payment bug', status: 'In Progress', assignee: 'Alex', priority: 'Critical', comments: [] }
]

export default function App() {
  const [tickets, setTickets] = useState([])
  const [newTitle, setNewTitle] = useState('')
  const [newPriority, setNewPriority] = useState('Medium')
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [newComment, setNewComment] = useState('')
  const [saveMessage, setSaveMessage] = useState('')

  // Load tickets from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('tickets')
    if (saved) {
      setTickets(JSON.parse(saved))
    } else {
      setTickets(sampleTickets)
    }
  }, [])

  // Save tickets to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('tickets', JSON.stringify(tickets))
  }, [tickets])

  function saveTickets() {
    localStorage.setItem('tickets', JSON.stringify(tickets))
    setSaveMessage('Saved!')
    window.setTimeout(() => setSaveMessage(''), 1500)
  }

  function addTicket() {
    if (!newTitle) return
    const t = { id: Date.now(), title: newTitle, status: 'Open', assignee: '', priority: newPriority, comments: [] }
    setTickets([t, ...tickets])
    setNewTitle('')
    setNewPriority('Medium')
    if (window.electronAPI) window.electronAPI.notify({ title: 'Ticket created', body: t.title })
  }

  function openTicket(ticket) {
    setSelectedTicket(ticket)
    setNewComment('')
  }

  function updateTicket(field, value) {
    const updated = { ...selectedTicket, [field]: value }
    setSelectedTicket(updated)
    setTickets(tickets.map(t => t.id === updated.id ? updated : t))
  }

  function addComment() {
    if (!newComment.trim()) return
    const updated = {
      ...selectedTicket,
      comments: [...selectedTicket.comments, { id: Date.now(), text: newComment, author: 'You' }]
    }
    setSelectedTicket(updated)
    setTickets(tickets.map(t => t.id === updated.id ? updated : t))
    setNewComment('')
  }

  return (
    <div className="app">
      <header className="bar">
        <h1>mac-ticketing</h1>
        <div className="new">
          <input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="New ticket title" />
          <select value={newPriority} onChange={e => setNewPriority(e.target.value)} className="priority-select">
            <option>Critical</option>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
          <button onClick={addTicket}>Create</button>
          <button className="save-btn" onClick={saveTickets}>Save</button>
        </div>
        {saveMessage && <div className="save-message">{saveMessage}</div>}
      </header>
      <main>
        <ul className="tickets">
          {tickets.map(t => (
            <li key={t.id} className={`ticket priority-${t.priority.toLowerCase()}`} onClick={() => openTicket(t)}>
              <div className="title">{t.title}</div>
              <div className="meta">{t.status} — {t.assignee || 'Unassigned'} — <span className="priority-badge">{t.priority}</span></div>
            </li>
          ))}
        </ul>
      </main>

      {selectedTicket && (
        <div className="modal-overlay" onClick={() => setSelectedTicket(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedTicket.title}</h2>
              <button className="close-btn" onClick={() => setSelectedTicket(null)}>✕</button>
            </div>
            <div className="modal-content">
              <div className="field">
                <label>Status:</label>
                <select value={selectedTicket.status} onChange={e => updateTicket('status', e.target.value)}>
                  <option>Open</option>
                  <option>In Progress</option>
                  <option>Closed</option>
                </select>
              </div>
              <div className="field">
                <label>Assignee:</label>
                <input value={selectedTicket.assignee} onChange={e => updateTicket('assignee', e.target.value)} placeholder="Enter assignee name" />
              </div>
              <div className="field">
                <label>Priority:</label>
                <select value={selectedTicket.priority} onChange={e => updateTicket('priority', e.target.value)}>
                  <option>Critical</option>
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
              </div>
              <div className="comments-section">
                <h3>Comments ({selectedTicket.comments.length})</h3>
                <div className="comments-list">
                  {selectedTicket.comments.map(c => (
                    <div key={c.id} className="comment">
                      <strong>{c.author}:</strong> {c.text}
                    </div>
                  ))}
                </div>
                <div className="add-comment">
                  <input value={newComment} onChange={e => setNewComment(e.target.value)} placeholder="Add a comment..." />
                  <button onClick={addComment}>Add</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
