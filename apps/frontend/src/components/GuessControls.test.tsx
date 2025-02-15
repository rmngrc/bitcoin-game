import { render, screen } from "@testing-library/react";
import { GuessControls } from "./GuessControls";

describe("GuessControls", () => {
  const onGuessMock = vi.fn();

  it("enables buttons when there is no guess unresolved", () => {
    render(<GuessControls onGuess={onGuessMock} disabled={false} countdown={0} />);

    const upButton = screen.getByRole("button", { name: /Up/i });
    const downButton = screen.getByRole("button", { name: /Down/i });

    expect(upButton).toBeEnabled();
    expect(downButton).toBeEnabled();
  });

  it("disables buttons when there is a guess unresolved and shows remaining time", () => {
    render(<GuessControls onGuess={onGuessMock} disabled={true} countdown={45} />);

    const upButton = screen.getByRole("button", { name: /Up/i });
    const downButton = screen.getByRole("button", { name: /Down/i });

    expect(upButton).toBeDisabled();
    expect(downButton).toBeDisabled();
    expect(
      screen.getByText(/Guessing is disabled now. Remaining time: 45.../i),
    ).toBeInTheDocument();
  });

  it("calls onGuess with Up when Up button is clicked", () => {
    render(<GuessControls onGuess={onGuessMock} disabled={false} countdown={0} />);

    const upButton = screen.getByRole("button", { name: /Up/i });
    upButton.click();

    expect(onGuessMock).toHaveBeenCalledWith("up");
  });

  it("calls onGuess with Down when Down button is clicked", () => {
    render(<GuessControls onGuess={onGuessMock} disabled={false} countdown={0} />);

    const downButton = screen.getByRole("button", { name: /Down/i });
    downButton.click();

    expect(onGuessMock).toHaveBeenCalledWith("down");
  });
});
