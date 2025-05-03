import { ChangeEventHandler } from 'react';
import { Option } from '@/types/common';

type SelectProps = {
  options: Option[];
  value: string;
  onChange: ChangeEventHandler<HTMLSelectElement>;
};

const Select: React.FC<SelectProps> = ({ options, value, onChange }) => {
  return (
    <select value={value} onChange={onChange} className="font-semibold tracking-wide outline-0">
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Select;
