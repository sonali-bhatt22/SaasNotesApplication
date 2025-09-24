import React, { useState, useEffect, useCallback } from 'react';
import { notesAPI, tenantAPI } from '../utils/api';
import { useAuth } from '../contexts/AuthContext';

const NotesApp = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [formData, setFormData] = useState({ title: '', content: '' });
  const [tenantSlug, setTenantSlug] = useState(() => localStorage.getItem('tenantSlug') || '');
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const { logout, user } = useAuth();

  const loadNotes = useCallback(async () => {
    try {
      setLoading(true);
      const response = await notesAPI.getNotes();
      setNotes(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load notes: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  }, []);

  // Load notes on component mount
  useEffect(() => {
    loadNotes();
    //console.log(response.data);
  }, [loadNotes]);

  const handleUpgrade = async () => {
    if (!tenantSlug) {
      setError('Please set your tenant slug before upgrading.');
      return false;
    }
    try {
      await tenantAPI.upgradePlan(tenantSlug);
      return true;
    } catch (err) {
      setError('Failed to upgrade: ' + (err.response?.data?.error || err.message));
      return false;
    }
  };
//   if (user?.role !== 'admin') {
//     return null; // nothing is rendered
//   }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingNote) {
        await notesAPI.updateNote(editingNote._id, formData);
      } else {
        await notesAPI.createNote(formData);
      }
      
      setFormData({ title: '', content: '' });
      setEditingNote(null);
      setShowForm(false);
      loadNotes(); // Reload notes
    } catch (err) {
      const message = err.response?.data?.error || err.message;
      if (err.response?.status === 403 && /upgrade/i.test(message)) {
        setShowUpgradeModal(true);
        return;
      }
      setError('Failed to save note: ' + message);
    }
  };

  const handleEdit = (note) => {
    setEditingNote(note);
    setFormData({ title: note.title, content: note.content });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await notesAPI.deleteNote(id);
        loadNotes(); // Reload notes
      } catch (err) {
        setError('Failed to delete note: ' + (err.response?.data?.error || err.message));
      }
    }
  };

  const handleCancel = () => {
    setFormData({ title: '', content: '' });
    setEditingNote(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="app-shell">
        <div className="panel"><div className="panel-body">Loading notes…</div></div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <div className="topbar">
        <h1>My Notes</h1>
        <div className="controls">
          <span style={{ marginRight: '10px', fontSize: '12px', color: '#555' }}>
            Tenant:
          </span>
          <input
            type="text"
            value={tenantSlug}
            onChange={(e) => {
              setTenantSlug(e.target.value.trim());
              localStorage.setItem('tenantSlug', e.target.value.trim());
            }}
            placeholder="acme"
            title="Set your tenant slug (e.g., acme, globex)"
            className="input"
          />
          {/* <button
            onClick={async () => {
              const ok = await handleUpgrade();
              if (ok) {
                // reload notes after upgrade
                loadNotes();
              }
            }}
            className="btn btn-secondary"
            title="Upgrade tenant to Pro (Admin only)"
          >
            Upgrade to Pro
          </button> */}
          <button
            onClick={() => setShowForm(true)}
            className="btn btn-success"
          >
            + New Note
          </button>
          <button
            onClick={logout}
            className="btn btn-danger"
          >
            Logout
          </button>
        </div>
      </div>

      {error && (<div className="alert alert-error">{error}</div>)}

      {showForm && (
        <div className="panel">
          <div className="panel-body">
          <h3>{editingNote ? 'Edit Note' : 'Create New Note'}</h3>
          <form onSubmit={handleSubmit} className="form">
            <div style={{ marginBottom: '15px' }}>
              <label>Title:</label>
              <input
                className="field"
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label>Content:</label>
              <textarea
                className="field textarea"
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                required
                rows={4}
              />
            </div>
            <div>
              <button type="submit" className="btn btn-primary" style={{ marginRight: 10 }}>
                {editingNote ? 'Update' : 'Create'}
              </button>
              <button type="button" onClick={handleCancel} className="btn btn-secondary">
                Cancel
              </button>
            </div>
          </form>
          </div>
        </div>
      )}

      <div>
        {notes.length === 0 ? (
          <div className="empty">No notes yet. Create your first note!</div>
        ) : (
          notes.map((note) => (
            <div key={note._id} className="note-card">
              <div className="row" style={{ justifyContent: 'space-between' }}>
                <h3 style={{ margin: 0 }}>{note.title}</h3>
                <div className="row">
                  <button onClick={() => handleEdit(note)} className="btn btn-warning" style={{ padding: '6px 10px' }}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(note._id)} className="btn btn-danger" style={{ padding: '6px 10px' }}>
                    Delete
                  </button>
                </div>
              </div>
              <p className="muted" style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                {note.content}
              </p>
              <div className="note-meta">
                Created: {note.createdAt ? new Date(note.createdAt).toLocaleString() : '—'}
              </div>
            </div>
          ))
        )}
      </div>

      {showUpgradeModal ? (
  user?.role === 'admin' ? (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-header">
          <h3 style={{ margin: 0 }}>Upgrade to Pro</h3>
        </div>
        <div className="modal-body">
          <p className="muted" style={{ marginTop: 0 }}>
            You reached the Free plan limit of 3 notes for tenant <b>{tenantSlug || '—'}</b>.
          </p>
          <div className="row" style={{ marginBottom: 10 }}>
            <span className="muted">Tenant</span>
            <input
              className="input"
              type="text"
              value={tenantSlug}
              onChange={(e) => {
                setTenantSlug(e.target.value.trim());
                localStorage.setItem('tenantSlug', e.target.value.trim());
              }}
              placeholder="e.g. acme"
            />
          </div>
          <p className="muted">Admin role required. Upgrade is immediate.</p>
        </div>
        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={() => setShowUpgradeModal(false)}>Cancel</button>
          <button
            className="btn btn-primary"
            onClick={async () => {
              const ok = await handleUpgrade();
              if (ok) {
                setShowUpgradeModal(false);
                try {
                  await notesAPI.createNote(formData);
                  setFormData({ title: '', content: '' });
                  setEditingNote(null);
                  setShowForm(false);
                  loadNotes();
                } catch (retryErr) {
                  setError('Failed after upgrade: ' + (retryErr.response?.data?.error || retryErr.message));
                }
              }
            }}
          >
            Upgrade now
          </button>
        </div>
      </div>
    </div>
  ) : (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-header">
          <h3 style={{ margin: 0 }}>Need to Upgrade</h3>
        </div>
        <div className="modal-body">
          <p className="muted">
            Only admin users can upgrade the plan. Contact your admin for assistance.
          </p>
        </div>
        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={() => setShowUpgradeModal(false)}>Close</button>
        </div>
      </div>
    </div>
  )
) : null}

    </div>
  );
};

export default NotesApp;
