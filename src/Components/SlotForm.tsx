import React from "react";

interface SlotFormProps {
  onSubmit: (slotData: any) => void;
  onCancel: () => void;
}

const SlotForm: React.FC<SlotFormProps> = ({ onSubmit, onCancel }) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      date: formData.get("date"),
      time: formData.get("time"),
      tables: parseInt(formData.get("tables") as string),
    };

    onSubmit(data);
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl max-w-md w-full">
        <h3 className="text-2xl font-semibold mb-4">Add Time Slots</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="date"
            name="date"
            className="w-full p-3 border border-gray-200 rounded-lg"
            required
          />
          <select
            name="time"
            className="w-full p-3 border border-gray-200 rounded-lg"
            required
          >
            {Array.from({ length: 12 }, (_, i) => i + 10).map((hour) => (
              <option key={hour} value={`${hour}:00`}>
                {hour}:00
              </option>
            ))}
          </select>
          <input
            type="number"
            name="tables"
            placeholder="Number of Tables Available"
            min="1"
            className="w-full p-3 border border-gray-200 rounded-lg"
            required
          />
          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700"
            >
              Add Slot
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg font-medium hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SlotForm;
