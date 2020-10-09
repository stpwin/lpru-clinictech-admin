import React, { useState, forwardRef, useImperativeHandle } from "react";
import { Modal, Button, Container, Row, Col } from "react-bootstrap";
import AutosuggestHighlightMatch from "autosuggest-highlight/match";
import AutosuggestHighlightParse from "autosuggest-highlight/parse";
import Autosuggest from "react-autosuggest";
import "./autosuggest-style.css";
import { getOwnersExcept } from "./specialistHelpers";
import { getOwnerImage } from "../../storageHelpers";
// import {firebaseAuthContext} from "../../providers/AuthProvider"

function escapeRegexCharacters(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getSuggestionValue(owner) {
  return `${owner.name}`;
}

function renderSuggestion(owner, { query }) {
  const suggestionText = `${owner.name}`;
  const matches = AutosuggestHighlightMatch(suggestionText, query);
  const parts = AutosuggestHighlightParse(suggestionText, matches);

  return (
    <span className={"suggestion-content"}>
      <img
        width={64}
        height={64}
        src={
          (owner.image && getOwnerImage(owner.image)) ||
          "https://via.placeholder.com/150?text=no image"
        }
        alt="placeholder"
      />
      <span className="name ml-3">
        {parts.map((part, index) => {
          const className = part.highlight ? "highlight" : null;

          return (
            <span className={className} key={index}>
              {part.text}
            </span>
          );
        })}
      </span>
    </span>
  );
}

export const AddOwnerModal = forwardRef((props, ref) => {
  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [owners, setOwners] = useState([]);
  const [selectedOwner, setSelectedOwner] = useState({
    id: null,
    name: null,
    image: null
  });
  const [error, setError] = useState("");

  useImperativeHandle(ref, () => ({
    FetchOwners: (idToken, specialistID) => {
      setOwners([]);
      setValue("");

      getOwnersExcept(idToken, specialistID)
        .then((res) => {
          setOwners(res);
          // console.log("Fetch done", res);
        })
        .catch((err) => {
          // setOwnerFetching(false);
        });
    },
    SetError: (err) => {
      setError(err);
    },
    Clear: () => {
      setError();
      setSelectedOwner({ id: null, name: null, image: null });
    }
  }));

  const onChange = (e, { newValue }) => {
    if (selectedOwner.id) {
      setSelectedOwner({ id: null, name: null, image: null });
      setValue("");
      return;
    }
    setSelectedOwner({ id: null, name: newValue, image: null });
    setValue(newValue);
  };

  const getSuggestions = (value) => {
    const escapedValue = escapeRegexCharacters(value.trim());

    if (escapedValue === "") {
      return [];
    }

    if (!owners) return [];

    const regex = new RegExp(escapedValue, "i");
    return owners.filter((owner) => regex.test(owner.name));
  };

  const onSelected = (e, { suggestion }) => {
    // console.log({suggestion, suggestionValue, suggestionIndex, sectionIndex, method})
    const { id, name, image } = suggestion;
    setSelectedOwner({ id, name, image });
    console.log({ id, name });
    // if (props.onSelect) props.onSelect(e.target.dataset)
  };

  const onSuggestionsFetchRequested = ({ value }) => {
    setSuggestions(getSuggestions(value));
  };

  const onSuggestionsClearRequested = () => setSuggestions([]);

  const inputProps = {
    placeholder: "",
    value,
    onChange
  };

  return (
    <Modal show={props.show} onHide={props.onHide}>
      <Modal.Header closeButton>
        <Modal.Title>เพิ่มเจ้าของ</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container fluid="md">
          <Row>
            <Col>
              <Autosuggest
                suggestions={suggestions}
                onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                onSuggestionsClearRequested={onSuggestionsClearRequested}
                getSuggestionValue={getSuggestionValue}
                renderSuggestion={renderSuggestion}
                inputProps={inputProps}
                onSuggestionSelected={onSelected}
              />
            </Col>
          </Row>
          <Row>
            <Col className="mt-2">
              {error ? <p className="text-danger">{error}</p> : null}

              {/* {ownerSelected ? <OwnerInfo data={ownerSelected} /> : null } */}
            </Col>
          </Row>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={() => props?.onSave(selectedOwner)}>บันทึก</Button>
      </Modal.Footer>
    </Modal>
  );
});

// const OwnerInfo = ({ data }) => {
//   if (!data?.name) return <div className='p-2'>-</div>;
//   return (
//     <div className='p-2'>
//       <Media>
//         {data.image ? (
//           <img
//             width={64}
//             height={64}
//             className='mr-3'
//             src={data.image}
//             alt='placeholder'
//           />
//         ) : (
//           <img
//             width={64}
//             height={64}
//             className='mr-3'
//             src='https://via.placeholder.com/150?text=no image'
//             alt='placeholder'
//           />
//         )}
//         <Media.Body>
//           <FaUser /> <span className='small'>{data.name}</span>
//           <p className='mb-0 font-weight-light small'>
//             <FaPhone /> {data.phone || "-"}
//           </p>
//           <p className='mb-0 font-weight-light small'>
//             <FaEnvelope /> {data.email || "-"}
//           </p>
//           <p className='mb-0 font-weight-light small'>
//             <FaMapMarkerAlt /> {data.place || "-"}
//           </p>
//         </Media.Body>
//       </Media>
//     </div>
//   );
// };
