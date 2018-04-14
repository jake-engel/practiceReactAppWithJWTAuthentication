import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { connect } from 'react-redux';

import * as actions from '../../actions';

const renderInput = field => (
  <div>
      <input { ...field.input } type={ field.type } className="form-control" />
      {
        field.meta.touched &&
        field.meta.error &&
        <div className="error">
          {field.meta.error}
        </div>
      }
  </div>
);

class Signup extends Component {
  componentWillMount() {
    this.setState({ errors: false })
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ errors: !nextProps.valid })
  }

  handleFormSubmit(formProps) {
    this.props.signupUser(formProps);
  }

  renderAlert() {
    if (this.props.errorMessage) {
      return (
        <div className="alert alert-danger">
          { this.props.errorMessage }
        </div>
      );
    }
  }

  render() {
    const { handleSubmit } = this.props;
    return (
      <form onSubmit={ handleSubmit(this.handleFormSubmit.bind(this)) }>
        <fieldset className="form-group">
          <label>Email:</label>
          <Field
            name="email"
            type="email"
            component={ renderInput }
            className="form-control"
          />
        </fieldset>
        <fieldset className="form-group">
          <label>Password:</label>
          <Field
            name="password"
            type="password"
            component={ renderInput }
            className="form-control"
          />
        </fieldset>
        <fieldset className="form-group">
          <label>Password Confirm:</label>
          <Field
            name="passwordConfirm"
            type="password"
            component={ renderInput }
            className="form-control"
          />
        </fieldset>
        { this.renderAlert() }
        <button action="submit" disabled={ this.state.errors } className="btn btn-primary">
          Sign Up
        </button>
      </form>
    );
  }
}

const validate = formProps => {
  const errors = {};
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const match = re.test(formProps.email);
  if (formProps.password !== formProps.passwordConfirm) {
    errors.password = 'Passwords must match';
  }
  if (!match) {
    errors.email = "Enter a valid email!";
  }
  if (!formProps.email) {
    errors.email = "Please enter an email!";
  }
  if (!formProps.password) {
    errors.password = "Please enter an password!";
  }
  if (!formProps.passwordConfirm) {
    errors.passwordConfirm = "Please enter an password confirmation!";
  }
  for (let formEl in formProps) {
    if (!formProps.formEl) {
      errors.formEl = `Please enter your ${ formEl.split().join(' ') }!`;
    }
  }
  return errors;
};

const mapStateToProps = (state) => {
  return { errorMessage: state.auth.error };
};

export default reduxForm({
  form: 'signup',
  fields: ['email', 'password', 'passwordConfirm'],
  validate
})(
  connect(mapStateToProps, actions)(Signup)
);
