import React, { useState, useEffect } from "react";
import "./App.css";
import Form from "./components/Form";
import FormSchema from "./validation/FormSchema";
import axios from "axios";
import * as yup from "yup";
import Card from "./components/Card";

const initialValues = {
  name: "",
  email: "",
  password: "",
  role: "",
  termsOfService: false,
};

const initialErrors = {
  name: "",
  email: "",
  password: "",
  role: "",
  termsOfService: "",
};

const initialUsers = [];
const initialDisabled = true;

function App() {
  const [user, setUser] = useState(initialUsers); //array of users
  const [formValues, setFormValues] = useState(initialValues); //object
  const [formErrors, setFormErrors] = useState(initialErrors); //object
  const [disabled, setDisabled] = useState(initialDisabled); //boolean

  //This axios call is
  // const getUsers = () => {
  //   axios
  //     .get("https://reqres.in/api/users")
  //     .then((result) => {
  //       setUser(result.data);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //       debugger;
  //     });
  // };

  const postNewUser = (newUser) => {
    axios
      .post("https://reqres.in/api/users", newUser)
      .then((res) => {
        setUser([res.data, ...user]);
        setFormValues(initialValues);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const inputChange = (name, value) => {
    yup
      .reach(FormSchema, name)
      .validate(value)
      .then(() => {
        setFormErrors({
          ...formErrors,
          [name]: "",
        });
      })
      .catch((err) => {
        setFormErrors({
          ...formErrors,
          [name]: err.errors[0],
        });
      });

    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const formSubmit = () => {
    const newUser = {
      name: formValues.name.trim(),
      email: formValues.email.trim(),
      password: formValues.password,
      role: formValues.role.trim(),
      // termsOfService: ["terms"].filter((term) => formValues[term])//used for multiple checkboxes
      termsOfService: formValues.term, //used for only one checkbox? Yes, yes it is.
    };
    postNewUser(newUser);
  };

  // useEffect(() => { //Thought I need this for when then were changes to the form
  //   getUsers();
  // }, []);

  useEffect(() => {
    FormSchema.isValid(formValues).then((valid) => {
      setDisabled(!valid);
    });
  }, [formValues]);

  return (
    <div>
      <header>
        <h2>Lambda School Faculty</h2>
      </header>

      <Form
        values={formValues}
        change={inputChange}
        submit={formSubmit}
        disabled={disabled}
        errors={formErrors}
      />

      {user &&
        user.map((person) => {
          return <Card key={person.id} details={person} />;
        })}
    </div>
  );
}

export default App;