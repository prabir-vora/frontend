import React, { Component } from 'react';
import { connect } from 'react-redux';
import Style from './style.module.scss';
import cx from 'classnames';

import { Img } from 'fields';

import { FireIcon } from 'assets/Icons';
import NumberOfLikesDuck from 'stores/ducks/NumberOfLikes.duck';
import UserDuck from 'stores/ducks/User.duck';
import AppAuthDuck from 'stores/ducks/AppAuth.duck';
import ReactTooltip from 'react-tooltip';

class AlgoliaProductTemplate extends Component {
  state = { numberOfLikes: null, fetchingLikes: true };

  async componentDidMount() {
    this.setState({ fetchingLikes: true });
    const { hit } = this.props;
    const { actionCreators } = NumberOfLikesDuck;
    const { fetchNumberOfLikes } = actionCreators;
    const numberOfLikes = await this.props.dispatch(
      fetchNumberOfLikes(hit._id),
    );
    this.setState({ numberOfLikes, fetchingLikes: false });
  }

  componentDidUpdate() {
    ReactTooltip.rebuild();
  }

  onClickLike = async productID => {
    if (this.state.fetchingLikes) {
      return;
    }
    const { user, hit } = this.props;

    if (!user) {
      const { actionCreators } = AppAuthDuck;
      const { showModal } = actionCreators;
      return this.props.dispatch(showModal('login'));
    }
    this.setState({ fetchingLikes: true });

    const { likedProducts } = user;

    const { actionCreators } = UserDuck;
    const { followProduct, unfollowProduct } = actionCreators;

    if (likedProducts.includes(productID)) {
      await this.props.dispatch(unfollowProduct(productID));

      const { fetchNumberOfLikes } = NumberOfLikesDuck.actionCreators;
      const numberOfLikes = await this.props.dispatch(
        fetchNumberOfLikes(hit._id),
      );
      this.setState({ numberOfLikes, fetchingLikes: false });
    } else {
      await this.props.dispatch(followProduct(productID));
      const { fetchNumberOfLikes } = NumberOfLikesDuck.actionCreators;
      const numberOfLikes = await this.props.dispatch(
        fetchNumberOfLikes(hit._id),
      );
      this.setState({ numberOfLikes, fetchingLikes: false });
    }
  };

  render() {
    const { hit } = this.props;
    const {
      _id,
      name,
      productSlug,
      original_image_url,
      askingPrice,
      brand_name,
    } = hit;

    const likedProducts = this.props.user ? this.props.user.likedProducts : [];
    const isLiked = likedProducts.includes(_id);

    return (
      <div className={Style.gridCellWrapper}>
        <div className={Style.gridCellContent}>
          <div className={Style.gridCell}>
            <button
              className={
                isLiked ? cx(Style.likeButton, Style.active) : Style.likeButton
              }
              data-tip="Cop or not?"
              data-for="like"
              onClick={() => this.onClickLike(_id)}
            >
              <FireIcon />
              {this.state.numberOfLikes}
            </button>

            <div className={Style.gridCellImage}>
              <a title={name} href={`/shop/${productSlug}`}>
                <Img src={original_image_url} className={Style.gridImage} />
              </a>
            </div>

            <div className={Style.brandAndPrice}>
              <div style={{ textAlign: 'center', color: '#b5b0ae' }}>
                {brand_name}
              </div>
              <div style={{ textAlign: 'center' }}>${askingPrice}</div>
            </div>
          </div>
          <div className={Style.gridCellBackground}>
            <a title={name} href={`/shop/${productSlug}`}>
              <div className={Style.gridCellProductName}>{name}</div>
            </a>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state[UserDuck.duckName].user,
  };
};

export default connect(mapStateToProps)(AlgoliaProductTemplate);
