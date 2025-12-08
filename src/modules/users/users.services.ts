import { pool } from "../../config/db";
import filterWithoutUndefined from "../../helpers/updateQuery";

// get all users
const getAllUsers = async () => {
  const result = await pool.query(`SELECT * FROM users`);
  return result;
};

// update user

const updateUser = async (
  id: string,
  payload: Record<string, unknown>,
  requestedUser: Record<string, unknown>
) => {
  const filteredData = filterWithoutUndefined(payload);
  const { role, email: requestedEmail } = requestedUser;

  if (role === "customer") {
    // all users except admins
    const userResult = await pool.query(`SELECT * FROM users WHERE id=$1`, [
      id,
    ]);

    if (userResult?.rows.length === 0) {
      return "not-found";
    }

    if (userResult?.rows.length) {
      const { email: userEmail } = userResult.rows[0];
      if (requestedEmail !== userEmail) {
        return "forbidden";
      }
    }

    const result = await pool.query(
      `UPDATE users SET ${filteredData.columnNameWithParameterIndex.join(
        ", "
      )} WHERE email=$${
        filteredData.columnNameWithParameterIndex.length + 1
      } RETURNING id, name, email, phone, role`,
      [...filteredData.parameterValue, requestedEmail]
    );
    return result;
  }

  // for admins
  const result = await pool.query(
    `UPDATE users SET ${filteredData.columnNameWithParameterIndex.join(
      ", "
    )} WHERE id=$${
      filteredData.columnNameWithParameterIndex.length + 1
    } RETURNING id, name, email, phone, role`,
    [...filteredData.parameterValue, id]
  );
  return result;
};

// delete user
const deleteUser = async (id: string) => {
  const result = await pool.query(
    `
    DELETE FROM users
    WHERE id=$1
    AND NOT EXISTS (
    SELECT * FROM bookings
    WHERE customer_id=$1
    AND status = 'active'
    )
  `,
    [id]
  );
  return result;
};

export const usersServices = {
  getAllUsers,
  updateUser,
  deleteUser,
};
