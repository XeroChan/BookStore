import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { styled } from '@mui/system';

const StyledInput = styled('input')({
  '::placeholder': {
    color: '#dbdbdb', // Change this to your desired placeholder color#dbdbdb
  },
});

const DeleteAccount = ({ clientId, setIsAuthenticated, IsAuthenticated }) => {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    try {
      const token = sessionStorage.getItem("authToken").replace(/"/g, "");
      const response = await fetch(`http://localhost:5088/clients/${clientId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ password }),
      });
  
      if (response.ok) {
        sessionStorage.removeItem("authToken");
        setIsAuthenticated(false);
        navigate("/");
      } else {
        console.error("Failed to delete account:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  };

  return (
    <div>
      <StyledInput
        type="password"
        placeholder="Potwierdź hasło"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleDeleteAccount}>Usuń konto</button>
    </div>
  );
};

export default DeleteAccount;