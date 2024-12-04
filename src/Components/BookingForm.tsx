import React, { useState, useEffect } from "react";

interface Slot {
  id: string;
  hour: number;
  capacity: number;
  booked: number;
}

interface BookingFormProps {
  restaurant: {
    id: string;
    name: string;
  };
  onCancel: () => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ restaurant, onCancel }) => {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [numberOfPeople, setNumberOfPeople] = useState<number>(1);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const res = await fetch(
          `http://13.127.141.1/restaurants/${restaurant.id}/slots`
        );
        if (res.ok) {
          const fetchedSlots = await res.json();
          setSlots(fetchedSlots);
        } else {
          setError("Failed to fetch slots.");
        }
      } catch (err) {
        setError("Error fetching slots. Please try again later.");
      }
    };

    fetchSlots();
  }, [restaurant.id]);

  useEffect(() => {
    if (selectedSlot) {
      const selectedSlotDetails = slots.find(
        (slot) => slot.id === selectedSlot
      );
      if (selectedSlotDetails) {
        setNumberOfPeople(
          Math.min(
            numberOfPeople,
            selectedSlotDetails.capacity - selectedSlotDetails.booked
          )
        );
      }
    }
  }, [selectedSlot, slots]);

  const handleBooking = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedSlot || selectedSlot === "") {
      setError("Please select a slot.");
      return;
    }

    const bookingData = {
      slot_id: selectedSlot,
      number_of_people: numberOfPeople,
    };

    try {
      const res = await fetch("http://13.127.141.1/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });

      if (res.ok) {
        setSuccessMessage("Booking successful!");
        setTimeout(() => {
          onCancel();
        }, 1500);
      } else {
        const errorResponse = await res.json();
        setError(errorResponse.detail || "Failed to book the slot.");
      }
    } catch (err) {
      setError("Error creating booking. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl max-w-md w-full">
        <h3 className="text-2xl font-semibold mb-4">
          Book a Table at {restaurant.name}
        </h3>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <form onSubmit={handleBooking} className="space-y-4">
          {slots.length > 0 ? (
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Select a Slot:
              </label>
              <select
                value={selectedSlot || ""}
                onChange={(e) => setSelectedSlot(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg"
                required
              >
                <option value="" disabled>
                  Choose a slot
                </option>
                {slots.map((slot) => (
                  <option
                    key={slot.id}
                    value={slot.id}
                    disabled={slot.capacity - slot.booked <= 0}
                  >
                    {slot.hour}:00 - Available: {slot.capacity - slot.booked}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <p className="text-gray-500">No slots available.</p>
          )}

          <input
            type="number"
            value={numberOfPeople}
            onChange={(e) => {
              const value = e.target.value;

              if (value === "") {
                setNumberOfPeople(0);
              } else {
                const numericValue = parseInt(value);

                setNumberOfPeople(numericValue >= 1 ? numericValue : 1);
              }
            }}
            placeholder="Number of People"
            min="1"
            max={
              selectedSlot && slots.length > 0
                ? (slots.find((slot) => slot.id === selectedSlot)?.capacity ??
                    0) -
                    (slots.find((slot) => slot.id === selectedSlot)?.booked ??
                      0) || 1
                : 1
            }
            className="w-full p-3 border border-gray-200 rounded-lg"
            required
          />

          <div className="flex gap-4">
            <button
              type="submit"
              className={`flex-1 py-2 rounded-lg font-medium ${
                !selectedSlot || selectedSlot === ""
                  ? "bg-indigo-300 text-white cursor-not-allowed"
                  : "bg-indigo-600 text-white hover:bg-indigo-700"
              }`}
              disabled={!selectedSlot || selectedSlot === ""}
            >
              Book Now
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg font-medium hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
          {successMessage !== null && (
            <div className="text-green-500">{successMessage}</div>
          )}
        </form>
      </div>
    </div>
  );
};

export default BookingForm;
