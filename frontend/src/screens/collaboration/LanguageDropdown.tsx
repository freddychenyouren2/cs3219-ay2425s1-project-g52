import React, { useEffect, useState } from "react";
import Select, { SingleValue } from "react-select";
// import { customStyles } from "../constants/customStyles";

interface LanguageOption {
  id: number;
  name: string;
}

interface LanguageDropdownProps {
  onSelectChange: (selectedOption: SingleValue<{ value: number; label: string }>) => void;
}

const LanguageDropdown: React.FC<LanguageDropdownProps> = ({ onSelectChange }) => {
  const [languageOptions, setLanguageOptions] = useState<{ value: number; label: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await fetch("https://ce.judge0.com/languages/");
        const languages: LanguageOption[] = await response.json();
        const options = languages.map(lang => ({
          value: lang.id,
          label: lang.name,
        }));
        setLanguageOptions(options);
      } catch (error) {
        console.error("Error fetching languages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLanguages();
  }, []);

  return (
    <Select
      placeholder="Filter By Category"
      options={languageOptions}
    //   styles={customStyles}
      isLoading={loading}
      onChange={(selectedOption) => onSelectChange(selectedOption)}
    />
  );
};

export default LanguageDropdown;
