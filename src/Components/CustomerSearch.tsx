import React, { useEffect, useState } from "react";

interface Restaurant {
  id: number;
  name: string;
  area: string;
  city: string;
  rating: number;
  cost_for_two: number;
  is_veg: boolean;
}

interface CustomerSearchProps {
  onSearchRestaurants: (restaurants: Restaurant[]) => void;
  restaurants: Restaurant[];
  onBookTable: (restaurant: Restaurant) => void;
}

const CustomerSearch: React.FC<CustomerSearchProps> = ({
  onSearchRestaurants,
  restaurants,
  onBookTable,
}) => {
  const [searchParams, setSearchParams] = useState({
    name: "",
    city: "",
    area: "",
  });
  const [searchInitiated, setSearchInitiated] = useState(false);

  const searchRestaurants = async () => {
    const params = new URLSearchParams(searchParams);
    const res = await fetch(`http://13.127.141.1/restaurants?${params}`);
    const data = await res.json();
    onSearchRestaurants(data);
    setSearchInitiated(true);
  };
  useEffect(() => {
    onSearchRestaurants([]);
  }, [searchParams]);

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Search Restaurants
      </h2>
      <div className="space-y-4">
        <input
          className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
          placeholder="Restaurant Name"
          onChange={(e) => {
            setSearchParams({ ...searchParams, name: e.target.value });
            setSearchInitiated(false);
          }}
        />
        <input
          className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
          placeholder="City"
          onChange={(e) => {
            setSearchParams({ ...searchParams, city: e.target.value });
            setSearchInitiated(false);
          }}
        />
        <input
          className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
          placeholder="Area"
          onChange={(e) => {
            setSearchParams({ ...searchParams, area: e.target.value });
            setSearchInitiated(false);
          }}
        />

        <button
          className={`w-full py-3 rounded-lg font-medium transition-colors duration-200 ${
            searchParams.name || searchParams.city || searchParams.area
              ? "bg-indigo-600 text-white hover:bg-indigo-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
          onClick={searchRestaurants}
          disabled={
            !searchParams.name &&
            searchParams.city === "" &&
            searchParams.area === ""
          }
        >
          Search
        </button>

        <div className="mt-8 space-y-6">
          {(restaurants.length === 0 && searchParams.name !== "") ||
          searchParams.area !== "" ||
          (searchParams.city !== "" && searchInitiated) ? (
            <p className="text-center text-gray-600">
              No restaurants found. Please try different search criteria.
            </p>
          ) : (
            restaurants.map((restaurant) => (
              <div
                key={restaurant.id}
                className="bg-gray-50 p-6 rounded-lg hover:shadow-md transition-shadow"
              >
                <p className="text-gray-600 mb-2">
                  {restaurant.name} {restaurant.area}, {restaurant.city}
                </p>
                <div className="flex justify-between items-center mb-4">
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                    Rating: {restaurant.rating}★
                  </span>
                  <span className="text-gray-700">
                    ₹{restaurant.cost_for_two} for two
                  </span>
                </div>
                <button
                  onClick={() => onBookTable(restaurant)}
                  className="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors duration-200"
                >
                  Book Table
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerSearch;
