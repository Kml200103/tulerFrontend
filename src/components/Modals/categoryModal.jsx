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
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 p-4">
        <div className="bg-white p-4 sm:p-6 rounded shadow-lg w-full max-w-md sm:max-w-lg md:max-w-xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base sm:text-lg font-semibold">
              Manage Categories
            </h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
              aria-label="Close"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 sm:h-6 sm:w-6"
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
              className="w-full border p-2 rounded text-sm sm:text-base"
              placeholder="Enter category name"
            />
            <button
              onClick={handleAdd}
              className="mt-2 sm:mt-4 text-blue-600 hover:underline text-sm sm:text-base"
            >
              Add Category
            </button>
          </div>

          <ul className="max-h-40 sm:max-h-48 overflow-auto border border-gray-100 rounded p-1">
            {categories?.map((category) => (
              <li
                key={category.id}
                className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-gray-100 last:border-b-0 gap-2"
              >
                {editCategory?.id === category.id ? (
                  <input
                    type="text"
                    value={editCategory?.name}
                    onChange={(e) =>
                      setEditCategory({ ...editCategory, name: e.target.value })
                    }
                    className="border p-1 rounded w-full sm:w-auto text-sm sm:text-base"
                  />
                ) : (
                  <span className="text-sm sm:text-base break-words pr-2">
                    {category.name}
                  </span>
                )}

                <div className="flex justify-end space-x-2 items-center mt-1 sm:mt-0">
                  {editCategory?.id === category.id ? (
                    <>
                      <button
                        onClick={handleUpdate}
                        className="text-green-500 hover:underline text-sm sm:text-base"
                      >
                        Save
                      </button>
                      <button
                        className="text-red-900"
                        onClick={() => setEditCategory(null)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
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
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setEditCategory(category)}
                        className="text-yellow-500 hover:underline text-sm sm:text-base"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
                        className="text-red-500 hover:underline text-sm sm:text-base"
                      >
                        Delete
                      </button>
                    </>
                  )}
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
