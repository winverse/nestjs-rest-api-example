import path from 'path';
import fs from 'fs';
import { Config } from 'src/provider/config/config.interface';

class WriteEnv {
  constructor() {
    const stdin = process.stdin;

    // without this, we would only get streams once enter is pressed
    if (process.stdin.isTTY) {
      stdin.setRawMode(false);
    }

    stdin.on('data', async (key) => {
      // cmd + c
      if (key.toString() === '\u0003') {
        await this.write();
      }
    });
  }

  public async write() {
    const isDev = process.env.NODE_ENV !== 'production';
    const envFile = isDev ? 'development' : 'production';
    const configFilePath = path.resolve(process.cwd(), `config/${envFile}.ts`);

    if (!fs.existsSync(configFilePath)) {
      throw new Error(`Not found [${envFile}.ts] config file`);
    }

    const configFile = path.basename(configFilePath);

    console.log('configFile', configFile);
    const { config }: { config: Config } = await import(configFilePath);

    // write env
    const { app, jwt } = config;
    const { provider, host, database, userName, port, password } =
      config.database;

    const databaseUrl = `${provider}://${userName}:${password}@${host}:${port}/${database}?schema=public`;
    const envFilePath = path.resolve(process.cwd(), `.env`);

    fs.writeFileSync(
      envFilePath,
      `PORT=${app.port}
      API_HOST=${app.apiHost}
      COOKIE_SECRET=${jwt.cookieSecretKey}

      DATABASE_URL=${databaseUrl}
      `.replace(/ /gi, ''),
    );
  }
}

const createEnv = new WriteEnv();

createEnv.write().then(() => {
  process.exit(0);
});
