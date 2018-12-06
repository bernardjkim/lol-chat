import React from 'react';

class UsernameForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            errors: null
        }
    } 

    onChange(e) {
        this.setState({username: e.target.value});
    }

    handleSubmit(e) {
        e.preventDefault();
        let username = this.state.username
        if (username.length > 1 && username.length < 20) {
            this.props.closeModal();
            this.errors = null;
            this.props.setUsername(this.state.username);
            this.props.socket.setUsername(this.state.username);
        } else {
            this.setState({ errors: "Username Should be 2 to 19 characters !"
            })
        }
    }

    render() {
        let errors = this.state.errors;
        return (
            <div>
                {errors}
                <form onSubmit={this.handleSubmit.bind(this)} id='username-form'>
                        <input type='text' 
                        id='username-input'
                        onChange={this.onChange.bind(this)}
                        value= {this.state.username}></input>
                        <button>set username</button>
                </form>

            </div>

        );
    }


}


export default UsernameForm;
 