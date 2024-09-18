// import React from 'react'
import { useState } from "react";
import * as XLSX from "xlsx";

const SubirExcel = () => {
    const [data, setData] = useState([]);   // ? por que no se asigna nada a data
    const [arrayFilas, setArrayFilas] = useState([]);
    const [cabecera, setCabecera] = useState([]);


    // ! Subida de archivo excel
    const handleFileUpload = (e) => {
        const reader = new FileReader();
        reader.readAsArrayBuffer(e.target.files[0]);
        reader.onload = (e) => {
            const data = e.target.result;
            const workbook = XLSX.read(data, { type: "binary" });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const parsedData = XLSX.utils.sheet_to_json(sheet);

            // * guardo la informacion del excel
            setData(parsedData);

            let headers = [];
            let filas = [];

            
            parsedData.map((i, index) => {
                if (index === 6) {
                    headers = Object.values(i);
                    setCabecera(headers);
                } else if (index >= 7 && index <= 24) {
                    let value = Object.values(i);
                    let fecha;
                    if (typeof value[4] === 'number') {
                        fecha = excelDateToJSDate(value[4]);
                    } else {
                        fecha = new Date(value[4]);
                    }
                    let fila = {
                        titularCuenta: value[0],
                        cuentaOperativa: value[1],
                        ctaContraparte: value[2],
                        movInterno: value[3],
                        Fecha: fecha,
                        impCreditoMCL: value[5]
                    };
                    filas.push(fila);
                }
                
            });

            // * guarda las filas
            console.log('Datos en arrayFilas:', arrayFilas);
            setArrayFilas(filas);
        };
    };
    //* funcion de transformar dato de serial a fecha
    const excelDateToJSDate = (serial) => {
        const excelEpoch = new Date(1899, 11, 30); // 30 de diciembre de 1899
        const millisecondsPerDay = 24 * 60 * 60 * 1000;
        return new Date(excelEpoch.getTime() + serial * millisecondsPerDay);
    };
  return (
    <>
        <div className="p-4">
        <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileUpload}
            className="mb-4 p-2 border border-gray-300"
        
        /> 

        </div>
        {arrayFilas.length > 0 && (
            <table className="min-w-full border border-gray-300">
                <thead>
                    <tr>
                        {cabecera.map((titulo,index)=>
                        <th 
                        key={index}
                        className="px-4 py-2 border border-gray-300 text-center">
                            {titulo}
                        </th>)}
                    </tr>
                </thead>
                {/* // ! tratado de filas y datos */}
                <tbody>
                    {arrayFilas.map((fila,index)=>(
                        <tr key={index} className="hover:bg-gray-400">
                            <td className="px-4 py-2 border">{fila.titularCuenta}</td>
                            <td className="px-4 py-2 border">{fila.cuentaOperativa}</td>
                            <td className="px-4 py-2 border">{fila.ctaContraparte}</td>
                            <td className="px-4 py-2 border">{fila.movInterno}</td>
                            <td className="px-4 py-2 border">
                                {fila.Fecha instanceof Date && !isNaN(fila.Fecha.getTime())
                                    ? fila.Fecha.toLocaleDateString()
                                    : 'está mal'}
                            </td>

                            <td className="px-4 py-2 border">{fila.impCreditoMCL}</td>
                            
                        </tr>
                    ))}

                </tbody>
            </table>
        )}
    </>
    
  )
}

export default SubirExcel
