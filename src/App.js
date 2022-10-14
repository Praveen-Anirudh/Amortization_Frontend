import "./App.css";
import React, { useState } from "react";
import userService from "./Service/userService";
import { useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    id: "",
    userName: "",
    principalAmount: "",
    annualIntrestRate: "",
    tenure: "",
    emi: "",
  });
  // state to storage the results of the calculation
  const [results, setResults] = useState({
    monthlyPayment: "",
    totalPayment: "",
    totalInterest: "",
    isResult: false,
  });
  // state to storage error message
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    setUser({ ...user, [e.target.name]: value });
  };

  // Manage validations and error messages
  const isValid = () => {
    const { principalAmount, annualIntrestRate, tenure } = user;
    let actualError = "";
    // Validate if there are values
    if (!principalAmount || !annualIntrestRate || !tenure) {
      actualError = "All the values are required";
    }
    // Validade if the values are numbers
    if (isNaN(principalAmount) || isNaN(annualIntrestRate) || isNaN(tenure)) {
      actualError = "All the values must be a valid number";
    }
    // Validade if the values are positive numbers
    if (
      Number(principalAmount) <= 0 ||
      Number(annualIntrestRate) <= 0 ||
      Number(tenure) <= 0
    ) {
      actualError = "All the values must be a positive number";
    }
    if (actualError) {
      setError(actualError);
      return false;
    }
    return true;
  };
  // Handle the data submited - validate inputs and send it as a parameter to the function that calculates the loan
  const handleSubmitValues = (e) => {
    e.preventDefault();
    if (isValid()) {
      setError("");
      calculateResults(user);
    }
  };

  // Calculation
  const calculateResults = ({ principalAmount, annualIntrestRate, tenure }) => {
    const userAmount = Number(principalAmount);
    const calculatedInterest = Number(annualIntrestRate) / 100 / 12;
    const calculatedPayments = Number(tenure) * 12;
    const x = Math.pow(1 + calculatedInterest, calculatedPayments);
    const monthly = (userAmount * x * calculatedInterest) / (x - 1);

    if (isFinite(monthly)) {
      const monthlyPaymentCalculated = monthly.toFixed(2);
      const totalPaymentCalculated = (monthly * calculatedPayments).toFixed(2);
      const totalInterestCalculated = (
        monthly * calculatedPayments -
        userAmount
      ).toFixed(2);

      // Set up results to the state to be displayed to the user
      setResults({
        monthlyPayment: monthlyPaymentCalculated,
        totalPayment: totalPaymentCalculated,
        totalInterest: totalInterestCalculated,
        isResult: true,
      });
    }
    return;
  };

  // Clear input fields
  const clearFields = () => {
    setUser({
      principalAmount: "",
      annualIntrestRate: "",
      tenure: "",
    });

    setResults({
      monthlyPayment: "",
      totalPayment: "",
      totalInterest: "",
      isResult: false,
    });
  };

  const saveUser = (e) => {
    handleSubmitValues(e);
    e.preventDefault();
    userService
      .saveUser(user, results)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <div className="calcContainer">
        <div className="calcSub">
          <div className="calcHeading">Calculate your Monthly Payment</div>
          {/* Display the error when it exists */}
          <p className="error">{error}</p>
          <div>
            <form>
              {!results.isResult ? (
                <div className="form-items">
                  <input
                    type="text"
                    name="userName"
                    className="calcInput"
                    id="userName"
                    placeholder="Your Name "
                    value={user.userName}
                    onChange={(e) => handleChange(e)}
                  />
                  <input
                    type="text"
                    name="principalAmount"
                    className="calcInput"
                    id="inCost"
                    placeholder="Loan Amount (₹)"
                    value={user.principalAmount}
                    onChange={(e) => handleChange(e)}
                  />
                  <input
                    type="text"
                    name="annualIntrestRate"
                    className="calcInput"
                    id="inInterest"
                    placeholder="Interest (%)"
                    value={user.annualIntrestRate}
                    onChange={(e) => handleChange(e)}
                  />
                  <input
                    type="text"
                    name="tenure"
                    className="calcInput"
                    id="inTerm"
                    placeholder="Length of Loan (years)"
                    value={user.tenure}
                    onChange={(e) => handleChange(e)}
                  />
                  <p>
                    <button
                      type="button"
                      className="calcButton"
                      id="btnCalculate"
                      onClick={(e) => {
                        saveUser(e);
                      }}
                    >
                      Calculate
                    </button>
                  </p>
                </div>
              ) : (
                // Form to display the results to the user
                <div className="form-items">
                  <a onClick={() => navigate("/schedule")}>Table</a>
                  <h4>
                    Loan amount: ₹{user.principalAmount} <br /> Interest:{" "}
                    {user.annualIntrestRate}% <br /> Years to repay:{" "}
                    {user.tenure}
                  </h4>
                  <div>
                    <label id="label">Monthly Payment:</label>
                    <input
                      type="text"
                      value={results.monthlyPayment}
                      disabled
                    />
                  </div>
                  <div>
                    <label id="label">Total Payment: </label>
                    <input type="text" value={results.totalPayment} disabled />
                  </div>
                  <div>
                    <label id="label">Total Interest:</label>
                    <input type="text" value={results.totalInterest} disabled />
                  </div>
                  {/* Button to clear fields */}
                  <input
                    className="button"
                    value="Calculate again"
                    type="button"
                    onClick={clearFields}
                  />
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
