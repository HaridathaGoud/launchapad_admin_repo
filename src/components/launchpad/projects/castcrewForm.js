import React from "react";
import { Modal } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/esm/Spinner';
import Multiselect from 'multiselect-react-dropdown';
import Image from 'react-bootstrap/Image';
import Alert from 'react-bootstrap/Alert';
import PropTypes from 'prop-types'

const CastCrewForm = (props) => {
    return (
        <Form>
            <Modal.Header className="d-flex justify-content-between px-4">
                <Modal.Title id="example-custom-modal-styling-title">
                    Add Cast and Crew
                </Modal.Title>
                <span className="icon close" onClick={props.handleCancell} ></span>

            </Modal.Header>
            <Modal.Body className="launchpadadmin-modal px-4">
                {props.castCrewImageError && (
                    <Alert variant="danger">
                        <div className='d-flex align-items-center'>
                            <span className='icon error-alert'></span>
                            <p className='m1-2' style={{ color: 'red' }}>{props.castCrewImageError}</p>
                        </div>
                    </Alert>
                )}
                <div className="text-center">{props.castCrewFormLoader && <Spinner className='text-center'></Spinner>}</div>
                {!props.castCrewFormLoader &&
                    <Row>
                        <Col xl={5} className="mb-2">
                            <Form.Group>
                                <div
                                    className={`cast-img ${props?.isIdeoRequest ?
                                        'upload-img mb-2 position-relative c-notallowed' :
                                        'upload-img mb-2 position-relative '}`}
                                >
                                    {props.castImgLoader && <Spinner fallback={props.castImgLoader} className='position-absolute'></Spinner>}
                                    {props?.cast_CrewsFormDeatils?.image && !props.castImgLoader && <span className='imgupload-span'>
                                        <Image src={props?.cast_CrewsFormDeatils?.image} width="100" height="100" alt="" /></span>}
                                    {!props?.cast_CrewsFormDeatils?.image && !props.castImgLoader &&
                                        <div className="choose-image">
                                            <div>
                                                <Form.Control
                                                    required
                                                    className="d-none custom-btn active btn"
                                                    type="file"
                                                    ref={props.inputRef3}
                                                    onChange={(e) => props.uploadToClient(e, 'image')}
                                                    disabled={props.isIdeoRequest}
                                                />
                                                <span
                                                    className="icon camera"
                                                    onClick={() => props.inputRef3.current?.click()}
                                                ></span>
                                                <p className="c-pointer pt-3">
                                                    Jpg, Jpeg, Png, Gif, Webp <br/>260*255

                                                </p>
                                            </div>
                                        </div>
                                    }
                                    {props?.cast_CrewsFormDeatils?.image && !props.castImgLoader &&
                                        <div
                                            className={`${props?.isIdeoRequest ?
                                                'onhover-upload c-notallowed' :
                                                'onhover-upload'}`}>
                                            <div className='bring-front'>
                                                <Form.Control
                                                    required
                                                    className="d-none custom-btn active btn"
                                                    type="file"
                                                    ref={props.inputRef3}
                                                    onChange={(e) => props.uploadToClient(e, 'image')}
                                                    disabled={props.isIdeoRequest}
                                                />
                                                <span
                                                    className="icon camera"
                                                    onClick={() => props.inputRef3.current?.click()}
                                                ></span>
                                            </div>
                                        </div>
                                    }
                                </div>
                            </Form.Group>
                        </Col>
                        <Col xl={7}>
                            <Row>
                                <Col xl={12} className="mb-3">
                                    <Form.Group className=" " controlId="exampleForm.ControlInput1">
                                        <Form.Label >Name<span className="text-danger">*</span></Form.Label>
                                        <Form.Control
                                            value={props?.cast_CrewsFormDeatils?.name || ''}
                                            type="text"
                                            name="name"
                                            autoComplete="off"
                                            onChange={(e) => props.handlecastCrewData('name', e.currentTarget.value)}
                                            onBlur={(e) => props.handlecastCrewData('name', e.target.value.trim().replace(/\s+/g, " "))}
                                            isInvalid={!!props.errors.name}
                                            required
                                            placeholder="Name"
                                            maxLength={50}
                                            disabled={props?.isIdeoRequest}
                                        />
                                        <Form.Control.Feedback className="error-space" type="invalid">{props?.errors?.name}</Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                                <Col lg={12} md={12} className="mb-3">
                                    <Form.Group className=" " controlId="exampleForm.ControlInput1">
                                        <Form.Label >Role<span className="text-danger">*</span></Form.Label>
                                        <Multiselect
                                            className='multiselecter role-select'
                                            options={props.castCrewRolesLu}
                                            selectedValues={props.selectedroleValues}
                                            onSelect={props.onRolsSelect}
                                            onRemove={props.onRolsSelect}
                                            displayValue="role"
                                            isInvalid={!!props.errors.role}
                                            disable={props.isIdeoRequest}
                                        />
                                        <Form.Control.Feedback type="invalid" className={` error-space ${props.errors?.role ? 'error-role' : ''}`}>{props?.errors?.role} </Form.Control.Feedback>
                                    </Form.Group>

                                </Col>
                                <Col lg={12} md={12} className="mb-3">
                                    <Form.Group className=" " controlId="exampleForm.ControlInput1">
                                        <Form.Label >Website Link</Form.Label>
                                        <Form.Control
                                            value={props?.cast_CrewsFormDeatils?.webisite || ''}
                                            type="text"
                                            name="webisite"
                                            autoComplete="off"
                                            onChange={(e) => props.handlecastCrewData('webisite', e.currentTarget.value)}
                                            onBlur={(e) => props.handlecastCrewData('webisite', e.target.value.trim().replace(/\s+/g, " "))}
                                            isInvalid={!!props.errors.webisite}
                                            placeholder="Website Link"
                                            maxLength={50}
                                            disabled={props?.isIdeoRequest}
                                        />
                                        <Form.Control.Feedback className="error-space" type="invalid">{props?.errors?.webisite}</Form.Control.Feedback>
                                    </Form.Group>
                                </Col>

                            </Row>
                        </Col>
                        <Col xl={12} className="mb-3">
                                    <Form.Group className=" " controlId="exampleForm.ControlInput1">
                                        <Form.Label >Bio</Form.Label>
                                        <Form.Control
                                            value={props?.cast_CrewsFormDeatils?.bio || ''}
                                            as="textarea"
                                            name='bio'
                                            placeholder="Enter Bio"
                                            style={{ height: '100px' }}
                                            onChange={(e) => props.handlecastCrewData('bio', e.currentTarget.value)}
                                            onBlur={(e) => props.handlecastCrewData('bio', e.target.value.trim().replace(/\s+/g, " "))}
                                            isInvalid={!!props.errors.bio}
                                            maxLength={256}
                                            disabled={props?.isIdeoRequest}
                                        />
                                        <Form.Control.Feedback className="error-space" type="invalid">{props?.errors?.bio}</Form.Control.Feedback>
                                    </Form.Group>
                                </Col>                                
                                <Col xl={12} className="mb-3">
                                    <Form.Group className=" " controlId="exampleForm.ControlInput1">
                                        <Form.Label >Instagram Link</Form.Label>
                                        <Form.Control
                                            value={props?.cast_CrewsFormDeatils?.instagram || ''}
                                            type="text"
                                            name="instagram"
                                            autoComplete="off"
                                            onChange={(e) => props.handlecastCrewData('instagram', e.currentTarget.value)}
                                            onBlur={(e) => props.handlecastCrewData('instagram', e.target.value.trim().replace(/\s+/g, " "))}
                                            isInvalid={!!props.errors.instagram}
                                            placeholder="Instagram Link"
                                            maxLength={50}
                                            disabled={props?.isIdeoRequest}
                                        />
                                        <Form.Control.Feedback className="error-space" type="invalid">{props?.errors?.instagram}</Form.Control.Feedback>
                                    </Form.Group>

                                </Col>
                                <Col xl={12} className="mb-3">
                                    <Form.Group className=" " controlId="exampleForm.ControlInput1">
                                        <Form.Label >FaceBook Link</Form.Label>
                                        <Form.Control
                                            value={props?.cast_CrewsFormDeatils?.facebook || ''}
                                            type="text"
                                            name="facebook"
                                            autoComplete="off"
                                            onChange={(e) => props.handlecastCrewData('facebook', e.currentTarget.value)}
                                            onBlur={(e) => props.handlecastCrewData('facebook', e.target.value.trim().replace(/\s+/g, " "))}
                                            isInvalid={!!props.errors.facebook}
                                            placeholder="FaceBook Link"
                                            maxLength={50}
                                            disabled={props?.isIdeoRequest}
                                        />
                                        <Form.Control.Feedback className="error-space" type="invalid">{props.errors?.facebook}</Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                    </Row>
                }

            </Modal.Body>
            <Modal.Footer>
                <div className="text-end btn-width"><Button className="cancel-btn" onClick={() => { props.handleCancell() }}>Cancel</Button>
                    {!props?.isIdeoRequest && (
                            <Button className="button-secondary ms-lg-3 ms-2" type="submit" onClick={(e) => props.handleCastCrewDataSave(e)}>
                                <span>{props.castCrewLoader && <Spinner size="sm" className='text-light' />} </span>Save
                            </Button>
                        )}
                </div>
            </Modal.Footer>
        </Form>
    )
}
CastCrewForm.propTypes = {
    castCrewImageError: PropTypes.any,
    handleCancell: PropTypes.any,
    errors: PropTypes.any,
    projectSaveDetails: PropTypes.any,
    handlecastCrewData: PropTypes.any,
    castCrewRolesLu: PropTypes.any,
    cast_CrewsFormDeatils: PropTypes.any,
    selectedroleValues: PropTypes.any,
    castCrewLoader: PropTypes.any,
    handleCastCrewDataSave : PropTypes.any,
    onRolsSelect: PropTypes.any,
    inputRef3: PropTypes.any,
    uploadToClient : PropTypes.any,
    castImgLoader: PropTypes.any,
    castCrewFormLoader : PropTypes.any,
    isIdeoRequest : PropTypes.any
  }
export default CastCrewForm;