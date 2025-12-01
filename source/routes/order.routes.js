import { Router } from "express";
import {
  createOrder,
  getOrderById,
  listOrders,
  updateOrder,
  //deleteOrder
} from "../controllers/order.controller.js";


const router = Router();

// Rotas da API
router.post("/order", createOrder);

router.get("/order/list", listOrders);

router.get("/order/:id", getOrderById);

router.put("/order/:id", updateOrder);

//router.delete("/order/:id", deleteOrder);

export default router;
