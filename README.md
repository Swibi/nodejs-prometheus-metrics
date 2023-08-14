# nodejs-prometheus-metrics

A simple package that allows the addition of a metrics endpoint that exposes prometheus metrics

# Installation

Run the following command to install the package:

```bash
npm install @swibi/nodejs-prometheus-metrics
```

# Usage

Send in the express app into the function `addMetrics(app)` and the function
will add the metrics endpoint. If you also set the environment variable
`APP_NAME` it will be added as the prometheus app label to the registry metrics.

Example `index.ts`:

```ts
import "reflect-metadata";
import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import swaggerUI from "swagger-ui-express";
import { container, inject, singleton } from "tsyringe";
import { ApiConfig } from "./configs";
import { LogService } from "./services";
import { RegisterRoutes } from "./build/routes";
import * as swaggerJson from "./build/swagger.json";
import cors from "cors";
import type bunyan from "bunyan";
import { addMetrics } from "./utilities/metrics.utilities";

dotenv.config();

@singleton()
class App {
  private readonly log: bunyan;

  constructor(
    @inject(LogService) logService: LogService,
    @inject(ApiConfig) private readonly apiConfig: ApiConfig,
  ) {
    this.log = logService.logger(this);
  }

  start(): void {
    this.log.info("Starting application...");
    const app = express();

    app.use(cors());
    app.use(bodyParser.json());

    addMetrics(app);
    RegisterRoutes(app);

    app.use(this.apiConfig.docs, swaggerUI.serve, swaggerUI.setup(swaggerJson));
    app.listen(this.apiConfig.port, () => {
      this.initLog();
    });
  }

  initLog(): void {
    this.log.info(
      `Server is running at '${this.apiConfig.url()}'. Checkout api docs at '${this.apiConfig.docsUrl()}'`,
    );
  }
}

container.resolve(App).start();
```
