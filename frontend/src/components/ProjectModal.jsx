import React from 'react'
import ReactMarkdown from 'react-markdown'
import { motion } from 'framer-motion'

export default function ProjectModal({project,onClose}){
  const readme = project.readme || project.desc

  return (
    <motion.div className="modal-overlay" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.6)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:60}} onClick={onClose}>
      <motion.div className="modal-panel" initial={{y:18,opacity:0,scale:0.98}} animate={{y:0,opacity:1,scale:1}} exit={{y:12,opacity:0,scale:0.98}} transition={{duration:0.28}} style={{maxWidth:880,width:'94%',background:'#071020',padding:20,borderRadius:12,boxShadow:'0 30px 80px rgba(2,6,23,0.9)'}} onClick={e=>e.stopPropagation()} role="dialog" aria-modal="true">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
          <h3 style={{margin:0}}>{project.title}</h3>
          <button onClick={onClose} aria-label="Close" style={{background:'transparent',border:'none',color:'var(--muted)',cursor:'pointer',fontSize:16}}>✕</button>
        </div>
        <div className="markdown" style={{maxHeight:'60vh',overflow:'auto',paddingRight:8}}>
          <ReactMarkdown>{readme}</ReactMarkdown>
        </div>
      </motion.div>
    </motion.div>
  )
}
