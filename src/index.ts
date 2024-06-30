import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.post('url', async (c) => {
  //@ts-ignore
  if (c.req.header("nb6rytc7tgn789") !== c.env.Token) {
    return c.text('Hello Hono!')
  }
  const body = await c.req.json()
  
})

export default app
