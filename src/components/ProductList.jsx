// src/components/ProductList.jsx
import React from "react";
import PropTypes from "prop-types";
import Button from "./Button";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const ProductListComponent = ({
  dataSource = [],
  onAddAction,
  onViewAction,
  isLoading,
}) => {
  return (
    <div>
      <div className="item-list-box">
        <div className="item-list">
          {isLoading ? (
            <SkeletonTheme baseColor="#e0e0e0" highlightColor="#f5f5f5">
              {Array.from({ length: 12 }).map((_, index) => (
                <div className="item" key={index}>
                  <Skeleton height={250} width={200} />
                  <Skeleton height={31} width={200} />
                  <Skeleton height={22} width={200} />
                </div>
              ))}
            </SkeletonTheme>
          ) : (
            dataSource.map((product) => (
              <div className="item" key={product.id}>
                <img src={product.image} alt={product.furniture_name} />
                <h2>{product.furniture_name}</h2>
                <p>{product.category}</p>
                <p>Price: ${product.price}</p>
                <div className="btn-product">
                  <Button
                    className="detail-btn"
                    onClick={() => onViewAction && onViewAction(product.id)}
                  >
                    View Detail
                  </Button>
                  <Button
                    className="add-btn"
                    onClick={() => onAddAction && onAddAction(product)}
                  >
                    Add to Cart
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

ProductListComponent.propTypes = {
  dataSource: PropTypes.array.isRequired,
  onAddAction: PropTypes.func,
  onViewAction: PropTypes.func,
  isLoading: PropTypes.bool, 
};

const ProductList = React.memo(ProductListComponent);
export default ProductList;
