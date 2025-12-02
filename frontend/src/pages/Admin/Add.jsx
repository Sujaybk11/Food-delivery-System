import React, { useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { StoreContext } from "../../context/StoreContext";

const Add = () => {
  const { token } = useContext(StoreContext);
  const storedToken = localStorage.getItem('token');
  const authToken = token || storedToken;
  const [image, setImage] = useState(false);
  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Salad"
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", Number(data.price));
    formData.append("category", data.category);
    formData.append("image", image);

    try {
      const response = await axios.post(`http://localhost:4000/api/food/add`, formData, {
        headers: { 
          token: authToken,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data.success) {
        setData({ name: "", description: "", price: "", category: "Salad" });
        setImage(false);
        toast.success("Food item added successfully!");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Failed to add food item");
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Add Food Item</h2>
      <form onSubmit={onSubmitHandler}>
        <div style={{ marginBottom: '15px' }}>
          <input onChange={(e) => setImage(e.target.files[0])} type="file" required accept="image/*" />
        </div>
        <input onChange={onChangeHandler} value={data.name} type="text" name="name" placeholder="Product name" required style={{ width: '100%', padding: '8px', marginBottom: '15px' }} />
        <textarea onChange={onChangeHandler} value={data.description} name="description" rows="4" placeholder="Description" required style={{ width: '100%', padding: '8px', marginBottom: '15px' }} />
        <select name="category" onChange={onChangeHandler} value={data.category} style={{ width: '100%', padding: '8px', marginBottom: '15px' }}>
          <option value="Salad">Salad</option>
          <option value="Rolls">Rolls</option>
          <option value="Deserts">Deserts</option>
          <option value="Sandwich">Sandwich</option>
          <option value="Cake">Cake</option>
          <option value="Pure Veg">Pure Veg</option>
          <option value="Pasta">Pasta</option>
          <option value="Noodles">Noodles</option>
        </select>
        <input onChange={onChangeHandler} value={data.price} type="number" name="price" placeholder="Price" required style={{ width: '100%', padding: '8px', marginBottom: '15px' }} />
        <button type="submit" style={{ padding: '12px 24px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>ADD</button>
      </form>
    </div>
  );
};

export default Add;