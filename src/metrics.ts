import { collectDefaultMetrics, Registry } from 'prom-client'
import dotenv from 'dotenv'

export function addMetrics (app: any): void {
  dotenv.config()
  const registry = new Registry()

  if (process.env.APP_NAME != null) {
    registry.setDefaultLabels({ app: process.env.APP_NAME })
  }

  collectDefaultMetrics({ register: registry })

  app.get('/metrics', async (req: any, res: any) => {
    res.set('Content-Type', registry.contentType)
    res.send(await registry.metrics())
  })
}
