import React, { useState, useEffect } from "react";
import { HiOutlineDotsCircleHorizontal } from "react-icons/hi";
import { LuPencilLine } from "react-icons/lu";
import { MdDelete } from "react-icons/md";
import SpinAnimation from "./LoadingAnimation/SpinAnimation/SpinAnimation";
import { IoMdSend } from "react-icons/io";
import { motion } from "framer-motion";
import { useUserContext } from "../context/AuthUserContext";
import formatDate from "../utils/formatDate";
import { useParams } from "react-router-dom";
import { useNotification } from "../context/NotificationContext";

import axiosClient from "../libs/axiosClient";

export default function Comment({ systemFilmData, onUpdateData }) {
  const { authUser } = useUserContext();
  const { systemFilmId } = useParams();
  const { showNotification } = useNotification();

  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingContent, setEditingContent] = useState("");
  const [editingReplyId, setEditingReplyId] = useState(null);
  const [editingReplyContent, setEditingReplyContent] = useState("");

  console.log("comments:", comments);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const data = await axiosClient.get(
          `/comment/film/${systemFilmId}/comment-list`,
        );
        setComments(data);
      } catch (err) {
        showNotification("error", err.message);
      }
    };
    fetchComments();
  }, [showNotification, systemFilmId]);

  const handleCommentFilm = async (e, parentCommentId = null) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    setLoading(true);
    const dataRequest = {
      filmId: systemFilmId,
      content: formData.get("comment"),
      ...(parentCommentId && { parentCommentId }),
    };

    try {
      const data = await axiosClient.post("/comment/save-comment", dataRequest);
      let newComments;
      if (parentCommentId) {
        newComments = comments.map((comment) => {
          if (comment.commentId === parentCommentId) {
            comment.childComments = [...comment.childComments, data.results];
          }
          return comment;
        });
      } else {
        newComments = [data.results, ...comments];
      }
      console.log("newComments:", newComments);
      setComments(newComments);
      setReplyingTo(null);
      onUpdateData();
    } catch (err) {
      showNotification("error", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditComment = async (e, commentId, filmId, isReply = false) => {
    e.preventDefault();
    try {
      const data = await axiosClient.post("/comment/update-comment", {
        commentId,
        filmId,
        content: isReply ? editingReplyContent : editingContent,
      });

      const updatedComments = comments.map((comment) => {
        if (isReply && comment.childComments) {
          const updatedChildren = comment.childComments.map((child) => {
            if (child.commentId === commentId) {
              return { ...child, content: editingReplyContent };
            }
            return child;
          });
          return { ...comment, childComments: updatedChildren };
        } else if (comment.commentId === commentId) {
          return { ...comment, content: editingContent };
        }
        return comment;
      });

      setComments(updatedComments);
      if (isReply) {
        setEditingReplyId(null);
        setEditingReplyContent("");
      } else {
        setEditingCommentId(null);
        setEditingContent("");
      }
    } catch (err) {
      showNotification("error", err.message);
    }
  };

  const handleDeleteMyComment = async (
    commentId,
    filmId,
    isReply = false,
    parentId = null,
  ) => {
    try {
      const data = await axiosClient.post(
        `/comment/delete-comment?commentId=${commentId}&filmId=${filmId}`,
      );
      onUpdateData();
      if (isReply) {
        const updated = comments.map((comment) => {
          if (comment.commentId === parentId) {
            return {
              ...comment,
              childComments: comment.childComments.filter(
                (child) => child.commentId !== commentId,
              ),
            };
          }
          return comment;
        });
        setComments(updated);
      } else {
        setComments((prev) =>
          prev.filter((comment) => comment.commentId !== commentId),
        );
      }

      showNotification("success", data.message);
    } catch (err) {
      showNotification("error", err.message);
    }
  };

  return (
    <motion.div
      className="mt-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
    >
      <div className="flex items-center gap-[10px] text-2xl font-bold text-white mb-6">
        <h2>
          Comments <span>({systemFilmData.numberOfComments})</span>
        </h2>
        <form
          onSubmit={(e) => handleCommentFilm(e, null)}
          className="flex flex-1 justify-between items-center gap-x-[12px]"
        >
          <input
            type="text"
            name="comment"
            placeholder="Write a comment..."
            className="text-[20px] px-[8px] py-[4px] bg-slate-700 rounded-[6px] focus:outline-none focus:ring-2 focus:ring-purple-600 w-full"
          />
          <button
            type="submit"
            className="h-full hover:text-[lightblue] transition duration-200 ease-in-out cursor-pointer flex items-center justify-center"
          >
            {loading ? <SpinAnimation /> : <IoMdSend className="text-[30px]" />}
          </button>
        </form>
      </div>

      <div className="space-y-6">
        {comments.length ? (
          comments.map((comment) => (
            <div
              key={comment.commentId}
              className="bg-gray-800 rounded-lg p-4 relative"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={comment.avatarPath}
                  alt={comment.username}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-semibold">{comment.username}</h4>
                  <span className="text-gray-400 text-xs">
                    {formatDate(comment.commentTime)}
                  </span>
                </div>
              </div>

              {editingCommentId === comment.commentId ? (
                <form
                  onSubmit={(e) =>
                    handleEditComment(e, comment.commentId, systemFilmId)
                  }
                >
                  <input
                    type="text"
                    value={editingContent}
                    onChange={(e) => setEditingContent(e.target.value)}
                    className="w-full bg-gray-700 p-2 rounded text-white mt-2"
                  />
                  <button type="submit" className="text-green-400 text-sm mt-1">
                    Save
                  </button>
                </form>
              ) : (
                <p className="mt-2 text-gray-300">{comment.content}</p>
              )}

              {/* Child comments */}
              {comment.childComments && comment.childComments.length > 0 && (
                <div className="ml-10 mt-4 space-y-4">
                  {comment.childComments.map((child) => (
                    <div key={child.commentId} className="flex space-x-4">
                      <img
                        src={child.avatarPath}
                        alt={child.username}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <h5 className="font-semibold text-sm">
                          {child.username}
                        </h5>
                        <span className="text-gray-400 text-xs">
                          {formatDate(child.commentTime)}
                        </span>

                        {editingReplyId === child.commentId ? (
                          <form
                            onSubmit={(e) =>
                              handleEditComment(
                                e,
                                child.commentId,
                                systemFilmId,
                                true,
                              )
                            }
                          >
                            <input
                              type="text"
                              value={editingReplyContent}
                              onChange={(e) =>
                                setEditingReplyContent(e.target.value)
                              }
                              className="w-full bg-gray-700 p-2 rounded text-white mt-1"
                            />
                            <button
                              type="submit"
                              className="text-green-400 text-sm mt-1"
                            >
                              Save
                            </button>
                          </form>
                        ) : (
                          <p className="text-gray-300 text-sm mt-1">
                            {child.content}
                          </p>
                        )}

                        {child.userId === authUser.id && (
                          <div className="flex gap-x-2 mt-1 text-[18px] text-gray-400">
                            <button
                              onClick={() => {
                                setEditingReplyId(child.commentId);
                                setEditingReplyContent(child.content);
                              }}
                              className="hover:text-yellow-300"
                            >
                              <LuPencilLine />
                            </button>
                            <button
                              onClick={() =>
                                handleDeleteMyComment(
                                  child.commentId,
                                  systemFilmId,
                                  true,
                                  comment.commentId,
                                )
                              }
                              className="hover:text-red-500"
                            >
                              <MdDelete />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {replyingTo === comment.commentId ? (
                <form
                  onSubmit={(e) => handleCommentFilm(e, comment.commentId)}
                  className="ml-10 mt-2"
                >
                  <input
                    type="text"
                    name="comment"
                    placeholder="Write a reply..."
                    className="w-full bg-gray-700 p-2 rounded text-white"
                  />
                  <button type="submit" className="text-blue-400 text-sm mt-1">
                    Reply
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setReplyingTo(comment.commentId)}
                  className="text-blue-300 text-xs ml-10 mt-2"
                >
                  Reply
                </button>
              )}

              {comment.userId === authUser.id && (
                <div className="absolute top-[10px] right-[10px] flex gap-x-[5px] text-[25px] group cursor-pointer">
                  <HiOutlineDotsCircleHorizontal />
                  <div className="hidden gap-x-[5px] group-hover:flex transition duration-200 ease-in-out absolute top-[-125%] right-0 bg-gray-600 rounded-lg p-[5px]">
                    <div
                      className="hover:scale-[1.07] transition duration-200 ease-in-out hover:text-[yellow]"
                      onClick={() => {
                        setEditingCommentId(comment.commentId);
                        setEditingContent(comment.content);
                      }}
                    >
                      <LuPencilLine />
                    </div>
                    <div
                      className="hover:scale-[1.07] transition duration-200 ease-in-out hover:text-[red]"
                      onClick={() =>
                        handleDeleteMyComment(comment.commentId, systemFilmId)
                      }
                    >
                      <MdDelete />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="w-full h-[50px] flex justify-center items-center text-white">
            <p className="text-[20px]">No comments yet</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
