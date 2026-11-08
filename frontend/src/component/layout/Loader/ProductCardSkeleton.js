import React from "react";
import "./ProductCardSkeleton.css";

const ProductCardSkeleton = () => {
  return (
    <div className="skeletonCard" aria-hidden="true">
      <div className="skeletonImage" />
      <div className="skeletonContent">
        <div className="skeletonText skeletonTitle" />
        <div className="skeletonText skeletonRating" />
        <div className="skeletonFooter">
          <div className="skeletonText skeletonPrice" />
          <div className="skeletonText skeletonBadge" />
        </div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
