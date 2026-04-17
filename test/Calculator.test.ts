import { describe, test, expect, beforeEach, vi } from "vitest";
import { Calculator } from "../src/application/Calculator";
import { Evaluator } from "../src/domain/Evaluator";
import { InputBuffer } from "../src/domain/InputBuffer";
import { NumberFormatter } from "../src/domain/NumberFormatter";
import { DomDisplay } from "../src/ui/DomDisplay";
import { Operation } from "../src/domain/Operation";

describe("Calculator handleDigit", () => {
  let calculator: Calculator;
  let displayEl: HTMLElement | null;

  beforeEach(() => {
    // テスト用にDOMセットアップ
    document.body.innerHTML = `<div id="screen"></div>`;
    displayEl = document.getElementById("screen");

    const evaluator = new Evaluator();
    const buffer = new InputBuffer();
    const formatter = new NumberFormatter();
    const display = new DomDisplay(displayEl!);

    // 初期operatorOrDigitは適切に設定する
    const operatorOrDigit: number | (typeof Operation)[number] | null = "Add";

    calculator = new Calculator(
      evaluator,
      buffer,
      formatter,
      operatorOrDigit,
      display,
    );

    // spyOnで監視
    vi.spyOn(calculator, "handleAllClear");
    vi.spyOn(calculator, "updateBuffer");
    vi.spyOn(calculator.buffer, "getValue");
    vi.spyOn(calculator.formatter, "formatForDisplay");
  });

  // 1は画面表示での確認とする

  // 2~11の実行
  test.each([1, 2, 3, 4, 5, 6, 7, 8, 9, 0])("handleDigit with %i", (digit) => {
    calculator.handleDigit(digit);
    expect(String(calculator.buffer.getValue())).toBe(String(digit));
  });

  test("12", () => {
    const steps = [
      { method: "handleDigit", arg: 0, expectedState: "InputtingFirst" },
      { method: "handleDigit", arg: 0, expectedState: "InputtingFirst" },
    ];

    steps.forEach(({ method, arg, expectedState }, index) => {
      (calculator as any)[method](arg);
      expect(calculator.state).toBe(expectedState);
    });

    expect(String(calculator.buffer.getValue())).toBe("0");
  });

  test("13", () => {
    const steps = [
      { method: "handleDigit", arg: 1, expectedState: "InputtingFirst" },
      { method: "handleDigit", arg: 2, expectedState: "InputtingFirst" },
      { method: "handleDigit", arg: 3, expectedState: "InputtingFirst" },
      { method: "handleDigit", arg: 4, expectedState: "InputtingFirst" },
      { method: "handleDigit", arg: 5, expectedState: "InputtingFirst" },
      { method: "handleDigit", arg: 6, expectedState: "InputtingFirst" },
      { method: "handleDigit", arg: 7, expectedState: "InputtingFirst" },
      { method: "handleDigit", arg: 8, expectedState: "InputtingFirst" },
    ];

    steps.forEach(({ method, arg, expectedState }, index) => {
      (calculator as any)[method](arg);
      expect(calculator.state).toBe(expectedState);
    });

    expect(String(calculator.buffer.getValue())).toBe("12345678");
  });

  test("14", () => {
    const steps = [
      { method: "handleDigit", arg: 1, expectedState: "InputtingFirst" },
      { method: "handleDigit", arg: 2, expectedState: "InputtingFirst" },
      { method: "handleDigit", arg: 3, expectedState: "InputtingFirst" },
      { method: "handleDigit", arg: 4, expectedState: "InputtingFirst" },
      { method: "handleDigit", arg: 5, expectedState: "InputtingFirst" },
      { method: "handleDigit", arg: 6, expectedState: "InputtingFirst" },
      { method: "handleDigit", arg: 7, expectedState: "InputtingFirst" },
      { method: "handleDigit", arg: 8, expectedState: "InputtingFirst" },
      { method: "handleDigit", arg: 9, expectedState: "InputtingFirst" },
    ];

    steps.forEach(({ method, arg, expectedState }, index) => {
      (calculator as any)[method](arg);
      expect(calculator.state).toBe(expectedState);
    });

    expect(String(calculator.buffer.getValue())).toBe("12345678");
  });

  test("15", () => {
    const steps = [
      { method: "handleDigit", arg: 5, expectedState: "InputtingFirst" },
    ];

    steps.forEach(({ method, arg, expectedState }, index) => {
      (calculator as any)[method](arg);
      expect(calculator.state).toBe(expectedState);
    });
  });

  test("16", () => {
    const steps = [
      {
        method: "handleDecimalPoint",
        arg: "",
        expectedState: "InputtingFirst",
      },
      { method: "handleDigit", arg: "1", expectedState: "InputtingFirst" },
    ];

    steps.forEach(({ method, arg, expectedState }, index) => {
      (calculator as any)[method](arg);
      expect(calculator.state).toBe(expectedState);
    });
  });

  test("17", () => {
    const steps = [
      {
        method: "handleOperator",
        arg: "Add",
        expectedState: "Ready",
      },
    ];

    steps.forEach(({ method, arg, expectedState }, index) => {
      (calculator as any)[method](arg);
      expect(calculator.state).toBe(expectedState);
    });
  });

  test("18", () => {
    const steps = [
      { method: "handleDigit", arg: 1, expectedState: "InputtingFirst" },
      { method: "handleDigit", arg: 2, expectedState: "InputtingFirst" },
    ];

    steps.forEach(({ method, arg, expectedState }, index) => {
      (calculator as any)[method](arg);
      expect(calculator.state).toBe(expectedState);
    });
  });

  test("19", () => {
    const steps = [
      { method: "handleDigit", arg: 1, expectedState: "InputtingFirst" },
      {
        method: "handleOperator",
        arg: "Add",
        expectedState: "OperatorEntered",
      },
    ];

    steps.forEach(({ method, arg, expectedState }, index) => {
      (calculator as any)[method](arg);
      expect(calculator.state).toBe(expectedState);
    });
  });

  test("20", () => {
    const steps = [
      { method: "handleDigit", arg: 1, expectedState: "InputtingFirst" },
      {
        method: "handleOperator",
        arg: "Multiply",
        expectedState: "OperatorEntered",
      },
    ];

    steps.forEach(({ method, arg, expectedState }, index) => {
      (calculator as any)[method](arg);
      expect(calculator.state).toBe(expectedState);
    });
  });

  test("21", () => {
    const steps = [
      { method: "handleDigit", arg: 1, expectedState: "InputtingFirst" },
      {
        method: "handleOperator",
        arg: "Subtract",
        expectedState: "OperatorEntered",
      },
    ];

    steps.forEach(({ method, arg, expectedState }, index) => {
      (calculator as any)[method](arg);
      expect(calculator.state).toBe(expectedState);
    });
  });

  test("22", () => {
    const steps = [
      { method: "handleDigit", arg: 1, expectedState: "InputtingFirst" },
      {
        method: "handleOperator",
        arg: "Divide",
        expectedState: "OperatorEntered",
      },
    ];

    steps.forEach(({ method, arg, expectedState }, index) => {
      (calculator as any)[method](arg);
      expect(calculator.state).toBe(expectedState);
    });
  });

  test("23", () => {
    const steps = [
      { method: "handleDigit", arg: 1, expectedState: "InputtingFirst" },
      {
        method: "handleOperator",
        arg: "Divide",
        expectedState: "OperatorEntered",
      },
      {
        method: "handleOperator",
        arg: "Multiply",
        expectedState: "OperatorEntered",
      },
    ];

    steps.forEach(({ method, arg, expectedState }, index) => {
      (calculator as any)[method](arg);
      expect(calculator.state).toBe(expectedState);
    });
  });

  test("24", () => {
    const steps = [
      { method: "handleDigit", arg: 1, expectedState: "InputtingFirst" },
      {
        method: "handleOperator",
        arg: "Divide",
        expectedState: "OperatorEntered",
      },
      {
        method: "handleEqual",
        arg: "",
        expectedState: "OperatorEntered",
      },
    ];

    steps.forEach(({ method, arg, expectedState }, index) => {
      (calculator as any)[method](arg);
      expect(calculator.state).toBe(expectedState);
    });
  });

  test("25", () => {
    const steps = [
      { method: "handleDigit", arg: 1, expectedState: "InputtingFirst" },
      {
        method: "handleOperator",
        arg: "Divide",
        expectedState: "OperatorEntered",
      },
      {
        method: "handleDigit",
        arg: 2,
        expectedState: "InputtingSecond",
      },
      {
        method: "handleEqual",
        arg: "",
        expectedState: "ResultShown",
      },
    ];

    steps.forEach(({ method, arg, expectedState }, index) => {
      (calculator as any)[method](arg);
      expect(calculator.state).toBe(expectedState);
    });
  });

  test("26", () => {
    const steps = [
      { method: "handleDigit", arg: 1, expectedState: "InputtingFirst" },
      {
        method: "handleOperator",
        arg: "Divide",
        expectedState: "OperatorEntered",
      },
      {
        method: "handleDigit",
        arg: 1,
        expectedState: "InputtingSecond",
      },
    ];

    steps.forEach(({ method, arg, expectedState }, index) => {
      (calculator as any)[method](arg);
      expect(calculator.state).toBe(expectedState);
    });
  });

  test("27", () => {
    const steps = [
      { method: "handleDigit", arg: 1, expectedState: "InputtingFirst" },
      {
        method: "handleOperator",
        arg: "Divide",
        expectedState: "OperatorEntered",
      },
      {
        method: "handleDecimalPoint",
        arg: "",
        expectedState: "OperatorEntered",
      },
      { method: "handleDigit", arg: "1", expectedState: "InputtingSecond" },
    ];

    steps.forEach(({ method, arg, expectedState }, index) => {
      (calculator as any)[method](arg);
      expect(calculator.state).toBe(expectedState);
    });
  });

  test("28", () => {
    const steps = [
      { method: "handleDigit", arg: 4, expectedState: "InputtingFirst" },
      {
        method: "handleOperator",
        arg: "Divide",
        expectedState: "OperatorEntered",
      },
      { method: "handleDigit", arg: "2", expectedState: "InputtingSecond" },
      { method: "handleDigit", arg: "4", expectedState: "InputtingSecond" },
    ];

    steps.forEach(({ method, arg, expectedState }, index) => {
      (calculator as any)[method](arg);
      expect(calculator.state).toBe(expectedState);
    });
  });

  test("29", () => {
    const steps = [
      { method: "handleDigit", arg: 4, expectedState: "InputtingFirst" },
      {
        method: "handleOperator",
        arg: "Divide",
        expectedState: "OperatorEntered",
      },
      {
        method: "handleDigit",
        arg: 2,
        expectedState: "InputtingSecond",
      },
      {
        method: "handleEqual",
        arg: "",
        expectedState: "ResultShown",
      },
    ];

    steps.forEach(({ method, arg, expectedState }, index) => {
      (calculator as any)[method](arg);
      expect(calculator.state).toBe(expectedState);
    });
  });

  test("30", () => {
    const steps = [
      { method: "handleDigit", arg: 4, expectedState: "InputtingFirst" },
      {
        method: "handleOperator",
        arg: "Divide",
        expectedState: "OperatorEntered",
      },
      {
        method: "handleDigit",
        arg: 2,
        expectedState: "InputtingSecond",
      },
      {
        method: "handleOperator",
        arg: "Add",
        expectedState: "OperatorEntered",
      },
    ];

    steps.forEach(({ method, arg, expectedState }, index) => {
      (calculator as any)[method](arg);
      expect(calculator.state).toBe(expectedState);
    });
  });

  test("31", () => {
    const steps = [
      { method: "handleDigit", arg: 1, expectedState: "InputtingFirst" },
      {
        method: "handleOperator",
        arg: "Divide",
        expectedState: "OperatorEntered",
      },
      {
        method: "handleDigit",
        arg: 0,
        expectedState: "InputtingSecond",
      },
      {
        method: "handleEqual",
        arg: "",
        expectedState: "Error",
      },
    ];

    steps.forEach(({ method, arg, expectedState }, index) => {
      (calculator as any)[method](arg);
      expect(calculator.state).toBe(expectedState);
    });
  });

  test("32", () => {
    const steps = [
      { method: "handleDigit", arg: 1, expectedState: "InputtingFirst" },
      {
        method: "handleOperator",
        arg: "Divide",
        expectedState: "OperatorEntered",
      },
      {
        method: "handleDigit",
        arg: 0,
        expectedState: "InputtingSecond",
      },
      {
        method: "handleOperator",
        arg: "Add",
        expectedState: "Error",
      },
    ];

    steps.forEach(({ method, arg, expectedState }, index) => {
      (calculator as any)[method](arg);
      expect(calculator.state).toBe(expectedState);
    });
  });

  test("33", () => {
    const steps = [
      { method: "handleDigit", arg: 4, expectedState: "InputtingFirst" },
      {
        method: "handleOperator",
        arg: "Divide",
        expectedState: "OperatorEntered",
      },
      { method: "handleDigit", arg: 2, expectedState: "InputtingSecond" },
      { method: "handleEqual", arg: "", expectedState: "ResultShown" },
      { method: "handleDigit", arg: 1, expectedState: "InputtingFirst" },
    ];

    steps.forEach(({ method, arg, expectedState }, index) => {
      (calculator as any)[method](arg);
      expect(calculator.state).toBe(expectedState);
    });
  });

  test("34", () => {
    const steps = [
      { method: "handleDigit", arg: 4, expectedState: "InputtingFirst" },
      {
        method: "handleOperator",
        arg: "Divide",
        expectedState: "OperatorEntered",
      },
      { method: "handleDigit", arg: 2, expectedState: "InputtingSecond" },
      { method: "handleEqual", arg: "", expectedState: "ResultShown" },
      { method: "handleDecimalPoint", arg: "", expectedState: "ResultShown" },
      { method: "handleDigit", arg: 1, expectedState: "InputtingFirst" },
    ];

    steps.forEach(({ method, arg, expectedState }, index) => {
      (calculator as any)[method](arg);
      expect(calculator.state).toBe(expectedState);
    });
  });

  test("35", () => {
    const steps = [
      { method: "handleDigit", arg: 4, expectedState: "InputtingFirst" },
      {
        method: "handleOperator",
        arg: "Divide",
        expectedState: "OperatorEntered",
      },
      { method: "handleDigit", arg: 2, expectedState: "InputtingSecond" },
      { method: "handleEqual", arg: "", expectedState: "ResultShown" },
      {
        method: "handleOperator",
        arg: "Add",
        expectedState: "OperatorEntered",
      },
    ];

    steps.forEach(({ method, arg, expectedState }, index) => {
      (calculator as any)[method](arg);
      expect(calculator.state).toBe(expectedState);
    });
  });

  test("36", () => {
    const steps = [
      { method: "handleDigit", arg: 1, expectedState: "InputtingFirst" },
      {
        method: "handleOperator",
        arg: "Divide",
        expectedState: "OperatorEntered",
      },
      { method: "handleDigit", arg: 0, expectedState: "InputtingSecond" },
      { method: "handleEqual", arg: "", expectedState: "Error" },
      { method: "handleDigit", arg: 1, expectedState: "InputtingFirst" },
    ];

    steps.forEach(({ method, arg, expectedState }, index) => {
      (calculator as any)[method](arg);
      expect(calculator.state).toBe(expectedState);
    });
  });

  test("37", () => {
    const steps = [
      { method: "handleDigit", arg: 1, expectedState: "InputtingFirst" },
      {
        method: "handleOperator",
        arg: "Divide",
        expectedState: "OperatorEntered",
      },
      { method: "handleDigit", arg: 0, expectedState: "InputtingSecond" },
      { method: "handleEqual", arg: "", expectedState: "Error" },
      {
        method: "handleDecimalPoint",
        arg: "",
        expectedState: "InputtingFirst",
      },
    ];

    steps.forEach(({ method, arg, expectedState }, index) => {
      (calculator as any)[method](arg);
      expect(calculator.state).toBe(expectedState);
    });
  });

  test("38", () => {
    const steps = [
      { method: "handleDigit", arg: 1, expectedState: "InputtingFirst" },
      {
        method: "handleOperator",
        arg: "Divide",
        expectedState: "OperatorEntered",
      },
      { method: "handleDigit", arg: 0, expectedState: "InputtingSecond" },
      { method: "handleEqual", arg: "", expectedState: "Error" },
      {
        method: "handleAllClear",
        arg: "",
        expectedState: "Ready",
      },
    ];

    steps.forEach(({ method, arg, expectedState }, index) => {
      (calculator as any)[method](arg);
      expect(calculator.state).toBe(expectedState);
    });
  });

  test("39", () => {
    const steps = [
      { method: "handleDigit", arg: 1, expectedState: "InputtingFirst" },
      {
        method: "handleOperator",
        arg: "Divide",
        expectedState: "OperatorEntered",
      },
      { method: "handleDigit", arg: 0, expectedState: "InputtingSecond" },
      { method: "handleEqual", arg: "", expectedState: "Error" },
      {
        method: "handleOperator",
        arg: "Divide",
        expectedState: "Error",
      },
    ];

    steps.forEach(({ method, arg, expectedState }, index) => {
      (calculator as any)[method](arg);
      expect(calculator.state).toBe(expectedState);
    });
  });

  test("40", () => {
    const steps = [
      { method: "handleDigit", arg: 1 },
      { method: "handleDecimalPoint", arg: "" },
    ];

    steps.forEach(({ method, arg }, index) => {
      (calculator as any)[method](arg);
    });

    expect(calculator.buffer.getValue()).toBe("1.");
  });

  test("41", () => {
    const steps = [
      { method: "handleDigit", arg: 1 },
      { method: "handleDecimalPoint", arg: "" },
      { method: "handleDecimalPoint", arg: "" },
    ];

    steps.forEach(({ method, arg }, index) => {
      (calculator as any)[method](arg);
    });

    expect(calculator.buffer.getValue()).toBe("1.");
  });

  test("42", () => {
    const steps = [{ method: "handleDecimalPoint", arg: "" }];

    steps.forEach(({ method, arg }, index) => {
      (calculator as any)[method](arg);
    });

    expect(calculator.buffer.getValue()).toBe("0.");
  });

  // 43は画面表示での確認とする

  test("44", () => {
    const steps = [
      {
        method: "handleOperator",
        arg: "Add",
        expectedOperator: "Add",
      },
    ];

    steps.forEach(({ method, arg, expectedOperator }, index) => {
      (calculator as any)[method](arg);
      expect(calculator.operator).toBe(expectedOperator);
    });
  });

  test("45", () => {
    const steps = [
      { method: "handleDigit", arg: 1, expectedOperator: null },
      {
        method: "handleOperator",
        arg: "Divide",
        expectedOperator: "Divide",
      },
      {
        method: "handleOperator",
        arg: "Add",
        expectedOperator: "Add",
      },
    ];

    steps.forEach(({ method, arg, expectedOperator }, index) => {
      (calculator as any)[method](arg);
      expect(calculator.operator).toBe(expectedOperator);
    });
  });

  test("46", () => {
    const steps = [
      { method: "handleDigit", arg: 4, expectedState: "InputtingFirst" },
      {
        method: "handleOperator",
        arg: "Divide",
        expectedState: "OperatorEntered",
      },
      { method: "handleDigit", arg: 2, expectedState: "InputtingSecond" },
      { method: "handleEqual", arg: "", expectedState: "ResultShown" },
      { method: "handleAllClear", arg: "", expectedState: "Ready" },
    ];

    steps.forEach(({ method, arg, expectedState }, index) => {
      (calculator as any)[method](arg);
      expect(calculator.state).toBe(expectedState);
    });

    expect(calculator.left).toBe(null);
    expect(calculator.operator).toBe(null);
  });

  test("47", () => {
    const steps = [
      { method: "handleDigit", arg: 1, expectedState: "InputtingFirst" },
      { method: "handleDigit", arg: 2, expectedState: "InputtingFirst" },
      { method: "handleBackspace", arg: "", expectedState: "InputtingFirst" },
    ];

    steps.forEach(({ method, arg, expectedState }, index) => {
      (calculator as any)[method](arg);
      expect(calculator.state).toBe(expectedState);
    });

    expect(String(calculator.buffer.getValue())).toBe("1");
  });

  test("48", () => {
    const steps = [
      { method: "handleDigit", arg: 4, expectedState: "InputtingFirst" },
      { method: "handleDigit", arg: 4, expectedState: "InputtingFirst" },
      {
        method: "handleOperator",
        arg: "Divide",
        expectedState: "OperatorEntered",
      },
      { method: "handleDigit", arg: 2, expectedState: "InputtingSecond" },
      { method: "handleEqual", arg: "", expectedState: "ResultShown" },
      { method: "handleBackspace", arg: "", expectedState: "ResultShown" },
    ];

    steps.forEach(({ method, arg, expectedState }, index) => {
      (calculator as any)[method](arg);
      expect(calculator.state).toBe(expectedState);
    });

    expect(String(calculator.buffer.getValue())).toBe("22");
  });

  test("49", () => {
    const steps = [
      { method: "handleDigit", arg: 2, expectedState: "InputtingFirst" },
      {
        method: "handleOperator",
        arg: "Add",
        expectedState: "OperatorEntered",
      },
      { method: "handleDigit", arg: 3, expectedState: "InputtingSecond" },
      { method: "handleEqual", arg: "", expectedState: "ResultShown" },
    ];

    steps.forEach(({ method, arg }, index) => {
      (calculator as any)[method](arg);
    });

    expect(calculator.buffer.getValue()).toBe("5");
  });

  test("50", () => {
    const steps = [
      { method: "handleDigit", arg: 2, expectedState: "InputtingFirst" },
      {
        method: "handleOperator",
        arg: "Subtract",
        expectedState: "OperatorEntered",
      },
      { method: "handleDigit", arg: 3, expectedState: "InputtingSecond" },
      { method: "handleEqual", arg: "", expectedState: "ResultShown" },
    ];

    steps.forEach(({ method, arg }, index) => {
      (calculator as any)[method](arg);
    });

    expect(calculator.buffer.getValue()).toBe("-1");
  });

  test("51", () => {
    const steps = [
      { method: "handleDigit", arg: 2, expectedState: "InputtingFirst" },
      {
        method: "handleOperator",
        arg: "Multiply",
        expectedState: "OperatorEntered",
      },
      { method: "handleDigit", arg: 3, expectedState: "InputtingSecond" },
      { method: "handleEqual", arg: "", expectedState: "ResultShown" },
    ];

    steps.forEach(({ method, arg }, index) => {
      (calculator as any)[method](arg);
    });

    expect(calculator.buffer.getValue()).toBe("6");
  });

  test("52", () => {
    const steps = [
      { method: "handleDigit", arg: 2, expectedState: "InputtingFirst" },
      {
        method: "handleOperator",
        arg: "Divide",
        expectedState: "OperatorEntered",
      },
      { method: "handleDigit", arg: 3, expectedState: "InputtingSecond" },
      { method: "handleEqual", arg: "", expectedState: "ResultShown" },
    ];

    steps.forEach(({ method, arg }, index) => {
      (calculator as any)[method](arg);
    });

    expect(calculator.buffer.getValue()).toBe("0.666666e+");
  });

  test("53", () => {
    const steps = [
      { method: "handleDigit", arg: 2, expectedState: "InputtingFirst" },
      {
        method: "handleOperator",
        arg: "Add",
        expectedState: "OperatorEntered",
      },
      { method: "handleDigit", arg: 3, expectedState: "InputtingSecond" },
      {
        method: "handleOperator",
        arg: "Multiply",
        expectedState: "OperatorEntered",
      },
      { method: "handleDigit", arg: 3, expectedState: "InputtingSecond" },
      { method: "handleEqual", arg: "", expectedState: "ResultShown" },
    ];

    steps.forEach(({ method, arg }, index) => {
      (calculator as any)[method](arg);
    });

    expect(calculator.buffer.getValue()).toBe("15");
  });

  test("54", () => {
    const steps = [
      { method: "handleDigit", arg: 1, expectedState: "InputtingFirst" },
      {
        method: "handleOperator",
        arg: "Divide",
        expectedState: "OperatorEntered",
      },
      { method: "handleDigit", arg: 0, expectedState: "InputtingSecond" },
      { method: "handleEqual", arg: "", expectedState: "Error" },
    ];

    steps.forEach(({ method, arg, expectedState }, index) => {
      (calculator as any)[method](arg);
      expect(calculator.state).toBe(expectedState);
    });
  });

  // 55は画面表示での確認とする
});
