export const exportData = (headers,data) => {
  const ExcelJS = require("exceljs");
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("sheet1");

  worksheet.columns = headers;

  worksheet.addRows(data);

  return workbook;
};
