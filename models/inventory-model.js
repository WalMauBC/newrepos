const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false // Asegúrate de que esto sea correcto según tu entorno
    }
});

/* *********************************
 * Get all classifications data
 * ******************************* */
async function getClassifications() {
    return await pool.query("SELECT * FROM public.classification ORDER BY classification_name");
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
    try {
        const data = await pool.query(
            `SELECT * FROM public.inventory AS i 
             JOIN public.classification AS c 
             ON i.classification_id = c.classification_id 
             WHERE i.classification_id = $1`,
            [classification_id]
        );
        return data.rows;
    } catch (error) {
        console.error("getInventoryByClassificationId error: ", error);
        throw error; // Lanzar error para manejo posterior
    }
}

/* ***************************
 *  Get vehicle item by ID
 * ************************** */
async function getVehicleById(vehicleId) {
    try {
        const data = await pool.query(
            `SELECT * FROM public.inventory WHERE inv_id = $1`,
            [vehicleId]
        );
        return data.rows[0]; // Retorna la primera fila (ya que inv_id es único)
    } catch (error) {
        console.error("getVehicleById error: ", error);
        throw error; // Lanzar error para manejo posterior
    }
}

module.exports = {
    getClassifications,
    getInventoryByClassificationId,
    getVehicleById
};