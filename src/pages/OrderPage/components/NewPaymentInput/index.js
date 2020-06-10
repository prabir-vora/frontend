import React, { Component } from 'react';

import Style from '../style.module.scss';

import * as immutable from 'object-path-immutable';

import { Button } from 'fields';

import { CardElement, ElementsConsumer } from '@stripe/react-stripe-js';

import { ClipLoader } from 'react-spinners';

const cardStyle = {
  style: {
    base: {
      color: 'white',
      fontFamily: 'Baskerville',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#919496',
      },
      borderBottom: '2px solid #fff',
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a',
    },
  },
};

class PaymentInputForm extends Component {
  state = {
    name: '',
    clientSecret: '',
    errorMessage: '',
    isLoading: false,
    creatingNewPayment: false,
  };

  async componentDidMount() {
    const { success, clientSecret } = await this.props.newSetupIntent();
    console.log(clientSecret);
    if (success) {
      this.setState({
        clientSecret,
      });
    } else {
      this.setState({
        errorMessage: 'Something went wrong. Try again',
      });
    }
  }

  onDetermineBtnStatus = () => {
    if (this.state.isLoading || this.state.name === '') {
      return 'inactive';
    } else {
      return 'active';
    }
  };

  onChangeFieldValue = (fieldName, fieldValue) => {
    this.setState({
      [fieldName]: fieldValue,
    });
  };

  onSubmitPaymentInfo = async event => {
    // Block native form submission.
    event.preventDefault();

    this.setState({
      creatingNewPayment: true,
    });

    const { stripe, elements } = this.props;

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return;
    }

    // Get a reference to a mounted CardElement. Elements knows how
    // to find your CardElement because there can only ever be one of
    // each type of element.

    const result = await stripe.confirmCardSetup(`${this.state.clientSecret}`, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: this.state.name,
        },
      },
    });

    if (result.error) {
      console.log('[error]', result.error);
      this.setState({
        errorMessage: result.error.message,
        creatingNewPayment: false,
      });
    } else {
      console.log('[PaymentMethod]', result.setupIntent.payment_method);
      const payment_method_id = result.setupIntent.payment_method;

      const { updated, message } = await this.props.addNewPaymentMethod(
        payment_method_id,
      );

      console.log(updated);

      this.setState({
        creatingNewPayment: false,
      });
    }
  };

  render() {
    const { stripe } = this.props;
    console.log(stripe);

    const { name, errorMessage } = this.state;

    // if (errorMessage) {
    //   return <div>Something Went Wrong</div>
    // }

    return (
      <div className={Style.formContainer}>
        <h1 className={Style.title}> PAYMENT INFO</h1>
        <form
          className={Style.form}
          onSubmit={e => this.onSubmitPaymentInfo(e)}
        >
          <br />
          <br />
          <input
            className={Style.formInput}
            placeholder={'Cardholder Name'}
            type="name"
            name="name"
            value={name}
            onChange={e =>
              this.onChangeFieldValue(e.target.name, e.target.value)
            }
          />
          <br />
          <br />
          <div
            style={{ borderBottom: '2px solid white', paddingBottom: '10px' }}
          >
            <CardElement id="card-element" options={cardStyle} />
          </div>
          <br />
          <div className={Style.errorMessage}>{this.state.errorMessage}</div>
          <br />

          {!this.state.creatingNewPayment ? (
            <div className={Style.buttonsContainer}>
              {this.props.addNewPayment && (
                <Button
                  className={Style.submitButton}
                  onClick={() => this.props.goBack()}
                >
                  Back
                </Button>
              )}
              <Button
                className={Style.submitButton}
                name="submit"
                status={this.onDetermineBtnStatus()}
              >
                Continue
              </Button>
            </div>
          ) : (
            <div
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',

                alignItems: 'center',
              }}
            >
              <ClipLoader width={'30px'} color={'#fff'} />
              <div>Adding payment...</div>
            </div>
          )}
        </form>
      </div>
    );
  }
}

const NewPaymentInput = props => {
  return (
    <ElementsConsumer>
      {({ elements, stripe }) => (
        <PaymentInputForm elements={elements} stripe={stripe} {...props} />
      )}
    </ElementsConsumer>
  );
};

export default NewPaymentInput;
