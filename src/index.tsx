import { Hono } from 'hono'
import { jsxRenderer } from 'hono/jsx-renderer'
import { logger } from 'hono/logger';
import { basicAuth } from 'hono/basic-auth';

import { eq } from "drizzle-orm";
import { db } from "./db";
import { urls } from './schema';
import { users } from './env';

const app = new Hono()

app.use(logger())

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
        <th>updatedAt</th>
      </tr>
    </thead>
    <tbody>
      {url!.map((u) => (
        <tr>
          <td><a href={u.url}>{u.url}</a></td>
          <td>{u.description}</td>
          <td>{new Date(u.updatedAt).toLocaleString('ja-JP')}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>, { title: 'リンクを共有' })
})

function authenticate(inputUsername:string, inputPassword:string) {
  return users.some(user => user.username === inputUsername && user.password === inputPassword);
}

app.get('/private', basicAuth({
  verifyUser: (username, password, c) => {
    c.set("username",username)
    console.log(users.includes({username:username,password:password}))
    return (authenticate(username, password));
  }}),async (c) => {
  //@ts-ignore
  const privateurl = await db.select().from(urls).where(eq(urls.parm,String(c.get("username"))))
  const publicurl = await db.select().from(urls).where(eq(urls.parm,"public"))
  const url = publicurl.concat(privateurl)
  return c.render(<div>
  <h2>private Links</h2>
  <p>your {c.get("username")}</p>
  <table>
    <thead>
      <tr>
        <th>URL</th>
        <th>description</th>
        <th>updatedAt</th>
      </tr>
    </thead>
    <tbody>
      {url!.map((u) => (
        <tr>
          <td><a href={u.url}>{u.url}</a></td>
          <td>{u.description}</td>
          <td>{new Date(u.updatedAt).toLocaleString('ja-JP')}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>, { title: 'リンクを共有' })
  })

app.post('url', async (c) => {
  //@ts-ignore
  if (c.req.header("token") !== "test") {
    console.log(c.req.header("token"))
    return c.text('Invalid Token!', 401)
  }
  await db.insert(urls).values({
    url:  String(await c.req.header("url")),
    description: await c.req.header("description"),
    createdAt: new Date().toString(),
    updatedAt: new Date().toString(),
    parm: await c.req.header("parm")
  })
  return c.text('Success!')
})

export default app
