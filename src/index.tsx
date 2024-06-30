import { Hono } from 'hono'
import { jsxRenderer } from 'hono/jsx-renderer'

import { eq } from "drizzle-orm";
import { db } from "./db";
import { urls } from './schema';

const app = new Hono()

app.get(
  "*",
  //@ts-ignore
  jsxRenderer(({ children, title }) => {
    return (
      <html lang="ja">
        <head>
          <meta charset="utf-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <title>{title}</title>
        </head>
        <body>{children}</body>
      </html>
    );
  }),
);

app.get('/', async (c) => {
  const url = await db.select().from(urls).where(eq(urls.parm,"public"))
  return c.render(<div>
  <h2>public Links</h2>
  <table>
    <thead>
      <tr>
        <th>URL</th>
        <th>description</th>
        <th>createdAt</th>
        <th>updatedAt</th>
      </tr>
    </thead>
    <tbody>
      {url!.map((u) => (
        <tr>
          <td>{u.url}</td>
          <td>{u.description}</td>
          <td>{u.createdAt}</td>
          <td>{u.updatedAt}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>, { title: 'リンクを共有' })
})

app.post('url', async (c) => {
  //@ts-ignore
  if (c.req.header("nb6rytc7tgn789") !== c.env.Token) {
    return c.text('Invalid Token!')
  }
  const body = await c.req.json()
  await db.insert(urls).values({
    url: body.url,
    description: body.description,
    createdAt: new Date().toString(),
    updatedAt: new Date().toString(),
    parm: body.parm
  })
  return c.text('Success!')
})

export default app
