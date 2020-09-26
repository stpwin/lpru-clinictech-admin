import React from "react";
import {
  Table,
  Button,
  Image,
} from "react-bootstrap";
import { FaPlus, FaTrash } from "react-icons/fa";

export const Owners = ({ sindex, data, onTrash }) => {
  return (
    <Table responsive borderless>
      <tbody className='fit-last-cell font-weight-light'>
        <tr>
          <td colSpan={3}>
            <Button variant='outline-success' className='float-right xs'>
              <FaPlus />
            </Button>
          </td>
        </tr>

        {data &&
          data.map((owner, i) => {
            return (
              <tr key={`owner-${i}`}>
                <td>
                  {owner.image ? (
                    <Image width='60' src={owner.image} />
                  ) : (
                    <Image
                      width='60'
                      src='https://via.placeholder.com/60?text=No image'
                    />
                  )}
                </td>
                <td>{`${owner.name}`}</td>
                <td>
                  <Button
                    className='xs'
                    variant='outline-danger'
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
