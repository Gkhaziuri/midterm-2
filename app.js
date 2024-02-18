const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3005;

app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {

    fs.readFile('expenses.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
        }
        const expenses = JSON.parse(data);
        res.render('index', { expenses });
    });
});

app.post('/add', (req, res) => {
    const { title, amount } = req.body;
    const newExpense = { title, amount };

    fs.readFile('expenses.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
        }
        const expenses = JSON.parse(data);

        expenses.push(newExpense);

        fs.writeFile('expenses.json', JSON.stringify(expenses), (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Internal Server Error');
            }
            res.redirect('/');
        });
    });
});

app.get('/expense/:id', (req, res) => {
    const expenseId = req.params.id;

    fs.readFile('expenses.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
        }
        const expenses = JSON.parse(data);
        const expense = expenses[expenseId];
        if (!expense) {
            return res.status(404).send('Expense not found');
        }
        res.render('expense', { expense });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${3005}`);
});
