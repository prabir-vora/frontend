import React, { Component } from 'react'
import PropTypes from 'prop-types'

// Redux
import { connect } from 'react-redux'
import AdminDuck from 'stores/ducks/Admin/Admin.duck'

// Components
import { CenterModal, ModalBackButton } from 'fields'
import SneakerFormFields from './sneakerFormFields'
import ConfirmArchiveModal from '../ConfirmArchiveModal'

// Style
import ModalStyle from '../style.module.scss'

class SneakersModal extends Component {
  state = {
    showLoadingModal: false,
  }

  componentWillUnmount = () => this.setState({ showLoadingModal: false })

  // On Change Methods

  onHideConfirmArchiveModal = () =>
    this.setState({ showConfirmArchiveModal: false })

  onShowConfirmArchiveModal = () =>
    this.setState({ showConfirmArchiveModal: true })

  renderModalTitle = () => {
    return <h1>{this.props.isInEditMode ? 'Edit' : 'Create'} Sneaker</h1>
  }

  onSubmitSneakerInfo = async sneakerInfo => {
    if (this.props.isInEditMode) {
      const { actionCreators } = AdminDuck
      const { updateExistingSneaker } = actionCreators
      const res = await this.props.dispatch(updateExistingSneaker(sneakerInfo))
      this.props.onUpdateAfterSneakerSaved(res)
    } else {
      const { actionCreators } = AdminDuck
      const { createNewSneaker } = actionCreators
      const res = await this.props.dispatch(createNewSneaker(sneakerInfo))
      this.props.onUpdateAfterSneakerCreated(res)
    }
  }

  onArchiveSneaker = async () => {
    const { actionCreators } = AdminDuck
    const { removeExistingSneaker } = actionCreators
    const res = await this.props.dispatch(
      removeExistingSneaker(this.props.sneakerInfo),
    )
    this.props.onUpdateAfterSneakerArchived(res)
  }

  // Render methods
  renderArchiveItemButton = () => {
    return (
      <button
        className={ModalStyle.archiveButton}
        name="Archive Item"
        onClick={() => {
          this.onShowConfirmArchiveModal()
        }}
        type="submit"
      >
        Archive
      </button>
    )
  }

  render() {
    const { isInEditMode, sneakerInfo } = this.props
    const { showConfirmArchiveModal } = this.state
    return (
      <CenterModal
        closeModalButtonLabel={<ModalBackButton />}
        contentLabel="Create or edit item modal"
        modalBoxClassname={ModalStyle.largeCenterModalBox}
        contentContainerClassname={ModalStyle.largeCenterModalContainer}
        onCloseModal={this.props.onCloseModal}
        shouldCloseOnOverlayClick={true}
      >
        {showConfirmArchiveModal && (
          <ConfirmArchiveModal
            name={sneakerInfo.name}
            onArchive={() => this.onArchiveSneaker()}
            onCloseModal={this.onHideConfirmArchiveModal}
          />
        )}
        {this.state.showLoadingModal && <div>Loading...</div>}
        {this.renderModalTitle()}
        <SneakerFormFields
          isInEditMode={isInEditMode}
          onSubmit={this.onSubmitSneakerInfo}
          brands={this.props.brands}
          designers={this.props.designers}
          sneakerInfo={this.props.sneakerInfo}
        />
        {isInEditMode && this.renderArchiveItemButton()}
      </CenterModal>
    )
  }
}

SneakersModal.propTypes = {
  isInEditMode: PropTypes.bool,
  isMutating: PropTypes.bool,
  sneakerInfo: PropTypes.object,
  sneakerID: PropTypes.string,
  onCloseModal: PropTypes.func.isRequired,
  onUpdateAfterSneakerArchived: PropTypes.func,
  onUpdateAfterSneakerCreated: PropTypes.func,
  onUpdateAfterSneakerSaved: PropTypes.func,
}

SneakersModal.defaultProps = {
  isInEditMode: false,
}

const mapStateToProps = state => {
  const { duckName } = AdminDuck
  return {
    isMutating: state[duckName].sneakers.isMutating,
    brands: state[duckName].brands.data,
    designers: state[duckName].designers.data,
  }
}

export default connect(mapStateToProps)(SneakersModal)
