import { Component } from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { convert } from '../helpers/api';
import { HeaderState } from '../helpers/types';

class Header extends Component<{}, HeaderState> {

    constructor(props: {}) {
        super(props);
        this.state = {
            fromUSD: 0,
            fromEUR: 0
        };
    }

    componentDidMount() {
        convert('USD', 'UAH', 1, (res) => this.setState({ fromUSD: res.data.result }));
        convert('EUR', 'UAH', 1, (res) => this.setState({ fromEUR: res.data.result }));
    }

    render() {
        return (
            <Navbar as='header' className='header'>
                <Container>
                    <Nav className='ms-auto me-auto'>
                        <Navbar.Text className='text-dark' title='USD to UAH'>$ {this.state.fromUSD}</Navbar.Text>
                        <Navbar.Text className='ms-2 me-2'>/</Navbar.Text>
                        <Navbar.Text className='text-dark' title='EUR to UAH'>€ {this.state.fromEUR}</Navbar.Text>
                    </Nav>
                </Container>
            </Navbar>
        );
    }
}
export default Header;