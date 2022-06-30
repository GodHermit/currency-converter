import { Component, FormEvent } from 'react';
import { Card, Col, Container, Form, Row, Alert } from 'react-bootstrap';
import { convert, getSupportedSymbols } from '../helpers/api';
import { ConverterStateType, SymbolType } from '../helpers/types';

class Converter extends Component<{}, ConverterStateType> {
    constructor(props: any) {
        super(props);
        this.state = {
            symbols: [],
            fromSymbolCode: '',
            toSymbolCode: '',
            fromAmount: '',
            toAmount: '',
            error: ''
        };

        this.isReadyToConvert = this.isReadyToConvert.bind(this);
        this.handleInput = this.handleInput.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.handleConvert = this.handleConvert.bind(this);
    }

    componentDidMount() {
        getSupportedSymbols((res) => this.setState({ symbols: res.data.symbols }));
    }

    isReadyToConvert(direction: string): boolean {
        switch (direction) {
            case 'from->to':
                return this.state.fromAmount !== '' && this.state.fromSymbolCode !== '' && this.state.toSymbolCode !== '';
            case 'to->from':
                return this.state.toAmount !== '' && this.state.toSymbolCode !== '' && this.state.fromSymbolCode !== '';
            default:
                return false;
        }
    }

    handleInput(e: FormEvent, direction: string = 'from->to') {
        // if input is empty, clear inputs value and return
        if (!(e.target as HTMLInputElement).value) {
            this.setState({ fromAmount: '', toAmount: '' });
            return;
        }

        // if input is not empty, set state and convert
        const amount = Number((e.target as HTMLInputElement).value);
        this.setState<never>(
            { [direction === 'from->to' ? 'fromAmount' : 'toAmount']: amount },
            () => this.handleConvert(direction)
        );
    }

    handleSelect(e: FormEvent, direction: string = 'from->to') {
        this.setState<never>(
            {
                [direction === 'from->to' ? 'fromSymbolCode' : 'toSymbolCode']: (e.target as HTMLSelectElement).value
            },
            () => {
                const tempDirection = direction === 'from->to' ? 'from->to' : 'to->from';
                const reverseDirection = direction === 'from->to' ? 'to->from' : 'from->to';

                if (this.isReadyToConvert(tempDirection)) { // if ready to convert in selected direction, convert
                    this.handleConvert(tempDirection);
                } else if (this.isReadyToConvert(reverseDirection)) { // or if ready to convert in reverse direction, convert
                    this.handleConvert(reverseDirection);
                }
            }
        );
    }

    handleConvert(direction: string) {
        // return if not ready to convert       
        if (!this.isReadyToConvert(direction)) {
            return;
        }

        switch (direction) {
            case 'from->to':
                convert(this.state.fromSymbolCode, this.state.toSymbolCode, Number(this.state.fromAmount), (res) => {
                    if (!res.data.result) {
                        this.setState({ error: 'Unknown exchange rate' });
                        return;
                    }
                    this.setState({ toAmount: res.data.result, error: '' });
                });
                break;
            case 'to->from':
                convert(this.state.toSymbolCode, this.state.fromSymbolCode, Number(this.state.toAmount), (res) => {
                    if (!res.data.result) {
                        this.setState({ error: 'Unknown exchange rate' });
                        return;
                    }
                    this.setState({ fromAmount: res.data.result !== null ? res.data.result : '', error: '' })
                });
                break;
        }
    }

    render() {
        const supportedSymbols = (Object.values(this.state.symbols) as SymbolType[]).sort((a, b) => a.description.localeCompare(b.description));
        return (
            <Container as='main' className='main'>
                <div>
                    <h1 className='pt-2 pb-2 text-center'>Currency converter</h1>
                    <Card>
                        <Card.Body>
                            {this.state.error && <Alert variant='danger' className='text-center fw-bold'>{this.state.error}</Alert>}
                            <Form>
                                <Row>
                                    <Col sm={4} className='mb-3'>
                                        <Form.Select
                                            required
                                            value={this.state.fromSymbolCode}
                                            onChange={(e) => this.handleSelect(e, 'from->to')}
                                        >
                                            <option value='' disabled hidden>Select currency</option>
                                            {supportedSymbols.filter((symbol: SymbolType) => symbol.code !== this.state.toSymbolCode).map((symbol: SymbolType) => (
                                                <option key={symbol.code} value={symbol.code}>{symbol.description} ({symbol.code})</option>
                                            ))}
                                        </Form.Select>
                                    </Col>
                                    <Col sm={8} className='mb-3'>
                                        <Form.Control
                                            type='number'
                                            placeholder='0'
                                            autoComplete='off'
                                            required
                                            value={this.state.fromAmount}
                                            onInput={(e) => this.handleInput(e, 'from->to')}
                                        />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col className='d-flex justify-content-center align-items-center'>
                                        <span className='fs-3 icon'>swap_vert</span>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col sm={4} className='mt-3'>
                                        <Form.Select
                                            required
                                            value={this.state.toSymbolCode}
                                            onChange={(e) => this.handleSelect(e, 'to->from')}
                                        >
                                            <option value='' disabled hidden>Select currency</option>
                                            {supportedSymbols.filter((symbol: SymbolType) => symbol.code !== this.state.fromSymbolCode).map((symbol: SymbolType) => (
                                                <option key={symbol.code} value={symbol.code}>{symbol.description} ({symbol.code})</option>
                                            ))}
                                        </Form.Select>
                                    </Col>
                                    <Col sm={8} className='mt-3'>
                                        <Form.Control
                                            type='number'
                                            placeholder='0'
                                            autoComplete='off'
                                            required
                                            value={this.state.toAmount}
                                            onInput={(e) => this.handleInput(e, 'to->from')} />
                                    </Col>
                                </Row>
                            </Form>
                        </Card.Body>
                    </Card>
                </div>
            </Container>
        );
    }
}

export default Converter;