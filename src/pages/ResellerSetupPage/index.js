import React, { Component } from 'react';

import MainNavBar from 'components/MainNavBar';

import Style from './style.module.scss';

import { Button, ImageUploader, TextInput } from 'fields';

import * as immutable from 'object-path-immutable';

import { ShowConfirmNotif } from 'functions';

import { connect } from 'react-redux';
import SellDuck from 'stores/ducks/Sell.duck';
import UserDuck from 'stores/ducks/User.duck';

import { withRouter } from 'react-router-dom';

import BrandSelection from './components/BrandSelection';

class ResellerSetupPage extends Component {
  confirmNotif = null;

  state = {
    page: 1,
    submitBtnStatus: 'inactive',
    resellerInfo: {
      resellerPageName: '',
      resellerBio: '',
      coverPictureURL: '',
      resellerTopBrands: [],
    },
  };

  async componentDidMount() {
    const { actionCreators } = SellDuck;
    const { getAllBrands } = actionCreators;
    await this.props.dispatch(getAllBrands());
  }

  onGetButtonStatus = () => {
    const { resellerInfo, page } = this.state;
    const {
      resellerPageName,
      resellerBio,
      coverPictureURL,
      resellerTopBrands,
    } = resellerInfo;

    console.log(resellerInfo);

    switch (page) {
      case 1:
        return resellerPageName !== '' && resellerBio !== ''
          ? this.setState({ submitBtnStatus: 'active' })
          : this.setState({ submitBtnStatus: 'inactive' });
      case 2:
        return coverPictureURL !== ''
          ? this.setState({ submitBtnStatus: 'active' })
          : this.setState({ submitBtnStatus: 'inactive' });
      case 3:
        return resellerTopBrands.length > 0
          ? this.setState({ submitBtnStatus: 'active' })
          : this.setState({ submitBtnStatus: 'inactive' });
      default:
        return 'inactive';
    }
  };

  onChangeTextInputValue = (fieldID, value) => {
    this.setState(
      {
        resellerInfo: immutable.set(this.state.resellerInfo, fieldID, value),
      },
      this.onGetButtonStatus,
    );
  };

  onUploadCoverPicture = imageURL => {
    this.setState(
      {
        resellerInfo: immutable.set(
          this.state.resellerInfo,
          'coverPictureURL',
          imageURL,
        ),
      },
      this.onGetButtonStatus,
    );
  };

  onBrandSelection = resellerTopBrands => {
    console.log(resellerTopBrands);
    this.setState(
      {
        resellerInfo: immutable.set(
          this.state.resellerInfo,
          'resellerTopBrands',
          resellerTopBrands,
        ),
      },
      this.onGetButtonStatus,
    );
  };

  onSubmitResellerInfo = async () => {
    const { resellerInfo } = this.state;
    const { actionCreators } = UserDuck;
    const { resellerSetup } = actionCreators;
    const { success } = await this.props.dispatch(resellerSetup(resellerInfo));
    if (success) {
      this.confirmNotif = ShowConfirmNotif({
        message: 'Reseller Setup Successful',
        type: 'success',
      });
      this.props.history.push('/user');
    } else {
      this.confirmNotif = ShowConfirmNotif({
        message: 'Reseller Setup Failed',
        type: 'error',
      });
    }
  };

  renderSetup = () => {
    switch (this.state.page) {
      case 1:
        return (
          <div style={{ padding: '30px', width: '50%' }}>
            <div>
              <h4>Name your Reseller Page / Brand</h4>
              <TextInput
                hasMultipleLines={false}
                resellerPageName={'resellerPageName'}
                onChange={value =>
                  this.onChangeTextInputValue('resellerPageName', value)
                }
                value={this.state.resellerInfo['resellerPageName']}
              />
            </div>
            <div>
              <h4>Bio</h4>
              <TextInput
                hasMultipleLines={true}
                resellerPageName={'resellerBio'}
                onChange={value =>
                  this.onChangeTextInputValue('resellerBio', value)
                }
                value={this.state.resellerInfo['resellerBio']}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                className={Style.submitBtn}
                status={this.state.submitBtnStatus}
                onClick={() =>
                  this.setState({ page: 2, submitBtnStatus: 'inactive' })
                }
              >
                Continue
              </Button>
            </div>
          </div>
        );
      case 2:
        return (
          <div style={{ padding: '30px', width: '50%' }}>
            <div>
              <h4>
                Cover Picture
                <span style={{ fontSize: '10px', marginLeft: '10px' }}>
                  (Recommended size: 820px X 312px)
                </span>{' '}
              </h4>
              <ImageUploader
                imageURL={this.state.resellerInfo.coverPictureURL}
                typeOfUpload={'reseller'}
                onUploadImage={this.onUploadCoverPicture}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
              <Button
                className={Style.submitBtn}
                onClick={() =>
                  this.setState({ page: 1, submitBtnStatus: 'inactive' })
                }
              >
                Back
              </Button>
              <Button
                className={Style.submitBtn}
                // status={this.state.submitBtnStatus}
                onClick={() =>
                  this.setState({ page: 3, submitBtnStatus: 'inactive' })
                }
              >
                Continue
              </Button>
            </div>
          </div>
        );
      case 3:
        return (
          <div style={{ padding: '30px', width: '100%' }}>
            <div>
              <h4>Select your top brands</h4>
              <BrandSelection
                brands={this.props.brands}
                onBrandSelection={this.onBrandSelection}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
              <Button
                className={Style.submitBtn}
                onClick={() =>
                  this.setState({ page: 2, submitBtnStatus: 'inactive' })
                }
              >
                Back
              </Button>
              <Button
                className={Style.submitBtn}
                status={this.state.submitBtnStatus}
                onClick={() => this.onSubmitResellerInfo()}
              >
                Submit
              </Button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  render() {
    console.log(this.props);
    return (
      <div>
        <MainNavBar />
        <div className={Style.pageLayout}>
          <div className={Style.pageContent}>
            <div className={Style.pageTitle}>
              <h1>Reseller Setup</h1>
            </div>
            <div className={Style.setupContainer}>{this.renderSetup()}</div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    brands: state[SellDuck.duckName].brands.data,
  };
};

const x = withRouter(ResellerSetupPage);

export default connect(mapStateToProps)(x);
