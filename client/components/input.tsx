import React from "react";
import './components.css';


export const InputField = (props: React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>) => {
  return (
    <input className="input-field" type='text' {...props} />
  );
}

export const Button = (props: React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>) => {
  return (
    <button className="btn">{props.children}</button>
  );
}

export interface Option {
  value: string;
  name: string;
}

export interface SelectProps {
  options: Array<Option>;
}

export const Select = (props: any) => {

  const handleChange = (e: any) => {
    console.log("Help me please:")
    console.log(e);
    props.onChange(e);
  }

  return (
    <select value={props.value} onClick={(e: any) => console.log(props.value)} onChange={handleChange} className="select">
      {
        props.options.map((option: Option, i: number) => <option value={option.value} key={i}>{option.name}</option>)
      }
    </select>
  );
}
