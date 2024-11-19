import React from "react";
import "./home.css"
import { Logo } from "./logo";
import { Button, InputField, Select } from "../components/input";
import { useNavigate } from "react-router";

export function HomePage() {

  const [agent, setAgent] = React.useState<string>("ql");
  const navigate = useNavigate();

  const handleSubmit = () => {
    navigate(`/play?agent=${agent}`);
  }

  return (
    <div className="home-page">
      <div className="card">
        <Logo />
        <form onSubmit={handleSubmit}>
          <div>
            <p className="tag">username</p>
            <InputField placeholder='coolguy32' />
          </div>
          <div className="flex-column">
            <p className="tag">opponent</p>
            <Select onChange={(e: any) => setAgent(e.target.value)} value={agent} options={
              [
                { value: "ql", name: "Q-Learning" },
                { value: "minimax", name: "MiniMax" }
                // Add more agent's here!
              ]} />
          </div>
          <Button>Start Match!</Button>
        </form>
      </div>
    </div>
  );
}
