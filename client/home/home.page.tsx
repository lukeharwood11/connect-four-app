import React from "react";
import "./home.css"
import { Logo } from "./logo";
import { Button, InputField, Select } from "../components/input";

export function HomePage() {

  // TODO: get options
  return (
    <div className="home-page">
      <div className="card">
        <Logo />
        <form>
          <p className="tag">username</p>
          <InputField placeholder='username' />
          <p className="tag">opponent</p>
          <Select>
            <option>AI</option>
            <option>Player</option>
          </Select>
          <Button>Hello!</Button>
        </form>
      </div>
    </div>
  );
}
