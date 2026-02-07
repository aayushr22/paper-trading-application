const express = require("express");
const router = express.Router();
const auth = require("../controllers/authMiddleware");
const { 
  purchaseStock, 
  sellStock, 
  getStockForUser, 
  resetAccount,
  searchStocks 
} = require("../controllers/stockController");

// Search stocks route (no auth required for search)
router.route("/search").get(searchStocks);

// User-specific stock routes (require auth)
router.route("/").post(auth, purchaseStock);
router.route("/").patch(auth, sellStock);
router.route("/:userId").get(auth, getStockForUser);
router.route("/:userId").delete(auth, resetAccount);

module.exports = router;