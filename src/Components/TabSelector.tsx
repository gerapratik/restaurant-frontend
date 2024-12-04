import React from "react";

interface TabSelectorProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

const TabSelector: React.FC<TabSelectorProps> = ({
  currentTab,
  onTabChange,
}) => {
  return (
    <div className="flex justify-center gap-8 mb-8">
      {["customer", "owner"].map((tabName) => (
        <div
          key={tabName}
          onClick={() => onTabChange(tabName)}
          className={`cursor-pointer w-64 p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-transform transform hover:scale-105 
            ${
              currentTab === tabName
                ? "border-2 border-indigo-600"
                : "border border-gray-200"
            }`}
        >
          <h2 className="text-xl font-semibold text-gray-800 text-center">
            {tabName === "customer" ? "Customer" : "Restaurant Owner"}
          </h2>
          <p className="text-gray-600 text-center mt-2">
            {tabName === "customer"
              ? "Search and book restaurants"
              : "Manage your restaurant"}
          </p>
        </div>
      ))}
    </div>
  );
};

export default TabSelector;
