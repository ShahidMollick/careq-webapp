import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Facility {
  id: string;
  name: string;
  city: string;
}

interface Role {
  id: string;
  name: string;
}

interface UserFacilityRole {
  id: string;
  facility: Facility;
  role: Role;
}

interface UserRolesState {
  roles: UserFacilityRole[];
  selectedFacility: Facility | null;
  selectedRole: string | null;
}

// ✅ Load initial state from localStorage
const loadState = (): UserRolesState => {
  try {
    const storedRoles = localStorage.getItem("userRoles");
    const storedFacility = localStorage.getItem("selectedFacility");
    const storedRole = localStorage.getItem("selectedRole");

    return {
      roles: storedRoles ? JSON.parse(storedRoles) : [],
      selectedFacility: storedFacility ? JSON.parse(storedFacility) : null,
      selectedRole: storedRole || null,
    };
  } catch (error) {
    console.error("Error loading user roles from localStorage", error);
    return { roles: [], selectedFacility: null, selectedRole: null };
  }
};

const initialState: UserRolesState = loadState();

const userRolesSlice = createSlice({
  name: "userRoles",
  initialState,
  reducers: {
    setUserRoles: (state, action: PayloadAction<UserFacilityRole[]>) => {
      state.roles = action.payload;

      if (action.payload.length > 0) {
        const { facility, role } = action.payload[0];
        state.selectedFacility = facility;
        state.selectedRole = role.name;

        // ✅ Store in localStorage for persistence
        localStorage.setItem("userRoles", JSON.stringify(action.payload));
        localStorage.setItem("selectedFacility", JSON.stringify(facility));
        localStorage.setItem("selectedRole", role.name);
      }
    },
    selectFacilityRole: (
      state,
      action: PayloadAction<{ facility: Facility; role: string }>
    ) => {
      state.selectedFacility = action.payload.facility;
      state.selectedRole = action.payload.role;

      localStorage.setItem(
        "selectedFacility",
        JSON.stringify(action.payload.facility)
      );
      localStorage.setItem("selectedRole", action.payload.role);
    },
    clearUserRoles: (state) => {
      state.roles = [];
      state.selectedFacility = null;
      state.selectedRole = null;
      localStorage.removeItem("userRoles");
      localStorage.removeItem("selectedFacility");
      localStorage.removeItem("selectedRole");
    },
  },
});

export const { setUserRoles, selectFacilityRole, clearUserRoles } =
  userRolesSlice.actions;

export default userRolesSlice.reducer;
