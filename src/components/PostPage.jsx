import React, { useState, useEffect } from "react";
import Post from "./Post";
import { db, auth } from "../lib/firebase";
import {doc, getDoc} from 'firebase/firestore'
import { Button, Dialog, Modal, DialogContent } from "@mui/material";
import { makeStyles } from "@mui/styles";
import ImgUpload from "./ImgUpload";
import Loader from "./Loader";
import { FaArrowCircleUp } from "react-icons/fa";
import { useSnackbar } from "notistack";
import logo from "../assets/logo.png";
import { Routes, Route, useNavigate, useParams } from "react-router-dom";

import AnimatedButton from "./AnimatedButton";


export function getModalStyle() {
  const top = 50;
  const left = 50;
  const padding = 2;
  const radius = 3;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
    padding: `${padding}%`,
    borderRadius: `${radius}%`,
    textAlign: "center",
    backgroundColor: "var(--bg-color)",
  };
}

export const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 250,
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    color: "var(--color)",
  },
}));

function PostPage(props) {
  const classes = useStyles();
  const navigate = useNavigate();

  const [post, setPost] = useState([]);
  const [user, setUser] = useState(props.user);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [openNewUpload, setOpenNewUpload] = useState(false);
  const [logout, setLogout] = useState(false);
  const params = useParams();
  const id = params.postId;

  const buttonStyle = {
    background: "linear-gradient(40deg, #e107c1, #59afc7)",
    borderRadius: "20px",
    ":hover": {
      background: "linear-gradient(-40deg, #59afc7, #e107c1)",
    },
  };

  const { enqueueSnackbar } = useSnackbar();
  const [showScroll, setShowScroll] = useState(false);

  const checkScrollTop = () => {
    if (!showScroll && window.pageYOffset > 400) {
      setShowScroll(true);
    } else if (showScroll && window.pageYOffset <= 400) {
      setShowScroll(false);
    }
  };

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  window.addEventListener("scroll", checkScrollTop);

  // useEffect(() => {
  //   const unsubscribe = auth.onAuthStateChanged((authUser) => {
  //     if (authUser) {
  //       setUser(authUser);
  //       navigate("/dummygram/");
  //       console.log("fucking you from line 87 Postpage.jsx")
  //     } else {
  //       setUser(null);
  //       navigate("/dummygram/login");
  //     }
  //   });

  //   return () => {
  //     unsubscribe();
  //   };
  // }, [user]);

  useEffect(() => {
    if (document.body.classList.contains("darkmode--activated")) {
      window.document.body.style.setProperty("--bg-color", "black");
      window.document.body.style.setProperty("--color", "white");
      window.document.body.style.setProperty("--val", 1);
      document.getElementsByClassName("app__header__img").item(0).style.filter =
        "invert(100%)";
    } else {
      window.document.body.style.setProperty("--bg-color", "white");
      window.document.body.style.setProperty("--color", "#2B1B17");
      window.document.body.style.setProperty("--val", 0);
      document.getElementsByClassName("app__header__img").item(0).style.filter =
        "invert(0%)";
    }

 
    
    
    // db.collection("posts")
    //   .orderBy("timestamp", "desc")
    //   .limit(pageSize)
    //   .onSnapshot((snapshot) => {
    //     setLoadingPosts(false);
    //     setPosts(
    //       snapshot.docs.map((doc) => ({
    //         id: doc.id,
    //         post: doc.data(),
    //       }))
    //     );
    //   });

    const postRef = doc(db, "posts", id)

    getDoc(postRef)
    .then((doc) => {
        setLoadingPosts(false);
        setPost(doc.data());
        console.log(doc.data())
        console.log("from postPage")
    })


  }, []);

  
  const signOut = () => {
    auth.signOut().finally();
    enqueueSnackbar("Logged out Successfully !", {
      variant: "info",
    });
  };

  return (
    <div className="app">
      <div className="app__header">
        <img
          src={logo}
          alt="dummygram"
          className="app__header__img w-100"
          onClick={() => {
            window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
            window.location.href = "/dummygram";
          }}
          style={{
            cursor: "pointer",
          }}
        />
        {user ? (
          <>
            <Button
              onClick={() => setOpenNewUpload(true)}
              color="secondary"
              variant="contained"
              sx={buttonStyle}
            >
              New Post
            </Button>
            <Button
              onClick={() => {
                setLogout(true);
              }}
              color="secondary"
              variant="contained"
              sx={{ ...buttonStyle, marginRight: "10px" }}
            >
              Logout
            </Button>
          </>
        ) : (
          <div className="login__container">
            <Button
              onClick={() => {
                navigate("/dummygram/login");
              }}
              color="primary"
              variant="contained"
              style={{ margin: 5 }}
              sx={buttonStyle}
            >
              Sign In
            </Button>

            <Button
              onClick={() => {
                navigate("/dummygram/signup");
              }}
              color="primary"
              variant="contained"
              style={{ margin: 5 }}
              sx={buttonStyle}
            >
              Sign Up
            </Button>
          </div>
        )}
      </div>

      <Dialog
        sx={{ borderRadius: "100px" }}
        open={openNewUpload}
        onClose={() => setOpenNewUpload(false)}
      >
        <div
          style={{
            backgroundColor: "var(--bg-color)",
            padding: "20px",
            textAlign: "center",
            color: "var(--color)",
            border: "2px solid var(--color)",
          }}
        >
          <img
            src="https://user-images.githubusercontent.com/27727921/185767526-a002a17d-c12e-4a6a-82a4-dd1a13a5ecda.png"
            alt="instagram"
            className="modal__signup__img"
            style={{ width: "50%", filter: "invert(var(--val))" }}
          />
          <p
            style={{
              fontSize: "25px",
              fontFamily: "monospace",
              color: "var(--color)",
            }}
          >
            New Post
          </p>

          <DialogContent
            sx={
              {
                // backgroundColor: "var(--bg-color)",
              }
            }
          >
            {!loadingPosts &&
              (user ? (
                <ImgUpload
                  user={user}
                  onUploadComplete={() => setOpenNewUpload(false)}
                />
              ) : (
                <h3>Sorry you need to login to upload posts</h3>
              ))}
          </DialogContent>
        </div>
      </Dialog>
      <Modal open={logout} onClose={() => setLogout(false)}>
        <div style={getModalStyle()} className={classes.paper}>
          <form className="modal__signup">
            <img
              src="https://user-images.githubusercontent.com/27727921/185767526-a002a17d-c12e-4a6a-82a4-dd1a13a5ecda.png"
              alt="dummygram"
              className="modal__signup__img"
              style={{
                width: "80%",
                marginLeft: "10%",
                filter: "invert(var(--val))",
              }}
            />

            <p
              style={{
                fontSize: "15px",
                fontFamily: "monospace",
                padding: "10%",
                color: "var(--color)",
              }}
            >
              Are you sure you want to Logout?
            </p>

            <AnimatedButton
              type="submit"
              onClick={signOut}
              variant="contained"
              color="primary"
              sx={buttonStyle}
            >
              Logout
            </AnimatedButton>
          </form>
        </div>
      </Modal>

       <>
       {
            user ? (
              <div
                style={{
                  display: "flex",
                  alignContent: "center",
                  justifyContent: "center",
                }}
              >
                <div
                  style={
                    !loadingPosts
                      ? {}
                      : {
                          width: "100%",
                          minHeight: "100vh",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }
                  }
                >
                  {loadingPosts ? (
                    <Loader />
                  ) : (
                    <div className="app__posts">
                      {
                        <Post key={id} postId={id} user={user} post={post} />
                      }
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <></>
            )
          }
       </>
      <FaArrowCircleUp
        fill="#777"
        // stroke="30"
        className="scrollTop"
        onClick={scrollTop}
        style={{
          height: 50,
          display: showScroll ? "flex" : "none",
        }}
      />
    </div>
  );
}

export default PostPage;
