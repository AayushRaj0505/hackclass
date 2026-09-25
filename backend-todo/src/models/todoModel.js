const supabase = require('../config/supabase');

class TodoModel {
  /**
   * Create a new todo item for a user
   */
  static async create({ userId, title, description = '' }) {
    const { data, error } = await supabase
      .from('todos')
      .insert([
        {
          user_id: userId,
          title: title.trim(),
          description: description ? description.trim() : '',
          completed: false
        }
      ])
      .select('*')
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  /**
   * Get all todos belonging to a user
   */
  static async findAllByUserId(userId) {
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data;
  }

  /**
   * Get a single todo by ID and ensure it belongs to the user
   */
  static async findByIdAndUserId(id, userId) {
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data;
  }

  /**
   * Update a todo item belonging to the user
   */
  static async update(id, userId, updates) {
    const { data, error } = await supabase
      .from('todos')
      .update(updates)
      .eq('id', id)
      .eq('user_id', userId)
      .select('*')
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  /**
   * Delete a todo item belonging to the user
   */
  static async delete(id, userId) {
    const { data, error } = await supabase
      .from('todos')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)
      .select('*')
      .single();

    if (error) {
      throw error;
    }

    return data;
  }
}

module.exports = TodoModel;
