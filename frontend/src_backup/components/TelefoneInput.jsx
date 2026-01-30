import React, { useState, useEffect } from "react";
import InputMask from "react-input-mask";

/**
 * TelefoneInput: máscara dinâmica fixo/celular sem perder dígito.
 * - name, value, onChange: compatível com seu handleChange (recebe { target: { name, value } })
 * - className: tailwind width/control
 */
const getPhoneMask = (digits) => {
  // digits: só números
  if (digits.length === 11) return "(99) 99999-9999"; // celular com DDD
  if (digits.length === 10) return "(99) 9999-9999";  // fixo com DDD
  // enquanto digita: preferimos máscara celular para não "quebrar" a digitação
  return "(99) 99999-9999";
};

  const TelefoneInput = ({ name, value, onChange, className = "w-full", placeholder = "" }) => {
  const init = value || "";
  const [localValue, setLocalValue] = useState(init);
  const [mask, setMask] = useState(getPhoneMask((init || "").replace(/\D/g, "")));
  const [maskKey, setMaskKey] = useState(`${name}-${mask}`);

  // sincroniza se parent resetar value
  useEffect(() => {
    setLocalValue(value || "");
    const digits = (value || "").replace(/\D/g, "");
    const newMask = getPhoneMask(digits);
    setMask(newMask);
    setMaskKey(`${name}-${newMask}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, name]);

  const handleChange = (e) => {
    const val = e.target.value || "";
    const digits = val.replace(/\D/g, "");
    const newMask = getPhoneMask(digits);

    // atualiza local imediatamente
    setLocalValue(val);

    // se máscara mudou, atualiza e força remount para InputMask aplicar corretamente
    if (newMask !== mask) {
      setMask(newMask);
      setMaskKey(`${name}-${newMask}-${Date.now()}`);
    }

    // propaga para parent no formato que seu handleChange espera
    if (typeof onChange === "function") {
      onChange({ target: { name, value: val } });
    }
  };

  return (
    <InputMask
      key={maskKey}
      mask={mask}
      value={localValue}
      onChange={handleChange}
      maskChar={null}
    >
      {(inputProps) => (
        <input
          {...inputProps}
          name={name}
          placeholder={placeholder}
          className={`border rounded p-2 ${className}`}
          type="tel"
          inputMode="tel"
        />
      )}
    </InputMask>
  );
};

export default TelefoneInput;
