import {
  saveOrder,
  saveItem,
  findOrderById,
  findItemsByOrderId,
  findAllOrders,
  updateOrderById,
  deleteOrderById,
  deleteItemsByOrderId
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


//Buscar pedido por ID
export async function getOrderById(req, res) {
  try{
    const { id } = req.params;

    const order = await findOrderById(id);

    if (!order) return res.status(404).json({ message: "Pedido não encontrado"});

    const items = await findItemsByOrderId(id);

    return res.json({ order, items });
  } catch (error) {
    console.error("Erro ao buscar pedido:", error);
    return res.status(500).json({ error: "Erro interno do servidor." });
  }
}


//Listar todos os pedidos
export async function listOrders(_req, res) {
  try {
    const orders = await findAllOrders();

    // Busca os itens de todos os pedidos em paralelo
    const ordersWithItems = await Promise.all(
      orders.map(async order => {
        const items = await findItemsByOrderId(order.orderId);
        return {
          orderId: order.orderId,
          value: order.value,
          creationDate: order.creationDate,
          items: items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price
          }))
        };
      })
    );

    return res.json(ordersWithItems);

  } catch (error) {
    console.error("Erro ao listar todos os pedidos:", error);
    return res.status(500).json({ error: "Erro interno do servidor." });
  }
}


//Atualizar pedido

export async function updateOrder(req, res) {
  try {
    const { id } = req.params;
    const { valorTotal, dataCriacao, items } = req.body;

    const orderExists = await findOrderById(id);
    if (!orderExists) {
      return res.status(404).json({ message: "Pedido não encontrado" });
    }

    await updateOrderById(id, valorTotal, new Date(dataCriacao));

    // Delete itens antigos
    await deleteItemsByOrderId(id);

    // Inserir os novos
    for (const item of items) {
      await saveItem(
        id,
        item.idItem,
        item.quantidadeItem,
        item.valorItem
      );
    }

    return res.json({ message: "Pedido atualizado com sucesso" });

  } catch (error) {
    console.error("Erro ao atualizar pedido:", error);
    return res.status(500).json({ error: "Erro interno do servidor." });
  }
}




