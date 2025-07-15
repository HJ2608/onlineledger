const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

const authRoutes = require('./routes/auth');    
const ledgerRoutes = require('./routes/ledger');

app.use(cors());
app.use(bodyParser.json());

app.use('/api', authRoutes);                    
app.use('/api', ledgerRoutes);                  

app.listen(process.env.PORT, () => {
  console.log(`🚀 Server running on port ${process.env.PORT}`);
});
