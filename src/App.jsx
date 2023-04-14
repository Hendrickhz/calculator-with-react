import React, { useReducer } from "react";
import "./App.css";
import DigitButton from "./DigitButton";
import OperationButton from "./OperationButton";

export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  CLEAR: "clear",
  DELETE_DIGIT: "delete-digit",
  CHOOSE_OPERATION: "choose-operation",
  CALCULATE: "calculate",
};

const App = () => {
  const initialState = {};
  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(
    reducer,
    initialState
  );
  function formatNumber(input) {
    const number = parseFloat(input);
    if (isNaN(number)) {
      return '';
    } else {
      return number.toLocaleString('en-US', { maximumFractionDigits: 3 });
    }
  }

  function reducer(state, { type, payload }) {
    switch (type) {
      case ACTIONS.ADD_DIGIT:
        if (payload.digit === "0" && state.currentOperand === "0") {
          return state;
        }
        if (payload.digit === "." && state.currentOperand.includes(".")) {
          return state;
        }
        if (state.overwrite) {
          return { ...state, currentOperand: payload.digit, overwrite: false };
        }

        return {
          ...state,
          currentOperand: `${state.currentOperand || ""}${payload.digit}`,
        };
      case ACTIONS.DELETE_DIGIT:
        if (state.overwrite) {
          return {
            ...state,
            overwrite: false,
            currentOperand: null,
          };
        }
        if (state.currentOperand == null) {
          return state;
        }
        if (state.currentOperand.length === 1) {
          return {
            ...state,
            currentOperand: null,
          };
        }
        return {
          ...state,
          currentOperand: state.currentOperand.slice(0, -1),
        };

      case ACTIONS.CHOOSE_OPERATION:
        if (state.currentOperand == null && state.previousOperand == null) {
          return state;
        }
        if (state.previousOperand == null) {
          return {
            ...state,
            state,
            operation: payload.operation,
            previousOperand: state.currentOperand,
            currentOperand: null,
          };
        }
        if (state.currentOperand == null) {
          return {
            ...state,
            operation: payload.operation,
          };
        }
        return {
          ...state,
          previousOperand: evaluate(state),
          operation: payload.operation,
          currentOperand: null,
        };

      case ACTIONS.CLEAR:
        return {};
      case ACTIONS.CALCULATE:
        if (
          state.currentOperand == null ||
          state.operation == null ||
          state.previousOperand == null
        ) {
          return state;
        }
        return {
          ...state,
          overwrite: true,
          previousOperand: null,
          operation: null,
          currentOperand: evaluate(state),
        };
    }
  }

  function evaluate({ currentOperand, previousOperand, operation }) {
    const prev = parseFloat(previousOperand);
    const current = parseFloat(currentOperand);
    if (isNaN(prev) || isNaN(current)) {
      return "";
    }
    let computation = "";
    switch (operation) {
      case "+":
        computation = prev + current;
        break;
      case "-":
        computation = prev - current;
        break;
      case "*":
        computation = prev * current;
        break;
      case "/":
        computation = prev / current;
        break;
    }
    return computation.toString();
  }

  return (
    <div className=" h-[100vh] bg-gray-200 flex justify-center items-center  w-[100vw]">
      <div className="calculator-container">
        <div className="output col-span-full bg-black bg-opacity-75  text-white flex-col flex  justify-around  items-end px-4  ">
          <div className="previous-operand opacity-75 text-xl">
            {formatNumber(previousOperand)} {operation}
          </div>
          <div className="current-operand text-3xl">{formatNumber(currentOperand)}</div>
        </div>
        <button
          className=" col-span-2"
          onClick={() => dispatch({ type: ACTIONS.CLEAR })}
        >
          AC
        </button>
        <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>
          DEL
        </button>
        <OperationButton operation={"/"} dispatch={dispatch} />
        <DigitButton digit={"1"} dispatch={dispatch} />
        <DigitButton digit={"2"} dispatch={dispatch} />
        <DigitButton digit={"3"} dispatch={dispatch} />
        <OperationButton operation={"*"} dispatch={dispatch} />
        <DigitButton digit={"4"} dispatch={dispatch} />
        <DigitButton digit={"5"} dispatch={dispatch} />
        <DigitButton digit={"6"} dispatch={dispatch} />
        <OperationButton operation={"+"} dispatch={dispatch} />
        <DigitButton digit={"7"} dispatch={dispatch} />
        <DigitButton digit={"8"} dispatch={dispatch} />
        <DigitButton digit={"9"} dispatch={dispatch} />
        <OperationButton operation={"-"} dispatch={dispatch} />
        <DigitButton digit={"."} dispatch={dispatch} />
        <DigitButton digit={"0"} dispatch={dispatch} />
        <button
          className="  col-span-2"
          onClick={() => dispatch({ type: ACTIONS.CALCULATE })}
        >
          =
        </button>
      </div>
    </div>
  );
};

export default App;
