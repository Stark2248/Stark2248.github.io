import React from 'react'
import { motion } from 'framer-motion'
import { IconSkills, IconLocation } from './Icons'

export default function About(){
  return (
    <section className="section" id="about">
      <div className="container">
        <motion.h2 initial={{opacity:0}} whileInView={{opacity:1}} transition={{duration:0.4}}>About</motion.h2>
        <motion.p initial={{opacity:0,y:8}} whileInView={{opacity:1,y:0}} transition={{duration:0.4,delay:0.1}}>
          Results-driven Specialist Software Engineer with 4+ years of experience in designing, developing, and optimizing
          enterprise-grade Java Spring Boot microservices. Skilled in building scalable, event-driven systems using Azure Event Hub
          (Kafka), PostgreSQL, and AWS S3, with strong expertise in CI/CD (Jenkins, GitHub Actions), Kubernetes (AKS), and Angular 9.
          Experienced in performance tuning, test automation (JUnit 5, BDD Cucumber), and modernizing legacy applications from Java 8 to 21.
        </motion.p>
        <motion.div initial={{opacity:0,y:6}} whileInView={{opacity:1,y:0}} transition={{duration:0.3,delay:0.15}} style={{marginTop:12,display:'flex',gap:16,flexWrap:'wrap'}}>
          <div style={{display:'flex',alignItems:'center',gap:8}}><IconLocation size={14}/> Bangalore, India</div>
          <div style={{display:'flex',alignItems:'center',gap:8}}><IconSkills size={14}/> Java · Spring Boot · Kafka</div>
        </motion.div>
      </div>
    </section>
  )
}
