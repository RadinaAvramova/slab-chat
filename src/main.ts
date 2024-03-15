import { app } from './index.js';

const port = parseInt(process.env.PORT ?? '8080');

app.listen(port, async () => {
  console.info(`Listening on :${port}`);
});
