import { useEffect, useState } from 'react'

export default function useParallax(strength = 0.15){
  const [offset, setOffset] = useState(0)
  useEffect(()=>{
    let raf = null
    function onScroll(){
      if(raf) cancelAnimationFrame(raf)
      raf = requestAnimationFrame(()=>{
        const y = window.scrollY || window.pageYOffset
        setOffset(y * strength)
      })
    }
    window.addEventListener('scroll', onScroll, {passive:true})
    onScroll()
    return ()=>{
      window.removeEventListener('scroll', onScroll)
      if(raf) cancelAnimationFrame(raf)
    }
  },[strength])
  return offset
}
