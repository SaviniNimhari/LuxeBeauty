const { Product, Review } = require("../models");
const cache = require("../utils/cache");

class ProductService {
  /**
   * Fetch product details by ID with caching
   */
  async getProductById(id) {
    const cacheKey = `product_${id}`;
    const cached = await cache.get(cacheKey);
    if (cached) return cached;

    const product = await Product.findByPk(id, {
      include: [{ model: Review, as: "reviews" }],
    });

    if (product) {
      await cache.set(cacheKey, product, 180); // cache for 3 minutes
    }

    return product;
  }

  /**
   * Invalidate product cache upon update or stock change
   */
  async invalidateProductCache(id) {
    await cache.del(`product_${id}`);
    await cache.del("all_products");
  }

  /**
   * Check stock availability for an item or specific variant
   */
  isStockAvailable(product, quantity, variantSku = null) {
    if (variantSku && product.variants && product.variants.length > 0) {
      const variant = product.variants.find((v) => v.sku === variantSku);
      if (variant) {
        return variant.stock >= quantity;
      }
    }
    return product.Stock >= quantity;
  }
}

module.exports = new ProductService();
