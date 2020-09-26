import React, { useState, useEffect } from "react";
import { Button, FormControl, Spinner, InputGroup, FormText } from "react-bootstrap";
import { FaEdit, FaSave } from 'react-icons/fa';

export const TitleEdit = ({ title, onSave }) => {
  const [edit, setEdit] = useState(false)
  const [saving, setSaving] = useState(false)
  const [newTitle, setNewTitle] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    setNewTitle(title)
  }, [title])

  const handleSave = () => {
    setSaving(true);
    if (newTitle && newTitle !== title) {
      return onSave(newTitle, callback)
    }
    setSaving(false);
    setEdit(false);
  }

  const callback = (title: string, err: string = "") => {
    // console.log({ err, title });
    setSaving(false);
    if (err) {
      setErr(err);
      return;
    }
    setEdit(false);
  };

  return (
    <>
      {edit ? (
        <>
          <InputGroup >
            <InputGroup.Prepend>
              <Button
                disabled={saving}
                className='xxs'
                variant='outline-info'
                onClick={() => handleSave()}
              >
                {saving ? (
                  <Spinner
                    as='span'
                    animation='border'
                    size='sm'
                    role='status'
                    aria-hidden='true'
                    className='mr-1'
                  />
                ) : (
                  <FaSave />
                )}
              </Button>
            </InputGroup.Prepend>
            <FormControl
              size='sm'
              disabled={saving}
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
          </InputGroup>
          <FormText className="text-danger">{err}</FormText>
        </>
      ) : (
        <>
          <Button
            className='xxs mr-2'
            variant='outline-info'
            onClick={() => setEdit(true)}
          >
            <FaEdit />
          </Button>
          <span className='align-middle'>{newTitle}</span>
        </>
      )}
    </>
  );
}
