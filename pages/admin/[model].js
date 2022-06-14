import MaterialTable from "@material-table/core";
import prisma from "../../lib/prisma";
import { FiEdit3, FiTrash, FiPlusSquare } from "react-icons/fi";
import { FaFileExcel } from "react-icons/fa";
import Create from "../../components/AdminCRUD/Create";
import Delete from "../../components/AdminCRUD/Delete";
import Edit from "../../components/AdminCRUD/Edit";
import Import from "../../components/AdminCRUD/Import";
import { Button, useDisclosure } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";

import safeWorkBook from "../../lib/excelJS";
import { exportData } from "../../lib/excelJS/admin/exportData";
import { capitalize, lowermize } from "../../lib/main";

// Display field of Prisma Model if Related

const displayMap = {
  Section: "name",
  Content: "text",
  Project: "name",
  Tag: "name",
  ProjectType: "name",
  Client: "name",
};


export async function getServerSideProps({ params }) {
  const model = params.model.toString();

  const data = await prisma[model].findMany();

  const enums = prisma._dmmf.datamodelEnumMap;

  const fieldsraw = prisma._dmmf.modelMap[capitalize(model)].fields;

  console.log(fieldsraw);

  /// Filter relational fields out
  const fields = fieldsraw.filter((item) => item.kind != "object");
  console.log(fields)

  /// Create Object with additional Querys (ids -> data)
  let idConverts = {};

  fieldsraw.forEach((field, i) => {
    if (field.relationFromFields && field.relationFromFields.length > 0) {
      idConverts[field.relationFromFields] = field.type;
    }
  });

  console.log(idConverts);

  /// Query Additional Data for Selectfields

  const iterateThrough = Object.keys(idConverts);

  let relatedData = [];

  if (iterateThrough.length > 0) {
    relatedData = await Promise.all(
      iterateThrough.map(async (item) => {
        const name = lowermize(idConverts[item]);
        const data = await prisma[name].findMany();
        return {
          name: item,
          model: idConverts[item],
          map: displayMap[idConverts[item]],
          items: data,
        };
      })
    );
  }

  console.log("rel", relatedData);

  return {
    props: { data, fields, relatedData, model, enums },
  };
}

export default function Content({ data, fields, relatedData, model, enums }) {
  const relatedNames = relatedData.map((item) => item.name);

  const router = useRouter();

  /// Modal for CREATE
  const { isOpen, onOpen, onClose } = useDisclosure();

  /// Modal for DELETE
  const {
    isOpen: isOpen2,
    onOpen: onOpen2,
    onClose: onClose2,
  } = useDisclosure();
  /// Modal for EDIT
  const {
    isOpen: isOpen3,
    onOpen: onOpen3,
    onClose: onClose3,
  } = useDisclosure();
  const {
    isOpen: isOpen4,
    onOpen: onOpen4,
    onClose: onClose4,
  } = useDisclosure();
  const [delEntry, setDelEntry] = useState();
  const [editEntry, setEditEntry] = useState();

  const keys = fields.map((item) => item.name);

  const columns = keys.map((key) => {
    console.log(key);
    if (relatedNames.includes(key)) {
      const relatedObject = relatedData.find((item) => item.name == key);
      const relatedObjectArray = relatedObject.items;

      console.log("rela", relatedObjectArray);
      console.log("relaobj", relatedObject);

      return {
        title: key,
        field: key,
        render: (rowData) => {
          if (rowData[key]) {
            return relatedObjectArray.find((obj) => obj.id == rowData[key])[
              relatedObject.map
            ];
          } else {
            return"none"
          }
        },
      };
    } else {
      return {
        title: key,
        field: key,
      };
    }
  });

  const add = {
    icon: () => <FiPlusSquare />,
    isFreeAction: true,
    onClick: (event) => {
      /// CREATE
      onOpen();
    },
  };

  const edit = {
    icon: () => <FiEdit3 />,

    onClick: (event, rowData) => {
      let obj = { ...rowData };
      delete obj["tableData"];

      setEditEntry(obj);
      onOpen3();
    },
  };

  const trash = {
    icon: () => <FiTrash />,

    onClick: (event, rowData) => {
      /// DELETE
      setDelEntry(rowData.id);
      onOpen2();
    },
  };

  const exportxlsx = {
    icon: () => <FaFileExcel color="green" />,
    isFreeAction: true,
    onClick: (event) => {
      const headers = fields.map((item) => ({
        header: item.name,
        key: item.name,
      }));
      console.log(data)
      const book = exportData(headers, data);
      safeWorkBook(book, `${model}-data`);
    },
  };

  const importxlsx = {
    icon: () => <FaFileExcel color="blue" />,
    isFreeAction: true,
    onClick: (event) => {
      onOpen4();
    },
  };

  let actions = [];

  if (model === "user") {
    actions = [add, exportxlsx, importxlsx, trash];
  } else {
    actions = [edit, exportxlsx, importxlsx, add, trash];
  }

  return (
    <>
      <MaterialTable
        title={`${model} Data`}
        columns={columns}
        data={data}
        actions={actions}
        options={{
          actionsColumnIndex: -1,
        }}
      />
      <Create
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        fields={fields}
        model={model}
        router={router}
        relatedData={relatedData}
        enums={enums}
      />
      <Edit
        isOpen={isOpen3}
        onOpen={onOpen3}
        onClose={onClose3}
        editEntry={editEntry}
        fields={fields}
        model={model}
        router={router}
        relatedData={relatedData}
        enums={enums}
      />
      <Delete
        isOpen={isOpen2}
        onOpen={onOpen2}
        onClose={onClose2}
        model={model}
        delEntry={delEntry}
        router={router}
      />
      <Import
        isOpen={isOpen4}
        onOpen={onOpen4}
        onClose={onClose4}
        model={model}
        delEntry={delEntry}
        router={router}
      />
    </>
  );
}
