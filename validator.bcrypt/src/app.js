const express = require('express');

const { usersRouter, authRouter } = require('./routers');
const { sequelize } = require('./dataBase/index');

const port = 5000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/users', usersRouter);
app.use('/auth', authRouter);

app.use('*', (error, req, res, next) => {
    res.status(error.code || 500).json({
        message: error.message,
        ok: false
    });
});

sequelize.sync({ alter: false })
    .then(() => app.listen(5000, (err) => err && console.log(err) || console.log(`Listen ${port}`)))
    .catch(console.log);
