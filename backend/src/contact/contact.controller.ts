import { Controller, Post, Body, BadRequestException, Get } from '@nestjs/common'
import { promises as fs } from 'fs'
import * as path from 'path'

class ContactDto {
  name: string
  message: string
}

const DATA_DIR = path.join(process.cwd(), 'backend', 'data')
const MESSAGES_FILE = path.join(DATA_DIR, 'messages.txt')

async function ensureDataDir(){
  try{ await fs.mkdir(DATA_DIR, { recursive: true }) }catch(e){/* ignore */}
}

@Controller('api/contact')
export class ContactController {
  @Post()
  async submit(@Body() body: ContactDto){
    if(!body.name || !body.message) throw new BadRequestException('Missing fields')
    await ensureDataDir()
    const line = `[${new Date().toISOString()}] ${body.name}: ${body.message.replace(/\n/g,' ')}\n`
    await fs.appendFile(MESSAGES_FILE, line, 'utf8')
    console.log('Contact saved:', line)
    return { status: 'ok' }
  }

  @Get()
  async list(){
    try{
      const data = await fs.readFile(MESSAGES_FILE, 'utf8')
      const lines = data.trim().split('\n').filter(Boolean).reverse()
      return { messages: lines }
    }catch(e){
      return { messages: [] }
    }
  }
}
