import React from 'react'
import { IconMail, IconProject } from './Icons'

export default function Footer(){
  return (
    <footer style={{padding:'28px 0',borderTop:'1px solid rgba(255,255,255,0.03)',marginTop:40}}>
      <div className="container" style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div>
          <strong>Amlan Das</strong>
          <div style={{color:'var(--muted)'}}>Full Stack Developer</div>
        </div>
        <div style={{display:'flex',gap:12,alignItems:'center'}}>
          <a href="mailto:dasamlan71@gmail.com" style={{color:'var(--white)',display:'flex',alignItems:'center',gap:8}}><IconMail size={14}/> dasamlan71@gmail.com</a>
          <span style={{color:'var(--muted)'}}>•</span>
          <a href="tel:+917504349183" style={{color:'var(--muted)'}}>+91 75043 49183</a>
          <span style={{color:'var(--muted)'}}>•</span>
          <a href="https://github.com/Stark2248/" target="_blank" rel="noreferrer" style={{color:'var(--muted)',display:'flex',alignItems:'center',gap:8}}><IconProject size={14}/> GitHub</a>
          <a href="https://www.linkedin.com/in/amlan-das-339300131/" target="_blank" rel="noreferrer" style={{color:'var(--muted)'}}>LinkedIn</a>
        </div>
      </div>
    </footer>
  )
}
