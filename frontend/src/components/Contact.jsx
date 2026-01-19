import React, {useState} from 'react'
import axios from 'axios'
import { IconMail, IconPhone } from './Icons'

export default function Contact(){
  const [form, setForm] = useState({name:'',message:''})
  const [status, setStatus] = useState(null)
  const sending = status === 'sending'

  async function handleSubmit(e){
    e.preventDefault()
    if(!form.message || !form.name) return setStatus('error')
    setStatus('sending')
    try{
      await axios.post('/api/contact', form)
      setStatus('sent')
      setForm({name:'',message:''})
      setTimeout(()=>setStatus(null),3000)
    }catch(err){
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
