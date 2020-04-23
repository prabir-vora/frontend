import React, { Component } from 'react';
import { connect } from 'react-redux';
import Style from './style.module.scss';
import cx from 'classnames';

import { Img } from 'fields';

import { FireIcon } from 'assets/Icons';
import NumberOfLikesDuck from 'stores/ducks/NumberOfLikes.duck';
import UserDuck from 'stores/ducks/User.duck';
import ReactTooltip from 'react-tooltip';

class AlgoliaProductTemplate extends Component {
  state = { numberOfLikes: null, fetchingLikes: false };

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
    const { user, hit } = this.props;
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
    const { _id, name, productSlug, original_image_url, askingPrice } = hit;

    const likedProducts = this.props.user ? this.props.user.likedProducts : [];
    const isLiked = likedProducts.includes(_id);

    if (this.state.fetchingLikes) {
      return null;
    }
    return (
      <div className={Style.gridCellWrapper}>
        <div className={Style.gridCellContent}>
          <div>
            <div className={Style.gridCell}>
              <button
                className={
                  isLiked
                    ? cx(Style.likeButton, Style.active)
                    : Style.likeButton
                }
                data-tip="Straight Fire"
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

              <div
                style={{
                  textAlign: 'center',
                  fontFamily:
                    'Druk Wide Web,futura-pt,HelveticaNeue-Light,Helvetica Neue Light,Helvetica Neue,Helvetica,Arial,Lucida Grande,sans-serif',

                  fontSize: '13px',
                  fontWeight: '800',
                  textTransform: 'uppercase',
                }}
              >
                <a title={name} href={`/shop/${productSlug}`}>
                  {name}
                </a>
              </div>
              <div style={{ textAlign: 'center' }}>${askingPrice}</div>
            </div>
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
