import {
  saveOrder,
  saveItem,
  findOrderById,
  findOrders,
  updateOrderById,
  deleteOrderById
} from "../repositories/order.repository.js"


// Criar pedido
export async function createOrder(req, res) {
  try {
    const { numeroPedido, valorTotal, dataCriacao, items } = req.body;

    // Validação
    if (!numeroPedido || !valorTotal || !dataCriacao || !items) {
      return res.status(400).json({ error: "Campos obrigatórios faltando." });
    }

    // Normalização
    const orderId = numeroPedido.replace(/-01$/, "");
    const value = valorTotal;
    const creationDate = new Date(dataCriacao);

    // Salvar pedido na tabela `Order`
    await saveOrder(orderId, value, creationDate);

    // Salvar items na tabela Items
    for (const item of items) {
      await saveItem(
        orderId,
        item.idItem,
        item.quantidadeItem,
        item.valorItem
      );
    }

    return res.status(201).json({ message: "Pedido criado com sucesso" });

  } catch (error) {
    console.error("Erro ao criar pedido:", error);
    return res.status(500).json({ error: "Erro interno do servidor." });
  }
}
