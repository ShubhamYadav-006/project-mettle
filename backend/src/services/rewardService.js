const { pool, query } = require('../config/db');
const { logActivity } = require('./activityService');

/**
 * Get Available Rewards Catalog with User Inventory Ownership
 */
const getRewardsCatalog = async (userId) => {
  const result = await query(
    `SELECT r.*, 
            COALESCE(i.quantity, 0) AS owned_quantity,
            COALESCE(i.is_equipped, false) AS is_equipped
     FROM rewards r
     LEFT JOIN inventory i ON i.reward_id = r.id AND i.user_id = $1
     WHERE r.is_active = true
     ORDER BY r.cost ASC`,
    [userId]
  );
  return result.rows;
};

/**
 * Get User Inventory
 */
const getUserInventory = async (userId) => {
  const result = await query(
    `SELECT i.*, r.name, r.description, r.category, r.icon, r.cost
     FROM inventory i
     JOIN rewards r ON r.id = i.reward_id
     WHERE i.user_id = $1 AND i.quantity > 0
     ORDER BY i.purchased_at DESC`,
    [userId]
  );
  return result.rows;
};

/**
 * Purchase a Reward Item
 */
const purchaseReward = async (userId, itemId) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // 1. Fetch Item Details
    const itemResult = await client.query(
      `SELECT * FROM rewards WHERE id = $1 AND is_active = true`,
      [itemId]
    );

    if (itemResult.rows.length === 0) {
      const error = new Error('Reward item not found.');
      error.statusCode = 404;
      throw error;
    }

    const item = itemResult.rows[0];

    // 2. Check if Theme already owned (Prevent duplicate theme purchase)
    if (item.category === 'theme') {
      const existingInventory = await client.query(
        `SELECT id FROM inventory WHERE user_id = $1 AND reward_id = $2`,
        [userId, itemId]
      );
      if (existingInventory.rows.length > 0) {
        const error = new Error(`You already own the "${item.name}" theme.`);
        error.statusCode = 400;
        throw error;
      }
    }

    // 3. Check Character Gold Balance with FOR UPDATE lock
    const charResult = await client.query(
      `SELECT id, gold FROM characters WHERE user_id = $1 FOR UPDATE`,
      [userId]
    );

    if (charResult.rows.length === 0) {
      const error = new Error('Character not found.');
      error.statusCode = 404;
      throw error;
    }

    const currentGold = charResult.rows[0].gold;
    if (currentGold < item.cost) {
      const error = new Error(`Insufficient gold! You need ${item.cost} gold, but have ${currentGold}.`);
      error.statusCode = 400;
      throw error;
    }

    // 4. Deduct Gold
    const updatedGold = currentGold - item.cost;
    await client.query(
      `UPDATE characters SET gold = $1, updated_at = CURRENT_TIMESTAMP WHERE user_id = $2`,
      [updatedGold, userId]
    );

    // 5. Add to Inventory
    await client.query(
      `INSERT INTO inventory (user_id, reward_id, quantity, is_equipped)
       VALUES ($1, $2, 1, false)
       ON CONFLICT (user_id, reward_id)
       DO UPDATE SET quantity = inventory.quantity + 1, updated_at = CURRENT_TIMESTAMP`,
      [userId, itemId]
    );

    // 6. Handle Special Item Logic (Streak Freeze shield increment)
    if (itemId === 'item_streak_freeze') {
      await client.query(
        `UPDATE streaks SET freeze_count = freeze_count + 1, updated_at = CURRENT_TIMESTAMP WHERE user_id = $1`,
        [userId]
      );
    }

    // 7. Record Currency Transaction
    await client.query(
      `INSERT INTO transactions (user_id, amount, balance_after, type, description)
       VALUES ($1, $2, $3, 'shop_purchase', $4)`,
      [userId, -item.cost, updatedGold, `Purchased: ${item.name}`]
    );

    // 8. Log Activity
    await logActivity(client, {
      userId,
      eventType: 'REWARD_PURCHASED',
      sourceId: item.id,
      amount: item.cost,
      metadata: { itemName: item.name, category: item.category },
    });

    await client.query('COMMIT');

    return {
      item,
      remainingGold: updatedGold,
      message: `🎉 Successfully purchased "${item.name}"!`,
    };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

/**
 * Equip / Toggle Inventory Item
 */
const equipItem = async (userId, itemId) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Verify item ownership
    const invResult = await client.query(
      `SELECT * FROM inventory WHERE user_id = $1 AND reward_id = $2`,
      [userId, itemId]
    );

    if (invResult.rows.length === 0) {
      const error = new Error('You do not own this item.');
      error.statusCode = 404;
      throw error;
    }

    // Unequip all other items in same category if theme
    await client.query(
      `UPDATE inventory SET is_equipped = false WHERE user_id = $1`,
      [userId]
    );

    // Set target item as equipped
    await client.query(
      `UPDATE inventory SET is_equipped = true, updated_at = CURRENT_TIMESTAMP WHERE user_id = $1 AND reward_id = $2`,
      [userId, itemId]
    );

    await logActivity(client, {
      userId,
      eventType: 'REWARD_EQUIPPED',
      sourceId: itemId,
    });

    await client.query('COMMIT');

    return { success: true, message: 'Item equipped successfully!', equippedId: itemId };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

/**
 * Get User Currency Transaction History
 */
const getTransactionHistory = async (userId) => {
  const result = await query(
    `SELECT * FROM transactions WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50`,
    [userId]
  );
  return result.rows;
};

module.exports = {
  getRewardsCatalog,
  getUserInventory,
  purchaseReward,
  equipItem,
  getTransactionHistory,
};
