import React from 'react'
import { motion } from 'framer-motion'
import { IconSkills } from './Icons'

const SKILLS = [
  'Java 21', 'Spring Boot', 'JPA', 'Kafka', 'Azure Event Hub',
  'AWS (EC2,S3,RDS,EKS)', 'Azure (AKS,Flexi DB)', 'PostgreSQL', 'MySQL',
  'Jenkins', 'GitHub Actions', 'Angular 9', 'HTML', 'CSS', 'Postman', 'Swagger'
]

const badgeContainer = { hidden:{}, show:{ transition:{ staggerChildren:0.06 } } }
const badgeItem = { hidden:{opacity:0,y:6,scale:0.98}, show:{opacity:1,y:0,scale:1,transition:{duration:0.36}} }

export default function Skills(){
  return (
    <section className="section" id="skills">
      <div className="container">
        <motion.h2 initial={{opacity:0}} whileInView={{opacity:1}} style={{display:'flex',alignItems:'center',gap:8}}><IconSkills size={18}/>Skills</motion.h2>
        <motion.div className="skills" style={{marginTop:12}} variants={badgeContainer} initial="hidden" whileInView="show">
          {SKILLS.map(s=> (
            <motion.span className="skill" key={s} variants={badgeItem} whileHover={{scale:1.06}}>{s}</motion.span>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
