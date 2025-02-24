import { useState } from "react";

const CategoryModal = ({
  isOpen,
  onClose,
  categories,
  getCategory,
  addCategory,
  deleteCategory,
  updateCategory,
}) => {
  console.log('categories', categories)

  const [newCategory, setNewCategory] = useState("");
  const [editCategory, setEditCategory] = useState(null);

  const handleAdd = async () => {
    if (!newCategory.trim()) return;
    await addCategory(newCategory);
    setNewCategory("");
    getCategory(); // Fetch updated categories after adding
  };

  const handleUpdate = async () => {
    console.log('editcate', editCategory)
    if (!editCategory?.name.trim()) return;
    await updateCategory(editCategory.id, editCategory.name);
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
        <div className="bg-white p-6 rounded shadow-lg w-1/2">

          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Manage Categories</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

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
              className="mt-4 text-blue-600 hover:underline" // Removed background color
            >
              Add Category
            </button>
          </div>

          <ul className="max-h-40 overflow-auto">
            {categories?.map((category) => (
              <li
                key={category.id}
                className="flex justify-between items-center py-1"
              >
                {editCategory?.id === category.id ? (
                  <input
                    type="text"
                    value={editCategory?.name}
                    onChange={(e) =>
                      setEditCategory({ ...editCategory, name: e.target.value })
                    }
                    className="border p-1 rounded"
                  />
                ) : (
                  <span>{category.name}</span>
                )}

                <div className="flex space-x-2">
                  {editCategory?.id === category.id ? (
                    <button
                      onClick={handleUpdate}
                      className="text-green-500 hover:underline" // Removed background color
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => setEditCategory(category)}
                      className="text-yellow-500 hover:underline" // Removed background color
                    >
                      Edit
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="text-red-500 hover:underline" // Removed background color
                  >
                    Delete
                  </button>

                  {editCategory && editCategory.id == category.id && <button className="text-red-900" onClick={() => setEditCategory(null)}> <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg></button>}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  );
};

export default CategoryModal;
