import React, { useEffect, useState } from "react";
import "./List.css";
import axios from "axios";
import { toast } from "react-toastify";
import { useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";

const List = ({ url }) => {
  const navigate = useNavigate();
  const { token,admin } = useContext(StoreContext);
  const [list, setList] = useState([]);
  const [editingPhoto, setEditingPhoto] = useState(null);
  const [newImage, setNewImage] = useState(null);

  const fetchList = async () => {
    const response = await axios.get(`${url}/api/food/list`);
    if (response.data.success) {
      setList(response.data.data);
    } else {
      toast.error("Error");
    }
  };

  const removeFood = async (foodId) => {
    const response = await axios.post(
      `${url}/api/food/remove`,
      { id: foodId },
      { headers: { token } }
    );
    await fetchList();
    if (response.data.success) {
      toast.success(response.data.message);
    } else {
      toast.error("Error");
    }
  };

  const updatePhoto = async (foodId) => {
    if (!newImage) {
      toast.error("Please select an image");
      return;
    }

    const formData = new FormData();
    formData.append("id", foodId);
    formData.append("image", newImage);

    try {
      const response = await axios.post(
        `${url}/api/food/update-image`,
        formData,
        { headers: { token } }
      );
      
      if (response.data.success) {
        toast.success("Image updated successfully");
        setEditingPhoto(null);
        setNewImage(null);
        fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Failed to update image");
    }
  };
  useEffect(() => {
    if (!admin && !token) {
      toast.error("Please Login First");
      navigate("/");
    }
    fetchList();
  }, []);

  return (
    <div className="list add flex-col">
      <p>All Food List</p>
      <div className="list-table">
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Actions</b>
        </div>
        {list.map((item, index) => {
          return (
            <div key={index} className="list-table-format">
              <div className="image-container">
                <img src={`${url}/images/` + item.image} alt="" />
                {editingPhoto === item._id ? (
                  <div className="edit-photo">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => setNewImage(e.target.files[0])}
                    />
                    <button onClick={() => updatePhoto(item._id)}>Save</button>
                    <button onClick={() => setEditingPhoto(null)}>Cancel</button>
                  </div>
                ) : (
                  <button 
                    className="edit-btn"
                    onClick={() => setEditingPhoto(item._id)}
                  >
                    Edit Photo
                  </button>
                )}
              </div>
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>₹{item.price}</p>
              <div className="action-buttons">
                <p onClick={() => removeFood(item._id)} className="cursor delete-btn">
                  Delete
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default List;
