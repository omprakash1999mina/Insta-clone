import { Avatar } from "@material-ui/core";
import React, { useState, useEffect, useRef } from "react";
import "./StatusBar.css";
import { GetAuthRequest } from "../../Components/Post/authRequest"
import { useSnackbar } from 'notistack';
import { useNavigate } from "react-router-dom"
import { AiOutlinePlus } from "react-icons/ai"
import { uploadFiles } from "./helper"
import StoriesPage from "./Stories";
import { useDispatch, useSelector } from "react-redux"



const StatusBar = () => {
  const [statusList, setStatusList] = useState([])
  const [statusUrls, setStatusUrls] = useState([])
  const { enqueueSnackbar } = useSnackbar();
  const input = useRef()
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate();
  const dispatch = useDispatch()

  useEffect(() => {
    const SuccessFxn = (response) => {
      setStatusList(response.data.status)
    }
    GetAuthRequest("api/status/fetch", SuccessFxn, enqueueSnackbar, navigate, dispatch);
  }, [])


  const createStatus = (e) => {
    const successFxn = (response) => {
      console.log(response)
      alert("status added successfully")
      window.location.reload()
    }
    uploadFiles(e.target.files[0], successFxn, enqueueSnackbar, navigate,dispatch)
  }

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
  }, [isOpen])

  return (<>
    {isOpen && <StoriesPage setIsOpen={setIsOpen} statusUrls={statusUrls} />}
    {/* {(statusList && statusList.length > 0) && */}
      <div>
        <div className="statusbar_container">
          <div className="status">
            <input type="file" className="hidden_input" accept="image/*" ref={input} onChange={e => createStatus(e)} />
            <Avatar className="statusbar_status_create" onClick={() => { input.current.click() }}>
              <AiOutlinePlus fontSize="30px" />
            </Avatar>
            <div className="statusbar_text">Create Story</div>
          </div>
          {
            statusList.map((item, index) => (
              <div className="status" key={item.userId} onClick={() => {
                setStatusUrls(item.statusUrls)
                setIsOpen(true)
              }}>
                <div className="status_outer_div">
                  <div className="status_inner_div">
                    <Avatar className="statusbar_status" src={item.profileImage} />
                  </div>
                </div>
                <div className="statusbar_text">{item.userName}</div>
              </div>
            ))
          }
        </div>
      </div>
  </>
  );
}


export default StatusBar;
