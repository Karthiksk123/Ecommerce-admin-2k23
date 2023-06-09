import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Spinner from "./Spinner";
import { ReactSortable } from "react-sortablejs/dist";

export default function ProductForm({
  _id,
  title: existingTitle,
  desc: existingDescription,
  price: existingPrice,
  images: existingImages,
  category: assignedCategory,
  properties: assignedProperties,
}) {
  const [title, setTitle] = useState(existingTitle || "");
  const [desc, setDesc] = useState(existingDescription || "");
  const [price, setPrice] = useState(existingPrice || "");
  const [images, setImages] = useState([]);
  const [goToProducts, setGoToProducts] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [produtProperties, setProductPropeties] = useState(
    assignedProperties || {}
  );
  const [category, setCategory] = useState(assignedCategory || "");
  const router = useRouter();

  useEffect(() => {
    setTitle(existingTitle);
    setDesc(existingDescription);
    setPrice(existingPrice);
    setImages(existingImages);
    setCategory(assignedCategory);
    setProductPropeties(assignedProperties);
    axios.get("/api/categories").then((res) => {
      setCategories(res.data);
    });
  }, [existingImages, existingPrice, existingTitle, existingDescription]);

  async function saveProduct(ev) {
    ev.preventDefault();
    const data = {
      title,
      desc,
      price,
      images,
      category,
      properties: produtProperties,
    };
    if (_id) {
      //update
      await axios.put("/api/products", { ...data, _id });
    } else {
      //create
      await axios.post("/api/products", data);
    }
    setGoToProducts(true);
  }
  if (goToProducts) {
    router.push("/products");
  }
  async function uploadImages(ev) {
    const files = ev.target?.files;
    if (files?.length > 0) {
      setIsUploading(true);
      const data = new FormData();
      for (const file of files) {
        data.append("file", file);
      }
      const res = await axios.post("/api/upload", data);
      setImages((existingImages) => {
        return existingImages
          ? [...existingImages, ...res.data.links]
          : [...res.data.links];
      });
      setIsUploading(false);
    }
  }

  function updateImageList(images) {
    setImages(images);
  }

  const propertiesToFill = [];
  if (categories.length > 0 && category) {
    let CatInfo = categories.find(({ _id }) => _id === category);
    propertiesToFill.push(...(CatInfo?.properties ?? []));
    while (CatInfo?.parent?._id) {
      const parent = categories.find(({ _id }) => _id === CatInfo?.parent?._id);
      propertiesToFill.push(...parent.properties);
      CatInfo = parent;
    }
  }

  function setProductProp(propName, value) {
    setProductPropeties((prev) => {
      const newProperties = { ...prev };
      newProperties[propName] = value;
      return newProperties;
    });
  }

  return (
    <form onSubmit={saveProduct}>
      <label>Product name</label>
      <input
        type="text"
        placeholder="product name"
        value={title}
        onChange={(ev) => setTitle(ev.target.value)}
      />
      <label>Categories</label>
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="">Uncategorized</option>
        {categories.length > 0 &&
          categories.map((c) => <option value={c._id}>{c.name}</option>)}
      </select>
      {propertiesToFill?.length > 0 &&
        propertiesToFill.map((p) => (
          <div key={p.name} className="">
            <label>{p.name[0].toUpperCase() + p.name.substring(1)}</label>
            <div>
              <select
                value={produtProperties[p.name]}
                onChange={(ev) => setProductProp(p.name, ev.target.value)}
              >
                {p.values.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}
      <label>Photos</label>
      <div className="mb-2 flex flex-wrap gap-1 mt-1">
        <ReactSortable
          list={images}
          setList={updateImageList}
          className="flex flex-wrap gap-2"
        >
          {!!images?.length &&
            images.map((link) => (
              <div key={link} className="flex cursor-pointer">
                <img src={link} alt="" className="rounded-lg h-24 w-24 mr-2" />
              </div>
            ))}
        </ReactSortable>
        {isUploading && (
          <div className="h-24 flex items-center bg-gray-200 p-1 rounded-md">
            <Spinner />
          </div>
        )}
        <label className="w-24 h-24 cursor-pointer text-center flex flex-col items-center justify-center text-sm gap-1 text-primary rounded-sm bg-white shadow-sm border border-primary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
            />
          </svg>
          <div>Add image</div>
          <input type="file" onChange={uploadImages} className="hidden" />
        </label>
      </div>
      <label>Description</label>
      <textarea
        placeholder="description"
        value={desc}
        onChange={(ev) => setDesc(ev.target.value)}
      />
      <label>Price (in USD)</label>
      <input
        type="number"
        placeholder="price"
        value={price}
        onChange={(ev) => setPrice(ev.target.value)}
      />
      <button type="submit" className="btn-primary">
        Save
      </button>
    </form>
  );
}
