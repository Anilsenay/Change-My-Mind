import { useState, useEffect } from "react";
import * as firebase from "firebase";
import "firebase/firestore";
import { createNotification } from "./notification.hooks";

function getCurrentUserId() {
  return firebase.auth().currentUser.uid;
}

async function registerUser(
  uid,
  username,
  profile_name,
  biography = "",
  imageSrc
) {
  await firebase
    .firestore()
    .collection("Users")
    .doc(uid)
    .set({
      UID: uid,
      username,
      profile_name,
      biography,
      imageSrc:
        imageSrc ||
        "https://firebasestorage.googleapis.com/v0/b/change-my-mind-v0.appspot.com/o/profile_photos%2FPngItem_307416.png?alt=media&token=bdfc051b-1c3b-4573-82e0-d5eb71290591",
      debates: [],
      followers: [],
      following: [],
      won: 0,
      lost: 0,
      ongoing: 0,
      points: 10,
      notifications: [],
      favourites: [],
    });
}

const getUser = (uid) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    uid &&
      firebase
        .firestore()
        .collection("Users")
        .doc(uid)
        .get()
        .then((doc) => {
          setData({ uid: doc.id, ...doc.data() });
        })
        .catch(function (error) {
          setError(error);
        })
        .finally(() => setLoading(false));
  }, [uid]);
  return { loading, data, error };
};

function updateUser(data) {
  return firebase
    .firestore()
    .collection("Users")
    .doc(firebase.auth().currentUser.uid)
    .update({ ...data });
}

const isUsernameExist = (username) => {
  return firebase
    .firestore()
    .collection("Users")
    .where("username", "==", username)
    .get();
};

const isUidExist = (uid) => {
  return firebase.firestore().collection("Users").doc(uid).get();
};

const followUser = (uid) => {
  firebase
    .firestore()
    .collection("Users")
    .doc(firebase.auth().currentUser.uid)
    .update({ following: firebase.firestore.FieldValue.arrayUnion(uid) })
    .then(() => {
      firebase
        .firestore()
        .collection("Users")
        .doc(uid)
        .update({
          followers: firebase.firestore.FieldValue.arrayUnion(
            firebase.auth().currentUser.uid
          ),
        });
    })
    .finally(() => {
      createNotification("followed you", null, getCurrentUserId(), null, uid);
    });
};

const unfollowUser = (uid) => {
  firebase
    .firestore()
    .collection("Users")
    .doc(firebase.auth().currentUser.uid)
    .update({ following: firebase.firestore.FieldValue.arrayRemove(uid) })
    .then(() => {
      firebase
        .firestore()
        .collection("Users")
        .doc(uid)
        .update({
          followers: firebase.firestore.FieldValue.arrayRemove(
            firebase.auth().currentUser.uid
          ),
        });
    });
};

const uploadImage = async (uri) => {
  const response = await fetch(uri);
  const blob = await response.blob();
  var ref = firebase
    .storage()
    .ref()
    .child("profile_photos/" + getCurrentUserId());
  return ref.put(blob);
};

const reportUser = (id) => {
  firebase.firestore().collection("Reports").add({
    reported_by: firebase.auth().currentUser.uid,
    reported_user: id,
    reported_date: new Date(),
  });
};

export {
  getCurrentUserId,
  registerUser,
  getUser,
  updateUser,
  isUsernameExist,
  isUidExist,
  followUser,
  unfollowUser,
  uploadImage,
  reportUser,
};
