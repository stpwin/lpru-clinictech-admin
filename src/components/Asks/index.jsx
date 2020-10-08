import React, { Component } from "react";
import { firebaseAuthContext } from "../../providers/AuthProvider";

import { Table, Button, Spinner } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import Moment from "react-moment";

import { GoogleSpreadsheet } from "google-spreadsheet";

import secret from "./credentials.json";
import { SPREADSHEET_ID, SHEET_ID } from "./sheetConfig";

export class Asks extends Component {
  state = {
    fetching: true,
    fetchFail: "",
    asks: [],
    sheetLoaded: false
  };

  doc = new GoogleSpreadsheet(SPREADSHEET_ID);

  componentDidMount() {
    // this.appendSpreadsheet({
    //   DateTime: new Date(),
    //   Name: "new name",
    //   Email: "new value",
    //   Content: "Hello"
    // });
    this.readSheet();
    // setTimeout(() => {
    //   this.setState({ fetching: false });
    // }, 1000);
  }

  readSheet = async () => {
    try {
      await this.doc.useServiceAccountAuth({
        client_email: secret.client_email,
        private_key: secret.private_key
      });

      await this.doc.loadInfo();

      const sheet = this.doc.sheetsById[SHEET_ID];
      const rows = await sheet.getRows();
      const asks = rows.map((item) => {
        const { Name, Email, Content, DateTime } = item;
        return { Name, Email, Content, DateTime };
      });
      asks.sort(function (a, b) {
        if (a.DateTime < b.DateTime) return 1;
        if (a.DateTime > b.DateTime) return -1;
        return 0;
      });
      console.log(rows);
      this.setState({ fetching: false, asks });
    } catch (e) {
      this.setState({ fetching: false, fetchFail: e });
      console.error("Error: ", e);
    }
  };

  appendSpreadsheet = async (row) => {
    try {
      await this.doc.useServiceAccountAuth({
        client_email: secret.client_email,
        private_key: secret.private_key
      });

      await this.doc.loadInfo();

      const sheet = this.doc.sheetsById[SHEET_ID];
      const result = await sheet.addRow(row);
      console.log(result);
    } catch (e) {
      console.error("Error: ", e);
    }
  };

  render() {
    const { fetching, fetchFail, asks } = this.state;
    return (
      <>
        <header>
          <h1>รายการสอบถาม</h1>
        </header>

        <Table
          responsive="sm"
          striped
          bordered
          hover
          size="sm"
          className="text-center"
        >
          <thead>
            <tr>
              <th style={{ width: "3%" }}>#</th>
              <th>ชื่อ</th>
              <th>อีเมล</th>
              <th>เนื้อหา</th>
              <th>เวลา</th>
              <th>
                {/* <Button
                  className="xs"
                  variant="outline-success"
                  onClick={this.handleAdd}
                  block
                >
                  <FaPlus />
                </Button> */}
              </th>
            </tr>
          </thead>
          <tbody className="fit-last-cell">
            {fetching ? (
              <tr>
                <td colSpan={6}>
                  <Spinner animation="border" />
                </td>
              </tr>
            ) : fetchFail ? (
              <tr>
                <td className="text-danger" colSpan={6}>
                  {`${fetchFail}`}
                </td>
              </tr>
            ) : asks.length > 0 ? (
              asks.map((item, i) => {
                return (
                  <tr key={`ask-${i}`}>
                    <td>{i + 1}</td>
                    <td>{item.Name}</td>
                    <td>
                      <a
                        href={`mailto:${item.Email}?subject=LPRU Clinic Techonology&body=ถึงคุณ ${item.Name}\n`}
                      >
                        {item.Email}
                      </a>
                    </td>
                    <td>{item.Content}</td>
                    <td>
                      <Moment fromNow>{item.DateTime}</Moment>
                    </td>
                    <td></td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6}>ไม่มีรายการ</td>
              </tr>
            )}
          </tbody>
        </Table>
      </>
    );
  }
}

Asks.contextType = firebaseAuthContext;
export default Asks;
