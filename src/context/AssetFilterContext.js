import { createContext, useState } from "react";

export const AssetFilterContext = createContext();

export const AssetFilterProvider = ({ children }) => {
  const [filters, setFilters] = useState({
    selectedType: '',
    selectedSubType: '',
    selectedEntity: '',
    selectedNode: '',
    selectedCampus: '',
    selectedLand: '',
    selectedBuilding: '',
    selectedFloor: '',
    selectedRoom: '',
    selectedSection: '',
    selectedSeat: '',
    assigned:'',
    verified:'',
    searchText: '',
    page: 1,
    limit: 100
  });

  return (
    <AssetFilterContext.Provider value={{ filters, setFilters }}>
      {children}
    </AssetFilterContext.Provider>
  );
};
