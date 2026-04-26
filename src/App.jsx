import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'

export default function App() {
  const [session, setSession] = useState(null)

  const [email, setEmail] = useState('')
  const [cups, setCups] = useState([])
  const [activities, setActivities] = useState([])
  const [activityLinks, setActivityLinks] = useState([])

  const [selectedCup, setSelectedCup] = useState(null)
  const [cupHistory, setCupHistory] = useState([])

  const [newActivity, setNewActivity] = useState('')
  const [selectedCupId, setSelectedCupId] = useState('')

  const [editingActivity, setEditingActivity] = useState(null)
  const [editName, setEditName] = useState('')
  const [editCupId, setEditCupId] = useState('')

  // ---------------------------
  // AUTH
  // ---------------------------
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
    })

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => setSession(session)
    )

    return () => listener.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (session?.user?.id) reloadAll()
  }, [session])

  // ---------------------------
  // LOAD DATA
  // ---------------------------
  const reloadAll = async () => {
    const [cupsRes, activitiesRes, linksRes] = await Promise.all([
      supabase.from('cups').select('*').eq('user_id', session.user.id),
      supabase.from('activities').select('*').eq('user_id', session.user.id),
      supabase.from('activity_cups').select('*')
    ])

    setCups(cupsRes.data || [])

    // FORCE alphabetical order
    setActivities(
      (activitiesRes.data || [])
        .filter(a => !a.deleted)
        .sort((a, b) => a.name.localeCompare(b.name))
    )

    setActivityLinks(linksRes.data || [])
  }

  // ---------------------------
  // AUTH
  // ---------------------------
  const signIn = async () => {
    await supabase.auth.signInWithOtp({ email })
    alert('Check your email ✉️')
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setSession(null)
  }

  // ---------------------------
  // CREATE ACTIVITY
  // ---------------------------
  const createActivity = async () => {
    if (!newActivity.trim() || !selectedCupId) return

    const { data: activity } = await supabase
      .from('activities')
      .insert({
        user_id: session.user.id,
        name: newActivity,
        deleted: false
      })
      .select()
      .single()

    await supabase.from('activity_cups').insert({
      activity_id: activity.id,
      cup_id: selectedCupId,
      value: 1
    })

    setNewActivity('')
    setSelectedCupId('')
    await reloadAll()
  }

  // ---------------------------
  // RUN ACTIVITY
  // ---------------------------
  const runActivity = async (activityId) => {
    await supabase.from('logs').insert({
      user_id: session.user.id,
      activity_id: activityId
    })

    const { data: links } = await supabase
      .from('activity_cups')
      .select('*')
      .eq('activity_id', activityId)

    for (const link of links || []) {
      const { data: cup } = await supabase
        .from('cups')
        .select('*')
        .eq('id', link.cup_id)
        .single()

      const newLevel = Math.min(
        cup.current_level + (link.value || 1),
        cup.max_level
      )

      await supabase
        .from('cups')
        .update({ current_level: newLevel })
        .eq('id', cup.id)
    }

    await reloadAll()
  }

  // ---------------------------
  // CUP HISTORY
  // ---------------------------
  const openCup = async (cup) => {
    setSelectedCup(cup)

    const { data: links } = await supabase
      .from('activity_cups')
      .select('activity_id')
      .eq('cup_id', cup.id)

    const activityIds = (links || []).map(l => l.activity_id)

    const { data: logs } = await supabase
      .from('logs')
      .select(`
        id,
        created_at,
        activity_id,
        activities (name)
      `)
      .in('activity_id', activityIds)
      .order('created_at', { ascending: false })

    setCupHistory(logs || [])
  }

  // ---------------------------
  // EDIT
  // ---------------------------
  const startEdit = async (activity) => {
    setEditingActivity(activity)
    setEditName(activity.name)

    const { data } = await supabase
      .from('activity_cups')
      .select('*')
      .eq('activity_id', activity.id)
      .maybeSingle()

    setEditCupId(data?.cup_id || '')
  }

  const saveEdit = async () => {
    await supabase
      .from('activities')
      .update({ name: editName })
      .eq('id', editingActivity.id)

    await supabase
      .from('activity_cups')
      .delete()
      .eq('activity_id', editingActivity.id)

    if (editCupId) {
      await supabase.from('activity_cups').insert({
        activity_id: editingActivity.id,
        cup_id: editCupId,
        value: 1
      })
    }

    setEditingActivity(null)
    await reloadAll()
  }

  // ---------------------------
  // SOFT DELETE
  // ---------------------------
  const deleteActivity = async (id) => {
    await supabase
      .from('activities')
      .update({ deleted: true })
      .eq('id', id)

    await reloadAll()
  }

  // ---------------------------
  // SUGGESTIONS (TOP 3)
  // ---------------------------
  const getSuggestions = () => {
    if (!cups.length || !activities.length || !activityLinks.length) return []

    const rankedCups = [...cups].sort(
      (a, b) =>
        (a.current_level / a.max_level) -
        (b.current_level / b.max_level)
    )

    const results = []

    for (const cup of rankedCups) {
      const linked = activityLinks
        .filter(l => l.cup_id === cup.id)
        .map(l => l.activity_id)

      const match = activities.find(a => linked.includes(a.id))

      if (match) {
        results.push({
          cup,
          activity: match
        })
      }

      if (results.length === 3) break
    }

    return results
  }

  // ---------------------------
  // AUTH SCREEN
  // ---------------------------
  if (!session) {
    return (
      <div style={styles.center}>
        <h1>☕ Cup System</h1>

        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
          placeholder="email"
        />

        <button onClick={signIn} style={styles.button}>
          Login
        </button>
      </div>
    )
  }

  const suggestions = getSuggestions()

  // ---------------------------
  // UI
  // ---------------------------
  return (
    <div style={styles.app}>
      <div style={styles.header}>
        <h1>Your Cups</h1>
        <button onClick={signOut}>Logout</button>
      </div>

      {/* CUPS */}
      <div style={styles.cupGrid}>
        {cups.map(cup => {
          const fill = (cup.current_level / cup.max_level) * 100

          return (
            <div key={cup.id} style={styles.cupCard} onClick={() => openCup(cup)}>
              <h3>{cup.name}</h3>

              <div style={styles.cupWrapper}>
                {/* FILL */}
                <div style={styles.liquidContainer}>
                  <div
                    style={{
                      ...styles.fillLayer,
                      height: `${fill}%`,
                      background: cup.color || '#4f8ef7'
                    }}
                  />
                </div>

                {/* IMAGE MUST BE ON TOP */}
                <img
                  src="/cup-outline.png"
                  style={styles.cupImage}
                />
              </div>

              <div style={styles.smallText}>
                {cup.current_level}/{cup.max_level}
              </div>
            </div>
          )
        })}
      </div>

      {/* SUGGESTIONS */}
      <div style={styles.panel}>
        <h2>Recommended next actions</h2>

        {suggestions.length === 0 ? (
          <p>No suggestions yet</p>
        ) : (
          suggestions.map((s, i) => (
            <button
              key={i}
              style={{
                ...styles.suggestionButton,
                background: s.cup.color || '#4f8ef7'
              }}
              onClick={() => runActivity(s.activity.id)}
            >
              {s.activity.name}
            </button>
          ))
        )}
      </div>

      {/* ACTIVITIES */}
      <div style={styles.panel}>
        <h2>Activities</h2>

        {activities.map(a => (
          <div key={a.id} style={styles.activityCard}>
            <span>{a.name}</span>

            <div>
              <button onClick={() => runActivity(a.id)}>Run</button>
              <button onClick={() => startEdit(a)}>Edit</button>
              <button onClick={() => deleteActivity(a.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE */}
      <div style={styles.panel}>
        <h2>Create Activity</h2>

        <input
          value={newActivity}
          onChange={(e) => setNewActivity(e.target.value)}
          style={styles.input}
        />

        <select
          value={selectedCupId}
          onChange={(e) => setSelectedCupId(e.target.value)}
          style={styles.input}
        >
          <option value="">Cup</option>
          {cups.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <button onClick={createActivity} style={styles.button}>
          Add
        </button>
      </div>

      {/* MODAL */}
      {selectedCup && (
        <div style={styles.modal}>
          <div style={styles.modalBox}>
            <h3>{selectedCup.name} history</h3>
            <button onClick={() => setSelectedCup(null)}>Close</button>

            {cupHistory.map(h => (
              <div key={h.id} style={styles.historyRow}>
                <span>{h.activities?.name}</span>
                <span style={styles.historyDate}>
                  {new Date(h.created_at).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {editingActivity && (
        <div style={styles.modal}>
          <div style={styles.modalBox}>
            <h3>Edit Activity</h3>

            <input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              style={styles.input}
            />

            <select
              value={editCupId}
              onChange={(e) => setEditCupId(e.target.value)}
              style={styles.input}
            >
              <option value="">Cup</option>
              {cups.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>

            <button onClick={saveEdit} style={styles.button}>
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ---------------------------
// STYLES
// ---------------------------
const styles = {
  app: { fontFamily: 'system-ui', padding: 30, maxWidth: 1100, margin: '0 auto' },

  center: { display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 100 },

  header: { display: 'flex', justifyContent: 'space-between' },

  cupGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 20,
    maxWidth: 600,
    margin: '0 auto'
  },

  cupCard: {
    padding: 16,
    background: '#fafafa',
    borderRadius: 12,
    cursor: 'pointer'
  },

  cupWrapper: {
    position: 'relative',
    width: 140,
    height: 140,
    margin: '0 auto'
  },

  liquidContainer: {
    position: 'absolute',
    top: 18,
    bottom: 18,
    left: 18,
    right: 18,
    overflow: 'hidden',
    borderRadius: 10,
    zIndex: 1
  },

  fillLayer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    transition: 'height 0.4s ease'
  },

  cupImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    zIndex: 5,
    pointerEvents: 'none'
  },

  panel: { marginTop: 40, padding: 20, background: '#fff', borderRadius: 12 },

  activityCard: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: 10,
    borderBottom: '1px solid #eee'
  },

  suggestionButton: {
    padding: 10,
    marginTop: 8,
    border: 0,
    borderRadius: 8,
    color: 'white',
    cursor: 'pointer',
    width: '100%'
  },

  modal: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.4)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999
  },

  modalBox: {
    background: 'white',
    padding: 20,
    borderRadius: 12,
    width: 400,
    maxHeight: '70vh',
    overflow: 'auto'
  },

  historyRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: 10
  },

  historyDate: { fontSize: 12, opacity: 0.6 },

  input: { padding: 8, margin: 5 },

  button: {
    padding: 8,
    marginLeft: 5,
    background: '#4f8ef7',
    color: 'white',
    border: 0,
    borderRadius: 6
  },

  smallText: { fontSize: 12, opacity: 0.6, textAlign: 'center' }
}