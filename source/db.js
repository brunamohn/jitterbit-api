import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

export const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "",
  database: process.env.DB_NAME || "jitterbit_db"
})

async function initDB() {
  const connection = await pool.getConnection();

  console.log("Conectado ao MySQL!");

   // Criação da tabela Order
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS \`Order\` (
      orderId VARCHAR(50) PRIMARY KEY,
      value DECIMAL(10,2),
      creationDate DATETIME
    );
  `);

  // Criação da tabela Items
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS Items (
      orderId VARCHAR(50),
      productId INT,
      quantity INT,
      price DECIMAL(10,2),
      FOREIGN KEY (orderId) REFERENCES \`Order\`(orderId)
    );
  `);

  console.log("Tabelas criadas com sucesso!");

  await connection.release();
}

initDB().catch((err) => {
  console.error("Erro ao inicializar banco:", err);
});
