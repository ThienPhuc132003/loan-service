import React, { useEffect, useState } from "react";
import Button from "./Button";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Api from "../network/Api";
import { METHOD_TYPE } from "../network/methodType";
import { addItem } from "../redux/CartSlice";
import "../assets/css/productDetail.style.css";

const ProductComponent = () => {
  const dispatch = useDispatch();
  const { productId } = useParams();
  const [productData, setProductData] = useState({});
  const [localQuantity, setLocalQuantity] = useState(1); // Local quantity state
  const cartItems = useSelector((state) => state.cart.items); // Access cart state

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        const response = await Api({
          endpoint: `https://667943a618a459f6394ee5b4.mockapi.io/Product`,
          query: { id: productId },
          method: METHOD_TYPE.GET,
        });
        const itemDetail = response.find(
          (item) => item.id === parseInt(productId)
        );
        setProductData(itemDetail);
        setLocalQuantity(1);
        console.log(itemDetail);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProductDetail();
  }, [productId]);

  const handleIncrementLocalQuantity = () => {
    setLocalQuantity((prevQuantity) => prevQuantity + 1);
  };

  const handleDecrementLocalQuantity = () => {
    setLocalQuantity((prevQuantity) =>
      prevQuantity > 1 ? prevQuantity - 1 : 1
    );
  };

  const handleAddToCart = () => {
    const itemToAdd = { ...productData, quantity: localQuantity };
    console.log("Dispatching item to cart:", itemToAdd);
    dispatch(addItem(itemToAdd));
    console.log("Updated cart state:", cartItems);
  };

  return (
    <div>
      <div className="item-detail-box">
        <div className="box1">
          <img src={productData?.image} className="image" alt="Product" />
        </div>
        <div className="box2">
          <div>{productData.id}</div>
          <div className="item-name">{productData.furniture_name}</div>
          <div className="item-price">${productData.price * localQuantity}</div>
          <div className="item-value">
            <Button className="plus-btn" onClick={handleIncrementLocalQuantity}>
              <i className="fa-solid fa-plus"></i>
            </Button>
            <div className="item-quantity">{localQuantity}</div>
            <Button
              className="minus-btn"
              onClick={handleDecrementLocalQuantity}
              style={{
                filter: localQuantity === 1 ? "color: #cccccc" : "none",
              }}
              disabled={localQuantity === 1}
            >
              <i className="fa-solid fa-minus"></i>
            </Button>
          </div>
          <div className="btn-box">
            <Button className="add-btn" onClick={handleAddToCart}>
              Add to cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

ProductComponent.propTypes = {
  data: PropTypes.object.isRequired,
  incrementItem: PropTypes.func,
  decrementItem: PropTypes.func,
  handleRemoveItem: PropTypes.func,
};

const ProductDetail = React.memo(ProductComponent);
export default ProductDetail;
