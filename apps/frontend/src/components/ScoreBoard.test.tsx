import { render, screen } from "@testing-library/react";
import { ScoreBoard } from "./ScoreBoard";

describe("ScoreBoard", () => {
  it("displays current score", () => {
    render(<ScoreBoard score={20} />);

    expect(screen.getByText("Your Score: 20")).toBeInTheDocument();
  });
});
