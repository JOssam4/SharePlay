import React, { Component } from 'react';

import { Form, Button } from 'react-bootstrap';
import '../styles/Search.css';


interface Props {
    submitHandler: (otherUser: string) => void,
}

interface State {
    text: string,
}

export default class UserSearch extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            text: ''
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event: any) {
        this.setState({
            text: event.target.value
        })
    }

    handleSubmit(event: any) {
        console.log(`Submitted ${this.state.text}`);
        event.preventDefault(); // prevent browser reload
        this.props.submitHandler(this.state.text);
    }

    render() {

        return (
            <div className="searchForm">
                <Form onSubmit={this.handleSubmit} className="formElements">
                    <Form.Group controlId="userSearch">
                        <Form.Label>Search for Spotify users here</Form.Label>
                        <Form.Control type="text" placeholder="Search for a user here" onChange={this.handleChange}/>
                    </Form.Group>
                    <Button className="btn-block" variant="primary" type="submit" >Submit</Button>
                </Form>
            </div>
        )
    }
}