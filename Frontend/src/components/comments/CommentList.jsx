import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { getTaskComments } from '../../services/commentService';
import CommentItem from './CommentItem';
import CommentForm from './CommentForm';
import Toggle from '../common/Toggle';

function CommentList({ taskId, projectId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showRealTime, setShowRealTime] = useState(true); // Toggle for real-time updates
  const { currentUser } = useAuth();
  const { socket } = useSocket();

  const fetchComments = async () => {
    try {
      setLoading(true);
      const data = await getTaskComments(taskId);
      setComments(data);
      setError(null);
    } catch (err) {
      setError('Failed to load comments');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
    
    // Listen for real-time comment updates
    if (socket && showRealTime) {
      socket.on('comment-added', (data) => {
        if (data.taskId === taskId) {
          setComments(prev => [...prev, data.comment]);
        }
      });
      
      socket.on('comment-deleted', (data) => {
        if (data.taskId === taskId) {
          setComments(prev => prev.filter(comment => comment._id !== data.commentId));
        }
      });
    }
    
    return () => {
      if (socket) {
        socket.off('comment-added');
        socket.off('comment-deleted');
      }
    };
  }, [taskId, socket, showRealTime]);

  const handleCommentAdded = (newComment) => {
    setComments([...comments, newComment]);
  };

  const handleCommentDeleted = (commentId) => {
    setComments(comments.filter(comment => comment._id !== commentId));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
          Comments
          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
            {comments.length}
          </span>
        </h3>
        
        <Toggle 
          checked={showRealTime}
          onChange={(e) => setShowRealTime(e.target.checked)}
          label="Real-time"
          labelPosition="left"
        />
      </div>
      
      {error && (
        <div className="bg-danger-50 border-l-4 border-danger-500 p-4 dark:bg-danger-900/30">
          <div className="flex">
            <div className="flex-shrink-0">
              <ExclamationCircleIcon className="h-5 w-5 text-danger-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-danger-700 dark:text-danger-200">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {loading && comments.length === 0 ? (
        <div className="flex items-center justify-center py-6 text-gray-500 dark:text-gray-400">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mr-3"></div>
          Loading comments...
        </div>
      ) : (
        <div className="space-y-3">
          {comments.length > 0 ? (
            comments.map(comment => (
              <CommentItem
                key={comment._id}
                comment={comment}
                currentUserId={currentUser?.uid}
                onDeleted={handleCommentDeleted}
                projectId={projectId}
              />
            ))
          ) : (
            <div className="text-center py-6 bg-gray-50 dark:bg-gray-800 rounded-md text-gray-500 dark:text-gray-400 italic">
              No comments yet
            </div>
          )}
        </div>
      )}
      
      <div className="mt-4">
        <CommentForm 
          taskId={taskId} 
          onCommentAdded={handleCommentAdded} 
        />
      </div>
    </div>
  );
}

export default CommentList;
