import React, { Component } from "react";
import { Container, Form, Button, Row, Col, Spinner } from "react-bootstrap";

import { firebaseAuthContext } from "../../providers/AuthProvider";

export class Login extends Component {
  state = {
    username: "",
    password: ""
  };

  handleSignIn = () => {
    const { username, password } = this.state;
    this.context.Signin(username, password);
  };

  handleInputChange = (name, value) => {
    this.setState({
      [name]: value
    });
  };

  componentDidMount() {
    // console.log("Context", this.context);
    // console.log("Props", this.props);
  }

  render() {
    const { username, password } = this.state;
    if (this.context.initial) {
      return (
        <>
          <Spinner animation="grow" variant="success" />
        </>
      );
    }
    return (
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          this.handleSignIn();
        }}
      >
        <Container className="p-5">
          <Row className="justify-content-center">
            <Col md={10} lg={5} xl={5}>
              <h1 className="text-center">เข้าสู่ระบบ</h1>

              <Form.Group controlId="formBasicEmail">
                <Form.Label>อีเมล</Form.Label>
                <Form.Control
                  disabled={this.context.loading}
                  type="email"
                  value={username}
                  onChange={(e) =>
                    this.handleInputChange("username", e.target.value)
                  }
                  placeholder="อีเมล"
                />
              </Form.Group>

              <Form.Group controlId="formBasicPassword">
                <Form.Label>รหัสผ่าน</Form.Label>
                <Form.Control
                  disabled={this.context.loading}
                  type="password"
                  value={password}
                  onChange={(e) =>
                    this.handleInputChange("password", e.target.value)
                  }
                  placeholder="รหัสผ่าน"
                />
              </Form.Group>
            </Col>
          </Row>
          <Row className="justify-content-center">
            <Col md={4} lg={3} xl={3}>
              <Button
                disabled={this.context.loading}
                variant="primary"
                type="submit"
                block
              >
                {this.context.loading ? (
                  <>
                    <Spinner animation="border" size="sm" className="mr-1" />{" "}
                    กำกลังเข้าสู่ระบบ...
                  </>
                ) : (
                  "เข้าสู่ระบบ"
                )}
              </Button>
            </Col>
          </Row>
          <Row className="justify-content-center">
            <Col>
              {this.context.error ? (
                <p className="text-center text-danger mt-3">
                  เข้าสู่ระบบไม่สำเร็จ
                  {/* {this.context.error} */}
                </p>
              ) : null}
            </Col>
          </Row>
        </Container>
      </Form>
    );
  }
}

// const withAuthContext = (Component) => {
//   return (props) => {
//     return (
//       <firebaseAuthContext.Consumer>
//         {({Signin,Signout,errors,token}) => {
//           return <Component {...props} Signin={} Signout={} errors={} token={} />;
//         }}
//       </firebaseAuthContext.Consumer>
//     );
//   };
// };

Login.contextType = firebaseAuthContext;
export default Login;
