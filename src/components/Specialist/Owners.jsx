import React from "react";
import { Table, Button } from "react-bootstrap";
import { FaPlus, FaTrash } from "react-icons/fa";
import { getOwnerImage } from "../../helpers";
import MyImage from "../MyImage";

export const Owners = ({ sindex, data, onTrash, onAdd }) => {
  return (
    <Table responsive borderless>
      <tbody className="fit-last-cell font-weight-light">
        <tr>
          <td colSpan={3}>
            <Button
              variant="outline-success"
              className="float-right xs"
              onClick={onAdd}
            >
              <FaPlus />
            </Button>
          </td>
        </tr>

        {data &&
          data.map((owner, i) => {
            return (
              <tr key={`owner-${i}`}>
                <td>
                  <MyImage
                    width="60"
                    height="60"
                    src={owner.image && getOwnerImage(owner.image)}
                  />
                </td>
                <td>{`${owner.name}`}</td>
                <td>
                  <Button
                    className="xs"
                    variant="outline-danger"
                    onClick={() => onTrash(sindex, i, owner.id)}
                  >
                    <FaTrash />
                  </Button>
                </td>
              </tr>
            );
          })}
      </tbody>
    </Table>
  );
};
