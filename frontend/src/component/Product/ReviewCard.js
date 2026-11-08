import { Rating } from "@material-ui/lab";
import React, { useState } from "react";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import ThumbUpAltIcon from "@material-ui/icons/ThumbUpAlt";
import "./ReviewCard.css";

const ReviewCard = ({ review }) => {
  const [helpfulCount, setHelpfulCount] = useState(
    Math.floor((Number(review.rating) || 4) * 3)
  );
  const [hasVoted, setHasVoted] = useState(false);

  const handleHelpfulClick = () => {
    if (hasVoted) {
      setHelpfulCount((prev) => prev - 1);
      setHasVoted(false);
    } else {
      setHelpfulCount((prev) => prev + 1);
      setHasVoted(true);
    }
  };

  const options = {
    value: Number(review.rating) || 0,
    readOnly: true,
    precision: 0.5,
    size: "small",
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="luxuryReviewCard">
      <div className="reviewCardHeader">
        <div className="reviewerAvatar">
          <span>{getInitials(review.name)}</span>
        </div>
        <div className="reviewerMeta">
          <div className="reviewerNameRow">
            <h4 className="reviewerName">{review.name}</h4>
            <span className="verifiedBuyerBadge">
              <CheckCircleIcon style={{ fontSize: "0.85rem", color: "#10b981" }} />
              Verified Buyer
            </span>
          </div>
          <div className="reviewRatingRow">
            <Rating {...options} />
            <span className="reviewDateTag">Verified Purchase</span>
          </div>
        </div>
      </div>

      <p className="reviewCardCommentText">{review.comment}</p>

      <div className="reviewCardFooter">
        <button
          type="button"
          className={`helpfulBtn ${hasVoted ? "voted" : ""}`}
          onClick={handleHelpfulClick}
          title="Mark review as helpful"
        >
          <ThumbUpAltIcon style={{ fontSize: "0.9rem" }} />
          <span>Helpful ({helpfulCount})</span>
        </button>
      </div>
    </div>
  );
};

export default ReviewCard;
