interface CheckboxProps {
  label: string;
  value: boolean;
  setValue: (v: boolean) => void;
}

// A simple convenience component to keep checkbox code DRY.
const Checkbox: React.FC<CheckboxProps> = ({ label, value, setValue }) => {
  const handleChange = ({
    target: { checked },
  }: React.ChangeEvent<HTMLInputElement>) => {
    setValue(checked);
  };

  return (
    <label>
      <input type="checkbox" onChange={handleChange} checked={value} />
      {label}
    </label>
  );
};

export { Checkbox };
