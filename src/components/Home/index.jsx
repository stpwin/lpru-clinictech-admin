import React, { Component, useState, useEffect } from "react";
import { Form, InputGroup, Col, Button, Spinner } from "react-bootstrap";
// import { ImageEdit } from "../ImageEdit";
import { createWebContact, getWebContact, saveWebContact } from "./homeHelpers";
import _ from "lodash";

export class Home extends Component {
  componentDidMount() {}
  render() {
    return (
      <>
        <header>
          <h1>จัดการข้อมูลเว็บไซต์</h1>
        </header>

        <div className="mb-5">
          {/* <Banner /> */}
          <Contact />
        </div>
      </>
    );
  }
}

// const Banner = () => {
//   return (
//     <>
//       <h3>แบนเนอร์</h3>
//       <div>
//         <Row className="justify-content-md-center">
//           <Col lg="10">
//             <div>
//               <ImageEdit
//                 width="100%"
//                 thumbnailUrl="http://localhost:3001/static/media/lpru-clinictech-banner.7a7feb17.svg"
//               />
//             </div>
//           </Col>
//         </Row>
//       </div>
//     </>
//   );
// };

const Contact = () => {
  const [data, setData] = useState({});
  const [dataNew, setDataNew] = useState({});
  const [dataChanged, setDataChanged] = useState([]);
  const [canSave, setCanSave] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [initialize, setInitilize] = useState(false);

  const fethData = () => {
    getWebContact()
      .then(async (res) => {
        if (!res) {
          if (!initialize) {
            setInitilize(false);
            return createWebContact()
              .then(() => {
                setLoading(false);
                setInitilize(true);
                fethData();
                return;
              })
              .catch((err) => {
                setError("ไม่สามารถติดต่อฐานข้อมูล");
              });
          }
          return;
        }
        setLoading(false);
        setData(res);
        setDataNew(JSON.parse(JSON.stringify(res)));
        setDataChanged(_.mapValues(res, () => false));
      })
      .catch((err) => {
        setError("ไม่สามารถติดต่อฐานข้อมูล");
        setLoading(false);
      });
  };

  useEffect(() => {
    fethData();
  }, []);

  useEffect(() => {
    setCanSave(Object.values(dataChanged).some((item) => item === true));
  }, [dataChanged]);

  const handleContactChange = (name, value) => {
    setError("");
    setSaved(false);
    setDataNew({
      ...dataNew,
      [name]: value
    });
    setDataChanged({ ...dataChanged, [name]: data[name] !== value });
  };

  const handleSave = () => {
    setLoading(true);
    setSaved(false);
    setError("");
    saveWebContact(dataNew)
      .then(() => {
        setDataChanged(_.mapValues(data, () => false));
        setData(JSON.parse(JSON.stringify(dataNew)));
        setLoading(false);
        setSaved(true);
      })
      .catch((err) => {
        setLoading(false);
        setError(err.message);
      });
  };

  return (
    <>
      <h3 className="mt-5">ข้อมูลติดต่อ</h3>
      <Form>
        <Form.Row>
          <Form.Group as={Col}>
            <Form.Label>โทรศัพท์</Form.Label>
            <Form.Control
              maxLength={15}
              disabled={loading || error}
              value={dataNew?.tel || ""}
              onChange={(e) => handleContactChange("tel", e.target.value)}
              type="text"
              placeholder=""
            />
          </Form.Group>
          <Form.Group as={Col}>
            <Form.Label>แฟกซ์</Form.Label>
            <Form.Control
              maxLength={15}
              disabled={loading || error}
              value={dataNew?.fax || ""}
              onChange={(e) => handleContactChange("fax", e.target.value)}
              type="text"
              placeholder=""
            />
          </Form.Group>
        </Form.Row>

        <Form.Group>
          <Form.Label>อีเมล</Form.Label>
          <Form.Control
            maxLength={100}
            disabled={loading || error}
            value={dataNew?.email || ""}
            onChange={(e) => handleContactChange("email", e.target.value)}
            type="email"
            placeholder=""
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Facebook</Form.Label>
          {/* <Form.Control type="text" placeholder="" /> */}
          <InputGroup className="mb-3">
            <InputGroup.Prepend>
              <InputGroup.Text id="inputGroup-sizing-default">
                ชื่อ
              </InputGroup.Text>
            </InputGroup.Prepend>
            <Form.Control
              maxLength={100}
              disabled={loading || error}
              value={dataNew?.facebookName || ""}
              onChange={(e) =>
                handleContactChange("facebookName", e.target.value)
              }
              aria-label="Default"
              aria-describedby="inputGroup-sizing-default"
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Prepend>
              <InputGroup.Text id="inputGroup-sizing-default">
                URL
              </InputGroup.Text>
            </InputGroup.Prepend>
            <Form.Control
              maxLength={800}
              disabled={loading || error}
              value={dataNew?.facebook || ""}
              onChange={(e) => handleContactChange("facebook", e.target.value)}
              aria-label="Default"
              aria-describedby="inputGroup-sizing-default"
            />
          </InputGroup>
        </Form.Group>
        <Form.Group>
          <Form.Label>สถานที่</Form.Label>
          <InputGroup className="mb-3">
            <InputGroup.Prepend>
              <InputGroup.Text id="inputGroup-sizing-default">
                ชื่อ
              </InputGroup.Text>
            </InputGroup.Prepend>
            <Form.Control
              maxLength={100}
              disabled={loading || error}
              value={dataNew?.placeName || ""}
              onChange={(e) => handleContactChange("placeName", e.target.value)}
              aria-label="Default"
              aria-describedby="inputGroup-sizing-default"
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Prepend>
              <InputGroup.Text id="inputGroup-sizing-default">
                URL
              </InputGroup.Text>
            </InputGroup.Prepend>
            <Form.Control
              maxLength={800}
              disabled={loading || error}
              value={dataNew?.place || ""}
              onChange={(e) => handleContactChange("place", e.target.value)}
              aria-label="Default"
              aria-describedby="inputGroup-sizing-default"
            />
          </InputGroup>
        </Form.Group>
        <Form.Group>
          <Form.Label>ข้อความอธิบาย</Form.Label>
          <Form.Control
            maxLength={1000}
            as="textarea"
            disabled={loading || error}
            value={dataNew?.footerText || ""}
            onChange={(e) => handleContactChange("footerText", e.target.value)}
            rows={3}
          />
        </Form.Group>
        <Button
          disabled={!canSave || loading || error}
          onClick={handleSave}
          variant={`${saved ? "success" : "primary"}`}
        >
          {saved ? (
            "บันทึกแล้ว"
          ) : loading ? (
            canSave ? (
              <>
                <Spinner animation="border" size="sm" className="mr-1" />
                กำลังบันทึก...
              </>
            ) : (
              "กำลังโหลด..."
            )
          ) : (
            "บันทึก"
          )}
        </Button>
        {error ? <p className="text-danger">{error}</p> : null}
      </Form>
    </>
  );
};

// const Footer = () => {
//   return (
//     <>
//       <h3 className="mt-5">ข้อมูลส่วนล่าง</h3>
//       <Form>
//         <Form.Group>
//           <Form.Label>ข้อความส่วนล่าง</Form.Label>
//           <Form.Control />
//         </Form.Group>
//         <Form.Group>
//           <Form.Label>ข้อความอธิบาย</Form.Label>
//           <Form.Control as="textarea" rows={5} />
//         </Form.Group>
//       </Form>
//     </>
//   );
// };

export default Home;
