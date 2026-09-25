const supabase = require('../config/supabase');

class UserModel {
  /**
   * Find user by email
   */
  static async findByEmail(email) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase().trim())
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data;
  }

  /**
   * Find user by ID
   */
  static async findById(id) {
    const { data, error } = await supabase
      .from('users')
      .select('id, name, email, created_at, updated_at')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data;
  }

  /**
   * Create new user record
   */
  static async create({ name, email, password }) {
    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          name: name.trim(),
          email: email.toLowerCase().trim(),
          password
        }
      ])
      .select('id, name, email, created_at, updated_at')
      .single();

    if (error) {
      throw error;
    }

    return data;
  }
}

module.exports = UserModel;
