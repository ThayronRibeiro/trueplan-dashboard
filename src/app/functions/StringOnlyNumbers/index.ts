export const stringOnlyNumbers = (value: string) => {
  if (/^\d+$/.test(value)) {
    return true; // String contém apenas números
  } else {
    return "O valor deve conter apenas números.";
  }
};
