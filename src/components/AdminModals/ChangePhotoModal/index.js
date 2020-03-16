import React, { Component } from "react";
import PropTypes from "prop-types";
import cx from "classnames";
// Style
import Style from "../style.module.scss";

// Fields
import {
    Button,
    CenterModal,
    ModalBackButton,
    TextInput,
    Img,
    ImageUploader
} from "fields";

class ChangePhotoModal extends Component {

    confirmNotif = null;

    state = { imageURL: "", pictures: [] };

    componentDidMount = () =>
    this.setState({
      imageURL: this.props.imageURL || ""
    });

    onChangeImageURL = imageURL => this.setState({ imageURL });

    onChangeItemImage = () => {
        this.props.onSaveImage(this.state.imageURL);
      };
    
      renderImageUrlInput = () => (
        <TextInput
          hasMultipleLines={true}
          label="Image URL"
          name="URL Input"
          placeholder="Paste the URL here"
          onChange={this.onChangeImageURL}
          rows={3}
          value={this.state.imageURL}
        />
      );
    

    renderImage = () => {
        return <div className={Style.imageContainer}>
            <Img className={Style.image} src={this.state.imageURL} />
            <p style={{ fontSize: "1.1rem" }}>Current Image</p>
        </div>
    }

   renderImageUploader = () => {
        return <ImageUploader
            imageURL={this.state.imageURL}
            typeOfUpload={this.props.type}
            onUploadImage={this.onChangeImageURL}
        />
   }

    render() {

        const { name } = this.props; 
        return (
            <CenterModal
                closeModalButtonLabel={<ModalBackButton />}
                contentLabel="Change item image modal"
                modalBoxClassname={cx(
                Style.largeCenterModalBox,
                Style.modalBoxClassname
                )}
                contentContainerClassname={
                Style.largeCenterModalContainer
                }
                onCloseModal={this.props.onCloseModal}
                shouldCloseOnOverlayClick={true}
            >
                <h2>{name}</h2>
                {this.renderImageUrlInput()}
                {this.renderImageUploader()}
                <Button
                className={Style.saveButton}
                name="save new item image url"
                onClick={this.onChangeItemImage}
                status={this.state.imageURL !== "" ? "active" : "inactive"}
                >
                    Save
                </Button>
            </CenterModal>
        );
    }
}

export default ChangePhotoModal;