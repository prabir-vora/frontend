import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

// Style
import Style from './style.module.scss';

// Components
import User from '../User';

// Fields
import { PageMsg } from 'fields';

class ListOfUsers extends Component {
  renderUsers = (users = []) =>
    users.map(user => {
      const { id } = user;
      return (
        <div className={Style.itemContainer} key={id}>
          <User
            resellerID={id}
            user={user}
            onRefreshAfterChanges={this.props.onRefreshAfterChanges}
          />
        </div>
      );
    });

  render() {
    const { users } = this.props;
    if (Object.keys(users).length === 0)
      return <PageMsg>No Items Found</PageMsg>;
    return (
      <div
        className={cx(Style.listContainer, this.props.listContainerClassname)}
      >
        {this.renderUsers(users)}
      </div>
    );
  }
}

export default ListOfUsers;

ListOfUsers.propTypes = {
  users: PropTypes.array,
  listContainerClassname: PropTypes.string,
  onRefreshAfterChanges: PropTypes.func,
};

ListOfUsers.defaultProps = {
  users: {},
};
