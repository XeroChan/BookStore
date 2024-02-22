import { jwtDecode } from "jwt-decode";

export async function fetchClientById(clientId, setClient) {
    try {
      // Your API call or data fetching logic to get a specific client
      const response = await fetch(`http://localhost:5088/clients/${clientId}`);
      if (response.ok) {
        const clientData = await response.json();
        // Update the state or perform other actions with the client data
        setClient(clientData);
      } else {
        console.error(
          `Error fetching client with ID ${clientId}:`,
          response.statusText
        );
      }
    } catch (error) {
      console.error(`Error fetching client with ID ${clientId}:`, error);
    }
  }

  export  async function fetchBooks(setBooks) {
    try {
      const response = await fetch("http://localhost:5088/books");
      if (response.ok) {
        const data = await response.json();
        setBooks(data);
      } else {
        console.error("Error fetching books:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  }

  export  async function fetchClients(setClients) {
    try {
      const response = await fetch("http://localhost:5088/clients");
      if (response.ok) {
        const data = await response.json();
        setClients(data);
      } else {
        console.error("Error fetching clients:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  }

  export  async function fetchRentals(setRentals) {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("http://localhost:5088/rentals", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.replace(/"/g, "")}`,
          mode: "cors",
          credentials: "include",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setRentals(data);
      } else {
        console.error("Error fetching rentals:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching rentals:", error);
    }
  }
  export function getUserInfo(setUser) {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const decodedUser = jwtDecode(token);
        setUser(decodedUser);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  };