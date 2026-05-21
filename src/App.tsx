import { useState, useEffect } from 'react';
import './index.css';

interface Note {
  id: string;
  title: string;
  content: string;
  folder: string;
  deleted: boolean;
  createdAt: number;
  updatedAt: number;
}

const SYSTEM_FOLDERS = ['all', 'personal', 'work', 'trash'];

export default function App() {
  const [showHome, setShowHome] = useState(true);
  const [showStats, setShowStats] = useState(false);

  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);

  const [currentFolder, setCurrentFolder] = useState('all');
  const [customFolders, setCustomFolders] = useState<string[]>([]);
  const [creatingFolder, setCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  const [renamingFolder, setRenamingFolder] = useState(false);
  const [renameValue, setRenameValue] = useState('');

  const [searchQuery, setSearchQuery] = useState('');

  // Load saved data
  useEffect(() => {
    const savedNotes = localStorage.getItem('noteify-notes');
    const savedFolders = localStorage.getItem('noteify-folders');

    if (savedNotes) {
      try {
        setNotes(JSON.parse(savedNotes));
      } catch {}
    }

    if (savedFolders) {
      try {
        setCustomFolders(JSON.parse(savedFolders));
      } catch {}
    }
  }, []);

  // Autosave notes
  useEffect(() => {
    localStorage.setItem('noteify-notes', JSON.stringify(notes));
  }, [notes]);

  // Autosave folders
  useEffect(() => {
    localStorage.setItem('noteify-folders', JSON.stringify(customFolders));
  }, [customFolders]);

  const folders = [
    { id: 'all', name: 'All Notes' },
    { id: 'personal', name: 'Personal' },
    { id: 'work', name: 'Work' },
    { id: 'trash', name: 'Trash' },
  ];

  const selectedNote = notes.find((n) => n.id === selectedNoteId) || null;

  const visibleNotes = notes.filter((n) => {
    if (currentFolder === 'trash') return n.deleted;
    if (currentFolder === 'all') return !n.deleted;
    return n.folder === currentFolder && !n.deleted;
  });

  const filteredNotes = visibleNotes.filter((n) =>
    (n.title + ' ' + n.content)
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  function createNote() {
    const id = crypto.randomUUID();
    const now = Date.now();

    const targetFolder =
      currentFolder === 'all' || currentFolder === 'trash'
        ? 'personal'
        : currentFolder;

    const newNote: Note = {
      id,
      title: 'Untitled Note',
      content: '',
      folder: targetFolder,
      deleted: false,
      createdAt: now,
      updatedAt: now,
    };

    setNotes([newNote, ...notes]);
    setSelectedNoteId(id);
    setShowHome(false);
  }

  function updateNote(fields: Partial<Note>) {
    if (!selectedNoteId) return;

    setNotes((prev) =>
      prev.map((n) =>
        n.id === selectedNoteId ? { ...n, ...fields, updatedAt: Date.now() } : n
      )
    );
  }

  function deleteNote(id: string) {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, deleted: true } : n))
    );
    setSelectedNoteId(null);
  }

  function restoreNote(id: string) {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, deleted: false } : n))
    );
  }

  function deleteForever(id: string) {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    if (selectedNoteId === id) setSelectedNoteId(null);
  }

  function startRenameFolder() {
    if (SYSTEM_FOLDERS.includes(currentFolder)) return;
    setRenamingFolder(true);
    setRenameValue(currentFolder);
  }

  function applyRenameFolder() {
    const trimmed = renameValue.trim();
    if (!trimmed || trimmed === currentFolder) {
      setRenamingFolder(false);
      return;
    }

    // Oppdater customFolders
    setCustomFolders((prev) =>
      prev.map((f) => (f === currentFolder ? trimmed : f))
    );

    // Oppdater alle notater som ligger i denne mappen
    setNotes((prev) =>
      prev.map((n) =>
        n.folder === currentFolder ? { ...n, folder: trimmed } : n
      )
    );

    setCurrentFolder(trimmed);
    setRenamingFolder(false);
  }

  function moveNoteToFolder(noteId: string, targetFolder: string) {
    setNotes((prev) =>
      prev.map((n) => (n.id === noteId ? { ...n, folder: targetFolder } : n))
    );
  }

  const allFolderOptions = [
    ...folders.filter((f) => f.id !== 'trash'),
    ...customFolders.map((name) => ({ id: name, name })),
  ];

  return (
    <div className="app-root fade-in">
      {/* NOTEIFY CUSTOM NAV (STYLE C) */}
      <div className="nav-root">
        <div className="nav-left">
          <span className="nav-logo">NOTEIFY</span>
          <span className="nav-subtitle">Web V1 • ICS Styled</span>
        </div>

        <div className="nav-center">
          <input
            className="nav-search"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="nav-right">
          <button
            className="nav-link-btn"
            onClick={() => {
              setShowHome(true);
              setShowStats(false);
            }}
          >
            Home
          </button>
          <button
            className="nav-link-btn"
            onClick={() => {
              setShowHome(false);
              setShowStats(false);
            }}
          >
            Notes
          </button>
          <button
            className="nav-link-btn"
            onClick={() => {
              setShowHome(false);
              setShowStats(true);
            }}
          >
            Stats
          </button>
        </div>
      </div>

      {/* HOME PAGE */}
      {showHome && !showStats && (
        <div className="frame fade-in">
          <h1 className="title">NOTEIFY V1</h1>
          <p className="subtitle">A redesigned note‑taking experience</p>

          <button onClick={() => setShowHome(false)}>📒 Open Noteify</button>
          <button onClick={() => setShowStats(true)}>📊 View Stats</button>
        </div>
      )}

      {/* MAIN APP */}
      {!showHome && !showStats && (
        <div
          className="frame fade-in"
          style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
        >
          <div style={{ display: 'flex', gap: '20px' }}>
            {/* FOLDER SIDEBAR */}
            <div
              style={{
                width: '220px',
                borderRight: '1px solid rgba(255,255,255,0.15)',
                paddingRight: '15px',
              }}
            >
              <h3 style={{ color: '#ffd700' }}>Folders</h3>

              {folders.map((f) => (
                <button
                  key={f.id}
                  onClick={() => {
                    setCurrentFolder(f.id);
                    setRenamingFolder(false);
                  }}
                  style={{
                    background:
                      currentFolder === f.id
                        ? 'rgba(255, 215, 0, 0.25)'
                        : 'rgba(20,20,20,0.85)',
                  }}
                >
                  {f.name}
                </button>
              ))}

              {customFolders.map((name) => (
                <button
                  key={name}
                  onClick={() => {
                    setCurrentFolder(name);
                    setRenamingFolder(false);
                  }}
                  style={{
                    background:
                      currentFolder === name
                        ? 'rgba(255, 215, 0, 0.25)'
                        : 'rgba(20,20,20,0.85)',
                  }}
                >
                  {name}
                </button>
              ))}

              <button onClick={() => setCreatingFolder(true)}>
                📁 Create Folder
              </button>

              {creatingFolder && (
                <div className="fade-in" style={{ marginTop: '10px' }}>
                  <input
                    placeholder="Folder name"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      borderRadius: '10px',
                      color: '#eee',
                    }}
                  />
                  <button
                    onClick={() => {
                      const trimmed = newFolderName.trim();
                      if (
                        trimmed.length > 0 &&
                        !customFolders.includes(trimmed)
                      ) {
                        setCustomFolders([...customFolders, trimmed]);
                        setCurrentFolder(trimmed);
                      }
                      setNewFolderName('');
                      setCreatingFolder(false);
                    }}
                  >
                    Add Folder
                  </button>
                </div>
              )}

              {/* RENAME FOLDER (only for custom folders) */}
              {!SYSTEM_FOLDERS.includes(currentFolder) && (
                <div style={{ marginTop: '20px' }}>
                  {!renamingFolder && (
                    <button onClick={startRenameFolder}>
                      ✏️ Rename Folder
                    </button>
                  )}

                  {renamingFolder && (
                    <div className="fade-in" style={{ marginTop: '8px' }}>
                      <input
                        placeholder="New folder name"
                        value={renameValue}
                        onChange={(e) => setRenameValue(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px',
                          background: 'rgba(255,255,255,0.06)',
                          border: '1px solid rgba(255,255,255,0.12)',
                          borderRadius: '10px',
                          color: '#eee',
                        }}
                      />
                      <button onClick={applyRenameFolder}>Apply Rename</button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* NOTES LIST */}
            <div
              style={{
                width: '250px',
                borderRight: '1px solid rgba(255,255,255,0.15)',
                paddingRight: '15px',
              }}
            >
              <h3 style={{ color: '#ffd700' }}>Notes</h3>

              {filteredNotes.length === 0 && (
                <p style={{ color: '#bbb' }}>No notes found.</p>
              )}

              {filteredNotes.map((note) => (
                <button
                  key={note.id}
                  onClick={() => setSelectedNoteId(note.id)}
                  style={{
                    marginTop: '10px',
                    background:
                      selectedNoteId === note.id
                        ? 'rgba(255, 215, 0, 0.25)'
                        : 'rgba(20,20,20,0.85)',
                  }}
                >
                  {note.title}
                </button>
              ))}

              <button onClick={createNote} style={{ marginTop: '20px' }}>
                ➕ New Note
              </button>
            </div>

            {/* NOTE EDITOR */}
            <div style={{ flex: 1 }} className="fade-in">
              {selectedNote ? (
                <div>
                  <input
                    value={selectedNote.title}
                    onChange={(e) => updateNote({ title: e.target.value })}
                    placeholder="Note title"
                    style={{
                      width: '100%',
                      padding: '12px',
                      fontSize: '18px',
                      marginBottom: '10px',
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      borderRadius: '10px',
                      color: '#eee',
                    }}
                  />

                  {/* NOTE TRANSFER – MOVE TO FOLDER */}
                  <div
                    style={{
                      marginBottom: '10px',
                      display: 'flex',
                      gap: '10px',
                    }}
                  >
                    <select
                      value={selectedNote.folder}
                      onChange={(e) =>
                        moveNoteToFolder(selectedNote.id, e.target.value)
                      }
                      style={{
                        flex: 1,
                        padding: '10px',
                        background: 'rgba(20,20,20,0.85)',
                        border: '1px solid rgba(255,255,255,0.18)',
                        borderRadius: '10px',
                        color: '#eee',
                      }}
                    >
                      {allFolderOptions.map((f) => (
                        <option key={f.id} value={f.id}>
                          {f.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <textarea
                    value={selectedNote.content}
                    onChange={(e) => updateNote({ content: e.target.value })}
                    placeholder="Start typing..."
                    style={{
                      width: '100%',
                      height: '380px',
                      padding: '12px',
                      fontSize: '16px',
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      borderRadius: '10px',
                      color: '#eee',
                      resize: 'vertical',
                    }}
                  />

                  <p style={{ marginTop: '10px', color: '#bbb' }}>
                    Words:{' '}
                    {
                      selectedNote.content.trim().split(/\s+/).filter(Boolean)
                        .length
                    }
                  </p>

                  {!selectedNote.deleted && (
                    <button
                      onClick={() => deleteNote(selectedNote.id)}
                      style={{ marginTop: '20px' }}
                    >
                      🗑️ Move to Trash
                    </button>
                  )}

                  {selectedNote.deleted && (
                    <>
                      <button
                        onClick={() => restoreNote(selectedNote.id)}
                        style={{ marginTop: '20px' }}
                      >
                        ♻️ Restore
                      </button>

                      <button
                        onClick={() => deleteForever(selectedNote.id)}
                        style={{
                          marginTop: '10px',
                          background: '#8b0000',
                        }}
                      >
                        ❌ Delete Forever
                      </button>
                    </>
                  )}
                </div>
              ) : (
                <p style={{ color: '#bbb' }}>
                  Select a note or create a new one.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* STATS PANEL */}
      {showStats && (
        <div className="stats-overlay fade-in">
          <div className="stats-card fade-in">
            <h2 style={{ color: '#ffd700' }}>📊 Statistics</h2>

            <p>Total notes: {notes.length}</p>
            <p>
              Total words:{' '}
              {notes.reduce(
                (sum, n) => sum + n.content.split(/\s+/).filter(Boolean).length,
                0
              )}
            </p>

            <button onClick={() => setShowStats(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
