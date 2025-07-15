const express = require('express');
const router = express.Router();
const db = require('../db');
const authMiddleware = require('../middleware/authMiddleware');
const ExcelJS = require('exceljs');

// Apply auth to all routes
router.use(authMiddleware);

// ✅ Add transaction
router.post('/transaction', async (req, res) => {
  const { type, product, quantity, buy_price, sell_price, notes } = req.body;
  const sql = `
    INSERT INTO transactions (type, product, quantity, buy_price, sell_price, notes, user_id)
    VALUES (?, ?, ?, ?, ?, ?, ?)`;
  try {
    const [result] = await db.query(sql, [type, product, quantity, buy_price, sell_price, notes, req.userId]);
    res.send({ success: true, id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to add transaction');
  }
});

// ✅ Add ledger entry
router.post('/entry', async (req, res) => {
  const { type, description, amount, direction, notes } = req.body;
  const sql = `
    INSERT INTO ledger_entries (type, description, amount, direction, notes, user_id)
    VALUES (?, ?, ?, ?, ?, ?)`;
  try {
    const [result] = await db.query(sql, [type, description, amount, direction, notes, req.userId]);
    res.send({ success: true, id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to add ledger entry');
  }
});

// ✅ Get all transactions (user-specific)
router.get('/transactions', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM transactions WHERE user_id = ? ORDER BY date DESC',
      [req.userId]
    );
    res.send(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to fetch transactions');
  }
});

// ✅ Get all ledger entries (user-specific)
router.get('/entries', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM ledger_entries WHERE user_id = ? ORDER BY date DESC',
      [req.userId]
    );
    res.send(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to fetch ledger entries');
  }
});

// ✅ Summary for current user only
router.get('/summary', async (req, res) => {
  try {
    const [sales] = await db.query(`
      SELECT SUM(sell_price * quantity) AS totalSales
      FROM transactions WHERE type = 'sale' AND user_id = ?`, [req.userId]);

    const [purchases] = await db.query(`
      SELECT SUM(buy_price * quantity) AS totalPurchases
      FROM transactions WHERE type = 'purchase' AND user_id = ?`, [req.userId]);

    const [credits] = await db.query(`
      SELECT SUM(amount) AS ledgerCredits
      FROM ledger_entries WHERE direction = 'credit' AND user_id = ?`, [req.userId]);

    const [debits] = await db.query(`
      SELECT SUM(amount) AS ledgerDebits
      FROM ledger_entries WHERE direction = 'debit' AND user_id = ?`, [req.userId]);

    res.json({
      totalSales: sales[0].totalSales || 0,
      totalPurchases: purchases[0].totalPurchases || 0,
      ledgerCredits: credits[0].ledgerCredits || 0,
      ledgerDebits: debits[0].ledgerDebits || 0,
      productProfit: (sales[0].totalSales || 0) - (purchases[0].totalPurchases || 0),
      netCashFlow:
        (sales[0].totalSales || 0) - (purchases[0].totalPurchases || 0) +
        (credits[0].ledgerCredits || 0) - (debits[0].ledgerDebits || 0)
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error calculating summary');
  }
});

// ✅ Update transaction (scoped to user)
router.put('/transaction/:id', async (req, res) => {
  const { id } = req.params;
  const { type, product, quantity, buy_price, sell_price, notes } = req.body;

  const sql = `
    UPDATE transactions
    SET type = ?, product = ?, quantity = ?, buy_price = ?, sell_price = ?, notes = ?
    WHERE id = ? AND user_id = ?`;

  try {
    const [result] = await db.query(sql, [type, product, quantity, buy_price, sell_price, notes, id, req.userId]);
    res.send({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to update transaction');
  }
});

// ✅ Delete transaction (scoped to user)
router.delete('/transaction/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query('DELETE FROM transactions WHERE id = ? AND user_id = ?', [id, req.userId]);
    res.send({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to delete transaction');
  }
});

// ✅ Update ledger entry (scoped to user)
router.put('/entry/:id', async (req, res) => {
  const { id } = req.params;
  const { type, description, amount, direction, notes } = req.body;

  try {
    const [result] = await db.query(
      `UPDATE ledger_entries
       SET type = ?, description = ?, amount = ?, direction = ?, notes = ?
       WHERE id = ? AND user_id = ?`,
      [type, description, amount, direction, notes, id, req.userId]
    );
    res.send({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to update ledger entry');
  }
});

// ✅ Delete ledger entry (scoped to user)
router.delete('/entry/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query('DELETE FROM ledger_entries WHERE id = ? AND user_id = ?', [id, req.userId]);
    res.send({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to delete ledger entry');
  }
});

// ✅ Get inventory summary
router.get('/inventory', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        product,
        SUM(CASE WHEN type = 'purchase' THEN quantity ELSE 0 END) AS purchased,
        SUM(CASE WHEN type = 'sale' THEN quantity ELSE 0 END) AS sold
      FROM transactions
      WHERE user_id = ?
      GROUP BY product
    `, [req.userId]);

    const inventory = rows.map(row => ({
      product: row.product,
      stock: (row.purchased || 0) - (row.sold || 0)
    }));

    res.json(inventory);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching inventory');
  }
});

router.get('/export', async (req, res) => {
  const { from, to } = req.query;
  try {
    const [transactions] = await db.query(
      `SELECT date, 'Transaction' AS source, type, product AS description, quantity,
              buy_price, sell_price, NULL AS amount, NULL AS direction, notes
       FROM transactions
       WHERE user_id = ? AND DATE(date) BETWEEN ? AND ?`,
      [req.userId, from, to]
    );

    const [entries] = await db.query(
      `SELECT date, 'Ledger' AS source, type, description, NULL AS quantity,
              NULL AS buy_price, NULL AS sell_price, amount, direction, notes
       FROM ledger_entries
       WHERE user_id = ? AND DATE(date) BETWEEN ? AND ?`,
      [req.userId, from, to]
    );

    const combined = [...transactions, ...entries].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    res.json(combined); // ✅ Return JSON so frontend can generate Excel
  } catch (err) {
    console.error('❌ Export error:', err);
    res.status(500).send('Export failed');
  }
});



module.exports = router;
