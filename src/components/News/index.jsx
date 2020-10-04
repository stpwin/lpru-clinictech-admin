import React, { Component } from "react";
import { Container, Table, Button } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";

export class News extends Component {
  render() {
    return (
      <>
        <header>
          <h1>ข่าวสาร</h1>
        </header>
        <Container className="mt-5">
          <Table striped bordered hover size="sm" className="text-center">
            <thead>
              <tr>
                <th style={{ width: "3%" }}>#</th>
                <th style={{ width: "50%" }}>รายการ</th>
                <th>สร้างเมื่อ</th>
                <th>
                  <Button
                    className="xs"
                    variant="outline-success"
                    onClick={this.handleShowCreateDownload}
                  >
                    <FaPlus />
                  </Button>
                </th>
              </tr>
            </thead>
            <tbody className="fit-last-cell"></tbody>
          </Table>
        </Container>
      </>
    );
  }
}

export default News;
