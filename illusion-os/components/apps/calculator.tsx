"use client"

import { useState } from "react"
import { clsx } from "clsx"

export default function Calculator() {
  const [display, setDisplay] = useState("0")
  const [memory, setMemory] = useState<number | null>(null)
  const [operation, setOperation] = useState<string | null>(null)
  const [waitingForOperand, setWaitingForOperand] = useState(false)

  const clearAll = () => {
    setDisplay("0")
    setMemory(null)
    setOperation(null)
    setWaitingForOperand(false)
  }

  const inputDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit)
      setWaitingForOperand(false)
    } else {
      setDisplay(display === "0" ? digit : display + digit)
    }
  }

  const performOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display)

    if (memory === null) {
      setMemory(inputValue)
    } else if (operation) {
      const currentValue = memory || 0
      let newValue: number

      switch (operation) {
        case "+": newValue = currentValue + inputValue; break
        case "-": newValue = currentValue - inputValue; break
        case "×": newValue = currentValue * inputValue; break
        case "÷": newValue = currentValue / inputValue; break
        default: newValue = inputValue
      }

      setMemory(newValue)
      setDisplay(String(newValue))
    }

    setWaitingForOperand(true)
    setOperation(nextOperation)
  }

  const calculateResult = () => {
    if (!memory || !operation) return
    performOperation("=")
    setMemory(null)
    setOperation(null)
    setWaitingForOperand(true)
  }

  const CalcButton = ({ children, onClick, className = "" }: { children: React.ReactNode, onClick: () => void, className?: string }) => (
    <button
      className={clsx(
        "h-14 rounded-lg text-lg font-medium bg-gray-200 text-black hover:bg-gray-300 transition-colors",
        className
      )}
      onClick={onClick}
    >
      {children}
    </button>
  )

  return (
    <div className="flex flex-col h-full p-4">
      <div className="bg-gray-800 p-4 rounded-t-lg mb-2">
        <div className="text-right text-white text-3xl font-medium overflow-hidden">{display}</div>
      </div>

      <div className="grid grid-cols-4 gap-2 flex-1">
        <CalcButton onClick={clearAll} className="bg-gray-300 text-black">AC</CalcButton>
        <CalcButton onClick={() => {}} className="bg-gray-300 text-black">+/-</CalcButton>
        <CalcButton onClick={() => {}} className="bg-gray-300 text-black">%</CalcButton>
        <CalcButton onClick={() => performOperation("÷")} className="bg-orange-500 text-white">÷</CalcButton>

        <CalcButton onClick={() => inputDigit("7")}>7</CalcButton>
        <CalcButton onClick={() => inputDigit("8")}>8</CalcButton>
        <CalcButton onClick={() => inputDigit("9")}>9</CalcButton>
        <CalcButton onClick={() => performOperation("×")} className="bg-orange-500 text-white">×</CalcButton>

        <CalcButton onClick={() => inputDigit("4")}>4</CalcButton>
        <CalcButton onClick={() => inputDigit("5")}>5</CalcButton>
        <CalcButton onClick={() => inputDigit("6")}>6</CalcButton>
        <CalcButton onClick={() => performOperation("-")} className="bg-orange-500 text-white">-</CalcButton>

        <CalcButton onClick={() => inputDigit("1")}>1</CalcButton>
        <CalcButton onClick={() => inputDigit("2")}>2</CalcButton>
        <CalcButton onClick={() => inputDigit("3")}>3</CalcButton>
        <CalcButton onClick={() => performOperation("+")} className="bg-orange-500 text-white">+</CalcButton>

        <CalcButton onClick={() => inputDigit("0")} className="col-span-2">0</CalcButton>
        <CalcButton onClick={() => inputDigit(".")}>.</CalcButton>
        <CalcButton onClick={calculateResult} className="bg-orange-500 text-white">=</CalcButton>
      </div>
    </div>
  )
}
