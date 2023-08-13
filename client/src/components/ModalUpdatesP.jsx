import { Modal } from "react-bootstrap";
import Update from "./UpdateProfileModal";

export default function ModalUpdates(props) {
    return (
        <>
            <Modal show={props.show} onHide={props.onHide} user={props.user} handleSuccess={props.handleSuccess} refetch={props.refetch} centered>
                <Modal.Body className="bg-dark rounded border-0">
                    <Update onHide={props.onHide} user={props.user} refetch={props.refetch} handleSuccess={props.handleSuccess}/>
                </Modal.Body>
            </Modal>
        </>
    )
}