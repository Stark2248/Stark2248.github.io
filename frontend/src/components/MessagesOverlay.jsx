import React, {useEffect, useState, useRef} from 'react'
import supabase from '../supabaseClient'

function randomPositions(n){
  const w = window.innerWidth
  const h = window.innerHeight
  const margin = 40
  const minDist = 110 // minimum distance between ghosts
  const positions = []

  function isFarEnough(x,y){
    for(const p of positions){
      const dx = p.x - x
      const dy = p.y - y
      if(Math.hypot(dx,dy) < minDist) return false
    }
    return true
  }

  // try to place randomly but enforce min distance
  const maxAttempts = n * 20
  let attempts = 0
  while(positions.length < n && attempts < maxAttempts){
    attempts++
    const x = Math.random() * (w - margin*2) + margin
    const y = Math.random() * (h - margin*2) + margin
    if(isFarEnough(x,y)) positions.push({x,y})
  }

  // fallback: if not enough placed, fill remaining on a simple grid
  if(positions.length < n){
    const cols = Math.ceil(Math.sqrt(n))
    const rows = Math.ceil(n / cols)
    for(let r=0;r<rows && positions.length<n;r++){
      for(let c=0;c<cols && positions.length<n;c++){
        const x = margin + (c + 0.5) * ((w - margin*2) / cols)
        const y = margin + (r + 0.5) * ((h - margin*2) / rows)
        if(isFarEnough(x,y)) positions.push({x,y})
      }
    }
  }

  // if still short, just repeat some positions (should be rare)
  while(positions.length < n) positions.push({x: margin + Math.random()*(w-margin*2), y: margin + Math.random()*(h-margin*2)})

  return positions
}

export default function MessagesOverlay(){
  const [messages, setMessages] = useState([])
  const [openIndex, setOpenIndex] = useState(null)
  const positions = useRef([])
  const velocity = useRef([])
  const rafRef = useRef(null)
  const nodesRef = useRef([])
  const savedVel = useRef([])

  useEffect(()=>{
    // motion tuning constants (slower, gentler behavior)
    const FRAME_SCALE = 0.6
    const MIN_REBOUND = 0.18
    const NUDGE_PX = 18
    const COLLISION_KICK = 1.05
    const MAX_SPEED = 1.4
    async function load(){
      try{
        const { data, error } = await supabase.from('messages').select('name,message,created_at').order('created_at', { ascending: false })
        if(error) throw error
        const msgs = (data || []).map(d => `[${d.created_at}] ${d.name}: ${d.message}`)
        setMessages(msgs)
        positions.current = randomPositions(msgs.length)
        // seed velocities using angle+speed to guarantee directional movement
        velocity.current = msgs.map(()=>{
          const angle = Math.random() * Math.PI * 2
          const speed = 0.25 + Math.random() * 0.9 // gentle speeds
          return { vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed }
        })
      }catch(e){
        console.warn('Failed to load messages from Supabase', e)
      }
    }
    load()

    const avoidsRef = { current: [] }
    function computeAvoids(){
      const avoids = []
      document.querySelectorAll('.container, header.hero, footer').forEach(el=>{
        const r = el.getBoundingClientRect()
        avoids.push({left:r.left,top:r.top,right:r.right,bottom:r.bottom})
      })
      avoidsRef.current = avoids
    }
    computeAvoids()
    window.addEventListener('resize', computeAvoids)
    window.addEventListener('scroll', computeAvoids, {passive:true})

    function step(){
      const w = window.innerWidth
      const h = window.innerHeight
      const avoids = avoidsRef.current || []
      for(let i=0;i<positions.current.length;i++){
        const p = positions.current[i]
        const v = velocity.current[i]
        if(!p || !v) continue
        const nx = p.x + v.vx * FRAME_SCALE
        const ny = p.y + v.vy * FRAME_SCALE

        // check against avoids, if next pos collides reflect velocity
        let collided = false
        for(const a of avoids){
          if(nx > a.left-30 && nx < a.right+30 && ny > a.top-30 && ny < a.bottom+30){
            // compute closest point on rect to the next position
            const closestX = Math.max(a.left, Math.min(nx, a.right))
            const closestY = Math.max(a.top, Math.min(ny, a.bottom))
            // normal from closest point to the point
            let nxv = nx - closestX
            let nyv = ny - closestY
            let nlen = Math.hypot(nxv, nyv)
            // if the point is exactly inside (nlen == 0), fall back to axis approach
            if(nlen === 0){
              const centerX = (a.left + a.right)/2
              const centerY = (a.top + a.bottom)/2
              const approachX = Math.abs(nx - centerX)
              const approachY = Math.abs(ny - centerY)
              if(approachX > approachY){ nxv = nx - centerX; nyv = 0 } else { nxv = 0; nyv = ny - centerY }
              nlen = Math.hypot(nxv, nyv) || 1
            }
            const ux = nxv / nlen
            const uy = nyv / nlen
            // reflect velocity across the normal: v' = v - 2*(v·n)*n
            const vdotn = v.vx * ux + v.vy * uy
            v.vx = v.vx - 2 * vdotn * ux
            v.vy = v.vy - 2 * vdotn * uy
            // give a small kick outward so it escapes
            v.vx *= COLLISION_KICK
            v.vy *= COLLISION_KICK
            // if speed too small, set a minimum escape velocity along normal
            const spAfter = Math.hypot(v.vx, v.vy)
            if(spAfter < MIN_REBOUND){
              v.vx = ux * MIN_REBOUND
              v.vy = uy * MIN_REBOUND
            }
            // nudge position just outside the rect along the normal
            p.x = closestX + ux * (NUDGE_PX + 8)
            p.y = closestY + uy * (NUDGE_PX + 8)
            // clamp max speed
            const spClamp = Math.hypot(v.vx, v.vy)
            if(spClamp > MAX_SPEED){
              const s = MAX_SPEED / spClamp
              v.vx *= s
              v.vy *= s
            }
            collided = true
            break
          }
        }
        if(!collided){ p.x = nx; p.y = ny }
        if(p.x < 20){ p.x = 20; v.vx *= -0.95 }
        if(p.y < 20){ p.y = 20; v.vy *= -0.95 }
        if(p.x > w-60){ p.x = w-60; v.vx *= -0.95 }
        if(p.y > h-60){ p.y = h-60; v.vy *= -0.95 }
        // keep velocities within a reasonable max after edge bounces
        const sp = Math.hypot(v.vx, v.vy)
        if(sp > MAX_SPEED){
          const s = MAX_SPEED / sp
          v.vx *= s
          v.vy *= s
        }

        // if velocity is extremely small, add a tiny jitter so the ghost drifts
        const tinySpeed = Math.hypot(v.vx, v.vy)
        if(tinySpeed < 0.02){
          v.vx += (Math.random()-0.5) * 0.2
          v.vy += (Math.random()-0.5) * 0.2
        }

        const node = nodesRef.current[i]
        if(node){
          node.style.transform = `translate3d(${Math.round(p.x)}px, ${Math.round(p.y)}px, 0)`
        }
      }
      rafRef.current = requestAnimationFrame(step)
    }
    rafRef.current = requestAnimationFrame(step)
    return ()=>{ if(rafRef.current) cancelAnimationFrame(rafRef.current) }
  },[])

  if(messages.length===0) return null

  function handleOpen(i){
    // pause that ghost
    if(velocity.current[i]){
      // only save if not already saved
      if(!savedVel.current[i]) savedVel.current[i] = {...velocity.current[i]}
      velocity.current[i] = {vx:0,vy:0}
    } else {
      // ensure there's something to restore later
      if(!savedVel.current[i]) savedVel.current[i] = {vx:(Math.random()-0.5)*0.5, vy:(Math.random()-0.5)*0.5}
      velocity.current[i] = {vx:0,vy:0}
    }
    setOpenIndex(i)
  }

  function handleClose(){
    // restore previously saved velocity
    if(openIndex != null){
      const sv = savedVel.current[openIndex]
      // if no saved velocity or it's nearly zero, give a small random escape velocity
      if(!sv || (Math.hypot(sv.vx||0, sv.vy||0) < 0.05)){
        const angle = Math.random() * Math.PI * 2
        const speed = 0.25 + Math.random() * 0.6
        velocity.current[openIndex] = {vx: Math.cos(angle)*speed, vy: Math.sin(angle)*speed}
      } else {
        velocity.current[openIndex] = {...sv}
      }
      savedVel.current[openIndex] = null
    }
    setOpenIndex(null)
  }

  return (
    <div aria-hidden style={{position:'fixed',inset:0,pointerEvents:'none'}}>
      {messages.map((m,i)=> {
        const p = positions.current[i] || {x:40,y:80}
        return (
        <div key={i} ref={el=> nodesRef.current[i]=el} style={{position:'absolute',left:0,top:0,pointerEvents:'auto',transform:`translate3d(${Math.round(p.x)}px, ${Math.round(p.y)}px, 0)`}}>
          <button onClick={()=>handleOpen(i)} style={{background:'transparent',border:'none',cursor:'pointer'}} title="View message">
            <div style={{width:36,height:36,borderRadius:999,background:'rgba(255,255,255,0.06)',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 6px 18px rgba(0,0,0,0.28)'}}>
              <span style={{fontSize:14,color:'var(--white)'}}>💬</span>
            </div>
          </button>
          {openIndex===i && (
            <div onClick={handleClose} style={{marginTop:8,maxWidth:260,background:'rgba(7,16,32,0.95)',color:'var(--white)',padding:10,borderRadius:10,boxShadow:'0 10px 30px rgba(0,0,0,0.6)',cursor:'pointer'}}>
              <div style={{fontSize:13,color:'var(--muted)',marginBottom:6}}>{
                // extract a simple name: prefer text inside ']' then before '<' or ':'
                (function(){
                  const part = m.split('] ')[1] || 'Message'
                  const beforeLt = part.split('<')[0]
                  const beforeColon = beforeLt.split(':')[0]
                  return beforeColon.trim()
                })()
              }</div>
              <div style={{fontSize:14,lineHeight:1.4}}>{m.split(': ').slice(1).join(': ')}</div>
            </div>
          )}
        </div>
      )})}
    </div>
  )
}
