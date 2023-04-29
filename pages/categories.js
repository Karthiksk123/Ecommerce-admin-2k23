import Layout from "@/components/Layout";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { withSwal } from "react-sweetalert2";

function Categories({ swal }) {
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]);
  const [parentCategory, setparentCategory] = useState("");
  const [editCategory, setEditCategory] = useState(null);
  const [properties, setProperties] = useState([]);
  useEffect(() => {
    fetchCategories();
  }, []);

  function fetchCategories() {
    axios.get("/api/categories").then((res) => setCategories(res.data));
  }

  async function saveCategories(e) {
    e.preventDefault();
    const data = {
      name,
      parentCategory,
      properties: properties.map((p) => ({
        name: p.name,
        values: p.values.split(","),
      })),
    };
    if (editCategory) {
      data._id = editCategory._id;
      await axios.put("/api/categories", data);
      setEditCategory(null);
    } else {
      const res = await axios.post("/api/categories", data);
    }
    setName("");
    setProperties([]);
    fetchCategories();
  }

  function editCategories(cat) {
    setEditCategory(cat);
    setName(cat.name);
    setparentCategory(cat.parent?._id);
    setProperties(
      cat.properties.map(({ name, values }) => ({
        name,
        values: values.join(","),
      }))
    );
  }

  function deleteCategories(cat) {
    swal
      .fire({
        title: "Are your sure ?",
        text: `Do you want to delete ${cat.name} ?`,
        showCancelButton: true,
        cancelButtonText: "Cancel",
        confirmButtonText: "Yes, delete!",
        reverseButtons: true,
        confirmButtonColor: "#d55",
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          const { _id } = cat;
          await axios.delete("/api/categories?id=" + _id);
          fetchCategories();
        }
      });
  }

  function addProperty() {
    setProperties((prev) => {
      return [...prev, { name: "", values: "" }];
    });
  }

  function handlePropertyNameChange(index, property, newName) {
    setProperties((prev) => {
      const properties = [...prev];
      properties[index].name = newName;
      return properties;
    });
  }
  function handlePropertyValueChange(index, property, newValues) {
    setProperties((prev) => {
      const properties = [...prev];
      properties[index].values = newValues;
      return properties;
    });
  }

  function removeProperty(indexToRemove) {
    setProperties((prev) => {
      return [...prev].filter((p, pIndex) => {
        return pIndex !== indexToRemove;
      });
    });
  }
  return (
    <Layout>
      <h1>Categories</h1>
      <label className="text-xl">
        {editCategory
          ? `Edit category ${editCategory.name}`
          : "Create new category"}
      </label>
      <form onSubmit={saveCategories}>
        <div className="flex gap-1">
          <input
            type="text"
            placeholder="Category Name"
            className="mb-0"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <select
            className="mb-0"
            value={parentCategory}
            onChange={(e) => setparentCategory(e.target.value)}
          >
            <option value="0">No parent Category</option>
            {categories.length > 0 &&
              categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
          </select>
        </div>
        <div className="mt-2">
          <label className="block">Properties</label>
          <button
            type="button"
            className="btn-default text-sm mb-2"
            onClick={addProperty}
          >
            add new property
          </button>
          {properties.length > 0 &&
            properties.map((property, index) => (
              <div className="flex gap-1 mb-3">
                <input
                  type="text"
                  className="mb-0"
                  placeholder="property name"
                  value={property.name}
                  onChange={(e) =>
                    handlePropertyNameChange(index, property, e.target.value)
                  }
                />
                <input
                  className="mb-0"
                  type="text"
                  placeholder="values"
                  value={property.values}
                  onChange={(e) =>
                    handlePropertyValueChange(index, property, e.target.value)
                  }
                />
                <button
                  className="btn-default"
                  onClick={() => removeProperty(index)}
                  type="button"
                >
                  Remove
                </button>
              </div>
            ))}
        </div>
        <div className="flex gap-2">
          {editCategory && (
            <button
              type="button"
              onClick={() => {
                setEditCategory(null);
                setName("");
                setparentCategory("");
                setProperties([]);
              }}
              className="btn-default mt-2"
            >
              Cancel
            </button>
          )}
          <button className="btn-primary py-1 mt-2" type="submit">
            Save
          </button>
        </div>
      </form>
      {editCategories && (
        <table className="basic mt-5">
          <thead>
            <tr>
              <td>Category Name</td>
              <td>Parent</td>
              <td></td>
            </tr>
          </thead>
          <tbody>
            {categories.length > 0 &&
              categories.map((cat) => (
                <tr key={cat._id}>
                  <td>{cat.name}</td>
                  <td>{cat?.parent?.name}</td>
                  <td className="flex gap-2">
                    <button
                      className="btn-primary flex items-center gap-2 px-2 py-0 mr-2"
                      onClick={() => editCategories(cat)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                        />
                      </svg>
                      Edit
                    </button>
                    <button
                      className="btn-primary flex items-center gap-2 px-2 py-0 mr-2"
                      onClick={() => deleteCategories(cat)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                        />
                      </svg>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </Layout>
  );
}

export default withSwal(({ swal }, ref) => <Categories swal={swal} />);
