import { pool } from "../db.js";


// Salvar pedido na tabela `Order`
export async function saveOrder(orderId, value, creationDate) {
  await pool.execute(
    "INSERT INTO `Order` (orderId, value, creationDate) VALUES (?, ?, ?)",
    [orderId, value, creationDate]
  );
}

// Salvar items na tabela Items
export async function saveItem(orderId, productId, quantity, price) {
  await pool.execute(
    "INSERT INTO `Items` (orderId, productId, quantity, price) VALUES (?, ?, ?, ?)",
    [orderId, productId, quantity, price]
  );
}

//Buscar pedido por ID
export async function findOrderById(orderId) {
  const [rows] = await pool.execute(
    " SELECT * FROM `Order` WHERE orderId = ?",
    [orderId]
  );
  return rows[0];
}

//Listar todos os pedidos
export async function findOrders() {
  const [rows] = await pool.execute("SELECT * FROM `Order`");
  return rows;
}

// Atualizar pedido
export async function updateOrderById(orderId, value, creationDate) {
  await pool.execute(
    "UPDATE `Order` SET value = ?, creationDate = ? WHERE orderId = ?",
    [value, creationDate, orderId]
  );
}

// Deletar pedido
export async function deleteOrderById(orderId) {
  await pool.execute("DELETE FROM `Order` WHERE orderId = ?", [orderId]);
}

