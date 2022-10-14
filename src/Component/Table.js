import React, { useState, useEffect } from "react";
import userService from "../Service/userService";
import { useNavigate } from "react-router-dom";
import "./style.css";

const Table = () => {
  const [user, setUser] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await userService.getUserById();
        setUser(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);
  return (
    <div class="table-wrapper">
      <table class="fl-table">
        <thead>
          <tr>
            <th>USERNAME</th>
            <th>AMOUNT</th>
            <th>INTREST </th>
            <th>TENURE </th>
            <th>EMI </th>
          </tr>
        </thead>
        <tbody />
        {user.map((user) => (
          <tr key={user.id}>
            <td>{user.userName} </td>
            <td>{user.principalAmount}</td>
            <td>{user.annualIntrestRate}</td>
            <td>{user.tenure}</td>
            <td>{user.emi}</td>
          </tr>
        ))}
        ;
      </table>
    </div>
  );
};

export default Table;
