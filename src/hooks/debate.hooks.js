import * as firebase from "firebase";
import "firebase/firestore";
import { useEffect, useState } from "react";

function createDebate({ ...values }, finalEvent) {
  console.log(values);
  const {
    topic,
    category,
    proponent,
    respond_hour,
    respond_minute,
    rounds,
    voting_period,
    argument,
    headerSrc,
  } = values;
  firebase
    .firestore()
    .collection("Rounds")
    .add({
      proponent,
      proponent_msg: argument,
      opponent: null,
      opponent_msg: null,
      proponent_date: new Date(),
      opponent_date: null,
      proponent_like: [],
      opponent_like: [],
      proponent_dislike: [],
      opponent_dislike: [],
    })
    .then((docRef) => {
      firebase
        .firestore()
        .collection("Debate")
        .add({
          title: topic,
          category,
          proponent,
          opponent: null,
          start_date: new Date(),
          update_date: new Date(),
          status: "open",
          round_number: +rounds,
          respond_limit: respond_hour * 60 + +respond_minute,
          finish_date: null,
          voting_period: +voting_period,
          rounds: [docRef.id],
          total_view: 1,
          total_vote: 0,
          headerSrc,
        })
        .then((docRef) => {
          firebase
            .firestore()
            .collection("Users")
            .doc(proponent)
            .update({
              debates: firebase.firestore.FieldValue.arrayUnion(docRef.id),
              stats: {
                ongoing: firebase.firestore.FieldValue.increment(1),
              },
            })
            .then(() => finalEvent(docRef.id));
        })
        .catch(function (error) {
          console.log(error);
        });
    });
}

const getDebate = (uid) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    uid &&
      firebase
        .firestore()
        .collection("Debate")
        .doc(uid)
        .get()
        .then((doc) => {
          setData({
            id: doc.id,
            ...doc.data(),
            start_date: doc.data().start_date.toDate(),
            update_date: doc.data().update_date.toDate(),
            finish_date: doc.data().finish_date?.toDate(),
          });
        })
        .catch(function (error) {
          setError(error);
        })
        .finally(() => setLoading(false));
  }, [uid]);
  return { loading, data, error };
};

const getDebates = (debateArray) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    debateArray &&
      firebase
        .firestore()
        .collection("Debate")
        .where(
          firebase.firestore.FieldPath.documentId(),
          "in",
          debateArray.slice(0, 10)
        )
        .get()
        .then((query) => {
          const fetchedData = query.docs.map((doc) => {
            return {
              id: doc.id,
              ...doc.data(),
              start_date: doc.data().start_date.toDate(),
              update_date: doc.data().update_date.toDate(),
              finish_date: doc.data().finish_date?.toDate(),
            };
          });
          setData(fetchedData);
        })
        .catch(function (error) {
          setError(error);
        })
        .finally(() => setLoading(false));
  }, [debateArray]);
  return { loading, data, error };
};

async function updateDebate(uid, data) {
  return await firebase
    .firestore()
    .collection("Debate")
    .doc(uid)
    .update({ ...data });
}

async function increaseView(uid) {
  return await firebase
    .firestore()
    .collection("Debate")
    .doc(uid)
    .update({ total_view: firebase.firestore.FieldValue.increment(1) });
}

async function increaseVote(uid) {
  return await firebase
    .firestore()
    .collection("Debate")
    .doc(uid)
    .update({ total_vote: firebase.firestore.FieldValue.increment(1) });
}
async function decreaseVote(uid) {
  return await firebase
    .firestore()
    .collection("Debate")
    .doc(uid)
    .update({ total_vote: firebase.firestore.FieldValue.increment(-1) });
}

async function setDebateWin(uid, winner_id, loser_id, status) {
  return await firebase
    .firestore()
    .collection("Debate")
    .doc(uid)
    .update({ status })
    .then(() => {
      firebase
        .firestore()
        .collection("Users")
        .doc(winner_id)
        .update({
          lost: firebase.firestore.FieldValue.increment(1),
          points: firebase.firestore.FieldValue.increment(10),
        });
    })
    .then(() => {
      firebase
        .firestore()
        .collection("Users")
        .doc(loser_id)
        .update({
          won: firebase.firestore.FieldValue.increment(1),
          points: firebase.firestore.FieldValue.increment(-2),
        });
    });
}

const uploadImage = async (uri) => {
  const response = await fetch(uri);
  const blob = await response.blob();
  var ref = firebase
    .storage()
    .ref()
    .child(
      "debate_headers/" +
        firebase.auth().currentUser.uid +
        "_" +
        new Date().getTime()
    );
  return ref.put(blob);
};

const reportDebate = (id) => {
  firebase.firestore().collection("Reports").add({
    reported_by: firebase.auth().currentUser.uid,
    reported_debate: id,
    reported_date: new Date(),
  });
};

export {
  createDebate,
  getDebate,
  updateDebate,
  getDebates,
  increaseView,
  increaseVote,
  decreaseVote,
  setDebateWin,
  uploadImage,
  reportDebate,
};
