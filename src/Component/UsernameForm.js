import React from 'react';

class UsernameForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: ''
        }
    } 

    onChange(e) {
        this.setState({username: e.target.value});
    }

    handleSubmit(e) {
        e.preventDefault();
        this.props.closeModal();
        this.props.socket.setUsername(this.state.username);
    }

    render() {
        return (
            <div>
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
 