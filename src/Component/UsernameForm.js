import React from "react";

class UsernameForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      errors: null
    };
    this.input = React.createRef();
  }

  onChange(e) {
    this.setState({ username: e.target.value });
    if (this.state.errors && e.target.value.length > 1) {
      this.setState({ errors: false });
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    let username = this.state.username;
    if (username.length > 1 && username.length < 20) {
      this.props.closeModal(this.state.username);
    } else {
      this.setState({ errors: true });
    }
  }

  focusInput = () => {
    if (this.input) this.input.focus();
  };

  render() {
    let errors = this.state.errors;
    return (
      <div id="container-modal">
        <p>Welcome to lol-chat!</p>
        <form onSubmit={this.handleSubmit.bind(this)} id="username-form">
          <input
            type="text"
            ref={ref => {
              this.input = ref;
            }}
            id="username-input"
            onChange={this.onChange.bind(this)}
            value={this.state.username}
            onBlur={this.focusInput}
            autoFocus
            autoComplete="off"
            className={errors ? "error" : null}
          />
          <button>Login</button>
        </form>
      </div>
    );
  }
}

export default UsernameForm;
