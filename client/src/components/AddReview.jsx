import React, { useState } from 'react'
import RestaurantFinder from '../apis/RestaurantFinder';
import { useParams } from 'react-router-dom';

const AddReview = () => {
  const { id } = useParams();
  const [name, setName] = useState("");
  const [body, setBody] = useState("");
  const [rating, setRating] = useState("Rating");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await RestaurantFinder.post(`/api/v1/restaurants/${id}/reviews`, {
        name,
        body,
        rating,
      });
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="mb-2">
      <form action="" onSubmit={(e) => handleSubmit(e)}>
        <div className="form-row">
          <div className="form-group col-8">
            <label htmlFor="name">Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} id="name" placeholder="name" type="text" className="form-control" />
          </div>
          <div className="form-group col-4">
            <label htmlFor="rating">Rating</label>
            <select value={rating} onChange={(e) => setRating(e.target.value)} id="rating" className="custom-select">
              <option disabled>Rating</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="Review">Review</label>
          <textarea value={body} onChange={(e) => setBody(e.target.value)} id="Review" className="form-control"></textarea>
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  )
}

export default AddReview
