import { useState } from "react";

const CategoryModal = ({ isOpen, onClose, categories, getCategory, addCategory, deleteCategory, updateCategory }) => {
  const [newCategory, setNewCategory] = useState("");
  const [editCategory, setEditCategory] = useState(null);

  const handleAdd = async () => {
    if (!newCategory.trim()) return;
    await addCategory(newCategory);
    setNewCategory("");
    getCategory(); // Fetch updated categories after adding
  };

  const handleUpdate = async () => {
    if (!editCategory?.name.trim()) return;
    await updateCategory(editCategory._id, editCategory.name);
    setEditCategory(null);
    getCategory(); // Fetch updated categories after updating
  };

  const handleDelete = async (id) => {
    await deleteCategory(id);
    getCategory(); // Fetch updated categories after deleting
  };

  return (
    isOpen && (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded shadow-lg w-96">
          <h3 className="text-lg font-semibold mb-4">Manage Categories</h3>

          {/* Add New Category */}
          <div className="mb-4">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="w-full border p-2 rounded"
              placeholder="Enter category name"
            />
            <button
              onClick={handleAdd}
              className="mt-2 w-full bg-blue-600 text-white px-4 py-2 rounded"
            >
              Add Category
            </button>
          </div>

          {/* List of Categories */}
          <ul className="max-h-40 overflow-auto">
            {categories.map((category) => (
              <li key={category._id} className="flex justify-between items-center py-1">
                {editCategory?._id === category._id ? (
                  <input
                    type="text"
                    value={editCategory.name}
                    onChange={(e) => setEditCategory({ ...editCategory, name: e.target.value })}
                    className="border p-1 rounded"
                  />
                ) : (
                  <span>{category.name}</span>
                )}

                <div className="flex space-x-2">
                  {editCategory?._id === category._id ? (
                    <button
                      onClick={handleUpdate}
                      className="bg-green-500 text-white px-2 py-1 rounded"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => setEditCategory(category)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded"
                    >
                      Edit
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(category._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>

          {/* Close Button */}
          <div className="flex justify-end mt-4">
            <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
              Close
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default CategoryModal;
