import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

// Style
import Style from './style.module.scss'

// // Components
import SneakerItem from '../SneakerItem'

// Fields
import { PageMsg } from 'fields'

class ListOfSneakers extends Component {
  renderSneakers = (sneakers = []) =>
    sneakers.map(sneakerInfo => {
      const { id } = sneakerInfo
      return (
        <div className={Style.itemContainer} key={id}>
          <SneakerItem
            sneakerID={id}
            sneakerInfo={sneakerInfo}
            onRefreshAfterChanges={this.props.onRefreshAfterChanges}
          />
        </div>
      )
    })

  render() {
    const { sneakers } = this.props
    console.log(sneakers)
    if (Object.keys(sneakers).length === 0)
      return <PageMsg>No Items Found</PageMsg>
    return (
      <div
        className={cx(Style.listContainer, this.props.listContainerClassname)}
      >
        {this.renderSneakers(sneakers)}
      </div>
    )
  }
}

export default ListOfSneakers

ListOfSneakers.propTypes = {
  sneakers: PropTypes.array,
  listContainerClassname: PropTypes.string,
  onRefreshAfterChanges: PropTypes.func,
}

ListOfSneakers.defaultProps = {
  sneakers: {},
}
