import app from './app';

const { PORT = 8080 } = process.env;
app.listen(PORT, () => console.log(`\n\nExpress listen at http://localhost:${PORT} \n`)); // eslint-disable-line no-console
