const BuildingTypeSelector = ({ selectedType, onSelect }) => {
    const types = [
      { label: "Home", value: "home" },
      { label: "Work", value: "work" },
      { label: "Other", value: "other" },
    ];
  
    return (
      <div className="mt-4">
        <h3 className="font-medium mb-2">Select Building Type</h3>
        <div className="flex gap-4">
          {types.map((type) => (
            <button
              key={type.value}
              onClick={() => onSelect(type.value)}
              className={`px-4 py-2 rounded border ${
                selectedType === type.value
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300"
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>
    );
  };
  
  export default BuildingTypeSelector;
  