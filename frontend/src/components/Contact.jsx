import React, {useState} from 'react'
import supabase from '../supabaseClient'
import { IconMail, IconPhone } from './Icons'

export default function Contact(){
  // add a hidden honeypot field 'website' to trap bots
  const [form, setForm] = useState({name:'',message:'',website:''})
  const [status, setStatus] = useState(null)
  const sending = status === 'sending'

  async function handleSubmit(e){
    e.preventDefault()
    // simple client-side checks
    if(form.website) return setStatus('error') // honeypot filled
    if(!form.message || !form.name) return setStatus('error')
    // rate limit: one message per 30 seconds
    const last = parseInt(localStorage.getItem('lastMessageAt') || '0',10)
    if(Date.now() - last < 30_000) return setStatus('error')
    // prevent trivial duplicate message spam (within this session)
    const lastMsg = localStorage.getItem('lastMessageText') || ''
    if(lastMsg && lastMsg === form.message) return setStatus('error')
    setStatus('sending')
    try{
      const { error } = await supabase.from('messages').insert([{ name: form.name, message: form.message }])
      if(error) throw error
      setStatus('sent')
      setForm({name:'',message:'',website:''})
      localStorage.setItem('lastMessageAt', String(Date.now()))
      localStorage.setItem('lastMessageText', form.message)
      setTimeout(()=>setStatus(null),3000)
    }catch(err){
      console.error(err)
      setStatus('error')
      setTimeout(()=>setStatus(null),3000)
    }
  }

  return (
    <section className="section contact" id="contact">
      <div className="container">
        <h2>Contact</h2>
        <div style={{color:'var(--muted)',marginBottom:12,display:'flex',gap:12,alignItems:'center',flexWrap:'wrap'}}>
          <div style={{display:'flex',alignItems:'center',gap:8}}><IconMail size={14}/> dasamlan71@gmail.com</div>
          <div style={{display:'flex',alignItems:'center',gap:8}}><IconPhone size={14}/> 7504349183</div>
          <div>Bengaluru, 560066</div>
        </div>
        <form onSubmit={handleSubmit}>
          <input placeholder="Your name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required />
          {/* honeypot - visually hidden field */}
          <input style={{position:'absolute',left:'-10000px',top:'auto',width:1,height:1,opacity:0}} placeholder="Website" value={form.website} onChange={e=>setForm({...form,website:e.target.value})} />
          <textarea placeholder="Message" rows={6} value={form.message} onChange={e=>setForm({...form,message:e.target.value})} required />
          <button type="submit" disabled={sending} style={{opacity:sending?0.7:1}}>{sending? 'Sending…' : 'Send Message'}</button>
          {status==='sending' && <p>Sending...</p>}
          {status==='sent' && <p>Thanks — message sent!</p>}
          {status==='error' && <p>There was an error sending message.</p>}
        </form>
      </div>
    </section>
  )
}
