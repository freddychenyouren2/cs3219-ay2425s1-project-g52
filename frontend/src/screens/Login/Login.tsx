import React from "react";
import { Button, Form, Input, Checkbox } from "antd";
import "./styles.css";
import logo from "../../assets/images/PeerPrep Logo.png";

const Login: React.FC = () => {
  return (
    <div className="container">
      <div className="header">
        <Button
          style={{
            backgroundColor: "#1D192A",
            color: "white",
            borderRadius: 20,
            width: 75,
            height: 40,
          }}
          onClick={() => {
            window.location.href = "/signup";
          }}
        >
          Sign up
        </Button>
      </div>
      <div className="body">
        <div className="LHS">
          <p className="title">Prep with us</p>
          <p className="desc">
            Communicate live with a peer to ace common technical interview
            questions
          </p>
          <img src={logo} className="logo" alt=""></img>
        </div>
        <div className="RHS">
          <div className="signUpBox">
            <p className="title" style={{ color: "black" }}>
              Login
            </p>
            <Form
              name="signup"
              initialValues={{ remember: true }}
              className="signup-form"
              style={{ width: "100%" }}
              // onFinish={onFinish}
              // onFinishFailed={onFinishFailed}
              autoComplete="off"
              layout="vertical"
            >
              {/* Email Field */}
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Please input your email!" },
                  { type: "email", message: "The input is not a valid email!" },
                ]}
              >
                <Input placeholder="Enter your email" size="large" />
              </Form.Item>

              {/* Password Field */}
              <Form.Item
                label="Password"
                name="password"
                rules={[
                  { required: true, message: "Please input your password!" },
                ]}
              >
                <Input.Password
                  placeholder="Enter your password"
                  size="large"
                />
              </Form.Item>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  width: "100%",
                  marginTop: 50,
                }}
              >
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{
                      paddingTop: 20,
                      paddingBottom: 20,
                      paddingRight: 200,
                      paddingLeft: 200,
                      backgroundColor: "black",
                      borderRadius: 20,
                      marginRight: 20,
                      fontFamily: "Poppins",
                    }}
                  >
                    Log in
                  </Button>
                </Form.Item>
                <p
                  style={{
                    alignSelf: "center",
                    marginTop: 5,
                    fontFamily: "Poppins",
                    fontSize: 12,
                  }}
                >
                  Don't have an account? <a href="/signup">Sign up!</a>
                </p>
                <p
                  style={{
                    alignSelf: "center",
                    marginTop: 5,
                    fontFamily: "Poppins",
                    fontSize: 12,
                  }}
                >
                  <a>Forgot you password?</a>
                </p>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
