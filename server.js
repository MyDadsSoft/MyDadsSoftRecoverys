import express from 'express';
import fs from 'fs';
import bodyParser from 'body-parser';
import { Client, GatewayIntentBits, Partials } from 'discord.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

// Load orders or initialize empty array
let orders = [];
if (fs.existsSync('orders.json')) orders = JSON.parse(fs.readFileSync('orders.json'));

// Discord bot
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.DirectMessages, GatewayIntentBits.MessageContent],
  partials: [Partials.Channel],
});
client.login(process.env.BOT_TOKEN);
client.once('ready', () => console.log(`Bot logged in as ${client.user.tag}`));

// Save orders to JSON
function saveOrders() {
  fs.writeFileSync('orders.json', JSON.stringify(orders, null, 2));
}

// API endpoint to place order
app.post('/api/order', (req, res) => {
  const { name, email, discord, packageSelected, currency } = req.body;
  const order = { id: Date.now(), name, email, discord, packageSelected, currency, replied: false };
  orders.push(order);
  saveOrders();
  res.json({ success: true, message: 'Order received!' });
});

// API endpoint to get orders
app.get('/api/orders', (req, res) => {
  res.json(orders);
});

// API endpoint to reply to user via bot
app.post('/api/reply', async (req, res) => {
  const { orderId, message } = req.body;
  const order = orders.find(o => o.id === orderId);
  if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

  try {
    const user = client.users.cache.find(u => u.tag === order.discord);
    if (!user) return res.status(404).json({ success: false, message: 'Discord user not found in cache.' });

    await user.send(`Reply from MyDadsSoft's Recoverys: ${message}`);
    order.replied = true;
    saveOrders();
    res.json({ success: true, message: 'Message sent!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to send DM. User may not allow DMs.' });
  }
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
