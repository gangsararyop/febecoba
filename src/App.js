import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Table, Button } from "reactstrap";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

function App() {
  const [products, setProducts] = useState([]);
  const [addData, setAddData] = useState({
    name: "",
    price: null,
  });
  const [handleModal, setHandleModal] = useState(false);
  const [editData, setEditData] = useState({});

  useEffect(async () => {
    try {
      let res = await axios.get(`http://localhost:5000/products`);
      setProducts(res.data);
    } catch (error) {
      console.log(error);
    }
  }, []);

  const renderTable = () => {
    return products.map((el, index) => {
      return (
        <tr>
          <td>{el.id}</td>
          <td>{el.name}</td>
          <td>{el.price}</td>
          <td>
            <Button color="primary" onClick={() => onModalOpen(el)}>
              Edit
            </Button>{" "}
            <Button color="danger" onClick={() => onDeleteClick(el.id)}>
              Delete
            </Button>{" "}
          </td>
        </tr>
      );
    });
  };

  const onChangeAddData = (e) => {
    setAddData({ ...addData, [e.target.name]: e.target.value });
  };

  const onClickAddData = async () => {
    try {
      await axios.post(`http://localhost:5000/products`, addData);
      let res1 = await axios.get(`http://localhost:5000/products`);

      setProducts(res1.data);
    } catch (error) {
      console.log(error);
    }
  };

  const onDeleteClick = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/products/${id}`);
      let res = await axios.get(`http://localhost:5000/products`);
      setProducts(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const onModalOpen = (data) => {
    setHandleModal(!handleModal);
    setEditData(data);
  };

  const onModalClose = () => {
    setHandleModal(false);
  };

  const onChangeEdit = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const onClickEdit = async () => {
    try {
      await axios.patch(`http://localhost:5000/products/${editData.id}`, {
        name: editData.name,
        price: parseInt(editData.price),
      });
      // let res = await axios.get(`http://localhost:5000/products`);
      // setProducts(res.data);
      setHandleModal(false);
    } catch (error) {
      console.log(error);
    }
  };

  const renderEdit = () => {
    return (
      <div>
        <Modal isOpen={handleModal} toggle={onModalClose}>
          <ModalHeader toggle={onModalClose}>Modal title</ModalHeader>
          <ModalBody className="d-flex flex-column w-100">
            <input
              type="text"
              className="mb-3"
              name="name"
              value={editData.name}
              onChange={onChangeEdit}
            />
            <input
              type="number"
              name="price"
              value={editData.price}
              onChange={onChangeEdit}
            />
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={onClickEdit}>
              Save
            </Button>{" "}
            <Button color="secondary" onClick={onModalClose}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  };

  return (
    <div className="container">
      <h1 className="mt-4 mb-4">Tes Tabel</h1>
      <div className="mb-4 d-flex flex-column w-25">
        <input
          type="text"
          placeholder="Add Name"
          name="name"
          value={addData.name}
          onChange={onChangeAddData}
        />
        <input
          type="number"
          placeholder="Add Price"
          className="my-2"
          name="price"
          value={addData.price}
          onChange={onChangeAddData}
        />
        <Button color="secondary" className="w-50" onClick={onClickAddData}>
          Add Data
        </Button>
      </div>
      <Table bordered striped>
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Price</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>{renderTable()}</tbody>
      </Table>{" "}
      {renderEdit()}
    </div>
  );
}

export default App;
