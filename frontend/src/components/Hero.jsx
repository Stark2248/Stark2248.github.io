import React from 'react'
import { motion } from 'framer-motion'
import { IconProject } from './Icons'
import { useEffect, useState } from 'react'
import useParallax from '../hooks/useParallax'

export default function Hero(){
  const [idx, setIdx] = useState(0)
  const phrases = ['Scalable Systems','Event-driven Architectures','RAG & AI']
  useEffect(()=>{
    const t = setInterval(()=> setIdx(i=> (i+1) % phrases.length),2200)
    return ()=> clearInterval(t)
  },[])
  const offset = useParallax(0.12)

  return (
    <header className="hero">
      <div className="container">
        <motion.div className="card"
          initial={{ opacity:0, y:10 }}
          animate={{ opacity:1, y:0 }}
          transition={{ duration:0.5 }}>
          <div style={{display:'flex',alignItems:'center',gap:18}}>
              <motion.img src="/49605278.jpeg" alt="Amlan Das" initial={{scale:0.95,opacity:0}} animate={{scale:1,opacity:1}} transition={{duration:0.6}} style={{width:84,height:84,borderRadius:999,objectFit:'cover',boxShadow:'0 8px 22px rgba(0,0,0,0.24)',transform:`translateY(${offset * -0.4}px)`}} />
            <div>
            <h1 style={{margin:0,fontSize:30}}>Amlan Das</h1>
            <p style={{color:'var(--muted)',marginTop:6}}>Specialist Software Engineer — Java, Spring Boot, Cloud</p>
            <p style={{marginTop:12,maxWidth:640}}>I design and build scalable microservices and event-driven systems, focusing on performance, maintainability and clean delivery.</p>
              <div style={{marginTop:12}}>
                <span className="subtitle-rotate">
                  {phrases.map((t,i)=> (
                    <span key={t} className={i===idx? 'show' : ''} style={{display:'inline-block',marginRight:8}}>{t}</span>
                  ))}
                </span>
                <span style={{marginLeft:8}}><IconProject size={18}/></span>
              </div>
            <div style={{marginTop:12}}>
              <a href="#projects" style={{color:'white',textDecoration:'none',background:'var(--accent)',padding:'8px 12px',borderRadius:8}}>View Projects</a>
            </div>
            </div>
          </div>
          <div className="blobs">
            <div className="blob one" aria-hidden style={{transform:`translateY(${offset * -0.6}px)`}}></div>
            <div className="blob two" aria-hidden style={{transform:`translateY(${offset * -0.3}px)`}}></div>
          </div>
        </motion.div>
      </div>
    </header>
  )
}
