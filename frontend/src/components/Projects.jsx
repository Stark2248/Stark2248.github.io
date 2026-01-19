import React, {useState} from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IconProject } from './Icons'
import ProjectModal from './ProjectModal'

const PROJECTS = [
  { title: 'Project A - AI Agent', desc: 'RAG-based AI agent that replies on WhatsApp texts on behalf of the user.', tech: 'RAG, Python', link: 'https://github.com/Stark2248/Project-A', featured: true,
    readme: `# Project A — RAG over WhatsApp exports

This repository contains tools to parse WhatsApp text exports, chunk them into passages, embed those passages with a sentence-transformer, store vectors in Postgres + pgvector, and run a small retrieval-augmented reply service that uses a local LLM to craft short WhatsApp-style responses using nearby "memories".

**Quick summary**

- **Purpose:** Build a lightweight RAG (retrieval augmented generation) system over personal WhatsApp chat exports.
- **Key pieces:** parsing & chunking, embedding and ingestion, vector storage in Postgres (pgvector), retrieval helpers, and a FastAPI service that produces short replies using retrieved memories.
- **Primary files:** [rag/wa_to_rag.py](rag/wa_to_rag.py), [rag/embed_and_ingest.py](rag/embed_and_ingest.py), [rag/retrieve.py](rag/retrieve.py), [rag/reply_with_memory.py](rag/reply_with_memory.py).

**Repository layout**

- **data/**: WhatsApp exports and the parsed JSONL used for ingestion.
- **init/**: SQL helper (create extension) for pgvector.
- **rag/**: RAG scripts and API.
- **infra/**: third-party/large projects (included for convenience).
- **docker-compose.yml**: convenience setup for running services with Docker.

**Requirements**

- Python 3.10+ (3.11 recommended)
- Postgres with pgvector extension (or use the provided Docker stack)
- pip packages in \`requirements.txt\` / install via \`pip install -r requirements.txt\` (see notes below)
- Optional: a local LLM HTTP API compatible with the simple chat completions format (e.g. llama.cpp HTTP wrapper)

**Environment variables / configuration**

- \`PG_DSN\`: Postgres DSN used by the scripts (example: \`postgresql://user:pass@host:5432/dbname\`). See [rag/config.py](rag/config.py) for how this is used.
- \`LLM_MODEL\`: model identifier passed to your local LLM server. The default is taken from \`rag/config.py\`.
- \`LLM_URL\`: HTTP endpoint for your chat-capable LLM server (default \`http://localhost:8080/v1/chat/completions\`).
- \`MY_NAME\`, \`MY_STYLE\`, \`MEM_K\` and other tuning options can be set as environment variables; \`reply_with_memory.py\` reads these at runtime.

**Database setup**

1. Create a Postgres database and enable the \`pgvector\` extension. The repo includes \`init/01-create-extension.sql\` which can be applied to the target database.

Example (psql):

\`\`\`bash
psql "\${PG_DSN}" -f init/01-create-extension.sql
\`\`\`

2. Create the \`wa_chunks\` table if you don't already have it. A minimal example schema is:

\`\`\`sql
CREATE TABLE wa_chunks (
  id serial PRIMARY KEY,
  chat_name text,
  ts_start timestamptz,
  ts_end timestamptz,
  n_messages int,
  text text,
  emb vector
);
\`\`\`

Adjust types to match your ingestion output. The ingestion script expects \`emb\` to be a \`vector\` column provided by \`pgvector\`.

**Ingesting WhatsApp data**

1. Parse and chunk WhatsApp export files into JSONL chunks. Use the parsing utility in \`rag/wa_to_rag.py\` or the convenience wrapper \`rag/wa_to_rag_single.py\` to process a single file. Example:

\`\`\`bash
python rag/wa_to_rag_single.py --file "data/whatsapp_exports/WA Chats/WhatsApp Chat with Noel Sushanth(Flatmate).txt" --output data/whatsapp_parsed/my_chat.jsonl
\`\`\`

2. Generate embeddings and insert chunks into Postgres using \`rag/embed_and_ingest.py\`. The script reads \`data/whatsapp_parsed/rag_chunks.jsonl\` by default; ensure \`PG_DSN\` is set.

\`\`\`bash
export PG_DSN="postgresql://user:pass@localhost:5432/mydb"
python rag/embed_and_ingest.py
\`\`\`

Notes:

- The embedding model used by default is \`intfloat/e5-small-v2\` (fast, 384-d); you can change this in \`rag/embed_and_ingest.py\`.
- The script inserts into the \`wa_chunks\` table and commits in batches.

**Retrieval & reply service**

- Use \`rag/retrieve.py\` to quickly run a nearest-neighbor query from the command line:

\`\`\`bash
python rag/retrieve.py "plan for tonight?"
\`\`\`

- \`rag/reply_with_memory.py\` provides a small reply service. It has two modes:
  - CLI: run directly to get a one-off reply.
  - FastAPI: when \`fastapi\` is installed the file exposes two endpoints: \/health and \/reply (POST with JSON { "msg": "..." }).

Example (CLI):

\`\`\`bash
python rag/reply_with_memory.py "Can we shift to 7:30?"
\`\`\`

Example (run FastAPI locally with Uvicorn):

\`\`\`bash
pip install fastapi uvicorn
uvicorn rag.reply_with_memory:app --host 0.0.0.0 --port 8081
curl -X POST -H "Content-Type: application/json" -d '{"msg":"Can we shift to 7:30?"}' http://localhost:8081/reply
\`\`\`

Important behaviors and tuning knobs are near the top of \`rag/reply_with_memory.py\` such as \`TOP_K\`, \`MIN_SIM\`, \`EMBED\` and \`LLM_URL\`.

**Docker / Deployment**

- A \`docker-compose.yml\` is included for convenience. It can be used to stand up Postgres (with pgvector) and any other services defined in the file. Inspect and adapt the compose file to your environment.
- \`DockerFile.pgvector\` is included as a helper for building a Postgres image with pgvector preinstalled.

**Troubleshooting**

- If embeddings fail or are slow: ensure \`sentence-transformers\` and its backend (PyTorch) are installed correctly. Use a smaller model if CPU-bound.
- If Postgres returns errors about \`vector\`: ensure the \`pgvector\` extension is installed and \`register_vector(conn)\` is called (the scripts call it automatically).
- If the LLM API returns unexpected payloads: verify \`LLM_URL\` matches a server that speaks a simple chat completions format (the scripts expect \`choices[0].message.content\`).

**Development notes**

- Code entrypoints:
  - [rag/wa_to_rag.py](rag/wa_to_rag.py): parsing & chunking helpers.
  - [rag/embed_and_ingest.py](rag/embed_and_ingest.py): encodes passages and inserts into Postgres.
  - [rag/retrieve.py](rag/retrieve.py): quick CLI retrieval tool.
  - [rag/reply_with_memory.py](rag/reply_with_memory.py): retrieval + prompt-stuffing + LLM call (CLI + FastAPI).

**License & attribution**

This project is provided as-is for personal use. Check third-party licenses in \`infra/\` and for the models you use.

**Next steps / suggestions**

- Add a \`requirements.txt\` at the repo root listing the minimum dependencies (\`sentence-transformers\`, \`psycopg[binary]\`, \`pgvector\`, \`fastapi\`, \`uvicorn\`, \`requests\`).
- Add a small \.env.example that documents the most important environment variables.

If you want, I can add \`requirements.txt\` and \.env.example next.` },
  { title: 'Better Reads', desc: 'Spring Boot application to track and review books (Jan 2022).', tech: 'Spring Boot, JPA, PostgreSQL'},
  { title: 'Dummy Album Management API', desc: 'Microservice API for managing albums (Apr 2023).', tech: 'Spring Boot, Docker, Kubernetes'}
]

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } }
}

const item = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.36 } }
}

export default function Projects(){
  const [selected, setSelected] = useState(null)
  function ProjectCard({p,onSelect}){
    const [tilt, setTilt] = useState({x:0,y:0})
    function handleMove(e){
      const rect = e.currentTarget.getBoundingClientRect()
      const cx = rect.left + rect.width/2
      const cy = rect.top + rect.height/2
      const dx = (e.clientX - cx) / rect.width
      const dy = (e.clientY - cy) / rect.height
      setTilt({x: dx * 6, y: dy * -6})
    }
    return (
      <motion.article className={"project" + (p.featured? ' featured' : '')} variants={item} whileHover={{scale:1.02}} onMouseMove={handleMove} onMouseLeave={()=>setTilt({x:0,y:0})} style={{transform:`perspective(900px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <h3 style={{margin:0,display:'flex',alignItems:'center',gap:8}}><IconProject size={14}/> {p.title}</h3>
          <div className="links" style={{display:'flex',alignItems:'center',gap:8}}>
            {p.link && <a href={p.link} target="_blank" rel="noreferrer" style={{color:'var(--accent)'}}>Repo</a>}
            <button onClick={()=>onSelect(p)} style={{marginLeft:10,background:'var(--accent)',border:'none',color:'white',cursor:'pointer',padding:'8px 10px',borderRadius:8}}>Details</button>
          </div>
        </div>
        <p style={{color:'var(--muted)',marginTop:8}}>{p.desc}</p>
        <div className="tech">{p.tech}</div>
      </motion.article>
    )
  }

  return (
    <section className="section" id="projects">
      <div className="container">
        <motion.h2 initial={{opacity:0}} whileInView={{opacity:1}} viewport={{once:false, amount:0.2}} style={{display:'flex',alignItems:'center',gap:8}}><IconProject size={18}/>Projects</motion.h2>
        <motion.div className="projects" style={{marginTop:12}} variants={container} initial="hidden" whileInView="show" viewport={{once:false, amount:0.2}}>
          {PROJECTS.map(p=> (
            <ProjectCard key={p.title} p={p} onSelect={setSelected} />
          ))}
        </motion.div>
      </div>

      <AnimatePresence>
        {selected && <ProjectModal project={selected} onClose={()=>setSelected(null)} />}
      </AnimatePresence>
    </section>
  )
}
