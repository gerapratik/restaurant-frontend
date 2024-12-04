import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import DeleteIcon from "@mui/icons-material/Delete";

interface RestaurantManagementProps {
  onRegisterRestaurant: (restaurantData: any) => void;
  showSuccessMessage: boolean;
  errorMessages: string[];
}

interface Slot {
  date: string;
  hour: string;
  capacity: number;
}

const RestaurantManagement: React.FC<RestaurantManagementProps> = ({
  onRegisterRestaurant,
  showSuccessMessage,
  errorMessages,
}) => {
  const [slots, setSlots] = useState<Slot[]>([
    { date: "", hour: "", capacity: 0 },
  ]);

  const addSlot = () => {
    setSlots([...slots, { date: "", hour: "", capacity: 0 }]);
  };

  const updateSlot = (index: number, field: string, value: string | number) => {
    const updatedSlots: Slot[] = [...slots];
    (updatedSlots[index] as any)[field as keyof Slot] = value;
    setSlots(updatedSlots);
  };

  const removeSlot = (index: number) => {
    setSlots(slots.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const id = uuidv4();
    const data = {
      id: id,
      name: formData.get("name") as string,
      city: formData.get("city") as string,
      area: formData.get("area") as string,
      cuisine: formData.get("cuisine") as string,
      rating: parseFloat(formData.get("rating") as string),
      cost_for_two: parseFloat(formData.get("cost_for_two") as string),
      is_veg: formData.get("is_veg") === "on",
      slots: slots.map((slot) => ({
        id: uuidv4(),
        restaurant_id: id,
        date: new Date(slot.date).toISOString().split(".")[0],
        hour: parseInt(slot.hour, 10),
        capacity: parseInt(slot.capacity.toString(), 10),
        booked: 0,
      })),
    };

    onRegisterRestaurant(data);
    (e.target as HTMLFormElement).reset();
    setSlots([]);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Restaurant Management
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          placeholder="Restaurant Name"
          className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
          required
          minLength={3}
        />
        <input
          name="city"
          placeholder="City"
          className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
          required
          minLength={3}
        />
        <input
          name="area"
          placeholder="Area"
          className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
          required
          minLength={3}
        />
        <input
          name="cuisine"
          placeholder="Cuisine"
          className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
          required
          minLength={3}
        />
        <input
          name="cost_for_two"
          type="number"
          placeholder="Cost for Two"
          className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
          required
          min={1}
        />
        <input
          name="rating"
          type="number"
          step="0.1"
          min="0"
          max="5"
          placeholder="Rating"
          className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
          required
        />
        <div className="flex items-center space-x-3 py-2">
          <input
            type="checkbox"
            name="is_veg"
            id="is_veg"
            className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
          />
          <label htmlFor="is_veg" className="text-gray-700">
            Vegetarian Only
          </label>
        </div>
        <div className="mt-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2 ">Slots</h3>
          <div>
            {slots.map((slot, index) => (
              <div key={index} className="mb-4">
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <label>Date:</label>
                    <input
                      type="date"
                      value={slot.date}
                      onChange={(e) =>
                        updateSlot(index, "date", e.target.value)
                      }
                      className="w-full p-2 border border-gray-200 rounded"
                      required
                    />
                  </div>
                  <div>
                    <label>Hour:</label>
                    <input
                      type="number"
                      min="0"
                      max="23"
                      value={slot.hour}
                      onChange={(e) =>
                        updateSlot(index, "hour", e.target.value)
                      }
                      className="w-full p-2 border border-gray-200 rounded"
                      required
                    />
                  </div>
                  <div>
                    <label>Capacity:</label>
                    <input
                      type="number"
                      min="1"
                      value={slot.capacity}
                      onChange={(e) =>
                        updateSlot(index, "capacity", e.target.value)
                      }
                      className="w-full p-2 border border-gray-200 rounded"
                      required
                    />
                  </div>
                  <div className="flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => removeSlot(index)}
                      className="p-2 bg-red-600 hover:bg-red-700 rounded-full transition-colors duration-200 flex items-center justify-center"
                      style={{ height: "40px", width: "40px" }}
                    >
                      <DeleteIcon style={{ color: "white" }} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addSlot}
            className="mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            Add Slot
          </button>
        </div>
        <div className="flex gap-4 mt-4">
          <button
            type="submit"
            className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors duration-200"
          >
            Register Restaurant
          </button>
        </div>
        {showSuccessMessage && (
          <p className="text-green-600 text-center mt-4">
            Restaurant registered successfully!
          </p>
        )}
        {errorMessages.length > 0 && (
          <ul className="bg-red-100 text-red-800 p-4 rounded-lg">
            {errorMessages.map((msg, index) => (
              <li key={index}>{msg}</li>
            ))}
          </ul>
        )}
      </form>
    </div>
  );
};

export default RestaurantManagement;
