import Dropzone from "react-dropzone";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "../ReduxState/index.js";
import "../Stylesheet/Mypost.css";
import {AiOutlineEdit, AiOutlineAudio} from "react-icons/ai"
import {MdDeleteOutline} from "react-icons/md"
import {BiImageAdd} from "react-icons/bi"
import {FaVideo} from "react-icons/fa"

function Mypost({ picturePath }) {
  const dispatch = useDispatch();
  const { _id } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);

  const [postDescription, setPostDescription] = useState("");
  const [image, setImage] = useState(null);
  const [isImage, setIsImage] = useState(false);

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("userId", _id);
    formData.append("description", postDescription);
    if (image) {
      formData.append("picture", image);
      formData.append("picturePath", image.name);
    }
    const res = await fetch("http://localhost:5000/posts", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    const posts = await res.json();
    dispatch(setPosts({ posts }));

    setImage(null);
    setPostDescription("");
  };
  return (
    <main className="mypostContainer">
      <div className="postInput">
        <div className="postUserImgContainer">
          <img
            src={`http://localhost:5000/assets/${picturePath}`}
            alt={`${_id}`}
            className="postUserImg"
          />
        </div>
        <input
          type="text"
          placeholder="Log your Thoughts here"
          className="userPost"
          value={postDescription}
          onChange={(e) => setPostDescription(e.target.value)}
        />
      </div>
      {isImage && (
        <div className="uploadImg">
          <Dropzone
            acceptedFiles=".jpg,.jpeg,.png"
            multiple={false}
            onDrop={(acceptedFiles) => setImage(acceptedFiles[0])}
          >
            {({ getRootProps, getInputProps }) => (
              <section>
                <div {...getRootProps()} className="dropContainerpost">
                  <input {...getInputProps()} />
                  {!image ? (
                    <p>Add your image here</p>
                  ):(
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <p>{image.name}</p>
                      <AiOutlineEdit />
                    </div>
                  )}
                </div>
                {image && (<MdDeleteOutline onClick={() => setImage(null)}/>)}
              </section>
            )}
          </Dropzone>
        </div>
      )}
      <hr/>
      <div className="attachmentIcon">
        <div className="icon attachmentIcon" onClick={()=>setIsImage(!isImage)}>
            <BiImageAdd className="mediaIcon"/> 
            <p className="icontext">Image</p>
        </div>
        <div className="icon attachmentIcon">
            <FaVideo className="mediaIcon"/> 
            <p className="icontext">Clip</p>
        </div>
        <div className="icon attachmentIcon">
            <AiOutlineAudio  className="mediaIcon"/> 
            <p className="icontext">Audio</p>
        </div>
        <button disabled={!postDescription} onClick={handleSubmit} className="postBtn">Post</button>
      </div>
    </main>
  );
}

export default Mypost;
