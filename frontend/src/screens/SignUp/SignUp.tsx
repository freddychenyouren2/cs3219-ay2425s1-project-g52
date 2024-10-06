import React from "react";
import { Button, Form, Input, Checkbox } from "antd";
import "./styles.css";
import logo from "../../assets/images/PeerPrep Logo.png";

const SignUp: React.FC = () => {
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
        >
          Login
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
              Sign up now
            </p>
            <Form
              name="signup"
              initialValues={{ remember: true }}
              className="signup-form"
              // onFinish={onFinish}
              // onFinishFailed={onFinishFailed}
              autoComplete="off"
              layout="vertical"
            >
              {/* Username Field */}
              <Form.Item
                label="Username"
                name="username"
                rules={[
                  { required: true, message: "Please input your username!" },
                ]}
              >
                <Input placeholder="Enter your username" size="large" />
              </Form.Item>

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

              {/* Confirm Password Field */}
              <Form.Item
                label="Confirm Password"
                name="confirmPassword"
                dependencies={["password"]}
                rules={[
                  { required: true, message: "Please confirm your password!" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("The two passwords do not match!")
                      );
                    },
                  }),
                ]}
              >
                <Input.Password
                  placeholder="Confirm your password"
                  size="large"
                />
              </Form.Item>
              <Form.Item
                name="agreement"
                valuePropName="checked"
                rules={[
                  {
                    validator: (_, value) =>
                      value
                        ? Promise.resolve()
                        : Promise.reject(
                            "Please agree to the terms and conditions"
                          ),
                  },
                ]}
              >
                <Checkbox
                  style={{
                    fontFamily: "Poppins",
                    fontSize: 11,
                  }}
                >
                  By creating an account, I am consenting to receive SMS
                  messages and emails, and agreeing to our Terms of use &
                  Privacy Policy
                </Checkbox>
              </Form.Item>
              {/* Submit Button */}
              <div className="row-container">
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{
                      paddingTop: 15,
                      paddingBottom: 15,
                      backgroundColor: "black",
                      borderRadius: 20,
                      marginRight: 20,
                      alignSelf:
                        "center" /* Ensure the button is vertically aligned */,
                    }}
                  >
                    Sign Up
                  </Button>
                </Form.Item>
                <p
                  style={{
                    alignSelf: "flex-start",
                    marginTop: 5,
                    fontFamily: "Poppins",
                    fontSize: 12,
                  }}
                >
                  Already have an account? <a>Log in</a>
                </p>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
