import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import Toast from "../../components/Toast";
import ListSeat from "./ListSeat"; // You’ll make this similar to ListSection
import MainLayout from "../../layouts/Mainlayout";
import { UserContext } from "../../context/UserContext";

// export default function AddSeat() {
//   return (
//     <MainLayout>
//       <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
//         <div className="text-center p-4 border rounded shadow-sm bg-light">
//           <i className="bi bi-tools text-warning" style={{ fontSize: '3rem' }}></i>
//           <h2 className="mt-3">Page Under Construction</h2>
//           <p className="text-muted">
//             We're currently building this page. Please check back later!
//           </p>
//         </div>
//       </div>
//     </MainLayout>
//   );
// }
const AddSeat = () => {
  const { user } = useContext(UserContext);
  const isViewMode = user.role === "ViewOnly";
  const [seatData, setSeatData] = useState({
    seat_name: "",
    seat_desc: "",
    section_id: "",
    section_name: "",
    seat_role_id: "",
    seat_role_name: "",
    seat_role_level: "",
    reports_to_seat_id: "",
    reports_to_seat_name: "",
  });

  const [sections, setSections] = useState([]);
  const [seatRoles, setSeatRoles] = useState([]);
  const [seats, setSeats] = useState([]); // all seats for "reports to"
  const [filteredReportsToSeats, setFilteredReportsToSeats] = useState([]);

  const [toast, setToast] = useState({ message: "", type: "" });
  const [refreshList, setRefreshList] = useState(false);

  // Fetch all sections
  useEffect(() => {
    const fetchSections = async () => {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/pages/misc/misc.ajax.php`,
          { type: "getSections" },
          { headers: { "Content-Type": "application/json" }, withCredentials: true }
        );
        setSections(response.data.data || []);
      } catch (error) {
        console.error("Error fetching sections:", error);
      }
    };
    fetchSections();
  }, []);

  // Fetch all seat roles
  useEffect(() => {
    const fetchSeatRoles = async () => {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/pages/misc/misc.ajax.php`,
          { type: "getSeatRoles" },
          { headers: { "Content-Type": "application/json" }, withCredentials: true }
        );
        setSeatRoles(response.data.data || []);
      } catch (error) {
        console.error("Error fetching seat roles:", error);
      }
    };
    fetchSeatRoles();
  }, []);

  // Fetch all seats (for reports_to)
  useEffect(() => {
    const fetchSeats = async () => {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/pages/misc/misc.ajax.php`,
          { type: "getSeats" },
          { headers: { "Content-Type": "application/json" }, withCredentials: true }
        );
        setSeats(response.data.data || []);
      } catch (error) {
        console.error("Error fetching seats:", error);
      }
    };
    fetchSeats();
  }, []);

  // Filter "Reports To Seat" when role changes
  useEffect(() => {
    if (!seatData.seat_role_id) {
      setFilteredReportsToSeats([]);
      return;
    }
    const currentRole = seatRoles.find(
      (r) => r.role_id === seatData.seat_role_id
    );
    if (currentRole) {
      const higherLevelSeats = seats.filter(
        (s) => s.seat_role_level < currentRole.role_level
      );
      setFilteredReportsToSeats(higherLevelSeats);
    }
  }, [seatData.seat_role_id, seatRoles, seats]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSeatData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSeat = async () => {
    const { seat_name, seat_role_id, section_id, reports_to_seat_id } = seatData;

    if (!seat_name || !seat_role_id) {
      setToast({ message: "All fields except Reports To are required.", type: "error" });
      return;
    }
    // find section_name and reports_to_seat_name
    const selectedSection = sections.find((s) => s.section_id === section_id);
    const selectedReportsToSeat = seats.find((s) => s.seat_id === reports_to_seat_id);
    const selectedRole = seatRoles.find((s) => s.role_id === seat_role_id);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/pages/misc/misc.ajax.php`,
        {
          type: "addSeat",
          ...seatData,
          section_name: selectedSection ? selectedSection.section_name : "",
          reports_to_seat_name: selectedReportsToSeat ? selectedReportsToSeat.seat_name : "",
          seat_role_name: selectedRole ? selectedRole.role_name : "",
          seat_role_level: selectedRole ? selectedRole.role_level : "",
          created_by: user.id,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (response.data.status) {
        setToast({ message: "Seat added successfully!", type: "success" });
        setSeatData({
          seat_name: "",
          seat_desc: "",
          section_id: "",
          seat_role_id: "",
          reports_to_seat_id: "",
        });
        setRefreshList((prev) => !prev);
      } else {
        setToast({
          message: response.data.message || "Failed to add seat.",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error adding seat:", error);
      setToast({ message: "Server error while adding seat.", type: "error" });
    }
  };

  return (
    <MainLayout>
      <div className="container mt-4">
        <h2 className="text-center mb-4">Add Seat</h2>

        {toast.message && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast({ message: "", type: "" })}
          />
        )}

        <div className="card p-4 shadow-sm">
          <div className="row">
            {/* Seat Name */}
            <div className="form-group mb-3 col-md-6">
              <label>Seat Name</label>
              <input
                type="text"
                className="form-control"
                name="seat_name"
                value={seatData.seat_name}
                onChange={handleChange}
                placeholder="Enter Seat Name"
              />
            </div>

            {/* Seat Description */}
            <div className="form-group mb-3 col-md-6">
              <label>Seat Description</label>
              <input
                type="text"
                className="form-control"
                name="seat_desc"
                value={seatData.seat_desc}
                onChange={handleChange}
                placeholder="Enter Seat Description"
              />
            </div>

            {/* Section */}
            <div className="form-group mb-3 col-md-6">
              <label>Section</label>
              <select
                className="form-select"
                name="section_id"
                value={seatData.section_id}
                onChange={handleChange}
              >
                <option value="">Select Section</option>
                {sections.map((sec) => (
                  <option key={sec.section_id} value={sec.section_id}>
                    {sec.section_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Seat Role */}
            <div className="form-group mb-3 col-md-6">
              <label>Seat Role</label>
              <select
                className="form-select"
                name="seat_role_id"
                value={seatData.seat_role_id}
                onChange={handleChange}
              >
                <option value="">Select Seat Role</option>
                {seatRoles.map((role) => (
                  <option key={role.role_id} value={role.role_id}>
                    {role.role_name} (Level {role.role_level})
                  </option>
                ))}
              </select>
            </div>

            {/* Reports To Seat */}
            <div className="form-group mb-3 col-md-6">
              <label>Reports To Seat</label>
              <select
                className="form-select"
                name="reports_to_seat_id"
                value={seatData.reports_to_seat_id}
                onChange={handleChange}
              >
                <option value="">Select Reporting Seat</option>
                {filteredReportsToSeats.map((s) => (
                  <option key={s.seat_id} value={s.seat_id}>
                    {s.seat_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {!isViewMode && (<button className="btn btn-primary mt-3" onClick={handleAddSeat}>
            ADD SEAT
          </button>)}
        </div>

        <ListSeat refresh={refreshList} />
      </div>
    </MainLayout>
  );
};

export default AddSeat;