import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, InputAdornment } from '@mui/material';


interface DropdownProps {
  label: string;
  value: string;
  onChange: (value: string) => void; 
  options: string[]; 
  icon?: React.ReactNode;
}

const Dropdown: React.FC<DropdownProps> = ({ label, value, onChange, options, icon }) => {
  return (
    <FormControl variant="outlined" size="small" margin="normal" sx={{ minWidth: 170 }}>
      <InputLabel>{label}</InputLabel>
      <Select
        label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        startAdornment={icon ? (
          <InputAdornment position="start">
            {icon}
          </InputAdornment>
        ) : null}
        inputProps={{
          startAdornment: icon ? (
            <InputAdornment position="start">
              {icon}
            </InputAdornment>
          ) : null,
        }}
      >
        {options.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default Dropdown;
