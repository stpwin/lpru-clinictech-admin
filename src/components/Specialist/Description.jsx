import React from "react";
import { Table, Button, Spinner, Form, InputGroup } from "react-bootstrap";
import { FaPlus, FaTrash, FaSave } from "react-icons/fa";

export const Description = ({
  sindex,
  descriptions,
  descriptionIDs,
  onTrash,
  onAdd,
  onChange,
  adding,
  deleting,
  setRef
}) => {
  return (
    <Table borderless>
      <thead>
        <tr>
          <th colSpan={2}>รายระเอียด</th>
        </tr>
      </thead>
      <tbody className="fit-last-cell font-weight-light">
        {descriptions &&
          descriptions.map((item, i) => {
            return (
              <tr key={`description-${i}`}>
                <td className="text-left">&bull; {`${item}`}</td>
                <td>
                  <Button
                    className="xs"
                    variant="outline-danger"
                    onClick={() => onTrash(sindex, i, descriptionIDs[i])}
                    disabled={deleting && deleting[i]}
                  >
                    {deleting && deleting[i] ? (
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      />
                    ) : (
                      <FaTrash />
                    )}
                  </Button>
                </td>
              </tr>
            );
          })}
        <tr>
          <td>
            <InputGroup size="sm">
              <InputGroup.Prepend>
                <InputGroup.Text className="text-primary">
                  <FaPlus />
                </InputGroup.Text>
              </InputGroup.Prepend>
              <Form.Control
                ref={setRef}
                maxLength={200}
                name={`da-${sindex}`}
                disabled={adding}
                onChange={(e) => onChange(e.target.value, sindex)}
              ></Form.Control>
            </InputGroup>
          </td>
          <td>
            <Button
              variant="outline-primary"
              className="xs"
              onClick={() => onAdd()}
              disabled={adding}
            >
              {adding ? (
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
              ) : (
                <FaSave />
              )}
            </Button>
          </td>
        </tr>
      </tbody>
    </Table>
  );
};
