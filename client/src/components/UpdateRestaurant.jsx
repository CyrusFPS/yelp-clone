import React, { useState, useEffect, useContext } from 'react'
import { useParams, useHistory } from 'react-router-dom';
import RestaurantFinder from '../apis/RestaurantFinder';
import { RestaurantsContext } from '../context/RestaurantsContext';

const UpdateRestaurant = (props) => {
  const { id } = useParams();
  const { restaurants } = useContext(RestaurantsContext);
  let history = useHistory();
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [price_range, setPriceRange] = useState("Price Range");

  useEffect(() => {
    const fetchData = async () => {
      const response = await RestaurantFinder.get(`/api/v1/restaurants/${id}`);
      const restaurant = response.data.data.restaurant;
      setName(restaurant.name);
      setLocation(restaurant.location);
      setPriceRange(restaurant.price_range);
    }
    
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await RestaurantFinder.put(`/api/v1/restaurants/${id}`, {
        name,
        location,
        price_range,
      });
      history.push('/');
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <form action="" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} id="name" type="text" className="form-control"/>
        </div>
        <div className="form-group">
          <label htmlFor="location">Location</label>
          <input value={location} onChange={(e) => setLocation(e.target.value)} id="location" type="text" className="form-control"/>
        </div>
        <div className="form-group">
            <label htmlFor="price_range">Price Range</label>
            <select
              className="custom-select my-1 mr-sm-2"
              id="price_range"
              value={price_range} 
              onChange={(e) => setPriceRange(e.target.value)} 
            >
              <option disabled>Price Range</option>
              <option value="1">$</option>
              <option value="2">$$</option>
              <option value="3">$$$</option>
              <option value="4">$$$$</option>
              <option value="5">$$$$$</option>
            </select>
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    </div>
  )
}

export default UpdateRestaurant
