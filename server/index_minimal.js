const express = require('express');
const app = express();
const PORT = 3456;

app.get('/', (req, res) => res.send('Hello'));

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
