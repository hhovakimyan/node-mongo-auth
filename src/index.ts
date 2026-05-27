import app from './init';

app.listen(process.env.EXPRESS_PORT, () => {
    console.log(`Listening to port ${process.env.EXPRESS_PORT}`);
});
