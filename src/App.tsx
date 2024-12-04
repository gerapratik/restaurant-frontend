import { useState } from "react";
import TabSelector from "./Components/TabSelector";
import CustomerSearch from "./Components/CustomerSearch";
import RestaurantManagement from "./Components/RestaurantManagement";
import BookingForm from "./Components/BookingForm";
import SlotForm from "./Components/SlotForm";

export default function App() {
  const [tab, setTab] = useState("customer");
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<any>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showSlotForm, setShowSlotForm] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);

  const handleSearchRestaurants = (results: any) => {
    setRestaurants(results);
  };

  const handleAddSlot = async (slotData: any) => {
    try {
      await fetch(
        `http://13.127.141.1/restaurants/${selectedRestaurant?.id || ""}/slots`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(slotData),
        }
      );
      setShowSlotForm(false);
    } catch (error) {
      console.error("Adding slot failed", error);
    }
  };

  const handleRegisterRestaurant = async (restaurantData: any) => {
    try {
      const response = await fetch("http://13.127.141.1/restaurants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(restaurantData),
      });

      if (response.status === 200) {
        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 3000);
      } else {
        const errorData = await response.json();
        const messages = errorData.detail.map(
          (err: { msg: string }) => err.msg
        );
        setErrorMessages(messages);
        setTimeout(() => setErrorMessages([]), 3000);
      }
    } catch (error) {
      setErrorMessages(["An unexpected error occurred. Please try again."]);
      console.error("Restaurant registration failed", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
          Restaurant Booking
        </h1>

        <TabSelector currentTab={tab} onTabChange={setTab} />

        {tab === "customer" ? (
          <CustomerSearch
            onSearchRestaurants={handleSearchRestaurants}
            restaurants={restaurants}
            onBookTable={(restaurant: any) => {
              setSelectedRestaurant(restaurant);
              setShowBookingForm(true);
            }}
          />
        ) : (
          <RestaurantManagement
            onRegisterRestaurant={handleRegisterRestaurant}
            showSuccessMessage={showSuccessMessage}
            errorMessages={errorMessages}
          />
        )}

        {showBookingForm && selectedRestaurant && (
          <BookingForm
            restaurant={selectedRestaurant}
            onCancel={() => {
              setShowBookingForm(false);
              setSelectedRestaurant(null);
            }}
          />
        )}

        {showSlotForm && (
          <SlotForm
            onSubmit={handleAddSlot}
            onCancel={() => setShowSlotForm(false)}
          />
        )}
      </div>
    </div>
  );
}
