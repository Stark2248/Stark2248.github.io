import React from 'react'
import { motion } from 'framer-motion'
import { IconProject } from './Icons'

const EXPERIENCES = [
  {
    title: 'Specialist Software Engineer — Societe Generale',
    period: 'Aug 2024 - Present',
    location: 'Bengaluru',
    points: [
      'Managed 10+ Spring Boot microservices integrated via REST APIs, Azure Event Hub, and PostgreSQL.',
      'Improved system performance by 30% through HikariCP tuning and query optimization.',
      'Migrated legacy Java 8 code to Java 21 and refactored into modern microservices.',
      'Implemented event-driven communication using Azure Event Hub (Kafka) and integrated AWS S3.'
    ]
  },
  {
    title: 'Programmer Analyst - Associate — Cognizant',
    period: 'Jul 2022 - Feb 2024',
    location: 'Kolkata',
    points: [
      'Built scalable Spring Boot microservices and REST APIs with Kafka integration.',
      'Optimized MySQL / AWS RDS performance and automated ETL using Spark-Java on Parquet data.',
      'Deployed on AWS with Docker + Kubernetes.'
    ]
  },
  {
    title: 'Programmer Analyst Trainee — Cognizant',
    period: 'Jul 2021 - Jul 2022',
    location: 'Kolkata',
    points: [
      'E2E Testing, Integration Testing, Functional Testing, Unit Testing on web applications.'
    ]
  }
]

export default function Experience(){
  return (
    <section className="section" id="experience">
      <div className="container">
        <motion.h2 initial={{opacity:0}} whileInView={{opacity:1}}>Experience</motion.h2>
        <motion.div style={{marginTop:12}} initial="hidden" whileInView="show" variants={{hidden:{},show:{transition:{staggerChildren:0.08}}}}>
          {EXPERIENCES.map(exp=> (
            <motion.div key={exp.title} initial={{opacity:0,y:8}} whileInView={{opacity:1,y:0}} transition={{duration:0.32}} style={{marginBottom:14}}>
              <h3 style={{margin:0,display:'flex',alignItems:'center',gap:8}}><IconProject size={16}/> {exp.title}</h3>
              <div style={{color:'var(--muted)',fontSize:13,marginBottom:8}}>{exp.period} • {exp.location}</div>
              <ul style={{marginTop:0,paddingLeft:18}}>
                {exp.points.map(p=> <li key={p} style={{color:'var(--muted)',marginBottom:6}}>{p}</li>)}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
